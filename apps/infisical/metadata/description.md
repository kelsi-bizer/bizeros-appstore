# Infisical

Infisical is an open-source secrets management platform — a self-hostable alternative to HashiCorp Vault, Doppler, AWS Secrets Manager, and 1Password Secrets Automation. Store API keys, database credentials, and config secrets centrally; sync them into the apps, CI pipelines, and infrastructure that need them; and audit who touched what.

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `infisical` | `infisical/infisical:v0.159.22` | Backend + frontend (Next.js + Express, internal port 8080) |
| `infisical-db` | `postgres:14-alpine` | Application database — projects, users, encrypted secrets |
| `infisical-redis` | `redis:7-alpine` | Cache + queue (rate-limit, async jobs) |

## What you get out of the box

- **Centralized secret storage** with project / environment / folder hierarchy
- **30+ sync integrations** — GitHub Actions, GitLab CI, Vercel, Netlify, AWS Secrets Manager, AWS Parameter Store, Azure Key Vault, GCP Secret Manager, Kubernetes, Docker, Heroku, and more
- **CLI** — `infisical run -- node app.js` injects secrets as env vars without writing them to disk
- **SDKs** — Node.js, Python, Go, Java, .NET, Ruby, Rust
- **Kubernetes operator** — `InfisicalSecret` CRD that materialises Infisical secrets into K8s `Secret` objects
- **Secret versioning** with point-in-time rollback
- **Role-based access control** — projects, environments, folder-level permissions
- **Audit logs** — every read/write/sync recorded with actor + IP + timestamp
- **Dynamic secrets** — short-lived credentials for AWS / databases (issue → use → expire)
- **Secret rotation** with provider-side credential rotation
- **PIT (point-in-time) recovery** of deleted secrets from the version history
- **SSO** — Google, GitHub, GitLab OAuth, plus SAML / OIDC for paid tiers

## First run

1. Install from the Bizeros app store. Three secrets are auto-generated (`ENCRYPTION_KEY`, `AUTH_SECRET`, `INFISICAL_DB_PASSWORD`) — no need to fill them.
2. (Optional but recommended) Configure SMTP — without it, Infisical can't send team invites, password resets, or notifications. First-boot signup still works.
3. Wait ~30–60 seconds on first boot — Postgres initialises, Infisical runs schema migrations.
4. Open the app URL → click **Sign up**. The first signup is the instance admin.
5. Create a project, add an environment (e.g. `production`), import secrets from a `.env` file.

## Connecting from your apps

The most common Infisical workflow:

```bash
# install the CLI on your dev machine or in CI
curl -fsSL https://raw.githubusercontent.com/Infisical/infisical/main/cli/scripts/install.sh | sh

# log in (opens a browser; redirects back to your Bizeros URL)
infisical login --domain https://${APP_DOMAIN}

# init a project (run once per repo)
infisical init

# wrap your app — secrets become env vars at process start
infisical run --env=production -- node server.js
```

Or via the SDK in Node.js:

```js
import { InfisicalClient } from "@infisical/sdk";
const client = new InfisicalClient({
  siteUrl: "https://YOUR_BIZEROS_HOST",
  clientId: process.env.INFISICAL_CLIENT_ID,
  clientSecret: process.env.INFISICAL_CLIENT_SECRET,
});
const secrets = await client.listSecrets({
  projectId: "...",
  environment: "production",
});
```

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `ENCRYPTION_KEY` | auto-generated random hex | AES key encrypting every secret stored in the DB. **Never rotate**. |
| `AUTH_SECRET` | auto-generated random base64 | JWT signing key for user sessions |
| `INFISICAL_DB_PASSWORD` | auto-generated random hex | Bundled Postgres password |
| `SITE_URL` | compose (`https://${APP_DOMAIN}`) | Public URL Infisical generates email links + OAuth callbacks against |
| `DB_CONNECTION_URI` | compose | Connection string to bundled Postgres |
| `REDIS_URL` | compose | Connection string to bundled Redis |
| `SMTP_*` | form fields (optional) | Outbound email config |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `postgres/` — application database **including encrypted secrets**
- `redis/` — cache state (regenerable; can be wiped)

**Back up `postgres/` and the `ENCRYPTION_KEY` together.** The DB has every encrypted secret; the `ENCRYPTION_KEY` is what decrypts them. Either alone is useless — losing the key means losing every secret in the system.

## Notes & caveats

- **Don't lose `INFISICAL_ENCRYPTION_KEY`.** It encrypts every stored secret with AES. Rotating it (or restoring DB backups taken with a different key) makes every stored secret unreadable. The form field is auto-generated once on first install and persisted in the Bizeros app config — do not change it after the first user has stored anything.
- **Slow first boot.** Schema migrations take 30–90 seconds. The DB is health-gated so the main service waits for it.
- **Self-hosted ≠ all features.** Some features (SAML SSO, secret approvals, dynamic secrets for some providers) are part of Infisical's Enterprise tier and require a license key from infisical.com. The core platform — projects, secrets, sync, CLI, SDK, GitHub/GitLab CI integrations — is fully open-source and works out of the box.
- **Slow image pull.** The image is ~1GB.

## References

- [Infisical docs](https://infisical.com/docs)
- [Self-host guide](https://infisical.com/docs/self-hosting/overview)
- [Source on GitHub](https://github.com/infisical/infisical)
