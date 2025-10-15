# Message and Status Synchronization Documentation

## Overview

The wacraft server implements a sophisticated synchronization mechanism to coordinate messages sent to WhatsApp with status updates received via webhooks. This ensures that every message in the database has an associated initial status, even when status updates arrive before the message is fully persisted.

## The Challenge

When sending a message to WhatsApp, there's a race condition between:

1. **Message creation flow**: API request → WhatsApp API call → Database insert → Response to client
2. **Status update flow**: WhatsApp webhook → Status processing → Database insert

WhatsApp can send status updates extremely quickly (sometimes in milliseconds), potentially arriving before the message has been saved to the database. Without synchronization, the status update might fail to find its corresponding message.

## Core Synchronization Mechanism

### MessageStatusSynchronizer Structure

Located in: `src/message/service/synchronize-message-and-status.go:13-145`

```go
type MessageStatusSynchronizer struct {
    channels map[string]*chan string // Channels indexed by WhatsApp Message ID (wamID)
    mu       *sync.Mutex             // Protects concurrent access to channels map
}
```

The synchronizer uses Go channels to coordinate between message creation and status updates:

- **Key**: WhatsApp Message ID (wamID) - the unique identifier WhatsApp assigns to each message
- **Value**: A string channel that communicates the message UUID once it's saved

### Global Instance

A global singleton instance is created and shared across the application:

```go
var StatusSynchronizer = CreateMessageStatusSynchronizer()
```

Located at: `src/message/service/synchronize-message-and-status.go:144`

## Synchronization Flow

### 1. Sending a Message (Outbound Flow)

Located in: `src/message/service/whatsapp.go:47-121`

#### Step-by-step Process:

1. **API Request Received** (`src/message/handler/whatsapp.go:28`)
    - Client sends POST request to `/message/whatsapp`
    - Request body is validated

2. **Message Preparation**
    - Contact lookup in database
    - Message content is built with WhatsApp-specific format

3. **WhatsApp API Call** (`src/message/service/whatsapp.go:80`)

    ```go
    response, err := message_service.Send(whatsapp.WabaApi, body.SenderData)
    ```

    - Message is sent to WhatsApp's Graph API
    - WhatsApp returns a `wamID` (WhatsApp Message ID)

4. **Register with Synchronizer** (`src/message/service/whatsapp.go:92-98`)

    ```go
    err = StatusSynchronizer.AddMessage(
        message.ProductData.Messages[0].ID.ID,  // wamID
        env.MessageStatusSyncTimeout,           // 20 seconds timeout
    )
    ```

    - Creates a channel for this wamID
    - **Blocks here** waiting for either:
        - A status update to signal the channel
        - A timeout (20 seconds default)

5. **Database Insert** (`src/message/service/whatsapp.go:101-108`)

    ```go
    err = tx.Create(&message).Error
    if err != nil {
        StatusSynchronizer.RollbackMessage(wamID, timeout)
        return message, err
    }
    ```

    - If successful: Message is saved with generated UUID
    - If failed: Rollback signal is sent to unblock any waiting status

6. **Signal Message Saved** (`src/message/service/whatsapp.go:110-118`)

    ```go
    go func() {
        StatusSynchronizer.MessageSaved(
            message.ProductData.Messages[0].ID.ID,  // wamID
            message.ID,                              // Database UUID
            env.MessageStatusSyncTimeout,
        )
    }()
    ```

    - Sends the database UUID through the channel
    - This unblocks the waiting status handler (if any)

### 2. Receiving Status Update (Webhook Flow)

Located in: `src/webhook-in/handler/whatsapp-message-status.go:26-114`

#### Step-by-step Process:

1. **Webhook Received** (`src/webhook-in/handler/whatsapp-message.go:36`)
    - WhatsApp sends POST request to webhook endpoint
    - Contains status updates array

2. **Extract wamID** (`src/webhook-in/handler/whatsapp-message-status.go:36`)

    ```go
    wamID := status.ID
    ```

    - The WhatsApp Message ID from the status update

3. **Lock for Race Condition** (`src/webhook-in/handler/whatsapp-message-status.go:38`)

    ```go
    statusSynchronizer.Lock(wamID)
    ```

    - Prevents multiple status updates for the same message from processing simultaneously
    - This is a separate synchronizer (`MutexSwapper`) from the message-status synchronizer

