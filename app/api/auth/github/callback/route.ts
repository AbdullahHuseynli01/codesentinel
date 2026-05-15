import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions, type SessionData } from "@/lib/session";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=missing_params", req.nextUrl)
    );
  }

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (session.oauthState !== state) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", req.nextUrl)
    );
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("GitHub OAuth error:", tokenData.error_description);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", req.nextUrl)
      );
    }

    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const githubUser = await userRes.json();

    let email = githubUser.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });
      const emails = await emailsRes.json();
      const primary = emails.find(
        (e: { primary: boolean; verified: boolean }) => e.primary && e.verified
      );
      email = primary?.email || null;
    }

    const user = await prisma.user.upsert({
      where: { githubId: githubUser.id },
      update: {
        username: githubUser.login,
        email,
        avatarUrl: githubUser.avatar_url,
        accessToken,
      },
      create: {
        githubId: githubUser.id,
        username: githubUser.login,
        email,
        avatarUrl: githubUser.avatar_url,
        accessToken,
      },
    });

    session.userId = user.id;
    session.githubAccessToken = accessToken;
    session.username = user.username;
    session.avatarUrl = user.avatarUrl || undefined;
    session.oauthState = undefined;
    await session.save();

    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", req.nextUrl)
    );
  }
}
