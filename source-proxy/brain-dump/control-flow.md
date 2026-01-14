# Control Flow

Upstream Source
↓
Deserialize / Parse
↓
Select Canonical (Message Name)
↓
Extract / Compose IDs
↓
Build DACHMessage (via Builder)
↓
SendOrderedMessageAsync

Partial Objects Add:
Build Header
↓
Send Header
↓
Build Child(ren)
↓
Send Child(ren)


- What Lives Where (Design Boundaries)

  - Upstream Producer
    - Builds the payload
    - Applies business logic
    - Decides when to send messages
    - Owns schema correctness

  - Proxy
    - Reads config
    - Extracts identity
    - Publishes messages
    - Logs success/failure

  - DACH
    - Guarantees ordering
    - Distributes messages
    - Handles retries and delivery
