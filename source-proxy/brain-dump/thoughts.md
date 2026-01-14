# Thoughts and incomplete ideas

- Dependency Injection
  - Inject the DACH producer
    - Proxy should only recieve, transform, and send data
    - Should do no configuration

- Example of Bad Proxy: ToDachHandler.cs  SET-Apps > SET-DealerMasterProxy

- ID vs Key vs CorrelationId
  - Message ID answers “which message is this?”
  - Ordering key answers “what must stay in order?”
  - Correlation ID answers “what story does this belong to?

Select message parameters
  MessageType 
  MessageName

Supply identity
  Id
  Key
  CorrelationID

Pass content through untouched
  Sequence messages
  Especially for PartialObject