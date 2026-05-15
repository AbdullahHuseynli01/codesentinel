import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { UserDTO, DashboardStats } from "@/lib/types";

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
});

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session.userId) {
    redirect("/login");
  }
  return session;
});

export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const session = await getSession();
  if (!session.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      plan: true,
      createdAt: true,
    },
  });

  return user;
});

export async function getUserRepositories(userId: string) {
  return prisma.repository.findMany({
    where: { userId },
    include: {
      _count: { select: { reviews: true } },
      reviews: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { overallScore: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserReviews(userId: string, limit = 20) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      repository: { select: { name: true, fullName: true, language: true } },
      _count: { select: { issues: true } },
      issues: {
        select: { severity: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getReviewDetail(reviewId: string, userId: string) {
  return prisma.review.findFirst({
    where: { id: reviewId, userId },
    include: {
      repository: { select: { name: true, fullName: true, language: true, owner: true } },
      issues: { orderBy: [{ severity: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [repos, reviews, recentReviews, issues] = await Promise.all([
    prisma.repository.count({ where: { userId } }),
    prisma.review.findMany({
      where: { userId, status: "COMPLETED" },
      select: { overallScore: true, createdAt: true },
    }),
    prisma.review.count({
      where: { userId, createdAt: { gte: oneWeekAgo } },
    }),
    prisma.issue.groupBy({
      by: ["severity"],
      where: { review: { userId } },
      _count: true,
    }),
  ]);

  const totalReviews = reviews.length;
  const averageScore =
    totalReviews > 0
      ? Math.round(
          reviews.reduce((acc, r) => acc + (r.overallScore || 0), 0) / totalReviews
        )
      : 0;

  const severityCounts = { CRITICAL: 0, WARNING: 0, INFO: 0 };
  for (const group of issues) {
    severityCounts[group.severity] = group._count;
  }

  return {
    totalReviews,
    totalIssues: severityCounts.CRITICAL + severityCounts.WARNING + severityCounts.INFO,
    averageScore,
    reposConnected: repos,
    reviewsThisWeek: recentReviews,
    criticalIssues: severityCounts.CRITICAL,
    warningIssues: severityCounts.WARNING,
    infoIssues: severityCounts.INFO,
  };
}
