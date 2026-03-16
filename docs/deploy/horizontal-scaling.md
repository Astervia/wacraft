# Horizontal Scaling

Scale **wacraft-server** across multiple instances behind a load balancer using Redis for distributed state synchronization.

> **Default behaviour:** A single instance uses in-memory primitives (mutexes, channels, maps). No extra infrastructure is required. Switch to `SYNC_BACKEND=redis` only when you need more than one replica.

---

## Why In-Memory Is Not Enough at Scale

The server tracks a lot of transient state that enables real-time features:

| Feature | What breaks with multiple replicas |
| --- | --- |
| Message ↔ Status sync | Instance A sends the message; Instance B receives the WhatsApp status webhook. The rendezvous channel doesn't exist on B. |
| WebSocket broadcasts | A webhook processed on Instance B never reaches clients connected to Instance A. |
| Campaign execution | Cancel requests, progress counters, and the `Sending` guard only live on the instance that started the campaign. |
| Billing counters | Each instance counts independently — effective rate limit becomes `N × limit`. |
| Webhook delivery worker | All instances poll simultaneously and may deliver the same webhook twice. |

Redis solves this by replacing in-memory primitives with distributed equivalents (pub/sub, distributed locks, atomic counters, shared cache).

---

## Architecture

```
              ┌──────────────────┐   ┌──────────────────┐
  Webhooks ──►│   Instance A     │   │   Instance B     │◄── API Calls
  (Nginx LB)  │  wacraft-server  │   │  wacraft-server  │
              └────────┬─────────┘   └────────┬─────────┘
                       │                      │
                       ▼                      ▼
              ┌─────────────────────────────────────────┐
              │          Redis (shared state)            │
              │  pub/sub · locks · counters · cache      │
              └─────────────────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

---

## Quick Start (Docker Compose)

The `docker-compose.yml` in the wacraft repo ships with a `distributed` profile that adds Redis and sets `SYNC_BACKEND=redis` automatically.

```bash
# Default — single instance, no Redis
docker compose up -d

# Distributed — Redis + configurable replicas
APP_REPLICAS=3 docker compose --profile distributed up -d
```

The `APP_REPLICAS` variable defaults to `1`. Set it to however many server instances you want behind the Nginx load balancer.

> **Note:** The client service (`wacraft-client`) is stateless and does not need replication — it proxies API calls through the load balancer to the server pool.

---

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `SYNC_BACKEND` | `memory` | `memory` (single-instance) or `redis` (distributed). |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL. Only used when `SYNC_BACKEND=redis`. |
| `REDIS_PASSWORD` | _(empty)_ | Redis password. Leave empty if Redis has no auth. |
| `REDIS_DB` | `0` | Redis logical database number. |
| `REDIS_KEY_PREFIX` | `wacraft:` | Prefix for all Redis keys. Useful when sharing a Redis instance between environments. |
| `REDIS_LOCK_TTL` | `30s` | TTL for distributed locks (Go duration string, e.g. `30s`, `1m`). |
| `REDIS_CACHE_TTL` | `5m` | TTL for distributed cache entries. |

See [Environment Variables Reference](../config/env-vars.md) for the full list.

---

## Running Multiple Replicas

### Docker Compose (recommended)

The distributed profile activates a Redis service and applies the right environment variables to every server replica:

```bash
# Start 3 server replicas + Redis
APP_REPLICAS=3 docker compose --profile distributed up -d
```

The built-in Nginx service load-balances across all replicas automatically.

### Manual / Custom Deployment

1. Deploy Redis (single node is fine for most workloads).
2. Set on every server instance:

    ```env
    SYNC_BACKEND=redis
    REDIS_URL=redis://<host>:6379
    ```

3. Put a load balancer (Nginx, HAProxy, AWS ALB) in front of all instances.
4. Make sure **sticky sessions are NOT required** — the server is fully stateless at the HTTP level when `SYNC_BACKEND=redis`.

---

## Operational Notes

### Redis Availability

- If Redis becomes temporarily unavailable, the server logs errors but does **not** crash.
- In-flight synchronization (message/status rendezvous, campaign progress) may degrade until Redis recovers. Database integrity is always preserved.

### Switching Modes

Switching between `memory` and `redis` only requires a restart with the new `SYNC_BACKEND` value. No database migration is needed.

### Redis Sizing

A single Redis node (256 MB RAM) is sufficient for hundreds of concurrent users. Most keys are short-lived (locks expire in `REDIS_LOCK_TTL`, cache entries in `REDIS_CACHE_TTL`). Persistent storage is not required; `appendonly no` is fine.

### WebSocket and Load Balancers

WebSocket connections use long-lived TCP connections. Configure your load balancer to:

- Enable **proxy_read_timeout** / idle timeout ≥ `WEBSOCKET_BASE_PING_INTERVAL` + buffer (default: 30 s → set timeout to ≥ 60 s).
- Pass the `Upgrade` and `Connection` headers through to the backend.

---

## Hardening Checklist

- [ ] Set `REDIS_PASSWORD` and restrict Redis port to the internal network only.
- [ ] Use `REDIS_KEY_PREFIX` to isolate environments (e.g. `wacraft-prod:`, `wacraft-staging:`).
- [ ] Configure Redis persistence (`appendonly yes`) if you want lock/counter durability across Redis restarts.
- [ ] Monitor Redis memory usage — set `maxmemory` with `allkeys-lru` eviction policy as a safety net.
- [ ] Point your load balancer health check at `/healthz` on each server instance.
- [ ] Set `DATABASE_MAX_OPEN_CONNS` appropriately — with N replicas the DB sees up to `N × DATABASE_MAX_OPEN_CONNS` connections.
