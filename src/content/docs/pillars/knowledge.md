---
title: 05 · المعرفة
description: TKAWEN Knowledge — LMS كامل + شهادات قابلة للتحقّق بـ QR — Décret 20-254.
---

## نظرة عامّة

**TKAWEN Knowledge** يشغّل بنية التعلّم والاعتماد الجزائريّة:

- **LMS** — دروس، مهامّ، اختبارات، تتبّع تقدّم
- **Certificates** — شهادات بـ QR قابلة للتحقّق عمومياً
- **Décret 20-254** — البنية معتمَدة قانونياً كـ academic spin-off
- **Trainer marketplace** — جمع المدرّبين الجزائريّين تحت TKAWEN ID
- **Skills taxonomy** — شجرة مهارات مفهرسة، تربط الدورة بسوق العمل
- **AI Tutors** — Ollama سياديّ (لا OpenAI، لا Anthropic)

يحلّ محلّ **Teachable، Coursera، Credly**.

## البدء السريع

```bash
# أصدر شهادة قابلة للتحقّق
curl -X POST https://api.tkawen.com/v1/knowledge/certificates \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": "usr_8xk2",
    "course_id": "crs_abc",
    "title": "شهادة إتمام دورة إدارة الصيدليّات",
    "issued_by": "TKAWEN Academy",
    "issued_date": "2026-05-18",
    "skills": ["pharmacy_management", "dgi_compliance"]
  }'
```

ردّ:

```json
{
  "certificate_id": "cert_8xk2",
  "qr_url": "https://verify.tkawen.com/cert_8xk2",
  "pdf_url": "https://api.tkawen.com/v1/knowledge/certificates/cert_8xk2.pdf",
  "verified_until": "permanent",
  "hash_sha256": "a1b2c3..."
}
```

كلّ من يمسح الـ QR يحصل على صفحة تحقّق رسميّة لا تتطلّب أن يكون لديه حساب.

## النقاط الرئيسيّة

### Courses
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/knowledge/courses` | إنشاء دورة |
| `GET` | `/v1/knowledge/courses/{id}` | تفاصيل |
| `POST` | `/v1/knowledge/courses/{id}/lessons` | إضافة درس |
| `POST` | `/v1/knowledge/courses/{id}/quizzes` | إضافة اختبار |

### Enrollments
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/knowledge/enrollments` | تسجيل طالب |
| `GET` | `/v1/knowledge/enrollments/{id}/progress` | نسبة الإنجاز |
| `POST` | `/v1/knowledge/enrollments/{id}/complete` | إنهاء + إصدار شهادة |

### Certificates
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `POST` | `/v1/knowledge/certificates` | إصدار شهادة |
| `GET` | `/v1/knowledge/certificates/{id}` | تفاصيل |
| `GET` | `/v1/knowledge/verify/{qr_token}` | تحقّق عموميّ (لا key) |
| `POST` | `/v1/knowledge/certificates/{id}/revoke` | إبطال |

### Skills
| Method | المسار | الوظيفة |
|--------|--------|---------|
| `GET` | `/v1/knowledge/skills` | شجرة المهارات |
| `GET` | `/v1/knowledge/skills/{slug}/courses` | دورات تطوّر مهارة |

## التسعير

| البند | السعر |
|-------|------|
| المؤسّسة — base/شهر | **100 DZD** (حتّى 50 طالب) |
| طالب إضافيّ فوق الـ 50 | **20 DZD/شهر** |
| إصدار شهادة | **5 DZD** |
| تحقّق عموميّ (لا key) | مجاناً |
| AI Tutor query | **2 DZD/استعلام** |

في Sandbox: 10 طلاب، 100 شهادة/شهر، AI Tutor محدود.

## أمثلة بـ SDK

```javascript
// أنشئ دورة + درس + اختبار
const course = await tk.knowledge.courses.create({
  title: 'إدارة الصيدليّة المعاصرة',
  language: 'ar-DZ',
  duration_hours: 12,
  skills: ['pharmacy_management', 'dgi_compliance'],
});

await tk.knowledge.lessons.create({
  courseId: course.id,
  title: 'الفاتورة الإلكترونيّة',
  content: '# مقدّمة\n...',
  video_url: 'https://...',
});

// تسجيل طالب
const enrollment = await tk.knowledge.enrollments.create({
  courseId: course.id,
  studentId: 'usr_8xk2',
});
```

```php
$course = $tk->knowledge->courses->create([
    'title' => 'إدارة الصيدليّة',
    'language' => 'ar-DZ',
    'duration_hours' => 12,
]);
```

## شهادة قابلة للتحقّق

كلّ شهادة:
- موقَّعة بـ SHA-256 hash
- مرتبطة بـ Décret 20-254 academic standing
- صالحة دائماً (إلّا إذا revoked)
- قابلة للتحقّق بدون account: فقط مسح QR

صفحة التحقّق `verify.tkawen.com/cert_8xk2` تعرض:
- اسم المؤسّسة المُصدِرة
- تاريخ الإصدار
- المهارات المُكتسبة
- حالة الصلاحيّة (live/revoked)
- توقيع TKAWEN الرقميّ

## AI Tutor (Ollama سياديّ)

```bash
curl -X POST https://api.tkawen.com/v1/knowledge/ai-tutor \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "course_id": "crs_abc",
    "question": "ما الفرق بين TVA و IBS؟",
    "language": "ar-DZ"
  }'
```

الذكاء الاصطناعيّ يستجيب بناءً على محتوى الدورة فقط — لا hallucination خارج المنهج. مُدرَّب على Ollama محلّياً، **بيانات الطالب لا تغادر VPS الجزائر**.

## Webhooks

```
course.created          course.published
enrollment.created      enrollment.completed
certificate.issued      certificate.revoked
quiz.submitted          quiz.passed
ai_tutor.queried
```

## روابط

- المنتج الاستهلاكيّ: [algeriacertify.com](https://algeriacertify.com)
- التحقّق: [verify.tkawen.com](https://verify.tkawen.com)
- الكاتالوغ: [catalogue.tkawen.com](https://catalogue.tkawen.com)
- التالي: [06 · اللوجستيك](/pillars/logistics/)
