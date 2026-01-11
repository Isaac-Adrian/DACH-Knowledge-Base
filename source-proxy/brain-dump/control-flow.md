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
