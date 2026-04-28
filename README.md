# bizeros-appstore

Custom Runtipi app store providing first-party Bizeros applications. Built from the [Runtipi example-appstore template](https://github.com/runtipi/example-appstore).

## Apps

The store currently ships **16 apps** organized by purpose. ⭐ marks BizerOS-native or BizerOS-branded apps.

### Communication

| App | Port | Notes |
| --- | --- | --- |
| **Mattermost** | 8070 | Team chat (channels, threads, DMs) — upstream `mattermost/mattermost-team-edition`. |
| ⭐ **BizerOS Chat** | 8071 | Mattermost fork rebranded for BizerOS. |

### CRM, PM & Scheduling

| App | Port | Notes |
| --- | --- | --- |
| **Twenty** | 8080 | Open-source CRM (Salesforce alternative). |
| **Plane** | 8090 | Project management (JIRA / Linear alternative) — full Community stack. |
| **Cal.com** | 8294 | Scheduling / booking pages (Calendly alternative). |
| **Invoice Ninja** | 8881 | Invoicing, expense tracking, time billing. |

### Content & Files

| App | Port | Notes |
| --- | --- | --- |
| **WordPress** | 8213 | The CMS that runs ~43% of the web. |
| **Nextcloud** | 8083 | Self-hosted file sync and share. |

### Data, Secrets & Identity

| App | Port | Notes |
| --- | --- | --- |
| **Metabase** | 3000 | Business intelligence — dashboards on top of any DB. |
| **Infisical** | 8222 | Secrets manager (Vault / Doppler alternative). |
| **Authentik** | 9000 | Identity provider — SSO, MFA, OIDC, SAML, LDAP. |

### Automation & AI

| App | Port | Notes |
| --- | --- | --- |
| **n8n** | 5678 | Visual workflow automation (Zapier alternative). |
| **Paperclip** | 3100 | Orchestration platform for teams of AI agents. |
| ⭐ **Miles** | 8642 | BizerOS's AI agent — Hermes fork powered by Arcee Trinity. |

### Infrastructure

| App | Port | Notes |
| --- | --- | --- |
| ⭐ **BizerOS Dash** | 7575 | Drag-and-drop home-screen dashboard (Homarr fork). |
| **Tailscale** | — | Mesh VPN (no web UI; managed at login.tailscale.com). |

## Repository structure

- **apps/** — one directory per app, each containing:
  - `config.json` — app manifest (name, port, form fields, etc.)
  - `docker-compose.yml` — Runtipi dynamic compose (`schema_version: 2`)
  - `metadata/description.md` — long-form description shown in the Runtipi UI
  - `metadata/logo.jpg` — app logo
  - `data/` — *(some apps only)* support files (nginx vhost configs, init scripts) that Runtipi pre-stages into `${APP_DATA_DIR}/data/` on first install
- **__tests__/** — Bun tests that validate each app's config and compose files.
- **scripts/update-config.ts** — helper used by Renovate to bump the `version` and `tipi_version` fields when a new image tag lands.

## Using this app store with Runtipi

In your Runtipi (or BizerOS) admin settings, add this repo as a custom app store:

```
https://github.com/kelsi-bizer/bizeros-appstore
```

Runtipi will index the `apps/` directory and expose each app for installation from the default branch (`main`).

## Local validation

```
bun install
bun run test
```

Each app contributes 6 tests (file existence + `config.json` schema + `docker-compose.yml` schema). With 16 apps the suite runs **96 tests**.

## References

- [Runtipi: Create your own app store](https://runtipi.io/docs/guides/create-your-own-app-store)
- [Runtipi: Dynamic compose guide](https://runtipi.io/docs/guides/dynamic-compose-guide)
- [Runtipi: config.json reference](https://runtipi.io/docs/reference/config-json)
