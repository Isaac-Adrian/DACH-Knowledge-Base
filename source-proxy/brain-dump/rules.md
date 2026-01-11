# Rules (Guidelines)

## Responsibility

- Have exactly one responsibility
  - A proxy exists to translate and publish only
  - business logic belongs upstream

## Message Construction

- Parse the payload once
  - Guarantees consistency across messages
  - Prevents subtle divergence between header/child content
- Build IDs deterministically and uniquely
  - Allows to be found in DACH (Brad mentioned)

## Ordering and Correlation

- Use the same ordering key for all messages in a logical object
  - Prevents out-of-order reconstruction
- Reuse correlation ID across the object

## PartialObject

- Send header first

## Configuration

- Externalize Selection not Logic
  - Good:
    - Property names
    - Message names
    - Suffix
  - Bad:
    - Conditionals
    - ID Composition rules
    - Message Flow

## Error Handling

- Fail fast and loud
- DO NOT log and continue
  - partial publish == BAD

## Logging

- Good:
  - ParentId
  - ChildId
  - CorrelationId
  - message name
- Bad:
  - full payloads

## Concurrency

- Do NOT parallelalize
  - Let EventHub handle ordering

## Signs your proxy is well designed

- You can replay the same payload and get identical messages
- You can explain the message flow on a whiteboard in 60 seconds
- Removing the proxy does not change business behavior

## Signs it is poorly designed

- Multiple message builders in one proxy
- Different ID logic per message type
- Business logic in the proxy
- Conditional message topology
- Dynamic message types based on content
