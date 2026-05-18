---
title: Python SDK
description: SDK رسميّ لـ TKAWEN بـ Python 3.10+، async-first، مع type hints كاملة.
---

## التثبيت

```bash
pip install tkawen
# أو
uv pip install tkawen
# أو
poetry add tkawen
```

يتطلّب:
- Python **3.10+** (يستخدم match statements + structural pattern matching)
- `httpx` (async HTTP)
- `pydantic` 2.x (validation)

## التهيئة

```python
from tkawen import Tkawen
import os

tk = Tkawen(
    key=os.environ['TKAWEN_KEY'],
    base_url='https://api.tkawen.com',   # افتراضي
    timeout=30.0,                          # seconds
    max_retries=3,
)
```

## الاستدعاء الأوّل

### Sync (افتراضيّ)

```python
room = tk.connect.rooms.create(
    name='demo',
    max_participants=4,
)

print(room.join_url)
# → https://meet.liqaa.io/rm_8x2k9d
```

### Async (المُفضَّل للـ web frameworks)

```python
import asyncio
from tkawen import AsyncTkawen

async def main():
    async with AsyncTkawen(key=os.environ['TKAWEN_KEY']) as tk:
        room = await tk.connect.rooms.create(
            name='demo',
            max_participants=4,
        )
        return room.join_url

print(asyncio.run(main()))
```

## التغطية

كلّ الطبقات السبع:

```python
tk.identity.verify(...)         # 01
tk.connect.rooms.create(...)    # 02
tk.pay.checkouts.create(...)   # 03
tk.commerce.stores.create(...) # 04
tk.knowledge.certificates.issue(...) # 05
tk.logistics.shipments.create(...) # 06
tk.usage.current()              # 07
```

كلّ الاستدعاءات typed بـ Pydantic models — IntelliSense كامل، validation تلقائيّ.

## معالجة الأخطاء

```python
from tkawen import (
    TkawenError,
    QuotaExceededError,
    InvalidParamError,
    AuthError,
)

try:
    tk.connect.rooms.create(name='')
except InvalidParamError as e:
    print(f"الحقل {e.field} غير صحيح: {e.expected}")
except QuotaExceededError as e:
    print(f"تجاوزت الحدّ ({e.used}/{e.limit})")
except TkawenError as e:
    print(f"خطأ: {e.code} — {e}")
```

## Webhooks (FastAPI example)

```python
from fastapi import FastAPI, Request, HTTPException
from tkawen import verify_webhook

app = FastAPI()
WEBHOOK_SECRET = os.environ['TKAWEN_WEBHOOK_SECRET']

@app.post('/tkawen-webhook')
async def webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get('x-tkawen-signature', '')

    if not verify_webhook(payload, signature, WEBHOOK_SECRET):
        raise HTTPException(401, 'invalid signature')

    event = await request.json()

    match event['type']:
        case 'room.ended':
            await process_recording(event['data'])
        case 'checkout.completed':
            await process_order(event['data'])
        case 'shipment.delivered':
            await notify_customer(event['data'])

    return {'received': True}
```

### Django example

```python
# views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseForbidden
from tkawen import verify_webhook

@csrf_exempt
def tkawen_webhook(request):
    payload = request.body
    signature = request.headers.get('X-TKAWEN-Signature', '')

    if not verify_webhook(payload, signature, settings.TKAWEN_WEBHOOK_SECRET):
        return HttpResponseForbidden()

    event = json.loads(payload)
    # ... معالجة الـ event
    return HttpResponse(status=200)
```

## Streaming (للـ AI Tutor + TTS)

```python
async for chunk in tk.knowledge.ai_tutor.stream(
    course_id='crs_abc',
    question='اشرح TVA بالعربية',
):
    print(chunk.text, end='', flush=True)
```

## Bulk operations

```python
# استيراد 5,000 منتج
products = [
    {'name': f'منتج {i}', 'price': 1000 + i, 'currency': 'DZD'}
    for i in range(5000)
]

result = tk.commerce.products.bulk(
    store_id='st_8xk2',
    products=products,
    batch_size=500,  # افتراضيّ
    on_progress=lambda n, total: print(f'{n}/{total}'),
)
print(f"نجح: {result.success_count}, فشل: {result.error_count}")
```

## Pandas integration

```python
import pandas as pd

# اقرأ كلّ الـ transactions كـ DataFrame
df = tk.pay.transactions.to_dataframe(
    period='2026-05',
    columns=['id', 'amount', 'currency', 'status', 'created_at'],
)

df.groupby('status')['amount'].sum()
```

## CLI (مدمج)

```bash
# الـ pip install يضيف tkawen CLI
tkawen --help
tkawen usage
tkawen connect.rooms.create --name=demo --max=4
tkawen --json keys.list  # للـ scripting
```

## أمثلة كاملة

مستودع `tkawen-python-examples`:

- `examples/fastapi-checkout`
- `examples/django-identity-sso`
- `examples/celery-bulk-import`
- `examples/data-pipeline` — استخراج Pandas + plot Matplotlib

```bash
git clone https://github.com/liqaa-cloud/tkawen-python-examples
cd tkawen-python-examples/examples/fastapi-checkout
pip install -r requirements.txt
uvicorn main:app --reload
```

## النسخة + التغيير

- **آخر إصدار:** 1.0.x
- **Python minimum:** 3.10
- **Changelog:** [github.com/liqaa-cloud/tkawen-python/releases](https://github.com/liqaa-cloud)

## المساهمة

[github.com/liqaa-cloud/tkawen-python](https://github.com/liqaa-cloud) — MIT.

## الدعم

- Discord: [discord.gg/tkawen](https://discord.gg/tkawen) #python-sdk
- البريد: DIRECTION@takawen.dz
