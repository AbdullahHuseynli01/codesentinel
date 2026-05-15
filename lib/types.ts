export interface ReviewIssue {
  id: string;
  type: "security" | "quality" | "performance" | "best-practice";
  severity: "critical" | "warning" | "info";
  file: string;
  line: number;
  title: string;
  description: string;
  suggestion: string;
  codeSnippet?: string;
}

export interface ReviewResult {
  overallScore: number;
  summary: string;
  issues: ReviewIssue[];
  securityScore: number;
  qualityScore: number;
  performanceScore: number;
  reviewedAt: string;
  positiveHighlights: string[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  language: string | null;
  private: boolean;
  default_branch: string;
  html_url: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  avatar_url: string;
  name: string | null;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  html_url: string;
  head: { ref: string };
  base: { ref: string };
  user: { login: string };
  state: string;
  created_at: string;
  updated_at: string;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
  plan: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalReviews: number;
  totalIssues: number;
  averageScore: number;
  reposConnected: number;
  reviewsThisWeek: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
}