4. **Check if Message Exists** (`src/webhook-in/handler/whatsapp-message-status.go:40-60`)

    ```go
    msgs, err := message_service.GetWamID(
        wamID,
        message_entity.Message{MessagingProductID: mpID},
        &database_model.Paginate{Offset: 0, Limit: 1},
        &database_model.DateOrder{CreatedAt: &ascending},
        nil,
        tx,
    )
    ```

    - Queries database using JSONB operators to find message by wamID
    - Query checks both `receiver_data` and `product_data.messages` fields

5. **Two Paths Based on Message Existence:**

    **Path A: Message Found** (`src/webhook-in/handler/whatsapp-message-status.go:74-88`)

    ```go
    statusSynchronizer.Unlock(wamID)
    msg := msgs[0]
    msgID = msg.ID
    ```

    - Message already exists in database
    - Use its UUID directly
    - Unlock immediately since no waiting needed

    **Path B: Message Not Found** (`src/webhook-in/handler/whatsapp-message-status.go:62-73`)

    ```go
    msgID, err = message_service.StatusSynchronizer.AddStatus(
        wamID,
        status.Status,
        env.MessageStatusSyncTimeout,
    )
    statusSynchronizer.Unlock(wamID)
    ```

    - Message hasn't been saved yet (race condition detected)
    - **Blocks here** waiting for message to be saved
    - Receives message UUID when `MessageSaved()` is called
    - If error (timeout or rollback), returns `nil` error to WhatsApp to avoid retries

6. **Save Status** (`src/webhook-in/handler/whatsapp-message-status.go:90-106`)

    ```go
    s, err := repository.Create(
        status_entity.Status{
            StatusFields: status_model.StatusFields{
                MessageID: msgID,
                ProductData: &status_model.ProductData{
                    Status: &status,
                },
            },
        },
        tx,
    )
    ```

    - Status is saved with the correct message UUID
    - Transaction ensures atomicity

## Synchronization Methods Explained

### AddMessage()

Located at: `src/message/service/synchronize-message-and-status.go:20-42`

Called by the message sender to wait for status confirmation.

**Behavior:**

- Creates a channel if one doesn't exist for this wamID
- Blocks waiting on the channel
- Unblocks when:
    - A status arrives and signals the channel (AddStatus)
    - Message is saved and signals completion (MessageSaved)
    - Timeout occurs (default 20 seconds)

**Returns:**

- `nil` if status arrives before timeout
- `error` if timeout occurs

### AddStatus()

Located at: `src/message/service/synchronize-message-and-status.go:84-135`

Called by the webhook handler when a status arrives before the message is saved.

**Behavior:**

1. Creates a channel if one doesn't exist for this wamID
2. **First signal**: Sends empty string to unblock waiting AddMessage()
3. **Wait for second signal**: Blocks waiting for MessageSaved() to send the UUID
4. Returns the message UUID once received

**Returns:**

- `uuid.UUID` of the message
- `error` if timeout or message was rolled back

### MessageSaved()

Located at: `src/message/service/synchronize-message-and-status.go:64-81`

Called after successfully saving a message to the database.

**Behavior:**

- Sends the message UUID through the channel
- Unblocks any waiting AddStatus() call
- Cleans up the channel from the map

### RollbackMessage()

Located at: `src/message/service/synchronize-message-and-status.go:44-61`

Called when message creation fails after WhatsApp accepted it.

**Behavior:**

- Sends empty string through the channel
- Signals to AddStatus() that message was rolled back
- AddStatus() will return an error when it receives empty string

## Configuration

### Timeout Setting

Located at: `src/config/env/whatsapp.go:18`

```go
MessageStatusSyncTimeout = 20 * time.Second
```

Can be configured via environment variable:

- Variable: `MESSAGE_STATUS_SYNC_TIMEOUT_SEC`
- Default: 20 seconds
- Purpose: Maximum time to wait for synchronization

This timeout applies to:

- Waiting for status when sending a message
- Waiting for message UUID when status arrives first
- Signaling operations

## Environment-Specific Behavior

### Local Development Mode

Located at: `src/message/service/whatsapp.go:31-35`

```go
if common_service.IsEnvLocal() {
    msg, err = SendWhatsAppMessageAtTransactionWithoutWaitingForStatus(body, mp.ID, nil)
} else {
    msg, err = SendWhatsAppMessageAtTransaction(body, mp.ID, nil)
}
```

In local development:

- Uses `SendWhatsAppMessageAtTransactionWithoutWaitingForStatus()`
- Does NOT block the HTTP response waiting for status
- AddMessage runs in a goroutine
- HTTP request completes faster
- Located at: `src/message/service/whatsapp.go:124-208`

