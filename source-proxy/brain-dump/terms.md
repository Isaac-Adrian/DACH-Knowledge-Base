# Terms

## DACH Producer Proxy

- Adapter that listens to upstream changes
- Constructs DACH message
- Publishes it using IDACHProducer

## IDACH Producer

- Interface proxies use to talk to DACH
  - Event Hub publishing
  - Partition routing
  - Ordered delivery
  - Retry mechanics

```csharp
SendOrderedMessageAsync(DACHMessage, CancellationToken)
```

## DACH Message Builder Factory

- Encapsulates DOC/DACH envelope construction rules
- Message Types
  - Business Object
  - Business Event
  - Partial Object

```csharp
CreateMessageBuilder(messageType, messageName)  
```

messageType = Message Type (Business Object, ...)
messageName = Data Product?

## Message Identifiers

| Field | Meaning | Owner |
|-------|---------|-------|
|**id**| Unique Message Instance | Proxy |
|**Key** | Ordering | Proxy |
|**CorrelationID** | Logical Grouping | Proxy |

- Partial Objects
  - Parent IDs shared across children
  - Child ID derrived with suffix

