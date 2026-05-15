export const APP_NAME = "CodeSentinel";
export const APP_DESCRIPTION = "AI-powered code review that catches security vulnerabilities, performance issues, and code smells before they reach production.";

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    repos: 1,
    reviews: 30,
    features: [
      "1 repository",
      "30 reviews/month",
      "Security scanning",
      "Code quality analysis",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 29,
    repos: 5,
    reviews: -1,
    popular: true,
    features: [
      "5 repositories",
      "Unlimited reviews",
      "Full analysis suite",
      "Email alerts",
      "Priority support",
      "Score tracking",
    ],
  },
  TEAM: {
    name: "Team",
    price: 79,
    repos: 20,
    reviews: -1,
    features: [
      "20 repositories",
      "Unlimited reviews",
      "5 team members",
      "Slack integration",
      "Team leaderboard",
      "Custom rules",
      "Dedicated support",
    ],
  },
} as const;

export const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    color: "var(--accent-red)",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
  },
  warning: {
    label: "Warning",
    color: "var(--accent-amber)",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  info: {
    label: "Info",
    color: "var(--accent-blue)",
    bg: "rgba(37, 99, 235, 0.1)",
    border: "rgba(37, 99, 235, 0.2)",
  },
} as const;

export const ISSUE_TYPE_CONFIG = {
  SECURITY: { label: "Security", icon: "Shield" },
  QUALITY: { label: "Quality", icon: "Code" },
  PERFORMANCE: { label: "Performance", icon: "Zap" },
  BEST_PRACTICE: { label: "Best Practice", icon: "BookOpen" },
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Repositories", href: "/repositories", icon: "GitFork" },
  { label: "Reviews", href: "/reviews", icon: "FileSearch" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#ED8B00",
  "C#": "#239120",
  Ruby: "#CC342D",
  PHP: "#777BB4",
  Swift: "#FA7343",
  Kotlin: "#7F52FF",
  C: "#A8B9CC",
  "C++": "#00599C",
};
