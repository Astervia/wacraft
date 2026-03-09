# Campaigns

> **v0.1.x (Legacy)** — [Switch to v0.2.x docs](../../guide/campaigns.md)

Campaigns allow you to send bulk messages to users. You can send any kind of message, but be aware of the 24 hour conversation limit when sending non template messages.

## Step 1: Create the Campaign

Navigate to **Campaigns** from the sidebar and click the **+** icon to create a new campaign.

![Create campaign](../../assets/images/create-campaign.png)

Give it a descriptive name and click **Save**.

![Created campaign](../../assets/images/created-campaign.png)

## Step 2: Add Messages

![Add messages to campaign](../../assets/images/add-messages-to-campaign.png)

There are two ways to add messages:

### Method 1: CSV (Recommended)

1. Go to the **Templates** page and select your template.
2. Click the **CSV icon** to download a pre‑formatted CSV.
3. Fill the `to` column with phone numbers.

```csv
messaging_product,recipient_type,to,type,template.name,template.language.code,template.components
whatsapp,individual,5511999999999,template,hello_world,en_US,[]
whatsapp,individual,5521888888888,template,hello_world,en_US,[]
```

4. Upload the file in the **Add messages to campaign** section.

### Method 2: Raw JSON

Select **JSON** and paste an array of WhatsApp message objects. See the [Meta API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages) for the format.

**Tip:** Send a message from Chats, click **Message data**, and copy the `sender_data` field to get a valid JSON object.

![Message data example](../../assets/images/message-data.png)

## Step 3: Send and Monitor

Click the blue **Send ▶️** button. A progress graph appears in real time.

![Campaign progress](../../assets/images/campaign-progress.png)

> **Note:** A "success" means Meta's API accepted the message. For final delivery status, check the **Chats** page after some time.
