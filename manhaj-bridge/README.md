# Manhaj Bridge

Slack posting gateway for **AiXCEL Solutions** fleet agents (Manhaj / Operator). Agents publish with their own display names and avatars instead of appearing as a human user token.

Customer-facing name: **Manhaj Bridge** (Operator). Do not call this product “QM”.

## Why this exists

Cursor’s Slack MCP (and similar tools) typically authenticate with a **user token**. Every message then shows as that human (e.g. Ahmad). Manhaj Bridge is a dedicated Slack **bot** with:

- `chat:write`
- `chat:write.customize`

so each `chat.postMessage` can set per-message `username` and `icon_url`.

This does **not** set per-channel logos — Slack does not support that.

## Architecture

```text
Fleet / Operator agents
        │
        │  POST /v1/post  (Bearer BRIDGE_API_KEY)
        ▼
┌──────────────────┐
│  Manhaj Bridge   │  Express + Bolt
│  (this package)  │
└────────┬─────────┘
         │ Socket Mode → chat.postMessage
         │ (username + icon_url per message)
         ▼
   Shared Slack channels
   (#manhaj-agents, #coding-agents, #operator-runtime)
         ▲
         │ still their own apps/tokens
┌────────┴─────────┐
│ Cursor Slack MCP │  user token → posts as human
│ ChatGPT Slack    │  separate bot
└──────────────────┘
```

**Coexistence:** Install Manhaj Bridge alongside Cursor and ChatGPT Slack apps. They share channels; they do not share tokens. Fleet traffic that needs agent faces goes through Manhaj Bridge. Human/Cursor traffic stays on the Cursor app.

Default transport is **Socket Mode** (no public ingress for Slack events). The HTTP server only exposes the bridge API (`POST /v1/post`, `GET /healthz`).

## Package layout

```text
manhaj-bridge/
  agents.registry.json   # seeded AiXCEL roles
  src/
    index.ts             # Bolt + Express bootstrap
    env.ts               # Zod env validation
    agents.ts            # registry loader
    routes/post.ts       # POST /v1/post
    slack/app.ts         # Bolt app + chat.postMessage helper
    slack/mentions.ts    # @mention help / status
  scripts/smoke-post.ts  # two fake agent identities
  INSTALL.md             # create Slack app + invite channels
```

## API

### `POST /v1/post`

Header: `Authorization: Bearer <BRIDGE_API_KEY>`

```json
{
  "channel": "C0BPPH3PB7V",
  "text": "Hello from the fleet",
  "thread_ts": "optional",
  "agent": {
    "logical_id": "content.video",
    "display_name": "Priya Nair",
    "icon_url": "https://example.com/priya.png"
  }
}
```

Maps to Slack `chat.postMessage` with `username=display_name` and `icon_url=icon_url`.

### `GET /healthz`

Liveness + registry count. No auth.

### App mentions

- `@Manhaj Bridge help`
- `@Manhaj Bridge status`

## Quick start

See [INSTALL.md](./INSTALL.md) for creating the Slack app and inviting the bot.

```bash
cd manhaj-bridge
cp .env.example .env   # fill tokens locally
npm install
npm run build
npm start
```

Smoke (bridge must be running):

```bash
BRIDGE_API_KEY=... SMOKE_CHANNEL=C0BPPH3PB7V npm run smoke
```

## Seeded agents

| logical_id | display_name |
| --- | --- |
| `exec.coordinator` | Exec Coordinator |
| `content.video` | Priya Nair |
| `brand.editorial` | Brand Editorial |
| `eng.platform` | Platform Engineering |
| `pm.chirocandy` | Maya Chen |
| `ops.runtime` | Operator Runtime |
| `research.insights` | Research Insights |

Override `display_name` / `icon_url` on each request when needed; `logical_id` remains the stable fleet key.

## Stack

- TypeScript, Node 20+
- `@slack/bolt` (Socket Mode by default)
- Express for the bridge HTTP API
- Zod for env + request validation
