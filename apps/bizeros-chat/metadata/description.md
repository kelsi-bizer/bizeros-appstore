# BizerOS Chat

> The team chat app for BizerOS — a Mattermost fork.

**BizerOS Chat** is the in-house team-chat platform for the BizerOS ecosystem. It's a fork of [Mattermost](https://mattermost.com) packaged for one-click install on Bizeros and rebranded for the Bizeros ecosystem. Underneath, it's the same battle-tested Mattermost server you'd expect — channels, threads, DMs, file sharing, search, plugin support, mobile + desktop clients.

**Image**: `ghcr.io/kelsi-bizer/bizeros-chat:022e332` (currently `linux/amd64` only).

**Source**: [github.com/kelsi-bizer/bizeros-chat](https://github.com/kelsi-bizer/bizeros-chat).

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `bizeros-chat` | `ghcr.io/kelsi-bizer/bizeros-chat:022e332` | Main server (internal port 8065) |
| `bizeros-chat-db` | `postgres:15` | Application database |

## What you get out of the box

- Channels (public + private), threads, direct messages
- File uploads + full-text search (Bleve-backed)
- Webhook integrations, slash commands, bot accounts
- Mobile + desktop apps (point them at your Bizeros host)
- Plugin marketplace — install the [Mattermost Agents plugin](https://github.com/mattermost/mattermost-plugin-agents) to wire up Miles or any OpenAI-compatible LLM as a bot
- Self-hosted, fully offline-capable

## First run

1. Install from the Bizeros app store. Fill in **Site Name** and **Admin Email**. The Postgres password is auto-generated.
2. Open the app URL — the first account you create becomes the system administrator.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `MM_SQLSETTINGS_DATASOURCE` | compose | Postgres connection string to the bundled DB |
| `MM_SERVICESETTINGS_SITEURL` | compose (`https://${APP_DOMAIN}`) | Public URL the chat generates links and OAuth callbacks against |
| `MM_SERVICESETTINGS_ALLOWCORSFROM` | compose (`*`) | CORS allow-list |
| `MM_TEAMSETTINGS_SITENAME` | form field `SITE_NAME` | Display name in the UI |
| `MM_SUPPORTSETTINGS_SUPPORTEMAIL` | form field `ADMIN_EMAIL` | Support contact shown in-app |
| `POSTGRES_PASSWORD` | auto-generated random hex | Bundled Postgres password |
| `TZ` | compose (`${TZ:-UTC}`) | Container timezone |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `config/` — Mattermost `config.json` and related runtime config
- `data/` — uploaded files, images, and plugins
- `postgres/` — Postgres data directory

## Connecting Miles as a chat bot

BizerOS Chat works seamlessly with the [Miles](../miles) AI agent through Mattermost's official **Agents** plugin:

1. Install both apps (BizerOS Chat + Miles) from the Bizeros store.
2. In BizerOS Chat: **System Console → Plugin Management → Plugin Marketplace → Agents → Install**.
3. Configure the plugin: paste Miles's API URL (`http://miles:8642/v1` over the shared Bizeros internal network) and the `API_SERVER_KEY` you set when installing Miles.
4. Set the model name to `arcee-trinity` (or whatever Miles is configured to advertise).
5. Invite the Agents bot into any channel. `@agent` mentions route to Miles.

## Notes & caveats

- **`linux/amd64` only.** The current published image doesn't ship arm64. ARM hosts can't install this app yet.
- **Pinned to a commit SHA** (`022e332`). The fork doesn't publish semver tags yet — Renovate can't auto-bump SHA pins, so updates require manually editing this docker-compose.yml when the fork ships a new tagged release.
- **Mattermost compatibility.** Because BizerOS Chat is a near-identical fork, all Mattermost docs, plugins, and clients work as-is. Point your existing Mattermost mobile / desktop apps at the Bizeros app URL and they'll connect with no further configuration.
- **DB compatibility.** The compose connects to a database named `mattermost` with user `mmuser` to keep schema-compatibility with upstream Mattermost.

## References

- [BizerOS Chat source](https://github.com/kelsi-bizer/bizeros-chat)
- [Mattermost docs (upstream)](https://docs.mattermost.com)
- [Mattermost configuration reference](https://docs.mattermost.com/configure/configuration-settings.html)
- [Mattermost Agents plugin](https://github.com/mattermost/mattermost-plugin-agents)