In production:

- Uses `SendWhatsAppMessageAtTransaction()`
- BLOCKS the HTTP response until status arrives
- Ensures status exists before responding to client
- Located at: `src/message/service/whatsapp.go:47-121`

## Race Condition Scenarios

### Scenario 1: Status Arrives Before Message is Saved

**Timeline:**

```
T0: Client sends message → WhatsApp API
T1: WhatsApp API accepts (returns wamID)
T2: AddMessage() called, blocks waiting
T3: ⚡ WhatsApp webhook arrives with status
T4: AddStatus() called, signals to unblock T2
T5: AddStatus() blocks waiting for message UUID
T6: Database insert completes
T7: MessageSaved() called with UUID
T8: AddStatus() receives UUID, unblocks
T9: Status saved with correct message UUID
```

**Result:** ✅ Status correctly linked to message

### Scenario 2: Message Saved Before Status Arrives

**Timeline:**

```
T0: Client sends message → WhatsApp API
T1: WhatsApp API accepts (returns wamID)
T2: AddMessage() called, blocks waiting
T3: Database insert completes
T4: MessageSaved() called
T5: ⏱️ Waiting for status...
T6: Timeout occurs (20 seconds)
T7: AddMessage() returns timeout error
T8: Message exists in database
T9: ⚡ WhatsApp webhook arrives (late)
T10: GetWamID() finds existing message
T11: Status saved with message UUID from database
```

**Result:** ✅ Status saved using database lookup (no synchronization needed)

### Scenario 3: Message Creation Fails After WhatsApp Accepts

**Timeline:**

```
T0: Client sends message → WhatsApp API
T1: WhatsApp API accepts (returns wamID)
T2: AddMessage() called, blocks waiting
T3: ⚡ WhatsApp webhook arrives with status
T4: AddStatus() called, signals to unblock T2
T5: AddStatus() blocks waiting for message UUID
T6: ❌ Database insert fails (e.g., constraint violation)
T7: RollbackMessage() called, sends empty string
T8: AddStatus() receives empty string
T9: AddStatus() returns "message rolled back" error
T10: Status NOT saved, returns nil to WhatsApp
```

**Result:** ✅ Status discarded, no orphaned status record

### Scenario 4: Multiple Status Updates for Same Message

WhatsApp sends status progressions: `sent` → `delivered` → `read`

**Concurrency Protection:**

```go
statusSynchronizer.Lock(wamID)
// ... process status ...
statusSynchronizer.Unlock(wamID)
```

Located at: `src/webhook-in/handler/whatsapp-message-status.go:38`

This `MutexSwapper` ensures:

- Only one status update per wamID processes at a time
- Second status waits until first completes
- Prevents duplicate processing
- Prevents race conditions in database queries

## Error Handling

### Message Send Failures

1. **Before WhatsApp API Call**
    - No synchronization needed
    - Error returned immediately
    - No cleanup required

2. **WhatsApp API Rejects**
    - Synchronization not started
    - Error returned to client
    - No status expected

3. **After WhatsApp API, Before DB Save**
    - AddMessage() is waiting
    - Database insert fails
    - RollbackMessage() signals the failure
    - Any waiting status receives rollback signal

### Status Processing Failures

1. **Timeout Waiting for Message**

    ```go
    msgID, err = message_service.StatusSynchronizer.AddStatus(...)
    if err != nil {
        // Returns nil to WhatsApp (don't retry)
        return nil
    }
    ```

    - Status arrives but message never saves
    - After 20 seconds, timeout occurs
    - Returns `nil` error to WhatsApp (200 OK response)
    - WhatsApp won't retry this specific status
    - Message may have status from database lookup on retry

