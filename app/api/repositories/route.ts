import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/session";
import { connectRepoSchema } from "@/lib/validations";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repositories = await prisma.repository.findMany({
    where: { userId: session.userId },
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

  return NextResponse.json({ repositories });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = connectRepoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.repository.findUnique({
    where: { githubId: parsed.data.githubId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Repository already connected" },
      { status: 409 }
    );
  }

  const repository = await prisma.repository.create({
    data: {
      githubId: parsed.data.githubId,
      name: parsed.data.name,
      fullName: parsed.data.fullName,
      owner: parsed.data.owner,
      description: parsed.data.description || null,
      language: parsed.data.language || null,
      isPrivate: parsed.data.isPrivate || false,
      defaultBranch: parsed.data.defaultBranch || "main",
      userId: session.userId,
    },
  });

  return NextResponse.json({ repository }, { status: 201 });
}
