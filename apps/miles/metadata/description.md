# Miles

> The AI agent built into BizerOS.

**Miles** is a self-hosted AI agent designed for the kind of small, local businesses that BizerOS is built for — butchers, salons, HVAC companies, repair shops; the kind of Main Street businesses that run on thin margins and long hours where the owner wears every hat. Miles is the assistant they didn't have time to hire.

Miles isn't a chatbot bolted onto BizerOS — Miles _is_ BizerOS, from the owner's perspective. Email, calendar, invoicing, customer records, financial data — every connected app routes through Miles, so the owner doesn't have to learn ten tools. They talk to Miles, Miles handles it.

## What's under the hood

- **LLM**: [Arcee Trinity](https://chat.arcee.ai/) via the OpenAI-compatible Arcee API at `https://api.arcee.ai/v1`. Default model: `arcee-trinity`.
- **Agent core**: forked from [NousResearch/Hermes-Agent](https://github.com/NousResearch/hermes-agent) — keeps Hermes's tool-calling loop, persistent memory, autonomous skill creation, and multi-platform messaging gateway. Rebrands the user-facing surface for BizerOS.
- **Image**: `ghcr.io/kelsi-bizer/miles-agent:latest` (multi-arch on amd64 + arm64).
- **Source**: [github.com/kelsi-bizer/miles-agent](https://github.com/kelsi-bizer/miles-agent).

## What you get out of the box

- **OpenAI-compatible API** at `/v1/chat/completions` on port 8642 — point any OpenAI-format client at Miles and it works (Open WebUI, Mattermost AI plugin, LobeChat, LibreChat, Continue.dev, Cursor, etc.)
- **90+ built-in tools** — file operations, terminal, web search, browser automation, calendar, email, calculations, code execution
- **Persistent memory + skills** — Miles remembers facts about your business and the people in it across conversations, and learns reusable skills from complex tasks
- **Messaging gateway** (configurable) — bridge Miles to Telegram / Discord / Slack / WhatsApp / Signal / SMS so the owner can text it like a person
- **Scheduled automations** — daily reports, nightly backups, weekly audits, all in natural language
- **Subagent delegation** — long tasks spin up isolated child agents to keep context windows lean

## First run

1. Install from the Bizeros app store. Provide:
   - **Arcee API Key** — get one at [chat.arcee.ai](https://chat.arcee.ai). Required.
   - The **API Server Auth Key** is auto-generated; don't change it.
2. Wait ~30–60 seconds on first boot — Miles initializes its data directory at `${APP_DATA_DIR}/data/`.
3. Miles is now reachable at the Bizeros app URL on port 8642.

There's no web UI on this app — Miles speaks the OpenAI Chat Completions protocol over HTTP. Use a chat front-end (Open WebUI bundled separately, or a Mattermost / Discord / Telegram bridge) to talk to it.

## Connecting front-ends

Anything that speaks OpenAI Chat Completions can talk to Miles. Common patterns inside Bizeros:

| Front-end | Endpoint | API Key |
| --- | --- | --- |
| **Open WebUI** | `http://miles:8642/v1` (cross-app) or `https://${APP_DOMAIN}/v1` | the auto-generated `API_SERVER_KEY` |
| **Mattermost Agents plugin** | same | same — paste the key when adding a model in Mattermost's System Console |
| **Continue.dev / Cursor** | the public app URL | same |

Find your `API_SERVER_KEY` in Bizeros's app settings (form field is auto-populated; reveal it to copy).

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `ARCEE_API_KEY` | form field (required) | Authenticates Miles → Arcee Trinity API |
| `ARCEE_BASE_URL` | compose (`https://api.arcee.ai/v1`) | OpenAI-compatible endpoint Miles forwards prompts to |
| `ARCEE_MODEL` | compose (`arcee-trinity`) | Default model name advertised on `/v1/models` |
| `API_SERVER_HOST` / `API_SERVER_PORT` | compose (`0.0.0.0:8642`) | Bind address — `0.0.0.0` so Bizeros traefik can route in |
| `API_SERVER_KEY` | auto-generated random hex | Bearer token clients must pass |
| `MILES_HOME` / `HERMES_HOME` | compose (`/opt/data`) | Data dir inside the container |
| `TZ` | compose (`${TZ:-UTC}`) | Schedule timezone for cron-style automations |

## Data persistence

All state lives at `${APP_DATA_DIR}/data/` (mounted as `/opt/data` in the container):

- `config.toml` — Miles configuration
- `db/` — SQLite databases (conversation history, memory, FTS5 search index)
- `skills/` — autonomous-learned skill files
- `secrets/` — encrypted credentials for connected platforms

**Back this directory up.** It's everything Miles knows, including the encryption keys for stored credentials.

## Notes & caveats

- **Tag is `latest`.** Renovate doesn't auto-bump moving tags; re-pulls happen on container restart.
- **API only — no built-in web UI.** Open the app URL in a browser and you'll get a JSON / 404 response. Pair this with Open WebUI (or another OpenAI-compatible chat front-end) for a usable chat experience.
- **Costs.** Every prompt forwarded to Arcee Trinity is billed by Arcee. Watch your usage in the Arcee dashboard.
- **`API_SERVER_KEY` rotation.** Regenerating the key (from Bizeros's app settings) immediately invalidates all client connections. Update each connected front-end with the new key.

## References

- [Miles source](https://github.com/kelsi-bizer/miles-agent)
- [Arcee Conductor / Trinity docs](https://docs.arcee.ai)
- [Hermes Agent (upstream)](https://github.com/NousResearch/hermes-agent)
