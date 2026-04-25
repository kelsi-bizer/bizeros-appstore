# Invoice Ninja

Invoice Ninja is an open-source invoicing platform for freelancers, agencies, and small businesses — a self-hostable alternative to FreshBooks, Wave, QuickBooks, and Zoho Invoice. Send branded invoices and quotes, track expenses, log billable time, accept online payments through 50+ gateways, and run client portals from a single Bizeros-hosted instance you fully control.

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `invoice-ninja-web` | `nginx:1.27-alpine` | Main reverse proxy (internal port 80) |
| `invoice-ninja` | `invoiceninja/invoiceninja:5.13.19` | PHP-FPM application |
| `invoice-ninja-db` | `mariadb:11` | Application database |
| `invoice-ninja-init` | `bash:5` | One-shot — fixes ownership of the data dirs to UID 1500 (the `invoiceninja` user inside the FPM image) on first boot |

## What you get out of the box

- **Invoices, quotes, credits, recurring invoices** with custom branding and PDF generation
- **Client portal** — clients log in to view, pay, and download their invoices
- **50+ payment gateways** — Stripe, PayPal, Square, Authorize.net, Braintree, GoCardless, Mollie, and many more
- **Expense tracking** with receipt OCR and bank feed integration via GoCardless/Nordigen
- **Time-tracking** with billable rates per project / per task
- **Tasks & projects** linked to clients and to invoices
- **Multi-currency** with auto-rate updates
- **Email-to-PDF** invoice delivery, plus webhook integrations
- **Multi-language** UI (40+ languages)
- **Mobile apps** — point the official iOS / Android client at this Runtipi URL

## First run

1. Install from the Bizeros app store. Fill in:
   - **Admin Email** + **Admin Password** — the initial Invoice Ninja admin account
   - The other two fields (**MariaDB Root Password**, **App Encryption Key**) are auto-generated; leave them.
2. Wait ~60 seconds on first boot — MariaDB initialises, the init container fixes ownership, then Invoice Ninja runs schema migrations.
3. Open the app URL → log in with the admin email + password from step 1.
4. Optional: delete the `IN_USER_EMAIL` and `IN_PASSWORD` env vars after first login (they're only used by the bootstrap routine and Invoice Ninja ignores them once the admin account exists). You can do this from the app's Bizeros settings page.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `APP_KEY` | `base64:` + auto-generated form value | Laravel session/cookie/encrypted-field signing key. **Don't rotate** — encrypted DB fields become unreadable. |
| `APP_URL` | compose (`https://${APP_DOMAIN}`) | Public URL Invoice Ninja generates links / PDF references against |
| `IN_USER_EMAIL` / `IN_PASSWORD` | form fields | First-run admin bootstrap (one-shot) |
| `INVOICE_NINJA_DB_PASSWORD` | auto-generated random | MariaDB root password. The app uses a separate `ninja` user. |
| `TRUSTED_PROXIES` | compose (`*`) | Trust X-Forwarded-* headers from any proxy — required because Runtipi terminates TLS at traefik |
| `QUEUE_CONNECTION` | compose (`database`) | Background jobs run via DB queue (no Redis required for v1) |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `mysql/` — MariaDB data directory (clients, invoices, payments, settings)
- `storage/` — Invoice Ninja's writable storage: PDFs, generated reports, uploaded logos and attachments
- `public/` — Invoice Ninja's public assets directory (mounted shared between FPM + nginx)
- `nginx/invoice-ninja.conf` — pre-staged nginx vhost config; edit if you need custom routing
- `php/php.ini` and `php/php-cli.ini` — pre-staged PHP runtime configs (raise upload limits, OPcache, etc.)
- `init/init.sh` — one-shot permission-fix script run by the `invoice-ninja-init` container

## Notes & caveats

- **Slow first boot.** Database init + Invoice Ninja schema migrations take 60–120 seconds. The healthcheck on the DB and the `service_completed_successfully` gate on the init container should keep you from hitting it before it's ready.
- **Don't lose `INVOICE_NINJA_APP_KEY_RAW`.** Stored fields (encryption keys for payment gateway credentials, etc.) become unreadable if you rotate it post-install.
- **PDF generation.** Default uses `snappdf` (a Chromium-headless wrapper bundled in the image). For better fidelity, switch to `phantomjs` via `PHANTOMJS_PDF_GENERATION=true` env var (requires extra config — see the upstream docs).
- **Mail delivery.** Defaults to `MAIL_MAILER=log` (writes mail to log instead of sending). Configure SMTP via the in-app settings or override `MAIL_*` env vars in the Bizeros compose.

## References

- [Invoice Ninja docs](https://invoiceninja.github.io)
- [Self-host install guide](https://invoiceninja.github.io/en/self-host-installation/)
- [Source on GitHub](https://github.com/invoiceninja/invoiceninja)
