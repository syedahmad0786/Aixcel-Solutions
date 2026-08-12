import express from "express";
import { loadEnv } from "./env.js";
import { loadAgentRegistry } from "./agents.js";
import { createSlackApp } from "./slack/app.js";
import { createPostRouter } from "./routes/post.js";

async function main(): Promise<void> {
  const env = loadEnv();
  const registry = loadAgentRegistry();
  const slackApp = createSlackApp(env, registry);

  const http = express();
  http.use(express.json({ limit: "256kb" }));

  http.get("/healthz", (_req, res) => {
    res.status(200).json({
      ok: true,
      service: "manhaj-bridge",
      product: "Manhaj Bridge",
      mode: env.SLACK_MODE,
      agents: registry.agents.length,
    });
  });

  http.use(
    createPostRouter({
      apiKey: env.BRIDGE_API_KEY,
      slackApp,
      registry,
    }),
  );

  await slackApp.start();
  console.log(
    `Manhaj Bridge Slack app started (mode=${env.SLACK_MODE}, agents=${registry.agents.length})`,
  );

  http.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Manhaj Bridge HTTP listening on 0.0.0.0:${env.PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
