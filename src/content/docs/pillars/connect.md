---
title: 02 · Connect
description: TKAWEN Connect — video, voice, SMS, WhatsApp, email, and TTS behind one API.
---

## Overview

**TKAWEN Connect** unifies every communication channel a product needs:

- **Video** via LIQAA Cloud (LiveKit-based) — sub-100ms latency, recording, transcripts
- **Voice** — WebRTC calls + server-side recording + Whisper transcription
- **SMS** — global routing across major carriers
- **WhatsApp** — Cloud API with per-tenant onboarding
- **Email** — transactional sending with DKIM signing
- **TTS** — multi-voice text-to-speech in 20+ languages

Replaces **Twilio, Zoom, SendGrid, Daily.co**.

## Quick start

```bash
# Create a video room
curl -X POST https://api.tkawen.com/v1/connect/rooms \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "team-standup",
    "max_participants": 12,
    "duration_minutes": 60,
    "record": true
  }'
```

Response:

```json
{
  "room_id": "rm_8x2k9d",
  "join_url": "https://meet.liqaa.io/rm_8x2k9d",
  "sdk_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-05-18T18:30:00Z"
}
```

## Endpoints

### Video + voice
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/connect/rooms` | Create a room |
| `GET` | `/v1/connect/rooms/{id}` | Room state + participants |
| `DELETE` | `/v1/connect/rooms/{id}` | End immediately |
| `GET` | `/v1/connect/rooms/{id}/recording` | Download recording (MP4) |
| `GET` | `/v1/connect/rooms/{id}/transcript` | Whisper transcript |

### SMS + WhatsApp + email
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/connect/sms` | Send SMS |
| `POST` | `/v1/connect/whatsapp` | Send WhatsApp message |
| `POST` | `/v1/connect/whatsapp/templates` | Register a template |
| `POST` | `/v1/connect/email` | Send transactional email |
| `GET` | `/v1/connect/messages/{id}` | Message state (sent / delivered / read) |

### TTS
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/connect/voice/tts` | Text to speech (20+ voices) |

## Pricing

| Action | Price |
|--------|-------|
| Video — per participant-minute | **$0.004** (HD) / **$0.008** (4K) |
| Recording — per minute | **+ $0.002** |
| Whisper transcript — per minute | **$0.005** |
| SMS — domestic destinations | **from $0.005** |
| SMS — international | **from $0.04** |
| WhatsApp message | **$0.015** |
| Email — transactional | **$0.0001 / email** |
| TTS — per 100 chars | **$0.0008** |

Sandbox: **1,000 video minutes/month, 100 SMS, 100 WA, 1,000 emails**.

## SDK examples

```javascript
// Create a room + send the join link by SMS
const room = await tk.connect.rooms.create({
  name: 'sales-demo',
  maxParticipants: 4,
});

await tk.connect.sms.send({
  to: '+15551234567',
  body: `Join the meeting: ${room.joinUrl}`,
});
```

```php
$room = $tk->connect->rooms->create([
    'name' => 'sales-demo',
    'max_participants' => 4,
]);

$tk->connect->sms->send([
    'to'   => '+15551234567',
    'body' => "Join the meeting: {$room->join_url}",
]);
```

```python
room = tk.connect.rooms.create(name='sales-demo', max_participants=4)
tk.connect.sms.send(to='+15551234567', body=f'Join: {room.join_url}')
```

## Webhooks

```
room.started     room.ended      room.participant_joined
sms.delivered    sms.failed      whatsapp.read
email.delivered  email.bounced   recording.ready
transcript.ready tts.ready
```

Configure:

```bash
curl -X POST https://api.tkawen.com/v1/connect/webhooks \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "url": "https://your-app.com/tkawen-webhook",
    "events": ["room.ended", "sms.delivered"],
    "secret": "whsec_..."
  }'
```

Signed with HMAC-SHA256 — verify via `X-TKAWEN-Signature`.

## Limits + SLA

- **Rate limit:** 500 SMS/min, 100 concurrent rooms (Builder)
- **Video latency p50:** under 50ms intra-region, under 100ms cross-region
- **SLA:** 99.9% (Builder), 99.99% (Enterprise)

## Related

- LIQAA Meet (OSS): [meet.liqaa.io](https://meet.liqaa.io)
- Source: [github.com/hartemyaakoub](https://github.com/hartemyaakoub)
- Next: [03 · Pay](/pillars/pay/)
