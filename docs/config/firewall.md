# 🛡️ Firewall & Rate Limiting

wacraft includes a two-layer auth firewall that protects every route against unauthorized IPs and brute-force attacks. Both layers are **zero-overhead passthroughs when not configured** — no performance penalty if you leave them at defaults.

## Overview

| Layer | Mechanism | Scope |
| ----- | --------- | ----- |
| **IP Filter** | Allowlist / Denylist by CIDR | All routes, evaluated before any handler |
| **Rate Limiting** | Per-route request caps keyed by IP (or IP + email) | Auth & login endpoints only |

## IP Filter

Control which IP addresses can reach the server at all. The two variables are independent and serve opposite purposes — use whichever fits your network model.

Evaluation order: **denylist is checked first**, then allowlist. Both are zero-overhead no-ops when left empty.

### `IP_ALLOWLIST` — whitelist (default: empty)

Comma-separated CIDRs. **When non-empty, every request whose source IP does not match at least one CIDR is rejected with `403`.** Only the listed ranges are allowed through.

```env
# Only your office network and VPN can reach the server
IP_ALLOWLIST=203.0.113.0/24,10.8.0.0/16
```

> **Warning:** Setting `IP_ALLOWLIST` blocks _all_ traffic from unlisted IPs — including the wacraft UI, n8n, and Meta webhooks. Make sure every source that needs access is covered before enabling this in production.

### `IP_DENYLIST` — blocklist (default: empty)

Comma-separated CIDRs. Any request whose source IP matches at least one CIDR is rejected with `403`. All other IPs are allowed.

```env
# Block a known bad range and a specific address
IP_DENYLIST=198.51.100.0/24,203.0.113.5/32
```

### CIDR notation

Both variables accept standard CIDR notation. A single IP is expressed as `/32`:

```
10.0.0.0/8          # entire 10.x.x.x range
192.168.1.5/32      # single address
```

Multiple entries are comma-separated with no spaces: `10.0.0.0/8,172.16.0.0/12`.

### Responses

| Scenario | Status | Body |
| -------- | ------ | ---- |
| IP not in allowlist | `403` | `{"error": "Access denied: unauthorized IP"}` |
| IP in denylist | `403` | `{"error": "Access denied"}` |

## Rate Limiting

Protects auth endpoints against credential stuffing and brute-force attacks. Each limiter is independent and stores state **in-memory** (no Redis required for single-instance deployments).

### Environment variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `RATE_LIMIT_ENABLED` | `true` | Set to `false` to disable **all** rate limiting. |
| `RATE_LIMIT_REGISTRATION` | `5` | Max registration attempts per window, keyed by **IP**. |
| `RATE_LIMIT_REGISTRATION_WINDOW` | `1h` | Window duration for registration. |
| `RATE_LIMIT_LOGIN` | `10` | Max login attempts per window, keyed by **IP + email**. |
| `RATE_LIMIT_LOGIN_WINDOW` | `15m` | Window duration for login. |
| `RATE_LIMIT_PASSWORD_RESET` | `5` | Max forgot-password requests per window, keyed by **IP**. |
| `RATE_LIMIT_PASSWORD_RESET_WINDOW` | `1h` | Window duration for forgot-password. |
| `RATE_LIMIT_EMAIL_VERIFICATION` | `5` | Max resend-verification requests per window, keyed by **IP**. |
| `RATE_LIMIT_EMAIL_VERIFICATION_WINDOW` | `1h` | Window duration for email verification. |
| `RATE_LIMIT_RESET_PASSWORD` | `10` | Max password-reset submissions per window, keyed by **IP**. |
| `RATE_LIMIT_RESET_PASSWORD_WINDOW` | `1h` | Window duration for password reset. |

Window values use **Go duration format**: `30s`, `15m`, `1h`, `24h`, etc.

### Protected routes

| Route | Limiter key | Default limit |
| ----- | ----------- | ------------- |
| `POST /auth/register` | IP | 5 / 1 h |
| `POST /user/oauth/token` (login) | IP + email | 10 / 15 min |
| `POST /auth/forgot-password` | IP | 5 / 1 h |
| `POST /auth/reset-password` | IP | 10 / 1 h |
| `POST /auth/resend-verification` | IP | 5 / 1 h |

> The login limiter uses a composite key (IP + email) to block credential stuffing even when an attacker rotates emails while keeping the same IP — and vice versa.

### Rate-limit response

When a limit is exceeded the server responds with `429 Too Many Requests`:

```json
{
    "error": "Too many login attempts",
    "message": "Please try again later"
}
```

Response headers:

| Header | Description |
| ------ | ----------- |
| `Retry-After` | Seconds until the window resets. |
| `X-RateLimit-Limit` | Maximum requests allowed in the window. |
| `X-RateLimit-Remaining` | Requests remaining in the current window. |
| `X-RateLimit-Reset` | Unix timestamp when the window resets. |

`Retry-After` is exposed in CORS `ExposeHeaders` so browser clients can read it directly.

## Example configuration

```env
# ── IP filter ──────────────────────────────
IP_DENYLIST=198.51.100.0/24,203.0.113.5/32

# ── Rate limiting ──────────────────────────
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN=5
RATE_LIMIT_LOGIN_WINDOW=10m
RATE_LIMIT_REGISTRATION=3
RATE_LIMIT_REGISTRATION_WINDOW=1h
```

## Multi-instance deployments

Rate-limiter state is held **in-memory** per process. If you run multiple wacraft-server replicas behind a load balancer, each instance tracks its own counters independently. To share limits across replicas plug a Redis backend into the limiter — no code changes are required, only a storage adapter swap. Contact [wacraft@astervia.tech](mailto:wacraft@astervia.tech) for guidance.

## Next steps

- [Env Vars Reference](./env-vars.md) — full variable table
- [Stripe / Billing Setup](./stripe-setup.md) — billing-specific rate limiting (`429` on throughput exhaustion)
