import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/session";
import { triggerReviewSchema } from "@/lib/validations";
import { fetchPRDiff, fetchPullRequest, postReviewComment } from "@/lib/github";
import { reviewPullRequest, formatReviewComment } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.userId || !session.githubAccessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = triggerReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const repository = await prisma.repository.findFirst({
    where: { id: parsed.data.repositoryId, userId: session.userId },
  });

  if (!repository) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  try {
    const pr = await fetchPullRequest(
      session.githubAccessToken,
      repository.owner,
      repository.name,
      parsed.data.prNumber
    );

    const review = await prisma.review.create({
      data: {
        prNumber: pr.number,
        prTitle: parsed.data.prTitle || pr.title,
        prUrl: parsed.data.prUrl || pr.html_url,
        branch: parsed.data.branch || pr.head.ref,
        status: "IN_PROGRESS",
        repositoryId: repository.id,
        userId: session.userId,
        startedAt: new Date(),
      },
    });

    const diff = await fetchPRDiff(
      session.githubAccessToken,
      repository.owner,
      repository.name,
      pr.number
    );

    const result = await reviewPullRequest(diff, pr.title, repository.language || "Unknown");

    const issueTypeMap: Record<string, string> = {
      security: "SECURITY",
      quality: "QUALITY",
      performance: "PERFORMANCE",
      "best-practice": "BEST_PRACTICE",
    };

    const severityMap: Record<string, string> = {
      critical: "CRITICAL",
      warning: "WARNING",
      info: "INFO",
    };

    await prisma.$transaction([
      prisma.review.update({
        where: { id: review.id },
        data: {
          status: "COMPLETED",
          overallScore: result.overallScore,
          securityScore: result.securityScore,
          qualityScore: result.qualityScore,
          performanceScore: result.performanceScore,
          summary: result.summary,
          positiveHighlights: result.positiveHighlights,
          completedAt: new Date(),
        },
      }),
      ...result.issues.map((issue) =>
        prisma.issue.create({
          data: {
            type: (issueTypeMap[issue.type] || "QUALITY") as "SECURITY" | "QUALITY" | "PERFORMANCE" | "BEST_PRACTICE",
            severity: (severityMap[issue.severity] || "INFO") as "CRITICAL" | "WARNING" | "INFO",
            title: issue.title,
            description: issue.description,
            file: issue.file,
            line: issue.line,
            suggestion: issue.suggestion || null,
            codeSnippet: issue.codeSnippet || null,
            reviewId: review.id,
          },
        })
      ),
    ]);

    try {
      const comment = formatReviewComment(result);
      await postReviewComment(
        session.githubAccessToken,
        repository.owner,
        repository.name,
        pr.number,
        comment
      );
    } catch (commentError) {
      console.error("Failed to post GitHub comment:", commentError);
    }

    return NextResponse.json({
      reviewId: review.id,
      score: result.overallScore,
      issueCount: result.issues.length,
    });
  } catch (error) {
    console.error("Review trigger failed:", error);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 }
    );
  }
}
