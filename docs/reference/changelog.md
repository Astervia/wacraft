# 🗒️ Changelog

All notable changes to **wacraft** will be documented in this file following
[Keep a Changelog](https://keepachangelog.com/) conventions and SemVer.

---

## \[v0.1.3] – 2025‑07‑20 (Client‑only update)

> This update applies _only_ to the **wacraft‑client**—no backend or infrastructure changes were made.

### 🎉 Added

- **Bulk messaging**: Introduced bulk message actions UI by @Rfluid in [#11](https://github.com/Astervia/wacraft-client/pull/11).
- **Visual feedback**: Added status and error indicators across key interactions by @Rfluid in [#15](https://github.com/Astervia/wacraft-client/pull/15).
- **UI improvements**: Enhanced modal contrast and added paddings for better accessibility by @Rfluid in [#14](https://github.com/Astervia/wacraft-client/pull/14).

### 🛠️ Fixed

- **Selection logic**: Automatically clears selected messages after bulk actions by @Rfluid in [#13](https://github.com/Astervia/wacraft-client/pull/13).

### 🔧 Changed

- **Inputs**: Switched input binding strategy to use framework-native approach instead of direct DOM manipulation by @Rfluid in [#16](https://github.com/Astervia/wacraft-client/pull/16).
- **Branding**: Updated to new favicon by @Rfluid in [#12](https://github.com/Astervia/wacraft-client/pull/12).

### 📦 Dependencies

- **Bumped** various frontend dependencies via `npm_and_yarn` group by @dependabot\[bot] in [#10](https://github.com/Astervia/wacraft-client/pull/10).

**Full changelog**: [v0.1.2…v0.1.3](https://github.com/Astervia/wacraft-client/compare/v0.1.2...v0.1.3)
**Commit**: `c23d186`

---

## \[v0.1.2] – 2025‑07‑14 (Client‑only update)

> This update applies _only_ to the **wacraft‑client**—no backend or infrastructure changes were made.

### 🎉 Added

- **Feature**: Toggle password visibility on login/reset screens by @Rfluid in [#5](https://github.com/Astervia/wacraft-client/pull/5).

### 🛠️ Fixed

- **Error handling**: Fixed issue in async error handling by @Rfluid in [#4](https://github.com/Astervia/wacraft-client/pull/4).
- **WebSocket**: Resolved reconnection instability in the client’s WebSocket logic by @Rfluid in [#7](https://github.com/Astervia/wacraft-client/pull/7).

**Full changelog**: [v0.1.1…v0.1.2](https://github.com/Astervia/wacraft-client/compare/v0.1.1...v0.1.2)
**Commit**: `8c936ac`

---

## \[v0.1.1] – 2025‑07‑13

### Backend Changes (wacraft-server)

#### 🎉 Added

- **Validation**: Added request body and query parameter validation for key API endpoints to improve error handling and input safety.

#### 🛠️ Fixed

- **Templates**: Resolved bugs in the WhatsApp templates model.

#### Infrastructure

- `make build` is now invoked as part of the lite-release sync process to ensure OpenAPI docs and generated artifacts are always up to date in `wacraft-server-lite`.

### Frontend Changes (wacraft-client, released 2025‑06‑07)

#### Changed

- **UI**: Improved contrast for message content to enhance readability.
- **UI**: Updated date formatting pipes and integrated copy buttons with Angular Material.
- **UI**: Improved phone number input styling and selector feedback.
- **UI**: Adjusted interactive header margins and content max-width behavior.
- **Codebase**: Added new dependencies and Angular providers to support frontend features.
- **Campaign module**: Refactored dependency error handling.

#### 🎉 Added

- **Auth**: Password reset link support.
- **UI**: Error modal in the account component.
- **UI**: Automatic redirect to contact chat after creating a new contact.

#### 🛠️ Fixed

- **Auth**: Missing method in authentication flow.
- **UI**: Incorrect `message-info-data` binding when clicking the copy button.

#### Refactored

- Removed unused pipes and cleaned up related logic.

---

## \[v0.1.0] – 2025‑05‑11

### 🎉 Added

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

- Quick‑start guides: [Fast Production Deploy](../quickstart/production.md), [Binary + Vercel](../deploy/binary-vercel.md), [Docker Compose](../deploy/docker-compose.md), [Node‑RED integration](../deploy/node-red.md).
- Meta setup & webhook guides.
- Diagrams and screenshots in `/assets`.

### Breaking Changes

_N/A – initial release._

### Known Issues

- Using old version of Tailwind CSS in the client. Need to update to latest to speed up build.
- Since the Webhooks sent to the server by Meta pass through a synchronization mechanism, you cannot scale the server horizontally (multiple replicas). We might solve this issue with a service like [Redis](https://redis.io/) or [RabbitMQ](https://www.rabbitmq.com/).

---

**SHA256 digests for Docker images available in the release artefacts section.**
