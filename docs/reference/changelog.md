# 🗒️ Changelog

All notable changes to **wacraft** will be documented in this file following
[Keep a Changelog](https://keepachangelog.com/) conventions and SemVer.

## [v0.1.7] – 2025-11-04 (Server-only update)

> This update applies _only_ to the **wacraft-server**—no client changes were made.

### 📦 Dependencies

- **WhatsApp Cloud API**: Updated to the latest available SDK revision to ensure compatibility with recent Meta changes by @Rfluid.
- **Go modules**: General dependency refresh across the codebase to incorporate upstream fixes and security patches by @Rfluid.

### 🛠️ Maintenance

- Internal housekeeping to align module versions, regenerate vendored metadata, and ensure reproducible builds.

**Full changelog**: [v0.1.6…v0.1.7](https://github.com/Astervia/wacraft-server/compare/v0.1.6...v0.1.7)

## [v0.1.6] – 2025-11-03

### Backend Changes (wacraft-server)

#### 🎉 Added

- **Typing indicator support**: Implemented new _typing_ event support for WhatsApp Cloud API by @Rfluid in [#13](https://github.com/Astervia/wacraft-server/pull/13).
    - Enables real-time “typing” status broadcast to connected clients.
    - Adds configuration for client-side typing behavior.

#### 📦 Dependencies

- **WhatsApp Cloud API**: Upgraded to latest version for improved reliability and compatibility with new typing events by @Rfluid.

#### 🧾 Documentation

- Updated API docs to include typing event payloads and usage instructions by @Rfluid.

**Full changelog**: [v0.1.5…v0.1.6](https://github.com/Astervia/wacraft-server/compare/v0.1.5...v0.1.6)
**Commit**: `feature/send-typing`

---

### Frontend Changes (wacraft-client)

> This update includes both feature and localization improvements.

#### 🎉 Added

- **Typing indicators**: Introduced dynamic typing feedback in conversation views, enhancing real-time interaction awareness by @Rfluid in [#35](https://github.com/Astervia/wacraft-client/pull/35).
    - Typing loop logic added to `user-conversation-store`.
    - Configurable typing send behavior under account settings.
    - New UI animations and pipe injection improvements.

- **New locale**: Added full support for **Spanish (Chile)** (`es-CL`) localization by @ProfishingIT in [#32](https://github.com/Astervia/wacraft-client/pull/32) and [#33](https://github.com/Astervia/wacraft-client/pull/33).
    - Added `"source": "/es-CL/:path*"` rewrite to `vercel.json`.
    - Ensures proper routing and locale loading for Chilean Spanish users.

#### 🛠️ Fixed

- **UI consistency**: Adjusted components and pipes to correctly reflect typing state and prevent injection issues by @Rfluid.

**Full changelog**: [v0.1.5…v0.1.6](https://github.com/Astervia/wacraft-client/compare/v0.1.5...v0.1.6)
**Commit**: `feature/send-typing`

---

## \[v0.1.5] – 2025-08-25 (Client-only update)

> This update applies _only_ to the **wacraft-client**—no backend or infrastructure changes were made.

### 🎉 Added

- **Message preview**: Added audio icon display for messages containing audio by @Rfluid in [#31](https://github.com/Astervia/wacraft-client/pull/31).
- **Shortcuts**: Introduced search shortcut in contacts modal and improved dialog shortcuts by @Rfluid.

### 🛠️ Fixed

- **WebSocket**: Multiple improvements to stability and reconnection flow:
    - Better handling of opened connections.
    - Ensured valid socket replacement after disconnection.
    - Removed unnecessary one-shot subject resets.
    - Throw explicit errors during socket generation.

- **Media messages**: Fixed layout issues for media message content.
- **Audio button**: Corrected aspect of the audio download button.
- **UI paddings**: Adjusted paddings for `conversation-body`, add/cancel buttons, and `list-options-modal`.
- **Contacts modal**: Fixed misalignment issue.
- **Search logic**: Corrected pattern application on search values.
- **Template API**: Prevented multiple API calls to the same template by introducing mutex swapper logic.

### Refactored

- **UI**: Reformatted `list-options-modal` for improved readability.

**Full changelog**: [v0.1.4…v0.1.5](https://github.com/Astervia/wacraft-client/compare/v0.1.4...v0.1.5)
**Commit**: `7c055b0`

---

## \[v0.1.4] – 2025-08-25 (Server update)

### Backend Changes (wacraft-server)

#### 🎉 Added

- **Contact indexes**: Created new indexes on contact data to accelerate queries and improve performance by @Rfluid in [#7](https://github.com/Astervia/wacraft-server/pull/7).
- **Query optimizations**: Improved query execution to take full advantage of indexes by @Rfluid.
- **Validation**: Added validation for content key `LIKE` operations by @Rfluid.

#### 🛠️ Fixed

- **Unaccent searches**: Ensured `LIKE` queries leverage indexes by using unaccented comparisons by @Rfluid in [#8](https://github.com/Astervia/wacraft-server/pull/8).
- **Docs**: Replaced regex examples with `ILIKE` operator in documentation for consistency by @Rfluid.

**Full changelog**: [v0.1.3…v0.1.4](https://github.com/Astervia/wacraft-server/compare/v0.1.3...v0.1.4)
**Commit**: `0c740c1`

---

## \[v0.1.3] – 2025-08-25

### Backend Changes (wacraft-server)

#### 🎉 Added

- **Contact indexes**: Introduced new indexes for contact lookups to speed up `LIKE`/`ILIKE` search paths by @Rfluid in [#7](https://github.com/Astervia/wacraft-server/pull/7).
- **Validation**: Added validation for content-key `LIKE` operations to prevent malformed queries by @Rfluid.

#### 🔧 Changed

- **Query plans**: Reworked queries to ensure the planner uses the new indexes effectively and improved the contact `LIKE` **count** logic by @Rfluid.

#### 🛠️ Fixed

- **Docs**: Replaced regex examples with the `ILIKE` operator for clarity and performance by @Rfluid.

**Full changelog**: [v0.1.2…v0.1.3](https://github.com/Astervia/wacraft-server/compare/v0.1.2...v0.1.3)
**Commit**: `a65ec2a`

---

## \[v0.1.2] – 2025‑08‑24

### Backend Changes (wacraft-server)

#### 🎉 Added

- **Database indexes**: Added optimized indexes to the `messages` table to accelerate chat feed queries, reduce temporary file usage, and improve latency by @Rfluid in [#6](https://github.com/Astervia/wacraft-server/pull/6).
    - This includes b-tree, composite, and GIN indexes with `pg_trgm` and `jsonb_path_ops` to target slow query paths.

#### Refactored

- **Codebase**: Updated premium annotations to enhance readability.
- **Configuration**: Improved indentation in Docker Compose files for better clarity.

### Infrastructure

- **Release scripts**: Added new `lite-release` sync process and related instructions by @Rfluid.

### 📦 Dependencies

- **Bumped** various Go dependencies by @Rfluid.

**Full changelog**: [v0.1.1...v0.1.2](https://github.com/Astervia/wacraft-server/compare/v0.1.1...v0.1.2)
**Commit**: `1d83d69`

---

## \[v0.1.4] – 2025‑07‑22 (Client‑only update)

> This update applies _only_ to the **wacraft‑client**—no backend or infrastructure changes were made.

### 🎉 Added

- **Template messages**: Introduced a _pending_ state to better represent template message delivery progress by @Rfluid in [#27](https://github.com/Astervia/wacraft-client/pull/27).

### 🛠️ Fixed

- **Icon alignment**: Fixed icon misalignment in buttons by applying Tailwind’s flex utilities by @Rfluid in [#20](https://github.com/Astervia/wacraft-client/pull/20).
- **Light theme**: Resolved several visual issues affecting the light theme UI by @Rfluid in [#22](https://github.com/Astervia/wacraft-client/pull/22).
- **Localization**: Corrected the Portuguese (pt‑BR) status modal title translation by @Rfluid in [#23](https://github.com/Astervia/wacraft-client/pull/23).
- **UI logic**: Fixed visibility logic to correctly hide the edit button where appropriate by @Rfluid in [#24](https://github.com/Astervia/wacraft-client/pull/24).

### 📦 Dependencies

- **Bumped** `form-data` from `4.0.3` to `4.0.4` via `npm_and_yarn` group by @dependabot\[bot] in [#25](https://github.com/Astervia/wacraft-client/pull/25).

**Full changelog**: [v0.1.3…v0.1.4](https://github.com/Astervia/wacraft-client/compare/v0.1.3...v0.1.4)
**Commit**: `f3a8307`

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
