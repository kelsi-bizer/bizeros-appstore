# n8n

n8n is an open-source, fair-code workflow automation tool — a self-hosted alternative to Zapier, Make, and Workato. Build automations visually by chaining nodes for HTTP requests, databases, 500+ SaaS integrations, and built-in AI / LLM agents. Workflows can run on a schedule, fire on webhook calls, or react to external events; results stream into databases, files, Slack/Discord/Telegram messages, or anywhere else you can hit an API.

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `n8n` | `n8nio/n8n:2.18.3` | Main editor + API (internal port 5678) |
| `n8n-db` | `postgres:16` | Workflow + execution storage |
| `n8n-init` | `bash:5` | One-shot — fixes ownership of the n8n data dir to UID 1000 on first boot |

## What you get

- **500+ pre-built integrations** — Slack, Discord, Telegram, Gmail, Google Sheets, Notion, Airtable, GitHub, GitLab, Jira, ClickUp, Salesforce, HubSpot, Stripe, OpenAI, Anthropic, Hugging Face, and many more
- **Visual editor** — drag nodes onto a canvas, draw lines between them, run/inspect at every step
- **AI / Agent nodes** — built-in nodes for LangChain agents, vector stores, RAG, tool calling, and chat triggers
- **Code nodes** — drop into JavaScript or Python when no visual node fits
- **Triggers** — schedule (cron), webhook, polling, MQTT, RabbitMQ, etc.
- **Self-hosted execution** — workflows run on your hardware, no usage caps or per-execution fees

## First run

1. Install from the Bizeros app store. Both Postgres passwords are auto-generated; nothing to fill in.
2. Wait ~30–60 seconds on first boot — Postgres initializes, the init script creates the non-root `n8n` DB user, then n8n runs schema migrations.
3. Open the app URL — n8n shows the **owner setup** wizard. Create your owner account (email + password). The first signup becomes the instance owner.
4. (Optional) Invite team members and create credentials for any external services you want to integrate.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `N8N_HOST` / `N8N_EDITOR_BASE_URL` / `WEBHOOK_URL` | compose (`${APP_DOMAIN}`) | Public URLs n8n generates webhook endpoints + redirect URIs against |
| `N8N_PROTOCOL` | compose (`https`) | Forces n8n to advertise https (Bizeros traefik terminates TLS) |
| `N8N_DEFAULT_BINARY_DATA_MODE` | compose (`filesystem`) | Stores binary outputs (file uploads / downloads) on disk in the volume rather than in Postgres — recommended for large payloads |
| `DB_TYPE` / `DB_POSTGRESDB_*` | compose | Postgres connection (always uses the bundled DB) |
| `N8N_DB_ROOT_PASSWORD` | auto-generated random | Postgres superuser password — used only by the bootstrap init-data.sh script |
| `N8N_DB_PASSWORD` | auto-generated random | Password for the limited-privileges `n8n` DB user that the application connects with at runtime |
| `TZ` / `GENERIC_TIMEZONE` | compose (`${TZ:-UTC}`) | Schedule trigger timezone, log timestamps |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `n8n/` — n8n's `~/.n8n` directory: workflows, execution history, encrypted credentials, binary data, custom nodes
- `postgres/` — Postgres data directory (workflows + executions table)
- `init/init-data.sh` — pre-staged Postgres init script that creates the non-root `n8n` DB user the first time the database container starts

**Back up `n8n/` and `postgres/` together.** The encryption key for credentials lives in `n8n/`, and the credentials themselves live (encrypted) in `postgres/`. Either alone is incomplete.

## Upgrade notes

- This package is on **n8n v2.x**. n8n maintains v1.x in parallel (currently `1.123.x`) for users who depend on the older API surface. If you've been running an older v1 install elsewhere, read the [v2 migration guide](https://docs.n8n.io/release-notes/) before importing workflows.

## Tips

- **Workers / external runners.** The default install runs everything in one process. For high-volume webhook traffic, n8n supports a separate `n8nio/runners` image (the [external task runner architecture](https://docs.n8n.io/hosting/scaling/task-runners/)). Not bundled here — add as a sidecar if you need it.
- **Custom nodes.** Drop `.tar.gz` packages into `n8n/custom/` and restart the container to load them.
- **Credential encryption key.** n8n auto-generates `~/.n8n/config.encryptionKey` on first boot. Do not delete it — you'll lose access to every saved credential.

## References

- [n8n docs](https://docs.n8n.io)
- [Self-hosted hosting guide](https://docs.n8n.io/hosting/installation/docker/)
- [Source on GitHub](https://github.com/n8n-io/n8n)
