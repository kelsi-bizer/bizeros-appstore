# Paperclip

> **If OpenClaw is an _employee_, Paperclip is the _company_.**

Paperclip is an open-source orchestration platform for running businesses made of AI agents. It looks like a task manager — but underneath it manages org charts, budgets, governance, goal alignment, and agent coordination across a heterogeneous fleet of agents.

You bring your own agents (Claude Code, Codex, OpenClaw, Cursor, bash, custom HTTP/webhook bots). Paperclip assigns them roles, gives them goals, runs them on heartbeats, tracks their costs, and gives you the board seat — approve hires, set budgets, override strategy, audit everything.

## What it does

| | |
| --- | --- |
| **🔌 Bring Your Own Agent** | Any agent, any runtime, one org chart. If it can receive a heartbeat, it's hired. The image bundles Claude Code, Codex, and opencode-ai CLIs ready to use. |
| **🎯 Goal Alignment** | Every task traces back to the company mission. Agents know *what* to do and *why*. |
| **💓 Heartbeats** | Agents wake on a schedule, check work, and act. Delegation flows up and down the org chart. |
| **💰 Cost Control** | Monthly budgets per agent. When they hit the limit, they stop. No runaway costs. |
| **🏢 Multi-Company** | One deployment, many companies. Complete data isolation. One control plane for your portfolio. |
| **🎫 Ticket System** | Every conversation traced. Every decision explained. Full tool-call tracing and immutable audit log. |
| **🛡️ Governance** | You're the board. Approve hires, override strategy, pause or terminate any agent — at any time. |
| **📊 Org Chart** | Hierarchies, roles, reporting lines. Your agents have a boss, a title, and a job description. |

## First run

1. Install from the Bizeros app store. No form fields — Paperclip generates its own secrets in the volume on first boot.
2. Wait ~20–30 seconds while the embedded Postgres initialises and Paperclip runs its schema migrations.
3. Open the app URL — you'll land on the **Onboarding** flow:
   - Create your **board user** account (email + password)
   - Create your first **company**
   - **Hire** your first agent: paste an Anthropic / OpenAI API key, pick a model, give it a role.
4. Start assigning goals and tasks. Heartbeats run automatically.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3100` | HTTP server port (also serves the UI) |
| `HOST` | `0.0.0.0` | Bind address inside the container |
| `PAPERCLIP_HOME` | `/paperclip` | Root of all persistent state — config, embedded Postgres, file storage, secrets |
| `PAPERCLIP_DEPLOYMENT_MODE` | `authenticated` | `authenticated` requires login (recommended). The other mode is `loopback`, which trusts unauthenticated localhost requests — only safe for `npx paperclipai` on your laptop, never on a Bizeros host. |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | `private` | Tells Paperclip the deployment is private (vs `public`) — affects rate-limit defaults and onboarding hints |
| `OPENCODE_ALLOW_ALL_MODELS` | `true` | Lets the bundled `opencode` CLI talk to any provider/model out of the box |
| `TZ` | `${TZ:-UTC}` | Timezone for heartbeat schedules and dashboard timestamps |

## Data persistence

All state lives at `${APP_DATA_DIR}/data/paperclip/` (mounted as `/paperclip` in the container). This single directory contains:

- `instances/default/config.json` — instance config and deployment mode
- `instances/default/db/` — embedded Postgres data files (companies, agents, tasks, audit log, secrets)
- `instances/default/storage/` — uploaded attachments and work products
- `secrets/` — encryption keys + provider API keys (encrypted at rest)
- `workspaces/` — per-project execution workspaces (git worktrees, etc.)

**Back this directory up.** It contains everything: your companies, agents, conversation histories, costs ledger, and the encryption keys needed to read it.

## Notes & caveats

- **Image is pinned to `latest`.** Paperclip's GitHub Container Registry currently only publishes `latest` and `sha-<commit>` tags — no version tags. `latest` is therefore a moving target; expect breaking changes between Bizeros app updates until upstream cuts a stable tag. Renovate doesn't auto-bump moving tags, so re-pulls happen on container restart.
- **First-run takes ~30s.** Paperclip provisions an embedded Postgres on first boot — the healthcheck has a 30-second `start_period` to cover it. If the app is unhealthy after 60s, check `docker logs` for migration errors.
- **Adapter API keys.** Paperclip itself doesn't need an LLM API key. Each agent you create needs one (Anthropic, OpenAI, etc.) — paste them in the UI when you hire the agent. Secrets are encrypted in the volume; back up `paperclip/` to keep them.
- **Bring-your-own workspace.** Adapters that run code (Claude Code, Codex) work in *project workspaces* you configure inside Paperclip. To give them access to a host directory, mount it in the compose: `- /your/host/code:/paperclip/workspaces/myproject`. Default install gives them isolated workspaces inside `/paperclip/workspaces/`.

## References

- [Paperclip docs](https://paperclip.ing/docs)
- [Source on GitHub](https://github.com/paperclipai/paperclip)
- [Discord](https://discord.gg/m4HZY7xNG3)
