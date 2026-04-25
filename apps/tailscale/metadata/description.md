# Tailscale

Tailscale is a zero-config mesh VPN built on WireGuard. It puts every device you authorise on a private encrypted overlay network — no port-forwarding, no manual key management, no static configuration. Each node has a stable IP and DNS name in your "Tailnet" and can talk to every other node directly, regardless of where they're running.

This app installs Tailscale as a long-running daemon on your BizerOS host. It has no web UI of its own — manage your Tailnet from the [Tailscale admin console](https://login.tailscale.com).

## Common patterns

- **Reach BizerOS from anywhere.** Once this node joins your Tailnet, you can SSH to the host or hit any installed app's port from your laptop / phone over Tailscale, even from a coffee shop or another country. No VPS, no port-forwarding, no public DNS.
- **Subnet router.** Advertise your home / office LAN (e.g. `192.168.1.0/24`) so other Tailnet devices can reach LAN-only IPs (printers, NAS, IoT gear) through this BizerOS box. Requires kernel-mode networking — turn off **Userspace Networking** in the form below and approve the route in the admin console.
- **Tailscale Serve / Funnel.** Publish individual Bizeros apps to your Tailnet (Serve, private) or to the public internet (Funnel, no port-forwarding). Drop a JSON config into the **Serve Config Path** to configure rules.
- **Exit node.** Route a remote device's entire internet traffic through this BizerOS box. Same kernel-mode requirement as subnet routing.

## First run

1. Visit [login.tailscale.com → Settings → Keys](https://login.tailscale.com/admin/settings/keys) and generate an **auth key**. For a one-time setup pick a non-reusable, 90-day key. For a node you may need to re-authenticate (e.g. after wiping the volume) check **Reusable** before generating.
2. Paste the key into the **Tailscale Auth Key** form field and install.
3. Within ~30 seconds the node should appear in the admin console with the **Tailnet Hostname** you chose.
4. From any other Tailnet device: `ping bizeros` (MagicDNS) or `ping <100.x.y.z>` (Tailnet IP from the admin console).

## All form fields

| Field | Env | Default | Notes |
| --- | --- | --- | --- |
| **Tailscale Auth Key** | `TS_AUTHKEY` | _(required)_ | Auth key from the admin console. Append `?ephemeral=true` to make the node disappear from the Tailnet when this container stops. |
| **Tailnet Hostname** | `TS_HOSTNAME` | `bizeros` | Display name in the admin console + MagicDNS. |
| **Auth Once** | `TS_AUTH_ONCE` | `true` | If on, only authenticate when there's no existing session. Off forces a fresh `tailscale up --auth-key` on every container start, which **burns single-use keys**. |
| **Userspace Networking** | `TS_USERSPACE` | `true` | Pure-userspace stack (works anywhere). Turn off for kernel-mode (required for subnet routing + exit node). |
| **Accept DNS** | `TS_ACCEPT_DNS` | `false` | Use DNS pushed from the admin console (MagicDNS, custom resolvers). Off keeps the container on Docker DNS. |
| **Advertised Subnet Routes** | `TS_ROUTES` | `""` | Comma-separated CIDRs (e.g. `192.168.1.0/24,10.0.0.0/24`). Requires Userspace Networking off + admin-console approval. |
| **Serve Config Path** | `TS_SERVE_CONFIG` | `""` | Path inside the container to a JSON Serve / Funnel rules file. |
| **Extra CLI Args** | `TS_EXTRA_ARGS` | `""` | Verbatim flags appended to `tailscale up`. E.g. `--accept-routes --advertise-tags=tag:bizeros --advertise-exit-node`. |

## Data persistence

All state lives under `${APP_DATA_DIR}/data/`:

- `state/` — Tailscale's machine identity, prefs, and tailnet credentials. **Keep this**: deleting it forces the node to re-auth and changes its identity.
- `config/` — Drop-in directory for the Serve / Funnel JSON config (referenced by **Serve Config Path**).

## Notes & caveats

- **No web UI / no exposable port.** This app is `no_gui: true` and `exposable: false` in Bizeros. The Tailnet itself is the UI; manage it at [login.tailscale.com](https://login.tailscale.com).
- **Auth key is a secret.** It's stored as a Bizeros form value; treat the Bizeros admin login like any credential store.
- **Kernel-mode requirements.** Turning off Userspace Networking requires the host kernel to support TUN (`/dev/net/tun`) — true on every modern Linux distro. The container already has `cap_add: net_admin, sys_module` and the device mount.
- **Tailnet Lock not configured.** This app doesn't set up [Tailnet Lock](https://tailscale.com/kb/1226/tailnet-lock) signing keys. If your Tailnet has lock enabled, this node will appear in a "pending signature" state until an existing signer approves it.

## References

- [Tailscale docs — Run on Docker](https://tailscale.com/kb/1282/docker)
- [Containerboot environment variables](https://github.com/tailscale/tailscale/blob/main/cmd/containerboot/main.go) (the source of truth for `TS_*` vars)
- [Serve / Funnel JSON spec](https://tailscale.com/kb/1242/tailscale-serve)
