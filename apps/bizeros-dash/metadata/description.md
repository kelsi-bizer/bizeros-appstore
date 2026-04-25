# BizerOS Dash

BizerOS Dash is the home-screen dashboard for your BizerOS install — a fork of [Homarr](https://homarr.dev) customised for the Bizeros ecosystem. Use it as the single page you bookmark, with tiles for every other Bizeros app and any other self-hosted service you run.

## What it does

- **Drag-and-drop tile layout.** Multiple boards, per-board grid, mobile and desktop layouts. No YAML — everything is edited in the web UI.
- **40+ integrations.** Status pings, media servers (Plex / Jellyfin / Emby), *arr stack (Sonarr / Radarr / Lidarr / Readarr), download clients (qBittorrent / Deluge / SABnzbd / NZBGet), smart-home (Home Assistant), Pi-hole / AdGuard, Proxmox, Docker, Portainer, calendars, weather, RSS, and more.
- **10K+ app icons** built in via the [Dashboard Icons](https://github.com/walkxcode/dashboard-icons) collection.
- **Credentials-based auth out of the box** — first-run wizard creates an admin user.
- **Public boards** (no login) and **private boards** (per-user) both supported.

## Bundled in one container

The Dashboard image ships with **everything inside a single container** — nginx fronts the Next.js app on port 7575, an internal Redis and a tasks worker run alongside, and SQLite stores layout/integration data. No external database or cache is required.

| Path inside container | Purpose |
| --- | --- |
| `/appdata/db/db.sqlite` | Layouts, boards, users, encrypted integration credentials |
| `/appdata/redis/` | Internal Redis snapshots |
| `/appdata/trusted-certificates/` | Drop-in directory for self-signed certs you want the app to trust when polling integrations over HTTPS |

## First run

1. Install from the Bizeros app store. The single form field (`SECRET_ENCRYPTION_KEY`) is auto-generated.
2. Open the app URL — first signup creates the admin account.
3. Add a board, then drag tiles onto it (App, Status, Calendar, Weather, RSS, etc.). Tiles that need credentials open a modal to paste an API key or token.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `SECRET_ENCRYPTION_KEY` | auto-generated (random, hex, 64 chars / 32 bytes) | Encrypts integration credentials at rest in the SQLite DB |
| `AUTH_SECRET` | container entrypoint | Auto-generated each container start (only used by Auth.js for JWT/mail flows that aren't exercised in the credentials-only setup) |
| `TZ` | compose (`${TZ:-UTC}`) | Display timezone for calendar / weather widgets |

## Data persistence

All state lives at `${APP_DATA_DIR}/data/appdata/`. Back this up and you've backed up the whole dashboard.

## Notes & caveats

- **Image is pinned to `dev`.** That's currently the only tag published to `ghcr.io/kelsi-bizer/bizeros-dashboard`. `dev` is a moving target — re-pulling the image may bring in changes. Once the fork publishes a versioned tag (e.g. `1.0.0`) we should pin to it here.
- **Don't lose `SECRET_ENCRYPTION_KEY`.** If the form field is rotated after integrations are configured, every stored API key/token in the dashboard becomes unreadable. Re-entry is the only fix.
- **External Redis is supported.** If you ever want to swap the bundled Redis for an external instance, set `REDIS_IS_EXTERNAL=true` and `REDIS_HOST` / `REDIS_PORT` in the compose. Default is "internal" so this isn't usually needed.

## References

- Source: [github.com/kelsi-bizer/bizeros-dashboard](https://github.com/kelsi-bizer/bizeros-dashboard)
- Upstream Homarr docs: [homarr.dev/docs](https://homarr.dev/docs)
