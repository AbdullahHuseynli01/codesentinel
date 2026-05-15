import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/session";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repoId = req.nextUrl.searchParams.get("repo");
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50"), 100);

  const where: Record<string, unknown> = { userId: session.userId };
  if (repoId) where.repositoryId = repoId;

  const reviews = await prisma.review.findMany({
    where,
    include: {
      repository: { select: { name: true, fullName: true, language: true } },
      _count: { select: { issues: true } },
      issues: { select: { severity: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ reviews });
}
