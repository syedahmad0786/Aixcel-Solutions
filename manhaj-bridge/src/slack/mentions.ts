import type { App } from "@slack/bolt";
import type { AgentRegistry } from "../agents.js";

function helpText(): string {
  return [
    "*Manhaj Bridge* — AiXCEL Operator Slack gateway",
    "",
    "Fleet agents post here with their own display names and avatars via `chat:write.customize`.",
    "This does *not* set per-channel logos (unsupported by Slack).",
    "",
    "*Commands (via mention)*",
    "• `@Manhaj Bridge help` — this message",
    "• `@Manhaj Bridge status` — runtime + registry summary",
    "",
    "*HTTP API*",
    "`POST /v1/post` with Bearer `BRIDGE_API_KEY` to publish as an agent identity.",
    "",
    "Coexists with Cursor / ChatGPT Slack apps in shared channels; those remain separate apps with their own tokens.",
  ].join("\n");
}

function statusText(registry: AgentRegistry): string {
  const agents = registry.agents
    .map((a) => `• \`${a.logical_id}\` — ${a.display_name}`)
    .join("\n");

  return [
    "*Manhaj Bridge status*",
    "• Mode: Socket Mode (default)",
    `• Registry version: ${registry.version}`,
    `• Agents seeded: ${registry.agents.length}`,
    "",
    "*Agent identities*",
    agents,
  ].join("\n");
}

export function registerMentionHandlers(
  app: App,
  registry: AgentRegistry,
): void {
  app.event("app_mention", async ({ event, say, logger }) => {
    try {
      const text = (event.text ?? "").toLowerCase();
      const wantsStatus = /\bstatus\b/.test(text) || /\bhealth\b/.test(text);

      await say({
        text: wantsStatus ? statusText(registry) : helpText(),
        thread_ts: event.thread_ts ?? event.ts,
      });
    } catch (error) {
      logger.error(error);
    }
  });
}
