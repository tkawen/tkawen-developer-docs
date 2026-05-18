---
title: 01 · Identity
description: TKAWEN Identity — OIDC SSO, KYC, and cross-product trust signals. One key, every service.
---

## Overview

**TKAWEN Identity** is the authentication and verification layer for every TKAWEN service and your own apps:

- **OIDC SSO** — standards-based single sign-on (OAuth 2.1, OIDC discovery, JWKs)
- **KYC** — identity verification against multiple national registries (US, EU, MENA, more)
- **Trust signals** — portable reputation across products built on TKAWEN
- **Unified accounts** — one user, one account, all your services

Replaces **Auth0, Okta, Clerk, Onfido**.

## Quick start

```bash
# Verify an identity against a national registry
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

Response in **under 800ms**:

```json
{
  "verified": true,
  "match_score": 0.97,
  "verified_fields": ["first_name", "last_name", "date_of_birth"],
  "trust_score": 78,
  "session_id": "sess_8xk2..."
}
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/identity/verify` | KYC against national registries |
| `GET` | `/v1/identity/me` | Current user |
| `POST` | `/v1/identity/sessions` | Create session (OIDC token) |
| `POST` | `/v1/identity/sessions/revoke` | Revoke a specific session |
| `GET` | `/v1/identity/trust/{user_id}` | Cross-product trust score |
| `POST` | `/v1/identity/trust/events` | Submit a trust event (order, dispute, etc.) |
| `GET` | `/v1/identity/oidc/.well-known/openid-configuration` | OIDC discovery |

## Pricing

| Action | Price | Notes |
|--------|-------|-------|
| Sign-in | **$0.001 / session** | Per new session |
| KYC verify | **$0.05 / verify** | Includes document OCR |
| Trust check | **$0.005 / query** | Cross-product reputation |
| Trust event ingestion | Free | Encourages quality data |

Sandbox: **1,000 calls / month** of each type, free.

## SDK examples

```javascript
import { Tkawen } from '@tkawen/sdk';
const tk = new Tkawen({ key: process.env.TKAWEN_KEY });

const result = await tk.identity.verify({
  nationalId: '1234567890123456',
  firstName: 'Jane',
  lastName: 'Doe',
  dateOfBirth: '1995-03-12',
  country: 'US',
});
console.log(result.verified, result.trustScore);
```

```php
use Tkawen\Sdk\Client;
$tk = new Client(['key' => env('TKAWEN_KEY')]);

$result = $tk->identity->verify([
    'national_id'    => '1234567890123456',
    'first_name'     => 'Jane',
    'last_name'      => 'Doe',
    'date_of_birth'  => '1995-03-12',
    'country'        => 'US',
]);
```

```python
from tkawen import Tkawen
tk = Tkawen(key=os.environ['TKAWEN_KEY'])

result = tk.identity.verify(
    national_id='1234567890123456',
    first_name='Jane',
    last_name='Doe',
    date_of_birth='1995-03-12',
    country='US',
)
```

```go
import "github.com/liqaa-cloud/tkawen-go"
tk := tkawen.New(os.Getenv("TKAWEN_KEY"))

result, err := tk.Identity.Verify(ctx, &tkawen.VerifyRequest{
    NationalID:  "1234567890123456",
    FirstName:   "Jane",
    LastName:    "Doe",
    DateOfBirth: "1995-03-12",
    Country:     "US",
})
```

## Limits + SLA

- **Rate limit:** 100 req/sec per API key (Builder), 1000 req/sec (Enterprise)
- **Latency p99:** under 800ms for KYC, under 50ms for trust checks
- **SLA:** 99.9% (Builder), 99.99% (Enterprise)

## Concepts

### OIDC Discovery
Any app can use TKAWEN Identity as a standard OIDC Provider. Point your app at:

```
https://identity.tkawen.com/application/o/your-app/.well-known/openid-configuration
```

### Trust Score
A number from 0 to 100 summarising:
- Transaction history across TKAWEN-powered products
- Dispute / chargeback ratio
- Identity stability (consistent phone, email, name across products and time)
- KYC completeness (verified ID, verified phone, verified address)

## Related

- Live status: [status.tkawen.com](https://status.tkawen.com)
- Spec repo: [github.com/liqaa-cloud](https://github.com/liqaa-cloud)
- Next: [02 · Connect](/pillars/connect/)
