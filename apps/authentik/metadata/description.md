# Authentik

Authentik is an open-source Identity Provider focused on flexibility and versatility. It's a self-hostable SSO front door — sitting in front of your other apps and handling authentication, MFA, RBAC, social login, LDAP/AD federation, and more.

This package bundles:

- **authentik** — the main HTTP server (port 9000 inside the container).
- **authentik-worker** — background tasks: certificate management, outpost deployment, scheduled flows.
- **authentik-db** — Postgres 18 with a dedicated `authentik` database.

## Features

- OAuth2 / OpenID Connect provider for modern apps
- SAML provider for legacy enterprise apps
- LDAP / Active Directory federation (inbound + outbound)
- RADIUS, SCIM provisioning
- Flow-based authentication engine with MFA (TOTP, WebAuthn, SMS)
- Social login (Google, GitHub, Microsoft, Apple, etc.)
- Self-service password reset and user enrollment

## First run

1. Install from the Runtipi app store. The two random secrets (`AUTHENTIK_DB_PASSWORD`, `AUTHENTIK_SECRET_KEY`) are auto-generated — leave them as-is.
2. After the container is healthy, open the app URL.
3. Authentik takes you to the **initial setup flow** at `/if/flow/initial-setup/` where you set the password for the built-in `akadmin` user.
4. Sign in as `akadmin` to start configuring providers, applications, and users.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `AUTHENTIK_DB_PASSWORD` | auto-generated (random, hex, ≥40) | Postgres password shared by server / worker / db |
| `AUTHENTIK_SECRET_KEY` | auto-generated (random, base64, ≥50) | Django signing key for cookies and tokens |
| `AUTHENTIK_POSTGRESQL__HOST/USER/NAME/PASSWORD` | compose | Connection to the bundled `authentik-db` |
| `AUTHENTIK_ERROR_REPORTING__ENABLED` | compose (`false`) | Disabled by default; flip to `true` if you want to share crash reports with the upstream Sentry instance |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `postgres/` — Postgres data directory
- `media/` — uploaded brand assets, application icons, attachments
- `templates/` — custom email / flow templates
- `certs/` — TLS certs and keys managed by the worker (used by Outposts)

## Notes & caveats

- **Docker socket mount.** The worker has `/var/run/docker.sock` mounted so it can deploy [Outposts](https://goauthentik.io/docs/outposts/) (per-app reverse proxies) into the local Docker engine. This grants the worker root-on-host privileges. If you don't intend to use Outposts, you can remove that volume mount post-install.
- **No Redis.** Authentik 2026.x has no hard Redis dependency for single-instance deployments; the bundled Postgres handles caching and session storage.
- **HTTPS upstream.** Authentik can also serve HTTPS on port 9443 inside the container, but Runtipi terminates TLS at traefik so we expose only port 9000 (HTTP) on the internal network.

## References

- [Authentik docs](https://docs.goauthentik.io)
- [Configuration reference](https://docs.goauthentik.io/install-config/configuration/configuration)
