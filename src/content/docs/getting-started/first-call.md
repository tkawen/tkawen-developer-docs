---
title: Your first call
description: One simple example — create a real video room in three lines.
---

## Create a video room (Connect)

```bash
curl -X POST https://api.tkawen.com/v1/connect/rooms \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "team-standup",
    "max_participants": 12,
    "duration_minutes": 60
  }'
```

Response:

```json
{
  "room_id": "rm_8x2k9...",
  "name": "team-standup",
  "sdk_token": "eyJhbGciOiJIUzI1NiIs...",
  "join_url": "https://meet.liqaa.io/rm_8x2k9...",
  "expires_at": "2026-05-18T18:30:00Z"
}
```

Open the `join_url` in any browser and you're in the room.

## Or send an SMS

```bash
curl -X POST https://api.tkawen.com/v1/connect/sms \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+15551234567",
    "body": "Your verification code: 123456"
  }'
```

Cost: from $0.04 per SMS depending on destination country, with no monthly subscription.

## Or verify an identity (KYC)

```bash
curl -X POST https://api.tkawen.com/v1/identity/verify \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "national_id": "1234567890123456",
    "first_name": "Jane",
    "last_name": "Doe",
    "date_of_birth": "1995-03-12",
    "country": "US"
  }'
```

Response typically returns in under 800ms.

## What you learned

- The `Bearer $TKAWEN_KEY` header works across every pillar
- All endpoints live under `api.tkawen.com/v1/<pillar>/<resource>`
- Responses are standard JSON
- Per-request cost returned in `X-TKAWEN-Cost` header

Read on: **[the seven pillars](/pillars/identity/)** for deeper reference.
