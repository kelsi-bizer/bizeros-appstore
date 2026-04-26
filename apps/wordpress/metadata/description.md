# WordPress

WordPress is the world's most popular content management system, powering ~43% of all websites. Use it for blogs, marketing sites, business sites, news publications, ecommerce stores (with WooCommerce), portfolios, member sites, and almost anything else that's web-shaped. This package gives you a self-hosted install you fully control — your content, plugins, themes, and customer data never touch a third-party platform.

## Bundled services

| Service | Image | Role |
| --- | --- | --- |
| `wordpress` | `wordpress:6.9.4-php8.4-apache` | Apache + PHP 8.4 + WordPress 6.9 (main service, internal port 80) |
| `wordpress-db` | `mariadb:11` | Application database with `utf8mb4` defaults |

## First run

1. Install from the Bizeros app store. Both database passwords are auto-generated; nothing to fill in.
2. Open the app URL — WordPress's **5-minute install** wizard greets you. Pick a site title, admin username, password, and email.
3. Sign in at `/wp-admin/`. Install themes, plugins, configure permalinks, etc.

## Why WordPress

- **Mature plugin ecosystem.** 60K+ plugins on the official directory — SEO (Yoast, Rank Math), forms (Gravity, WPForms, Fluent), caching (WP Rocket, W3 Total Cache), backups (UpdraftPlus, BackupBuddy), security (Wordfence), analytics, ecommerce, members, LMS, etc.
- **Themes for any niche.** 11K+ free themes, plus paid marketplaces (ThemeForest) and page-builders (Elementor, Beaver Builder, Bricks, Divi).
- **Block editor (Gutenberg).** Modern WYSIWYG built on React. Supports full-site editing for block-based themes.
- **WooCommerce.** Drop-in ecommerce — products, cart, checkout, payment gateways, shipping, taxes.
- **REST + GraphQL APIs.** Build headless front-ends in Next.js / Astro / SvelteKit while keeping WordPress as the back-office.
- **Multi-language** via Polylang, WPML, or TranslatePress.

## Configuration

| Variable | Source | Purpose |
| --- | --- | --- |
| `WORDPRESS_DB_*` | compose | Connection to the bundled MariaDB |
| `WORDPRESS_DB_PASSWORD` | auto-generated random | App-DB password |
| `WORDPRESS_DB_ROOT_PASSWORD` | auto-generated random | DB root, for direct admin via `docker exec` |
| `WORDPRESS_CONFIG_EXTRA` | compose | Pins `WP_HOME` / `WP_SITEURL` to `https://${APP_DOMAIN}` so generated URLs (asset paths, redirects) all use HTTPS — avoids mixed-content errors behind Bizeros's traefik TLS termination |
| `TZ` | compose (`${TZ:-UTC}`) | Timezone for scheduled posts, comments, and stats |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `wordpress/` — the entire `/var/www/html` mount: WordPress core files, `wp-config.php`, **`wp-content/`** (themes, plugins, uploads, language packs)
- `mariadb/` — MariaDB data directory

**Back up `wordpress/` and `mariadb/` together.** Either alone is incomplete: the DB has all your posts/users/settings, the wp-content directory has your media uploads and customised plugin/theme code.

## Tips

- **Permalink rewrites.** Apache mod_rewrite is enabled in this image, so pretty permalinks (`/sample-post/` instead of `/?p=123`) work without extra config. Pick a permalink scheme in **Settings → Permalinks**.
- **Plugin/theme updates.** WordPress writes new plugin and core files into the `wordpress/` volume on update. They persist across container restarts as long as the volume is intact.
- **Auto-updates.** Disabled by default for major versions; flip to enabled in **Dashboard → Updates**, or set `WP_AUTO_UPDATE_CORE` constants via `WORDPRESS_CONFIG_EXTRA`.
- **HTTPS / reverse proxy.** Already handled — Bizeros's traefik terminates TLS and forwards `X-Forwarded-Proto: https`, which the bundled `WORDPRESS_CONFIG_EXTRA` snippet honours.
- **Email.** Default uses PHP's `mail()` which usually fails on container hosts. Install a plugin like *FluentSMTP* or *WP Mail SMTP* and point it at your SMTP relay.

## References

- [WordPress.org docs](https://wordpress.org/documentation/)
- [Official Docker image docs](https://hub.docker.com/_/wordpress)
- [Source on GitHub](https://github.com/WordPress/WordPress)
