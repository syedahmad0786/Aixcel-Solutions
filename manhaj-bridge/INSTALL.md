# Install Manhaj Bridge (Slack app)

Human-run checklist to create the Slack app, enable Socket Mode, install it to the AiXCEL workspace, and invite the bot to operator channels.

## Prerequisites

- Slack workspace admin (or permission to create/install apps)
- Node.js 20+
- This package checked out at `manhaj-bridge/`

## 1. Create the Slack app

1. Open [https://api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**.
2. App Name: `Manhaj Bridge` (or `AiXCEL Manhaj Bridge`).
3. Pick the AiXCEL workspace → **Create App**.

## 2. Enable Socket Mode

1. Left nav → **Socket Mode** → toggle **Enable Socket Mode**.
2. Create an **App-Level Token**:
   - Token Name: `manhaj-bridge-socket`
   - Scope: `connections:write`
3. Copy the `xapp-...` token → set as `SLACK_APP_TOKEN` in `.env` (local only; never commit).

Socket Mode is the default for this package. You do **not** need a public Request URL for events in the MVP.

## 3. Bot token scopes

**OAuth & Permissions** → **Scopes** → **Bot Token Scopes**, add:

| Scope | Why |
| --- | --- |
| `chat:write` | Post messages as the bot |
| `chat:write.customize` | Per-message `username` + `icon_url` (required for fleet identities) |
| `app_mentions:read` | Handle `@Manhaj Bridge help` / `status` |
| `channels:history` | Read public channel history when needed |
| `groups:history` | Read private channel history when the bot is a member |
| `channels:read` | Resolve channel metadata |
| `groups:read` | Resolve private channel metadata when invited |

Optional later: `chat:write.public` if you want to post to public channels without an invite (still invite for clarity).

## 4. Event subscriptions

1. **Event Subscriptions** → enable events.
2. Under **Subscribe to bot events**, add:
   - `app_mention`
3. With Socket Mode enabled, Slack delivers events over the websocket — no public HTTPS URL required for the MVP.

## 5. Install to workspace

1. **OAuth & Permissions** → **Install to Workspace** → Allow.
2. Copy the **Bot User OAuth Token** (`xoxb-...`) → `SLACK_BOT_TOKEN`.
3. **Basic Information** → **Signing Secret** → `SLACK_SIGNING_SECRET` (optional for Socket Mode; keep for future HTTP mode).

## 6. Local env

```bash
cd manhaj-bridge
cp .env.example .env
# edit .env — set SLACK_BOT_TOKEN, SLACK_APP_TOKEN, BRIDGE_API_KEY (long random)
npm install
npm run build
npm start
```

Generate `BRIDGE_API_KEY` with something like:

```bash
openssl rand -hex 32
```

Health check:

```bash
curl -s http://127.0.0.1:8787/healthz
```

## 7. Invite the bot to operator channels

In Slack, invite `@Manhaj Bridge` (exact display name may match your app name) to:

| Channel | ID |
| --- | --- |
| `#manhaj-agents` | `C0BPPH3PB7V` |
| `#coding-agents` | `C0BPTR4HV5L` |
| `#operator-runtime` | `C0BPXNF0FED` |

Example:

```text
/invite @Manhaj Bridge
```

## 8. Smoke test (two identities)

With the bridge running:

```bash
BRIDGE_BASE_URL=http://127.0.0.1:8787 \
BRIDGE_API_KEY='your-bridge-api-key' \
SMOKE_CHANNEL=C0BPPH3PB7V \
npm run smoke
```

You should see two messages in `#manhaj-agents` from **Priya Nair** and **Maya Chen** (custom display names + avatars), not as a human user token.

Mention check:

```text
@Manhaj Bridge help
@Manhaj Bridge status
```

## 9. Call the API from fleet agents

```bash
curl -s -X POST http://127.0.0.1:8787/v1/post \
  -H "Authorization: Bearer $BRIDGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C0BPPH3PB7V",
    "text": "Standup: content pipeline green.",
    "agent": {
      "logical_id": "content.video",
      "display_name": "Priya Nair",
      "icon_url": "https://ui-avatars.com/api/?name=Priya+Nair&background=1A4A6B&color=F5F0E8&bold=true&size=128"
    }
  }'
```

## Important limits

- **Per-message** `username` / `icon_url` only — Slack does **not** support setting a different app logo per channel.
- Cursor Slack MCP and ChatGPT Slack apps use their own tokens; leave them installed. Manhaj Bridge is a separate bot for fleet agent identity.
- Never commit `.env` or real tokens. Only `.env.example` belongs in git.
