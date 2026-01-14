# Common Mistakes Made by Producers

## 1. Responsibility Violations

### ❌ Putting Business Logic in the Proxy
**Problem:** The proxy applies business rules, makes decisions, or transforms data beyond simple extraction.

**Why it's bad:** The proxy should only translate and publish. Business logic belongs upstream.

**Example:**
```csharp
// BAD: Business logic in proxy
if (order.Total > 1000)
{
    message = builder.BuildMessage("high-value-order", ...);
}
else
{
    message = builder.BuildMessage("standard-order", ...);
}
```

**Fix:** Move this logic upstream. The proxy should receive data that's already been processed by business rules.

---

## 2. Message Construction Errors

### ❌ Parsing the Payload Multiple Times
**Problem:** Deserializing or parsing JSON separately for header and children.

**Why it's bad:** 
- Guarantees inconsistency across messages
- Creates subtle divergence between header/child content
- Performance overhead

**Example:**
```csharp
// BAD: Parsing multiple times
var headerData = JObject.Parse(json);
var headerMessage = builder.BuildMessage(..., headerData);

var childData = JObject.Parse(json); // Parsed again!
var childMessage = builder.BuildMessage(..., childData["lines"]);
```

**Fix:** Parse once at the beginning and reuse the parsed object.

```csharp
// GOOD: Parse once
var payload = JObject.Parse(json);
// Use 'payload' for all message construction
```

---

### ❌ Non-Deterministic ID Generation
**Problem:** Using timestamps, GUIDs, or random values to build message IDs.

**Why it's bad:** 
- Cannot replay the same payload and get identical messages
- Makes debugging harder
- Brad mentioned: IDs must allow messages to be found in DACH

**Example:**
```csharp
// BAD: Non-deterministic
var id = $"{orderId}-{Guid.NewGuid()}";
var id = $"{orderId}-{DateTime.Now.Ticks}";
```

**Fix:** Build IDs deterministically from the payload content.

```csharp
// GOOD: Deterministic
var id = orderId;
var childId = $"{orderId}-line-{lineId}";
```

---

## 3. Ordering and Correlation Mistakes

### ❌ Using Different Keys for Related Messages
**Problem:** Header and children use different ordering keys.

**Why it's bad:** Prevents out-of-order reconstruction. DACH cannot guarantee ordering across different keys.

**Example:**
```csharp
// BAD: Different keys
var headerMessage = builder.BuildMessage(
    id: orderId,
    key: orderId,  // Different key!
    ...);

var childMessage = builder.BuildMessage(
    id: childId,
    key: childId,  // Different key!
    ...);
```

**Fix:** Use the same ordering key for all messages in a logical object.

```csharp
// GOOD: Same key
var key = orderId;
var headerMessage = builder.BuildMessage(..., key: key, ...);
var childMessage = builder.BuildMessage(..., key: key, ...);
```

---

## 4. Partial Object Pattern Violations

### ❌ Sending Children Before Header
**Problem:** Publishing child messages before the parent/header.

**Why it's bad:** Consumers cannot reconstruct the object properly.

**Example:**
```csharp
// BAD: Children first
foreach (var line in payload["lines"]!)
{
    await _producer.SendOrderedMessageAsync(childMessage);
}
await _producer.SendOrderedMessageAsync(headerMessage); // Header last!
```

**Fix:** Always send header first, then children.

```csharp
// GOOD: Header first
await _producer.SendOrderedMessageAsync(headerMessage);

foreach (var line in payload["lines"]!)
{
    await _producer.SendOrderedMessageAsync(childMessage);
}
```

---

### ❌ Incorrect Child ID Composition
**Problem:** Not following the pattern: `{ParentId}-{ChildType}-{Suffix}`

**Example:**
```csharp
// BAD: Non-standard format
var childId = $"{lineId}";  // Missing parent reference
var childId = $"{orderId}{lineId}";  // Missing delimiters
```

**Fix:** Follow the standard pattern.

```csharp
// GOOD: Standard pattern
var childId = $"{orderId}-line-{lineId}";
```

---

## 5. Configuration Mistakes

### ❌ Hard-Coding Logic Instead of Externalizing Parameters
**Problem:** Embedding conditional logic, ID composition rules, or message flow in code.

