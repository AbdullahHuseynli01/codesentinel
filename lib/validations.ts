import { z } from "zod";

export const connectRepoSchema = z.object({
  githubId: z.number(),
  name: z.string().min(1),
  fullName: z.string().min(1),
  owner: z.string().min(1),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
  defaultBranch: z.string().optional(),
});

export const triggerReviewSchema = z.object({
  repositoryId: z.string().min(1),
  prNumber: z.number().int().positive(),
  prTitle: z.string().optional(),
  prUrl: z.string().url().optional(),
  branch: z.string().optional(),
});

export const webhookPayloadSchema = z.object({
  action: z.string(),
  pull_request: z.object({
    number: z.number(),
    title: z.string(),
    html_url: z.string(),
    head: z.object({ ref: z.string() }),
    base: z.object({ ref: z.string() }),
    user: z.object({ login: z.string() }),
  }),
  repository: z.object({
    id: z.number(),
    name: z.string(),
    full_name: z.string(),
    owner: z.object({ login: z.string() }),
    language: z.string().nullable(),
  }),
});

export type ConnectRepoInput = z.infer<typeof connectRepoSchema>;
export type TriggerReviewInput = z.infer<typeof triggerReviewSchema>;
export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