2. **Message Rolled Back**
    - AddStatus() receives empty string
    - Returns "message rolled back" error
    - Returns `nil` to WhatsApp (don't retry)

3. **Database Insert Fails**
    - Transaction rolls back
    - Error propagates up
    - WhatsApp may retry webhook

## Transaction Handling

### Message Transaction

Located at: `src/message/service/whatsapp.go:58-62`

```go
transactionProvided := tx != nil
if tx == nil {
    tx = database.DB
}
```

- Supports external transactions (for bulk operations)
- If no transaction provided, uses database directly
- MessageSaved() only called if no transaction provided
- In transactions, caller is responsible for signaling

### Status Transaction

Located at: `src/webhook-in/handler/whatsapp-message.go:51-86`

```go
tx := database.DB.Begin()
// ... process messages and statuses ...
if err := tx.Commit().Error; err != nil {
    return err
}
```

- All status updates in single webhook are atomic
- Multiple statuses committed together
- On error, all statuses rolled back

## Database Schema Integration

### Messages Table

Messages store their WhatsApp metadata in JSONB fields:

**product_data (JSONB):**

```json
{
    "messages": [
        {
            "id": "wamid.HBgNNTU5..." // WhatsApp Message ID
        }
    ]
}
```

**receiver_data (JSONB):**

```json
{
    "id": "wamid.HBgNNTU5..." // For received messages
}
```

### Finding Messages by wamID

Located at: `src/message/service/wam-id.go:29-39`

```sql
WHERE receiver_data->>'id' = ?
   OR EXISTS (
       SELECT 1 FROM jsonb_array_elements(product_data->'messages') AS m(message)
       WHERE m.message->>'id' = ?
   )
```

This query efficiently finds messages whether they were sent or received.

### Status Table

```go
type Status struct {
    MessageID   uuid.UUID  // Foreign key to messages table
    ProductData JSONB      // Contains WhatsApp status details
}
```

## Performance Considerations

### Channel Management

Channels are created on-demand and cleaned up after use:

```go
defer func() {
    m.mu.Lock()
    delete(m.channels, wamID)
    m.mu.Unlock()
}()
```

This prevents memory leaks from accumulating channels.

### Goroutine Usage

MessageSaved() runs in a goroutine:

```go
go func() {
    if !transactionProvided {
        StatusSynchronizer.MessageSaved(wamID, message.ID, timeout)
    }
}()
```

This prevents blocking the main message creation flow.

### Database Queries

Status processing queries messages with:

- Limit of 1 result
- Ascending date order (oldest first)
- Efficient JSONB indexing

### Concurrent Processing

Webhooks process multiple statuses concurrently:

```go
var eg errgroup.Group
for _, status := range *value.Statuses {
    eg.Go(func() error {
        // Process status
    })
}
```

## Testing Considerations

### Local Development

Set environment to local to avoid blocking on status:

```bash
export ENV=local
```

### Simulating Race Conditions

1. **Status before message:**
    - Send webhook immediately after getting wamID
    - Add delay before database insert

2. **Status timeout:**
    - Block webhook endpoint
    - Send message
    - Wait 20+ seconds
    - Unblock webhook

3. **Message rollback:**
    - Break database constraint
    - Send message (will fail after WhatsApp accepts)
    - Send webhook
    - Verify status not created

## Monitoring and Debugging

### Timeout Monitoring

Watch for timeout errors in logs:

```
"timeout waiting for whatsapp message status update"
"timeout waiting to signal message saved"
"timeout waiting for message added"
```

These indicate:

- WhatsApp webhook delays
- Database performance issues
- Network problems

### Suggested Metrics

1. **Synchronization Success Rate**
    - Messages that complete within timeout
    - Target: >99%

2. **Average Wait Time**
    - Time spent in AddMessage() or AddStatus()
    - Target: <1 second

3. **Timeout Rate**
    - Percentage of operations timing out
    - Target: <0.1%

4. **Status Arrival Order**
    - Count of statuses arriving before vs. after message save
    - Helps tune timeout values

## Future Improvements

### Potential Optimizations

1. **Redis-based Synchronization**
    - Replace in-memory channels with Redis pub/sub
    - Enables horizontal scaling across multiple server instances
    - Current limitation: synchronization only works within single process

2. **Adaptive Timeouts**
    - Monitor actual wait times
    - Adjust timeout based on percentiles
    - Reduce unnecessary waiting

3. **Status Buffering**
    - Buffer early status updates in memory
    - Retry attachment after short delay
    - Reduce database queries

4. **Webhook Ordering**
    - WhatsApp doesn't guarantee order
    - Could implement sequence numbers
    - Ensure statuses process in correct order

## Summary

The message-status synchronization system ensures data consistency by:

- Using Go channels for inter-goroutine communication
- Blocking message creation until status arrives (production)
- Blocking status creation until message exists
- Handling rollback scenarios gracefully
- Preventing race conditions with mutex locks
- Cleaning up resources automatically
- Providing configurable timeouts

This design ensures every message has an associated status, even when WhatsApp's webhooks arrive faster than the server can persist messages.
