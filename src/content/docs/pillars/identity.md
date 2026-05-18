---
title: 01 · الهوية
description: TKAWEN Identity — OIDC SSO، KYC، Trust Network. هوية موحَّدة لكلّ المنصّات الجزائريّة.
---

## نظرة عامّة

**TKAWEN Identity** هو طبقة المصادقة والتحقّق التي تربط كلّ المنصّات الجزائريّة بهويّة موحَّدة. مبنيّ على Authentik (OIDC قياسيّ)، يضيف عليه:

- **KYC** ضدّ سجلّ الهوية الوطنيّ الجزائريّ
- **Trust Network** — سمعة عابرة-للمنصّات (طلبيّتك على متجر A تُحسَب في ثقتك على متجر B)
- **Cross-platform SSO** — حساب واحد لـ MyStoq + Algeria Certify + LIQAA + PharmaPro

يحلّ محلّ **Auth0، Okta، Onfido**.

## البدء السريع

```bash
# تحقّق من هوية وطنيّة (KYC)
curl -X POST https://api.tkawen.com/v1/identity/verify \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "national_id": "1234567890123456",
    "first_name": "محمد",
    "last_name": "بن أحمد",
    "date_of_birth": "1995-03-12"
  }'
```

ردّ في **<800ms**:

```json
{
  "verified": true,
  "match_score": 0.97,
  "verified_fields": ["first_name", "last_name", "date_of_birth"],
  "trust_score": 78,
  "session_id": "sess_8xk2..."
}
```

## النقاط الرئيسيّة

| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/identity/verify` | KYC ضدّ الهوية الوطنيّة |
| `GET` | `/v1/identity/me` | المستخدم الحاليّ |
| `POST` | `/v1/identity/sessions` | إنشاء جلسة (OIDC token) |
| `POST` | `/v1/identity/sessions/revoke` | إنهاء جلسة محدَّدة |
| `GET` | `/v1/identity/trust/{user_id}` | درجة الثقة العابرة للمنصّات |
| `POST` | `/v1/identity/trust/events` | تسجيل حدث ثقة |
| `GET` | `/v1/identity/oidc/.well-known/openid-configuration` | OIDC discovery |

## التسعير (بالدينار)

| العمليّة | السعر | ملاحظة |
|----------|------|--------|
| تسجيل دخول | **0.50 DZD** | لكلّ session جديدة |
| KYC verify | **8 DZD** | يشمل OCR للبطاقة |
| Trust check | **2 DZD** | استعلام عن trust score |
| Trust event ingestion | مجاناً | لتحفيز المنصّات على التغذية |

في Sandbox: **1,000 استدعاء/شهر مجاناً** لكلّ نوع.

## أمثلة بـ SDK

```javascript
import { Tkawen } from '@tkawen/sdk';
const tk = new Tkawen({ key: process.env.TKAWEN_KEY });

const result = await tk.identity.verify({
  nationalId: '1234567890123456',
  firstName: 'محمد',
  lastName: 'بن أحمد',
  dateOfBirth: '1995-03-12',
});
console.log(result.verified, result.trustScore);
```

```php
use Tkawen\Sdk\Client;
$tk = new Client(['key' => env('TKAWEN_KEY')]);

$result = $tk->identity->verify([
    'national_id'    => '1234567890123456',
    'first_name'     => 'محمد',
    'last_name'      => 'بن أحمد',
    'date_of_birth'  => '1995-03-12',
]);
```

```python
from tkawen import Tkawen
tk = Tkawen(key=os.environ['TKAWEN_KEY'])

result = tk.identity.verify(
    national_id='1234567890123456',
    first_name='محمد',
    last_name='بن أحمد',
    date_of_birth='1995-03-12',
)
```

```go
import "github.com/liqaa-cloud/tkawen-go"
tk := tkawen.New(os.Getenv("TKAWEN_KEY"))

result, err := tk.Identity.Verify(ctx, &tkawen.VerifyRequest{
    NationalID:  "1234567890123456",
    FirstName:   "محمد",
    LastName:    "بن أحمد",
    DateOfBirth: "1995-03-12",
})
```

## الحدود + SLA

- **Rate limit:** 100 req/sec per API key (Builder)، 1000 req/sec (Enterprise)
- **Latency p99:** <800ms للـ KYC، <50ms للـ trust check
- **SLA:** 99.9% (Builder)، 99.99% (Enterprise)

## مفاهيم

### OIDC Discovery
استخدم هذا الـ URL في إعدادات تطبيقك:

```
https://identity.tkawen.com/application/o/your-app/.well-known/openid-configuration
```

### Trust Score
رقم 0-100 يلخّص:
- تاريخ المعاملات عبر منصّات TKAWEN
- وجود نزاعات (chargebacks)
- ثبات الهوية (نفس الهاتف/البريد عبر الوقت)
- مدى التحقّق (KYC مكتمل؟ هاتف مُتحقَّق؟)

## روابط

- حالة الخدمة: [status.tkawen.com](https://status.tkawen.com)
- المستودع: [github.com/liqaa-cloud](https://github.com/liqaa-cloud)
- التالي: [02 · الاتصال](/pillars/connect/)
