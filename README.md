# bizeros-appstore

Custom Runtipi app store providing first-party Bizeros applications. Built from the [Runtipi example-appstore template](https://github.com/runtipi/example-appstore).

## Apps

- **Mattermost** — self-hosted team chat, backed by a bundled Postgres 15 database.

## Repository structure

- **apps/** — one directory per app, each containing:
  - `config.json` — app manifest (name, port, form fields, etc.)
  - `docker-compose.yml` — Runtipi dynamic compose (`schema_version: 2`)
  - `metadata/description.md` — long-form description shown in the Runtipi UI
  - `metadata/logo.jpg` — app logo
- **__tests__/** — Bun tests that validate each app's config and compose files.
- **scripts/update-config.ts** — helper used by Renovate to bump the `version` and `tipi_version` fields when a new image tag lands.

## Using this app store with Runtipi

In your Runtipi admin settings, add this repo as a custom app store:

```
https://github.com/kelsi-bizer/bizeros-appstore
```

Runtipi will index the `apps/` directory and expose each app for installation.

## Local validation

```
bun install
bun run test
```

## References

- [Runtipi: Create your own app store](https://runtipi.io/docs/guides/create-your-own-app-store)
- [Runtipi: Dynamic compose guide](https://runtipi.io/docs/guides/dynamic-compose-guide)
- [Runtipi: config.json reference](https://runtipi.io/docs/reference/config-json)
