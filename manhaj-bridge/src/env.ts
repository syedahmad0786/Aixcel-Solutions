import { z } from "zod";

const baseSchema = z.object({
  SLACK_BOT_TOKEN: z
    .string()
    .min(1, "SLACK_BOT_TOKEN is required")
    .regex(/^xoxb-/, "SLACK_BOT_TOKEN must start with xoxb-"),
  // Required by Bolt App constructor even in Socket Mode; also used if SLACK_MODE=http.
  SLACK_SIGNING_SECRET: z.string().min(1, "SLACK_SIGNING_SECRET is required"),
  BRIDGE_API_KEY: z
    .string()
    .min(16, "BRIDGE_API_KEY must be at least 16 characters"),
  PORT: z.coerce.number().int().positive().default(8787),
  SLACK_MODE: z.enum(["socket", "http"]).default("socket"),
  SLACK_APP_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof baseSchema> & {
  SLACK_MODE: "socket" | "http";
  SLACK_APP_TOKEN?: string;
};

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = baseSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid Manhaj Bridge environment:\n${details}`);
  }

  const env = parsed.data;
  if (env.SLACK_MODE === "socket") {
    if (!env.SLACK_APP_TOKEN || !env.SLACK_APP_TOKEN.startsWith("xapp-")) {
      throw new Error(
        "Invalid Manhaj Bridge environment:\n  - SLACK_APP_TOKEN: required for Socket Mode and must start with xapp-",
      );
    }
  }

  return env;
}
