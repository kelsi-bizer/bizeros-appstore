# Twenty

Twenty is an open-source, self-hostable CRM positioned as a modern alternative to Salesforce. It ships a customisable data model, Kanban and spreadsheet-style views, opportunity/contact/company records, activity tracking, and a plugin-friendly architecture — all running on infrastructure you control.

This package bundles:

- **twenty-server** — the HTTP API and UI (main service on the app port).
- **twenty-worker** — a background job runner sharing the same image and local storage.
- **twenty-db** — Postgres 16 with a dedicated database (`default`) for Twenty.
- **twenty-redis** — Redis 7 for queue and cache backing.

## First run

1. Install the app from your Runtipi app store.
2. Leave **App Secret** and **Postgres Password** on their auto-generated values (they're random secrets).
3. Open the app URL — the first signup becomes the workspace administrator.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `SERVER_URL` | compose (`https://${APP_DOMAIN}`) | Public URL Twenty generates links and OAuth callbacks against |
| `PG_DATABASE_URL` | compose | Connection string to the bundled `twenty-db` Postgres |
| `REDIS_URL` | compose | Redis connection string for queues / cache |
| `APP_SECRET` | auto-generated (random field, base64) | Signing key for sessions and tokens |
| `PG_DATABASE_PASSWORD` | auto-generated (random field, hex) | Password for the bundled Postgres `twenty` role |
| `STORAGE_TYPE` | compose (`local`) | Persists uploads on the host under `${APP_DATA_DIR}/data/server` |
| `TZ` | compose (`${TZ:-UTC}`) | Container timezone |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `server/` — uploaded files served by Twenty's local storage driver
- `postgres/` — Postgres data directory for the bundled database

## References

- [Twenty docs](https://twenty.com/developers)
- [Twenty Docker repo](https://github.com/twentyhq/twenty/tree/main/packages/twenty-docker)
