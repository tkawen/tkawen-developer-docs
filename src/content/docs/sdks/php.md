---
title: PHP / Laravel SDK
description: SDK رسميّ لـ TKAWEN بـ PHP 8.2+ مع Service Provider لـ Laravel.
---

## التثبيت

```bash
composer require tkawen/sdk
```

يتطلّب:
- PHP **8.2+** (يستخدم enums + readonly properties)
- ext-curl + ext-json + ext-mbstring
- Laravel 10/11/12 (اختياريّ — يعمل بدونه)

## التهيئة

### Vanilla PHP

```php
require __DIR__.'/vendor/autoload.php';

use Tkawen\Sdk\Client;

$tk = new Client([
    'key'      => getenv('TKAWEN_KEY'),
    'base_url' => 'https://api.tkawen.com',  // افتراضي
    'timeout'  => 30,                         // seconds
    'retries'  => 3,
]);
```

### Laravel (Auto-discovery)

أضف إلى `.env`:

```dotenv
TKAWEN_KEY=sk_live_xxxxxxxxxxxxxxxx
TKAWEN_WEBHOOK_SECRET=whsec_xxxxxxxx
```

الـ Service Provider يُسجَّل تلقائياً. استخدم facade مباشرة:

```php
use Tkawen\Sdk\Facades\Tkawen;

$room = Tkawen::connect()->rooms()->create([
    'name' => 'demo',
    'max_participants' => 4,
]);
```

أو dependency injection:

```php
use Tkawen\Sdk\Client;

class CheckoutController extends Controller
{
    public function __construct(private Client $tk) {}

    public function start(Request $request)
    {
        $checkout = $this->tk->pay->checkouts->create([
            'amount' => 25000,
            'currency' => 'DZD',
            'success_url' => route('checkout.success'),
        ]);

        return redirect($checkout->checkout_url);
    }
}
```

## التغطية

كلّ الطبقات السبع متاحة:

```php
$tk->identity->verify([...]);        // 01
$tk->connect->rooms->create([...]);  // 02
$tk->pay->checkouts->create([...]); // 03
$tk->commerce->stores->create([...]); // 04
$tk->knowledge->certificates->issue([...]); // 05
$tk->logistics->shipments->create([...]); // 06
$tk->usage->current();              // 07
```

## معالجة الأخطاء

```php
use Tkawen\Sdk\Exceptions\{
    TkawenException,
    QuotaExceededException,
    InvalidParamException,
    AuthException
};

try {
    $tk->connect->rooms->create(['name' => '']);
} catch (InvalidParamException $e) {
    Log::warning('invalid param', ['field' => $e->field]);
} catch (QuotaExceededException $e) {
    Log::error('over quota', ['used' => $e->used, 'limit' => $e->limit]);
} catch (TkawenException $e) {
    Log::error('tkawen error', ['code' => $e->code, 'msg' => $e->getMessage()]);
}
```

## Webhooks (Laravel)

```php
// routes/web.php
Route::post('/tkawen-webhook', [WebhookController::class, 'handle'])
    ->middleware('tkawen.webhook');  // middleware يُسجَّل تلقائياً
```

```php
// app/Http/Controllers/WebhookController.php
class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $event = $request->validated();  // التحقّق تمّ في middleware

        match($event['type']) {
            'room.ended'         => RecordingJob::dispatch($event['data']),
            'checkout.completed' => OrderConfirmationJob::dispatch($event['data']),
            'shipment.delivered' => CustomerNotificationJob::dispatch($event['data']),
            default => null,
        };

        return response('', 200);
    }
}
```

## Vanilla PHP Webhook Verification

```php
function verifyTkawenWebhook(string $payload, string $signature, string $secret): bool
{
    $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($expected, $signature);
}

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_TKAWEN_SIGNATURE'] ?? '';

if (!verifyTkawenWebhook($payload, $signature, getenv('TKAWEN_WEBHOOK_SECRET'))) {
    http_response_code(401);
    exit;
}
```

## Async / Concurrent calls

يستخدم Guzzle promises داخلياً:

```php
use GuzzleHttp\Promise;

$promises = [
    'room' => $tk->connect->rooms->createAsync(['name' => 'demo']),
    'sms'  => $tk->connect->sms->sendAsync(['to' => '+213...', 'body' => 'hi']),
];

$results = Promise\Utils::unwrap($promises);
```

## Macros (Laravel)

```php
// AppServiceProvider boot()
\Tkawen\Sdk\Facades\Tkawen::macro('quickSms', function (string $phone, string $msg) {
    return $this->connect->sms->send(['to' => $phone, 'body' => $msg]);
});

// استخدام
Tkawen::quickSms('+213555000000', 'مرحباً');
```

## التكامل مع Filament

```php
use Tkawen\Sdk\Filament\TkawenIdentityProvider;

// app/Providers/Filament/AdminPanelProvider.php
public function panel(Panel $panel): Panel
{
    return $panel
        ->authGuard('tkawen-id')
        ->plugins([
            TkawenIdentityProvider::make()
                ->trustScoreColumn()
                ->kycButton(),
        ]);
}
```

## أمثلة كاملة

مستودع `tkawen-php-examples`:

- `examples/laravel-checkout` — Laravel 12 + Chargily
- `examples/wordpress-plugin` — WP plugin يستخدم Connect SMS
- `examples/yii-integration` — Yii Framework example

```bash
git clone https://github.com/hartemyaakoub/tkawen-php-examples
cd tkawen-php-examples/examples/laravel-checkout
composer install && cp .env.example .env && php artisan serve
```

## النسخة + التغيير

- **آخر إصدار:** 1.0.x
- **PHP minimum:** 8.2
- **Laravel minimum:** 10
- **Changelog:** [github.com/hartemyaakoub/tkawen-php/releases](https://github.com/hartemyaakoub)

## المساهمة

[github.com/hartemyaakoub/tkawen-php](https://github.com/hartemyaakoub) — MIT license.

## الدعم

- Discord: [discord.gg/tkawen](https://discord.gg/tkawen) #php-sdk
- البريد: DIRECTION@takawen.dz
- Status: [status.tkawen.com](https://status.tkawen.com)
