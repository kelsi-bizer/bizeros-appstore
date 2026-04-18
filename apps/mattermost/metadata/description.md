# Mattermost

Mattermost is an open-source, self-hostable team chat platform designed as an alternative to Slack and Microsoft Teams. It provides persistent channels, direct messages, threaded conversations, file sharing, search, and a rich plugin/integration ecosystem — all running on infrastructure you control.

This app uses the Team Edition (free, open-source) image and bundles a dedicated Postgres 15 database so Mattermost is fully self-contained.

## Features

- Channels, threads, and direct messages
- File sharing and full-text search (Bleve-backed)
- Integrations via incoming/outgoing webhooks, slash commands, and bots
- Desktop and mobile apps (point them at your Runtipi-hosted URL)
- Self-hosted, fully offline-capable

## First run

1. Install the app from your custom app store inside Runtipi.
2. Fill in the **Site Name** and **Admin Email** form fields.
3. After the container boots, open the app URL — the first account you create becomes the system administrator.

## Configuration

The following environment variables are wired into the container:

| Variable | Source | Purpose |
| --- | --- | --- |
| `MM_SQLSETTINGS_DATASOURCE` | compose | Postgres connection string to the bundled `mattermost-db` |
| `MM_SERVICESETTINGS_SITEURL` | compose (`${APP_DOMAIN}`) | Public HTTPS URL Mattermost generates links against |
| `MM_SERVICESETTINGS_ALLOWCORSFROM` | compose | CORS allow-list (set to `*` by default) |
| `MM_TEAMSETTINGS_SITENAME` | form field `SITE_NAME` | Display name in the UI |
| `MM_SUPPORTSETTINGS_SUPPORTEMAIL` | form field `ADMIN_EMAIL` | Support contact shown in-app |
| `POSTGRES_PASSWORD` | auto-generated (random field) | Password for the bundled Postgres `mmuser` role; persisted by Runtipi on first install |
| `TZ` | compose (`${TZ:-UTC}`) | Container timezone |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `config/` — Mattermost `config.json` and related runtime config
- `data/` — uploaded files, images, and plugins
- `postgres/` — Postgres data directory for the bundled database

## References

- [Official Mattermost Docker docs](https://docs.mattermost.com/install/install-docker.html)
- [Mattermost configuration settings](https://docs.mattermost.com/configure/configuration-settings.html)
