import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { webhookPayloadSchema } from "@/lib/validations";
import { fetchPRDiff, postReviewComment } from "@/lib/github";
import { reviewPullRequest, formatReviewComment } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";

  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(body).digest("hex");

  if (
    signature.length !== digest.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");

  if (event !== "pull_request") {
    return NextResponse.json({ message: "Event ignored" });
  }

  const payload = JSON.parse(body);
  const parsed = webhookPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { action, pull_request, repository: ghRepo } = parsed.data;

  if (!["opened", "synchronize", "reopened"].includes(action)) {
    return NextResponse.json({ message: "Action ignored" });
  }

  const repository = await prisma.repository.findUnique({
    where: { githubId: ghRepo.id },
    include: { user: { select: { id: true, accessToken: true } } },
  });

  if (!repository) {
    return NextResponse.json({ message: "Repository not tracked" });
  }

  try {
    const review = await prisma.review.create({
      data: {
        prNumber: pull_request.number,
        prTitle: pull_request.title,
        prUrl: pull_request.html_url,
        branch: pull_request.head.ref,
        status: "IN_PROGRESS",
        repositoryId: repository.id,
        userId: repository.user.id,
        startedAt: new Date(),
      },
    });

    const diff = await fetchPRDiff(
      repository.user.accessToken,
      ghRepo.owner.login,
      ghRepo.name,
      pull_request.number
    );

    const result = await reviewPullRequest(
      diff,
      pull_request.title,
      ghRepo.language || "Unknown"
    );

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
        repository.user.accessToken,
        ghRepo.owner.login,
        ghRepo.name,
        pull_request.number,
        comment
      );
    } catch (commentError) {
      console.error("Failed to post GitHub comment:", commentError);
    }

    return NextResponse.json({ success: true, score: result.overallScore });
  } catch (error) {
    console.error("Webhook review failed:", error);

    return NextResponse.json(
      { error: "Review processing failed" },
      { status: 500 }
    );
  }
}
