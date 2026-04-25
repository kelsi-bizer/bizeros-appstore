# Metabase

Metabase is an open-source business-intelligence platform. Point it at the databases you already have, then build dashboards, ask ad-hoc questions in SQL or with the no-code query builder, schedule reports to email/Slack, and embed charts in other tools — all without a data-engineering team.

This package bundles:

- **metabase** — the Open Source server (Java / Jetty), main service on port 3000.
- **metabase-db** — Postgres 16 for Metabase's *own* application data (questions, dashboards, users, permissions). Required: Metabase's default H2 file store is wiped if the container is recreated, so any production install must use Postgres.

## Connect your data

After first run, log in as the admin you create during the setup wizard, then go to **Admin → Databases → Add database** to point Metabase at any of these:

- Postgres, MySQL, MariaDB, SQL Server, Oracle, SQLite
- BigQuery, Snowflake, Redshift, Athena
- MongoDB, ClickHouse, Druid, Presto/Trino
- Google Analytics, Spark SQL, Vertica, and ~10 more via community drivers

If your other Bizeros apps (Mattermost, Plane, Twenty, Authentik) are running on the same Runtipi instance, you can connect Metabase to their bundled Postgres databases via the shared `tipi_main_network`.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `POSTGRES_PASSWORD` | auto-generated (random, hex, ≥32) | Metabase ↔ application Postgres |
| `MB_ENCRYPTION_SECRET_KEY` | auto-generated (random, base64, ≥32) | Encrypts data-source credentials Metabase stores in its DB |
| `MB_DB_*` | compose | Application-DB connection (already wired) |
| `JAVA_TIMEZONE` / `TZ` | compose (`${TZ:-UTC}`) | Reports and scheduled jobs use this timezone |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `postgres/` — Metabase's application DB (dashboards, questions, users, permissions, **and encrypted data-source credentials**)
- `plugins/` — drop in `.jar` plugin files here for community database drivers; mounted into the container at `/plugins`

## Notes & caveats

- **Don't lose `MB_ENCRYPTION_SECRET_KEY`.** It's auto-generated on install and stored in Runtipi's app config. If you lose or change it after admins have entered data-source passwords, those credentials become unreadable and you'll have to re-enter them.
- **First start is slow.** Metabase runs schema migrations on the first boot — expect 30–90 seconds before the UI responds. The healthcheck reflects this with a generous `start_period`.
- **Open Source vs. Pro/Enterprise.** This app uses the Open Source image (`metabase/metabase`). If you have a [Metabase Enterprise license](https://www.metabase.com/pricing/), swap the image for `metabase/metabase-enterprise` and add `MB_PREMIUM_EMBEDDING_TOKEN` post-install.

## References

- [Metabase docs — Running on Docker](https://www.metabase.com/docs/latest/installation-and-operation/running-metabase-on-docker)
- [Environment variables reference](https://www.metabase.com/docs/latest/configuring-metabase/environment-variables)