**What to externalize (GOOD):**
- Property names
- Message names
- Suffix values

**What NOT to externalize (BAD):**
- Conditionals
- ID composition rules
- Message flow topology

**Example:**
```csharp
// BAD: Logic in config
if (config["shouldSendChild"] == "true")
{
    // Don't make message topology conditional
}

// GOOD: Parameters in config
var messageName = config["MessageName"]; // "Order"
var childSuffix = config["ChildSuffix"]; // "line"
```

---

## 6. Error Handling Failures

### ❌ Log and Continue
**Problem:** Catching exceptions, logging them, and continuing to process.

**Why it's bad:** Partial publish is BAD. You'll have incomplete data in DACH.

**Example:**
```csharp
// BAD: Swallowing errors
try
{
    await _producer.SendOrderedMessageAsync(headerMessage);
}
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to send header");
    // Continues to send children anyway!
}
```

**Fix:** Fail fast and loud. Let the error bubble up.

```csharp
// GOOD: Fail fast
await _producer.SendOrderedMessageAsync(headerMessage);
// If this fails, exception propagates and stops execution
```

---

## 7. Logging Issues

### ❌ Logging Full Payloads
**Problem:** Writing entire JSON payloads to logs.

**Why it's bad:** 
- Performance issues
- Security/privacy concerns
- Noise in logs

**Example:**
```csharp
// BAD: Full payload
_logger.LogInformation("Processing: {Payload}", json);
```

**Fix:** Log only identifiers.

```csharp
// GOOD: IDs only
_logger.LogInformation(
    "Sent message - ParentId: {ParentId}, ChildId: {ChildId}, " +
    "CorrelationId: {CorrelationId}, MessageName: {MessageName}",
    orderId, childId, correlationId, "Order");
```

---

## 8. Concurrency Mistakes

### ❌ Parallelizing Message Sends
**Problem:** Using `Task.WhenAll` or parallel loops to send messages.

**Why it's bad:** Let EventHub handle ordering. Parallelizing defeats the ordering guarantee.

**Example:**
```csharp
// BAD: Parallel sends
var tasks = children.Select(child => 
    _producer.SendOrderedMessageAsync(childMessage));
await Task.WhenAll(tasks);
```

**Fix:** Send sequentially.

```csharp
// GOOD: Sequential
foreach (var child in children)
{
    await _producer.SendOrderedMessageAsync(childMessage);
}
```

---

## 9. Architecture Anti-Patterns

### ❌ Multiple Message Builders in One Proxy
**Problem:** Creating different builders for different scenarios in the same proxy.

**Why it's bad:** Violates single responsibility. Each proxy should have one clear purpose.

---

### ❌ Dynamic Message Types Based on Content
**Problem:** Choosing message type or structure based on payload values.

**Example:**
```csharp
// BAD: Conditional message topology
if (data["type"] == "new")
{
    builder = CreateMessageBuilder(MessageType.BusinessEvent, "OrderCreated");
}
else
{
    builder = CreateMessageBuilder(MessageType.BusinessObject, "Order");
}
```

**Fix:** This should be decided upstream. The proxy should have one clear message structure.

---

## 10. Signs Your Proxy is Poorly Designed

Watch out for these red flags:

- ❌ Multiple message builders in one proxy
- ❌ Different ID logic per message type  
- ❌ Business logic in the proxy
- ❌ Conditional message topology
- ❌ Dynamic message types based on content
- ❌ Cannot replay the same payload and get identical messages
- ❌ Cannot explain the message flow on a whiteboard in 60 seconds
- ❌ Removing the proxy changes business behavior

---

## Reference Example

See [ToDachHandler.cs in SET-Apps > SET-DealerMasterProxy](thoughts.md) as an example of what NOT to do.

---

## Quick Checklist

Before deploying your proxy, verify:

- ✅ Parse payload once
- ✅ IDs are deterministic
- ✅ Same key for all related messages
- ✅ Header sent before children
- ✅ Child IDs follow pattern: `{ParentId}-{ChildType}-{Suffix}`
- ✅ No business logic in proxy
- ✅ Fail fast on errors
- ✅ Log IDs, not payloads
- ✅ Sequential sends (no parallelization)
- ✅ Can replay and get identical messages
