import OpenAI from "openai";
import type { ReviewResult } from "@/lib/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are CodeSentinel, a senior software engineer and security expert with 15+ years of experience reviewing production code across multiple languages and frameworks.

Your job is to perform a thorough, professional code review of the provided pull request diff. You must analyze the code across four dimensions:

1. SECURITY: Identify SQL injection risks, XSS vulnerabilities, exposed API keys or secrets, insecure authentication, unvalidated inputs, CORS misconfigurations, path traversal risks, and other OWASP Top 10 issues.

2. CODE QUALITY: Detect code duplication, overly complex functions (cyclomatic complexity), unclear variable/function naming, dead code, missing error handling, improper type usage, and maintainability issues.

3. PERFORMANCE: Identify N+1 query problems, synchronous blocking operations that should be async, inefficient algorithms (O(n²) where O(n) is possible), memory leaks, unnecessary re-renders (in React), and missing database indexes.

4. BEST PRACTICES: Flag violations of language-specific conventions, missing input validation, incomplete error boundaries, lack of logging for critical operations, missing or incorrect TypeScript types, and architectural anti-patterns.

For each issue you find, provide:
- The exact file and line number
- A clear, non-condescending title
- A concise explanation of why this is a problem
- A concrete, actionable suggestion for how to fix it
- The severity level (critical, warning, or info)

Also provide:
- An overall quality score from 0 to 100
- Individual scores for security, quality, and performance (0-100 each)
- A brief, encouraging summary paragraph
- 2-3 positive highlights of what the developer did well

Always be constructive, specific, and professional. Never be vague. Never say "consider refactoring" without explaining exactly how.

Return your response as a valid JSON object matching this exact structure:
{
  "overallScore": number,
  "securityScore": number,
  "qualityScore": number,
  "performanceScore": number,
  "summary": string,
  "positiveHighlights": string[],
  "reviewedAt": string (ISO date),
  "issues": [
    {
      "id": string (unique),
      "type": "security" | "quality" | "performance" | "best-practice",
      "severity": "critical" | "warning" | "info",
      "file": string,
      "line": number,
      "title": string,
      "description": string,
      "suggestion": string,
      "codeSnippet": string (optional, the relevant code)
    }
  ]
}`;

export async function reviewPullRequest(
  diff: string,
  prTitle: string,
  language: string
): Promise<ReviewResult> {
  const truncatedDiff = diff.length > 15000 ? diff.slice(0, 15000) + "\n...(truncated)" : diff;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Please review this pull request:

**Title**: ${prTitle}
**Primary Language**: ${language}

**Diff**:
\`\`\`diff
${truncatedDiff}
\`\`\`

Return a complete JSON object matching the ReviewResult structure.`,
      },
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty response from AI");

  const result = JSON.parse(content) as ReviewResult;

  result.overallScore = Math.max(0, Math.min(100, Math.round(result.overallScore)));
  result.securityScore = Math.max(0, Math.min(100, Math.round(result.securityScore)));
  result.qualityScore = Math.max(0, Math.min(100, Math.round(result.qualityScore)));
  result.performanceScore = Math.max(0, Math.min(100, Math.round(result.performanceScore)));
  result.reviewedAt = result.reviewedAt || new Date().toISOString();

  if (!Array.isArray(result.issues)) result.issues = [];
  if (!Array.isArray(result.positiveHighlights)) result.positiveHighlights = [];

  return result;
}

export function formatReviewComment(result: ReviewResult): string {
  const scoreEmoji = result.overallScore >= 80 ? "✅" : result.overallScore >= 60 ? "⚠️" : "🔴";

  let comment = `## ${scoreEmoji} CodeSentinel Review — Score: ${result.overallScore}/100\n\n`;
  comment += `${result.summary}\n\n`;
  comment += `| Category | Score |\n|----------|-------|\n`;
  comment += `| Security | ${result.securityScore}/100 |\n`;
  comment += `| Quality | ${result.qualityScore}/100 |\n`;
  comment += `| Performance | ${result.performanceScore}/100 |\n\n`;

  if (result.issues.length > 0) {
    const critical = result.issues.filter((i) => i.severity === "critical");
    const warnings = result.issues.filter((i) => i.severity === "warning");
    const info = result.issues.filter((i) => i.severity === "info");

    comment += `### Issues Found: ${result.issues.length}\n`;
    if (critical.length > 0) comment += `- 🔴 **${critical.length}** Critical\n`;
    if (warnings.length > 0) comment += `- 🟡 **${warnings.length}** Warnings\n`;
    if (info.length > 0) comment += `- 🔵 **${info.length}** Info\n`;
    comment += "\n";

    for (const issue of result.issues.slice(0, 10)) {
      const severity = issue.severity === "critical" ? "🔴" : issue.severity === "warning" ? "🟡" : "🔵";
      comment += `#### ${severity} ${issue.title}\n`;
      comment += `**${issue.file}:${issue.line}** — ${issue.type}\n\n`;
      comment += `${issue.description}\n\n`;
      if (issue.suggestion) {
        comment += `> 💡 **Suggestion:** ${issue.suggestion}\n\n`;
      }
    }
  } else {
    comment += "### ✨ No issues found — clean code!\n";
  }

  if (result.positiveHighlights.length > 0) {
    comment += `### Highlights\n`;
    for (const h of result.positiveHighlights) {
      comment += `- ✅ ${h}\n`;
    }
  }

  comment += "\n---\n*Reviewed by [CodeSentinel](https://codesentinel.dev)*";
  return comment;
}
