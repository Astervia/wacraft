# 🗒️ Changelog

All notable changes to **wacraft** will be documented in this file following
[Keep a Changelog](https://keepachangelog.com/) conventions and SemVer.

## \[v0.1.0] – 2025‑05‑11

### Added

- **First public release** of the complete stack.
- **wacraft‑server** – Go backend for WhatsApp Cloud API

  - Multi‑tenant architecture with PostgreSQL persistence.
  - Webhook relay & real‑time WebSocket feed for UI.
  - JWT‑based auth, super‑user account, RBAC scaffolding.

- **wacraft‑server‑lite** – same as wacraft-server but without supporter features.
- **wacraft‑client** – Angular 19 SPA

  - Chat inbox, contacts, templates, automations panel.
  - Dark/Light theme via Tailwind + Angular Material.
  - Internationalisation placeholders (`i18n`).
  - User management.
  - Webhook management.

- **wacraft‑nodered** – pre‑baked Node‑RED with custom nodes

  - `wait-text-message-match`, `respond-with-text`, `send-interactive-list`, etc.
  - OAuth handshake against wacraft‑server using `SU_PASSWORD`.

### Infrastructure

- Docker images published under **`astervia/`** namespace, tag `v0.1.0`.
- Static binaries for Linux x64/arm64, macOS, Windows.
- Helm chart skeleton and Docker Compose examples (`prod`, `lite`).

### Documentation

- Quick‑start guides: `production.md`, `binary-vercel.md`, `docker-compose.md`, `node-red.md`.
- Meta setup & webhook guides.
- Diagrams and screenshots in `/assets`.

### Breaking Changes

_N/A – initial release._

### Known Issues

- Using old version of Tailwind CSS in the client. Need to update to latest to speed up build.
- Since the Webhooks sent to the server by Meta pass through a synchronization mechanism, you cannot scale the server horizontally (multiple replicas). We might solve this issue with a service like [Redis](https://redis.io/) or [RabbitMQ](https://www.rabbitmq.com/).

---

**SHA256 digests for Docker images available in the release artefacts section.**
