import type { GitHubRepo, GitHubUser, GitHubPullRequest } from "@/lib/types";

const GITHUB_API = "https://api.github.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/user`, { headers: headers(accessToken) });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchUserRepos(accessToken: string, page = 1, perPage = 30): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/user/repos?sort=updated&per_page=${perPage}&page=${page}&type=all`,
    { headers: headers(accessToken) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function searchUserRepos(accessToken: string, query: string): Promise<GitHubRepo[]> {
  const user = await fetchGitHubUser(accessToken);
  const res = await fetch(
    `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}+user:${user.login}&per_page=20`,
    { headers: headers(accessToken) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

export async function fetchPullRequest(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<GitHubPullRequest> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`,
    { headers: headers(accessToken) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchPRDiff(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<string> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        ...headers(accessToken),
        Accept: "application/vnd.github.v3.diff",
      },
    }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.text();
}

export async function fetchPRFiles(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number
): Promise<{ filename: string; status: string; patch?: string; additions: number; deletions: number }[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    { headers: headers(accessToken) }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function postReviewComment(
  accessToken: string,
  owner: string,
  repo: string,
  prNumber: number,
  body: string
): Promise<void> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`,
    {
      method: "POST",
      headers: { ...headers(accessToken), "Content-Type": "application/json" },
      body: JSON.stringify({ body, event: "COMMENT" }),
    }
  );
  if (!res.ok) {
    console.error("Failed to post review comment:", res.status);
  }
}

export async function createWebhook(
  accessToken: string,
  owner: string,
  repo: string,
  webhookUrl: string,
  secret: string
): Promise<{ id: number }> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/hooks`,
    {
      method: "POST",
      headers: { ...headers(accessToken), "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "web",
        active: true,
        events: ["pull_request"],
        config: {
          url: webhookUrl,
          content_type: "json",
          secret,
          insecure_ssl: "0",
        },
      }),
    }
  );
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create webhook: ${res.status} ${error}`);
  }
  return res.json();
}

export async function deleteWebhook(
  accessToken: string,
  owner: string,
  repo: string,
  hookId: number
): Promise<void> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/hooks/${hookId}`,
    { method: "DELETE", headers: headers(accessToken) }
  );
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to delete webhook: ${res.status}`);
  }
}
