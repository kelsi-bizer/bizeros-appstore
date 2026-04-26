# Cal.com

Cal.com is the open-source Calendly alternative — a self-hostable scheduling platform with personal booking pages, two-way calendar sync, video integrations, and team / round-robin scheduling. This package runs the **Cal.com Community Edition** with a dedicated Postgres 16 database; the few Cal.com features gated behind an enterprise license (Insights, SAML, advanced Teams/Orgs) gracefully degrade with no license key required.

> **Note on the cal.diy fork.** You may have heard of `cal.diy` — a community fork of Cal.com with all enterprise code removed. It's a great project but doesn't ship a prebuilt Docker image, so we ship the Cal.com parent here. Functionally, the core scheduling experience is identical.

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `calcom` | `calcom/cal.com:v6.2.0` | Next.js + tRPC web app (main, internal port 3000) |
| `calcom-db` | `postgres:16` | Application database — users, event types, bookings, encrypted integration credentials |

## What you get out of the box

- **Personal booking pages** at `/<your-username>` with custom event types (15-min intro, 30-min sync, 60-min strategy, etc.)
- **Two-way calendar sync** — Google, Outlook, iCloud, and any CalDAV server
- **Video conferencing integrations** — Google Meet, Zoom, Daily.co, Jitsi (free, no account)
- **Custom availability** with time-zone awareness, buffers, and minimum booking notice
- **Workflows** — automatic emails / SMS reminders, custom thank-you pages
- **Webhooks + REST API** for embedding in your own apps
- **Embeddable widget** (`<iframe>` snippet, button popup, or full-page route) for any website
- **Multi-language** UI (50+ locales)

## First run

1. Install from the Bizeros app store. Three secrets are auto-generated (`CALCOM_NEXTAUTH_SECRET`, `CALENDSO_ENCRYPTION_KEY`, `CALCOM_DB_PASSWORD`); you only need to fill **Default From Address** at minimum.
2. (Optional but recommended) Configure SMTP — without it, Cal.com can't deliver booking confirmations or reminders.
3. (Optional) Paste OAuth credentials for Google / Microsoft / Zoom if you want users to be able to connect those integrations from their account settings.
4. Wait ~30–60 seconds on first boot — Postgres initializes, then Cal.com runs Prisma schema migrations.
5. Open the app URL → click **Sign up**. The first signup becomes the instance owner.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_WEBAPP_URL` / `NEXTAUTH_URL` | compose (`https://${APP_DOMAIN}`) | Public URLs Cal.com generates booking links and OAuth redirect URIs against |
| `NEXTAUTH_SECRET` | auto-generated random base64 | NextAuth session-cookie signing key |
| `CALENDSO_ENCRYPTION_KEY` | auto-generated random hex | AES-256 key for encrypting calendar tokens / integration secrets in the DB. **Don't rotate** post-install. |
| `CALCOM_DB_PASSWORD` | auto-generated random hex | Bundled Postgres password |
| `EMAIL_FROM` / `EMAIL_SERVER_*` | form fields | SMTP setup for booking emails |
| `GOOGLE_API_CREDENTIALS` | form field (optional) | JSON OAuth credentials block for Google Calendar + Meet |
| `MS_GRAPH_CLIENT_ID` / `_SECRET` | form fields (optional) | Azure AD app for Office 365 / Outlook integration |
| `ZOOM_CLIENT_ID` / `_SECRET` | form fields (optional) | Zoom OAuth app for Zoom video integration |
| `LICENSE` / `NEXT_PUBLIC_LICENSE_CONSENT` | compose (`agree`) | Acknowledges Cal.com's AGPL/community-license terms |
| `CALCOM_TELEMETRY_DISABLED` | compose (`1`) | Disables anonymous usage reporting |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `postgres/` — the entire application database: users, event types, bookings, encrypted calendar / integration tokens

This is the only persistent volume. The Cal.com container itself is stateless — uploads, generated PDFs, and other ephemera live in DB or are streamed.

## Notes & caveats

- **amd64-only.** The `calcom/cal.com:v6.2.0` Docker image is single-arch. arm64 users would need to use the separate `:v6.2.0-arm` tag — this app is pinned to the standard amd64 build to match what most users expect. Document edit needed if you switch.
- **Don't lose `CALENDSO_ENCRYPTION_KEY`.** Calendar tokens, OAuth credentials, and other sensitive fields are AES-encrypted with this key in the DB. If you rotate it, every connected calendar / video integration becomes unreadable and users have to reconnect from scratch.
- **Slow first boot.** Cal.com runs Prisma migrations on first start — expect 30–90 seconds before the UI responds. The DB is health-gated so the main service waits for it.
- **OAuth redirect URIs.** When configuring Google / Microsoft / Zoom OAuth apps, set the redirect URI in their consoles to `https://${APP_DOMAIN}/api/integrations/<provider>/callback`. Exact paths in the [Cal.com integrations docs](https://cal.com/docs/integrations).
- **Enterprise feature gating.** Insights, SAML SSO, advanced Teams/Organizations features are visible in the UI but disabled. You'll see "Get a License" prompts. Ignore them — the rest of the app works without one.

## References

- [Cal.com docs](https://cal.com/docs)
- [Self-host guide](https://cal.com/docs/self-hosting)
- [Source on GitHub](https://github.com/calcom/cal.com)
- [cal.diy community fork](https://github.com/calcom/cal.diy) — same product, EE code stripped, but no prebuilt image
