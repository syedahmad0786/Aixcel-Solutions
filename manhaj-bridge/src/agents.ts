import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const agentSchema = z.object({
  logical_id: z.string().min(1),
  display_name: z.string().min(1),
  icon_url: z.string().url(),
  role: z.string().optional(),
});

const registrySchema = z.object({
  version: z.number().int(),
  description: z.string().optional(),
  agents: z.array(agentSchema).min(1),
});

export type AgentIdentity = z.infer<typeof agentSchema>;
export type AgentRegistry = z.infer<typeof registrySchema>;

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadAgentRegistry(
  path = join(packageRoot, "agents.registry.json"),
): AgentRegistry {
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
  return registrySchema.parse(raw);
}

export function findAgent(
  registry: AgentRegistry,
  logicalId: string,
): AgentIdentity | undefined {
  return registry.agents.find((agent) => agent.logical_id === logicalId);
}
