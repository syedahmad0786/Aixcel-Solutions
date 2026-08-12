/**
 * Smoke-test Manhaj Bridge by posting as two fake agent identities.
 *
 * Usage (from manhaj-bridge/):
 *   BRIDGE_BASE_URL=http://127.0.0.1:8787 \
 *   BRIDGE_API_KEY=... \
 *   SMOKE_CHANNEL=C0BPPH3PB7V \
 *   npm run smoke
 */
import { z } from "zod";

const smokeEnvSchema = z.object({
  BRIDGE_BASE_URL: z.string().url().default("http://127.0.0.1:8787"),
  BRIDGE_API_KEY: z.string().min(16),
  SMOKE_CHANNEL: z.string().min(1).default("C0BPPH3PB7V"),
});

const agents = [
  {
    logical_id: "content.video",
    display_name: "Priya Nair",
    icon_url:
      "https://ui-avatars.com/api/?name=Priya+Nair&background=1A4A6B&color=F5F0E8&bold=true&size=128",
    text: "[smoke] Priya Nair (content.video) checking Manhaj Bridge identity customization.",
  },
  {
    logical_id: "pm.chirocandy",
    display_name: "Maya Chen",
    icon_url:
      "https://ui-avatars.com/api/?name=Maya+Chen&background=3D5A1A&color=F5F0E8&bold=true&size=128",
    text: "[smoke] Maya Chen (pm.chirocandy) checking Manhaj Bridge identity customization.",
  },
] as const;

async function postOne(
  baseUrl: string,
  apiKey: string,
  channel: string,
  agent: (typeof agents)[number],
): Promise<void> {
  const url = new URL("/v1/post", baseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      channel,
      text: agent.text,
      agent: {
        logical_id: agent.logical_id,
        display_name: agent.display_name,
        icon_url: agent.icon_url,
      },
    }),
  });

  const body = (await response.json()) as unknown;
  if (!response.ok) {
    console.error(`FAIL ${agent.logical_id}`, response.status, body);
    process.exitCode = 1;
    return;
  }

  console.log(`OK ${agent.logical_id}`, body);
}

async function main(): Promise<void> {
  const env = smokeEnvSchema.parse(process.env);

  for (const agent of agents) {
    await postOne(env.BRIDGE_BASE_URL, env.BRIDGE_API_KEY, env.SMOKE_CHANNEL, agent);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
