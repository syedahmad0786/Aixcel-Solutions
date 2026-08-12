/**
 * Offline self-check: registry + env validation (no Slack network calls).
 */
import assert from "node:assert/strict";
import { loadAgentRegistry, findAgent } from "../src/agents.js";
import { loadEnv } from "../src/env.js";

function expectThrow(fn: () => unknown, label: string): void {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  assert.equal(threw, true, label);
}

const registry = loadAgentRegistry();
assert.equal(registry.version, 1);
assert.ok(registry.agents.length >= 5);
assert.ok(findAgent(registry, "content.video")?.display_name === "Priya Nair");
assert.ok(findAgent(registry, "pm.chirocandy")?.display_name === "Maya Chen");
assert.ok(findAgent(registry, "exec.coordinator"));

expectThrow(() => loadEnv({}), "empty env should fail");
expectThrow(
  () =>
    loadEnv({
      SLACK_BOT_TOKEN: "xoxb-test",
      SLACK_APP_TOKEN: "xapp-test",
      SLACK_SIGNING_SECRET: "secret",
      BRIDGE_API_KEY: "short",
    }),
  "short API key should fail",
);

const ok = loadEnv({
  SLACK_BOT_TOKEN: "xoxb-test-token",
  SLACK_APP_TOKEN: "xapp-test-token",
  SLACK_SIGNING_SECRET: "signing-secret",
  BRIDGE_API_KEY: "0123456789abcdef",
  PORT: "9090",
  SLACK_MODE: "socket",
});
assert.equal(ok.PORT, 9090);
assert.equal(ok.SLACK_MODE, "socket");

console.log("manhaj-bridge self-check OK");
