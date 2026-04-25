# Nextcloud

Nextcloud is an open-source file sync and share platform — a self-hostable alternative to Dropbox, Google Drive, OneDrive, and iCloud Drive. This package focuses on its file-management surface; other Nextcloud apps (Calendar, Mail, Talk, Office, Notes, etc.) can be enabled later from the admin UI if you want them.

## What you get out of the box

- Web file manager with grid + list views, drag-and-drop uploads, in-browser preview for images / PDFs / video / audio
- Per-user storage with quota controls
- Granular sharing — share with users, groups, or public links (password-protected, with expiry, with upload permission)
- File versioning + trash bin (restore deletes within ~30 days by default)
- Sync clients for **macOS, Windows, Linux, iOS, Android** — point them at this Runtipi URL with your admin credentials and they'll keep your local files in sync
- Server-side encryption (off by default; enable in Admin → Security)
- WebDAV endpoint at `/remote.php/dav/files/<user>/` for any WebDAV client (Finder, Explorer, rclone, etc.)
- App store inside Nextcloud — install Calendar, Contacts, Tasks, Office (Collabora/OnlyOffice), Talk, Notes, Bookmarks, etc. as needed

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `nextcloud` | `nextcloud:33.0.2-apache` | Main PHP app + Apache web server (internal port 80) |
| `nextcloud-cron` | `nextcloud:33.0.2-apache` | Runs `/cron.sh` every 5 minutes — required for file scanning, notifications, and scheduled jobs |
| `nextcloud-db` | `postgres:16-alpine` | Application metadata: users, groups, share permissions, file index |
| `nextcloud-redis` | `redis:7-alpine` | Memcache + transactional file locking (required for safe multi-client sync) |

## First run

1. Install from the Bizeros app store. Pick an admin username + password in the form fields. The Postgres password is auto-generated.
2. Wait ~60 seconds on first boot for Nextcloud to run schema migrations.
3. Open the app URL — you'll land in the file browser, signed in as the admin you just created.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `NEXTCLOUD_ADMIN_USER` / `NEXTCLOUD_ADMIN_PASSWORD` | form fields | Initial admin account, created on first boot only |
| `POSTGRES_PASSWORD` | auto-generated (random, hex) | Bundled Postgres password |
| `NEXTCLOUD_TRUSTED_DOMAINS` | compose (`${APP_DOMAIN}`) | Hostname Nextcloud accepts in the `Host:` header — protects against host-header injection |
| `OVERWRITEPROTOCOL` | compose (`https`) | Tells Nextcloud all generated URLs should use HTTPS (Runtipi terminates TLS at traefik) |
| `TRUSTED_PROXIES` | compose | Allows Nextcloud to trust `X-Forwarded-*` headers from the Runtipi traefik network |
| `TZ` | compose (`${TZ:-UTC}`) | Timezone for cron + uploaded-file timestamps |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `nextcloud/` — Nextcloud installation directory **including all user files** at `nextcloud/data/<username>/files/`. This is the most important directory to back up.
- `postgres/` — application database
- `redis/` — Redis snapshot (regenerable; can be wiped)

## Optional: enable more Nextcloud apps later

After install, sign in as admin → click your avatar → **Apps**. Examples worth enabling:

- **Calendar / Contacts / Tasks** — CalDAV/CardDAV server for Apple/Google/Outlook clients
- **Notes** — Markdown notes, syncs with the Notes mobile apps
- **Photos** — Google-Photos-style timeline view of uploaded images
- **Files external storage** — mount S3, SMB, FTP as virtual folders
- **Talk** — chat + WebRTC video calls (small group calls work without the high-performance backend)
- **Collabora Online** or **OnlyOffice** — in-browser document editing (each runs in a separate container; not bundled here)

## References

- [Nextcloud admin manual](https://docs.nextcloud.com/server/latest/admin_manual/)
- [Official Docker image docs](https://github.com/nextcloud/docker)
