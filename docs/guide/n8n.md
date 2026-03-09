# 🔌 n8n Integration

wacraft ships a community node for **n8n** — [`@astervia/n8n-nodes-wacraft`](https://github.com/Astervia/n8n-nodes-wacraft) — that lets you automate WhatsApp workflows without writing code. Send messages, react to incoming events, manage contacts, handle media, and more, all from n8n's visual editor.

## 1 — Install the Community Node

1. Open your n8n instance and go to **Settings → Community Nodes**.
2. Search for `@astervia/n8n-nodes-wacraft`.
3. Click **Install** and confirm.
4. Restart n8n when prompted.

**Alternative — manual install:**

```bash
cd ~/.n8n/custom
npm install @astervia/n8n-nodes-wacraft
# restart n8n
```

> For a local test environment, the repo ships a Docker Compose file:
> ```bash
> docker compose -f docker-compose.test.yml up --build
> # n8n available at http://localhost:5678
> ```

## 2 — Configure Credentials

After installing, create a **Wacraft API** credential in n8n (**Credentials → New → Wacraft API**):

| Field | Value |
| ----- | ----- |
| **Base URL** | Your wacraft server URL, e.g. `https://api.example.com` (no trailing slash). Use `http://host.docker.internal:6900` when n8n runs in Docker and wacraft is on the same machine. |
| **Username** | Your wacraft account email |
| **Password** | Your wacraft account password |
| **Default Workspace ID** | The UUID of the workspace this credential operates on by default |

> Tokens are obtained via `POST /user/oauth/token` and refreshed automatically before expiry — you don't need to manage them manually.

You can override the workspace ID per operation, so a single n8n instance can drive multiple wacraft workspaces.

## 3 — Available Nodes & Operations

### Contact

| Operation | Description |
| --------- | ----------- |
| Get Many | List contacts with filters (name, email, sort) |
| Create | Add a new contact |
| Update | Edit an existing contact |
| Delete | Remove a contact by ID |

### Message

| Operation | Description |
| --------- | ----------- |
| Get Many | Paginated messages with date/ID filters |
| Search by Content | Full-text search using ILIKE matching |
| Send WhatsApp Message | Send any message following the WhatsApp Cloud API format |
| Mark as Read | Show double blue checkmark on a conversation |
| Send Typing | Display a typing indicator to the recipient |

### Messaging Product Contact

| Operation | Description |
| --------- | ----------- |
| Get Many | List product contacts with filters |
| Get WhatsApp Contacts | Filter by phone number or WA ID |
| Search by Content | ILIKE text search |
| Create / Create WhatsApp | Link a contact to a messaging product |
| Delete | Remove a contact link |
| Block / Unblock | Manage contact blocking status |

### Media

| Operation | Description |
| --------- | ----------- |
| Get Info | Retrieve metadata and a 5-minute temporary download URL |
| Download | Fetch binary media data |
| Upload | Submit a media file with its MIME type |

### Template

| Operation | Description |
| --------- | ----------- |
| Get Many | Retrieve templates with filters (category, status, quality, language, pagination) |

### Messaging Product

| Operation | Description |
| --------- | ----------- |
| Get Many | List available messaging products (currently WhatsApp) |

## 4 — Suggested Flow: Automate Replies via Webhook

This is the recommended starting point for most automation scenarios.

### Step 1 — Create a Webhook endpoint in wacraft

1. Log in to wacraft and open your workspace.
2. Go to **Webhooks** in the sidebar and click **New Webhook**.
3. Set the **URL** to your n8n webhook trigger URL (shown when you add an n8n Webhook node — see Step 2).
4. Select which events to forward (e.g. `message.received`).
5. Save the webhook.

### Step 2 — Build the n8n flow

A minimal auto-reply flow looks like this:

```
[Webhook Trigger] → [IF: message contains "hello"] → [Wacraft: Send WhatsApp Message]
```

**Add the Webhook trigger node:**

1. Create a new workflow in n8n.
2. Add a **Webhook** node as the trigger.
3. Set **HTTP Method** to `POST`.
4. Copy the generated webhook URL and paste it into the wacraft webhook you created in Step 1.

**Add the Wacraft Send Message node:**

1. Add a **Wacraft** node after your logic.
2. Set **Resource** → `Message` and **Operation** → `Send WhatsApp Message`.
3. Select your **Wacraft API** credential.
4. Set the **Messaging Product Contact ID** (the ID of the contact to reply to — typically extracted from the webhook payload).
5. Set the **Message** body as JSON following the WhatsApp Cloud API format:

```json
{
    "messaging_product": "whatsapp",
    "type": "text",
    "text": { "body": "Hello! Thanks for reaching out." }
}
```

6. Activate the workflow.

**Testing:** Send a WhatsApp message to your registered phone number. The webhook fires, n8n processes it, and the reply is sent via the Wacraft node.

### Extracting data from webhook payloads

wacraft forwards the full WhatsApp event payload to your webhook. Use n8n **Set** or **Code** nodes to extract fields. Common fields:

| n8n expression | Value |
| -------------- | ----- |
| `{{ $json.body.messaging_product_contact_id }}` | Messaging product contact ID (use as recipient) |
| `{{ $json.body.content }}` | Incoming message text |
| `{{ $json.body.contact_id }}` | wacraft contact UUID |

> Field names depend on your wacraft version. Check the live payload in n8n's execution viewer to confirm exact keys.

## 5 — Tips

- **Multiple workspaces**: Set a different **Default Workspace ID** per credential, or override it per node — useful for agencies managing several clients.
- **Template messages**: Use `Send WhatsApp Message` with `"type": "template"` in the JSON body to send approved template messages.
- **Media replies**: Chain a **Wacraft: Media → Download** node to fetch received media, process it, and reply.
- **Error handling**: Enable **Continue on Fail** in Wacraft nodes and add an error branch to log or alert on delivery failures.

## Next Steps

- [Webhook Setup](../config/webhook-setup.md) — configure the wacraft webhook endpoint
- [Workspaces & Permissions](./workspaces.md) — ensure your n8n user has `webhook.manage` and `message.send` policies
- [n8n-nodes-wacraft on GitHub](https://github.com/Astervia/n8n-nodes-wacraft) — source code, issues, and contributions
