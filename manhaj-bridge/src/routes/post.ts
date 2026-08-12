import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import type { App } from "@slack/bolt";
import { postAsAgent } from "../slack/app.js";
import type { AgentRegistry } from "../agents.js";
import { findAgent } from "../agents.js";

const postBodySchema = z.object({
  channel: z.string().min(1),
  text: z.string().min(1),
  thread_ts: z.string().min(1).optional(),
  agent: z.object({
    logical_id: z.string().min(1),
    display_name: z.string().min(1),
    icon_url: z.string().url(),
  }),
});

export type CreatePostRouterOptions = {
  apiKey: string;
  slackApp: App;
  registry: AgentRegistry;
};

function unauthorized(res: Response): void {
  res.status(401).json({
    ok: false,
    error: "unauthorized",
    message: "Missing or invalid Bearer BRIDGE_API_KEY",
  });
}

function requireBearer(apiKey: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.header("authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match || match[1] !== apiKey) {
      unauthorized(res);
      return;
    }
    next();
  };
}

export function createPostRouter(options: CreatePostRouterOptions): Router {
  const router = Router();

  router.post(
    "/v1/post",
    requireBearer(options.apiKey),
    async (req: Request, res: Response) => {
      const parsed = postBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          ok: false,
          error: "invalid_body",
          issues: parsed.error.issues,
        });
        return;
      }

      const body = parsed.data;
      const seeded = findAgent(options.registry, body.agent.logical_id);

      // Request body always wins for display_name / icon_url (fleet may override).
      // Registry is advisory for known identities.
      try {
        const posted = await postAsAgent(options.slackApp, {
          channel: body.channel,
          text: body.text,
          thread_ts: body.thread_ts,
          username: body.agent.display_name,
          icon_url: body.agent.icon_url,
        });

        res.status(200).json({
          ok: true,
          ts: posted.ts,
          channel: posted.channel,
          agent: {
            logical_id: body.agent.logical_id,
            display_name: body.agent.display_name,
            icon_url: body.agent.icon_url,
            known_in_registry: Boolean(seeded),
          },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to post message";
        res.status(502).json({
          ok: false,
          error: "slack_post_failed",
          message,
        });
      }
    },
  );

  return router;
}
