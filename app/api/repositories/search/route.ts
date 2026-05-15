import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import { searchUserRepos, fetchUserRepos } from "@/lib/github";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.userId || !session.githubAccessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q");

  try {
    let repositories;
    if (query && query.trim()) {
      repositories = await searchUserRepos(session.githubAccessToken, query);
    } else {
      repositories = await fetchUserRepos(session.githubAccessToken);
    }

    return NextResponse.json({ repositories });
  } catch (error) {
    console.error("Failed to search repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories from GitHub" },
      { status: 502 }
    );
  }
}
