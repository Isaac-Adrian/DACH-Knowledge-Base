# Partial Object Pattern

## Definition 

A single logical entity (data object) is decomposed into

1. Header (parent message)
2. One or more child messages
3. All sharing same order key

## Rules

- Header sent first
- Children sent after
- Child IDs composed as: {ParentId}-{ChildType}-{Suffix}

## Why (More examination needed)

- Payload size limits
- Independent child lifecycles
- Consumer-side reconstruction

## Example

Data Object

```json
{
  "orderId": "ORD-123",
  "customerId": "CUST-9",
  "lines": [
    { "lineId": "1", "sku": "A1", "qty": 2 },
    { "lineId": "2", "sku": "B4", "qty": 1 }
  ]
}
```

```csharp
public sealed class SimplePartialObjectProducer
{
    private readonly IDACHProducer _producer;

    public SimplePartialObjectProducer(IDACHProducer producer)
    {
        _producer = producer;
    }

    public async Task SendAsync(string json)
    {
        // 1. Parse once
        var payload = JObject.Parse(json);

        var orderId = payload["orderId"]!.ToString();
        var key = orderId;
        var correlationId = orderId;

        // 2. Create builder (PartialObject)
        var builder =
            DACHMessageBuilderFactory.CreateMessageBuilder(
                MessageType.PartialObject,
                "Order");

        // 3. Build + send HEADER (parent)
        var headerContent = new JObject
        {
            ["orderId"] = orderId,
            ["customerId"] = payload["customerId"]
        };

        var headerMessage =
            builder.BuildMessage(
                id: orderId,
                key: key,
                correlationId: correlationId,
                content: headerContent.ToString());

        await _producer.SendOrderedMessageAsync(headerMessage);

        // 4. Build + send CHILDREN
        foreach (var line in payload["lines"]!)
        {
            var lineId = line["lineId"]!.ToString();

            var childId = $"{orderId}-line-{lineId}";

            var childMessage =
                builder.BuildMessage(
                    id: childId,
                    key: key,                    // SAME KEY
                    correlationId: correlationId,
                    content: line.ToString());

            await _producer.SendOrderedMessageAsync(childMessage);
        }
    }
}

```