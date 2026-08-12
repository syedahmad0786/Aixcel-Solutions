import { App } from "@slack/bolt";
import type { Env } from "../env.js";
import type { AgentRegistry } from "../agents.js";
import { registerMentionHandlers } from "./mentions.js";

export function createSlackApp(env: Env, registry: AgentRegistry): App {
  const app = new App({
    token: env.SLACK_BOT_TOKEN,
    appToken: env.SLACK_APP_TOKEN,
    signingSecret: env.SLACK_SIGNING_SECRET,
    socketMode: env.SLACK_MODE === "socket",
  });

  registerMentionHandlers(app, registry);

  return app;
}

export type PostAsAgentInput = {
  channel: string;
  text: string;
  thread_ts?: string;
  username: string;
  icon_url: string;
};

export async function postAsAgent(
  app: App,
  input: PostAsAgentInput,
): Promise<{ ok: true; ts: string; channel: string }> {
  const result = await app.client.chat.postMessage({
    channel: input.channel,
    text: input.text,
    username: input.username,
    icon_url: input.icon_url,
    ...(input.thread_ts ? { thread_ts: input.thread_ts } : {}),
  });

  if (!result.ok || !result.ts || !result.channel) {
    throw new Error(
      `chat.postMessage failed: ${result.error ?? "unknown Slack error"}`,
    );
  }

  return {
    ok: true,
    ts: result.ts,
    channel: result.channel,
  };
}
