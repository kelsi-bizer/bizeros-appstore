# Plane

Plane is an open-source project management tool — a self-hostable alternative to JIRA, Linear, and Monday. It tracks issues, epics, cycles, modules, pages, and product roadmaps with customisable views (Kanban, list, calendar, Gantt, spreadsheet).

This package bundles the entire **Plane Community** stack in a single Runtipi app so nothing external is required:

| Service | Image | Role |
| --- | --- | --- |
| `plane-proxy` | `makeplane/plane-proxy` | Main entrypoint — routes HTTP to web/api/space/admin/live |
| `plane-web` | `makeplane/plane-frontend` | Main Next.js app |
| `plane-space` | `makeplane/plane-space` | Public workspace views |
| `plane-admin` | `makeplane/plane-admin` | God-mode admin UI (`/god-mode`) |
| `plane-live` | `makeplane/plane-live` | Realtime / collaborative sync |
| `plane-api` | `makeplane/plane-backend` | Django REST API |
| `plane-worker` | `makeplane/plane-backend` | Celery worker |
| `plane-beat-worker` | `makeplane/plane-backend` | Celery beat scheduler |
| `plane-migrator` | `makeplane/plane-backend` | One-shot DB migration runner |
| `plane-db` | `postgres:15.7-alpine` | Primary database |
| `plane-redis` | `valkey/valkey:7.2.11-alpine` | Redis-compatible cache |
| `plane-mq` | `rabbitmq:3.13.6-management-alpine` | Task queue |
| `plane-minio` | `minio/minio` | S3-compatible object store for uploads |

## First run

1. Install from the Runtipi app store. All secrets (`SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `POSTGRES_PASSWORD`, `RABBITMQ_PASSWORD`, `AWS_SECRET_ACCESS_KEY`) are auto-generated — leave the form fields as they come.
2. Wait ~1 minute on first boot while `plane-migrator` runs schema migrations; the API won't come healthy until it finishes.
3. Open the app URL — the first signup becomes the instance administrator.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `SECRET_KEY` | auto-generated (random, base64) | Django signing secret for API / worker / beat |
| `LIVE_SERVER_SECRET_KEY` | auto-generated (random, base64) | Shared secret between API and realtime service |
| `POSTGRES_PASSWORD` | auto-generated (random, hex) | Bundled Postgres password |
| `RABBITMQ_PASSWORD` | auto-generated (random, hex) | Bundled RabbitMQ password |
| `AWS_SECRET_ACCESS_KEY` | auto-generated (random, hex) | MinIO secret for uploads |
| `DATABASE_URL` | compose | Django DSN assembled from the Postgres values |
| `AMQP_URL` | compose | Celery broker URL assembled from the RabbitMQ values |
| `WEB_URL` / `CORS_ALLOWED_ORIGINS` | compose (`https://${APP_DOMAIN}`) | Public URL Plane generates links against |
| `TZ` | compose (`${TZ:-UTC}`) | Container timezone |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `postgres/` — Plane database
- `redis/` — Valkey AOF / RDB snapshots
- `rabbitmq/` — RabbitMQ message queue state
- `minio/` — uploaded attachments, avatars, and cover images
- `proxy-config/`, `proxy-data/` — Caddy/nginx config and TLS cache (unused behind Runtipi's traefik but required by the container)

## References

- [Plane docs](https://developers.plane.so)
- [Plane repo](https://github.com/makeplane/plane)
- [Community self-host compose](https://github.com/makeplane/plane/tree/master/deployments/cli/community)
