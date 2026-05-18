---
title: 05 · Knowledge
description: TKAWEN Knowledge — courses, AI tutors, and tamper-proof certificates with public QR verification.
---

## Overview

**TKAWEN Knowledge** powers learning and credentialing for product teams, schools, training organizations, and certification authorities:

- **LMS** — lessons, assignments, quizzes, progress tracking
- **Certificates** — QR-verifiable, tamper-proof via SHA-256 hashing
- **Trainer marketplace** — unified instructor accounts under TKAWEN ID
- **Skills taxonomy** — indexed skill tree linking courses to job market signals
- **AI Tutors** — context-bound LLM tutors that won't hallucinate outside the syllabus

Replaces **Teachable, Coursera, Credly**.

## Quick start

```bash
# Issue a verifiable certificate
curl -X POST https://api.tkawen.com/v1/knowledge/certificates \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_id": "usr_8xk2",
    "course_id": "crs_abc",
    "title": "Advanced React Patterns — Completion Certificate",
    "issued_by": "Your Academy",
    "issued_date": "2026-05-18",
    "skills": ["react_advanced", "state_management"]
  }'
```

Response:

```json
{
  "certificate_id": "cert_8xk2",
  "qr_url": "https://verify.tkawen.com/cert_8xk2",
  "pdf_url": "https://api.tkawen.com/v1/knowledge/certificates/cert_8xk2.pdf",
  "verified_until": "permanent",
  "hash_sha256": "a1b2c3..."
}
```

Anyone scanning the QR sees an official verification page — no account required.

## Endpoints

### Courses
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/knowledge/courses` | Create a course |
| `GET` | `/v1/knowledge/courses/{id}` | Course details |
| `POST` | `/v1/knowledge/courses/{id}/lessons` | Add a lesson |
| `POST` | `/v1/knowledge/courses/{id}/quizzes` | Add a quiz |

### Enrollments
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/knowledge/enrollments` | Enroll a student |
| `GET` | `/v1/knowledge/enrollments/{id}/progress` | Completion percentage |
| `POST` | `/v1/knowledge/enrollments/{id}/complete` | Finalise + issue certificate |

### Certificates
| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/knowledge/certificates` | Issue a certificate |
| `GET` | `/v1/knowledge/certificates/{id}` | Details |
| `GET` | `/v1/knowledge/verify/{qr_token}` | Public verification (no auth) |
| `POST` | `/v1/knowledge/certificates/{id}/revoke` | Revoke |

### Skills
| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/knowledge/skills` | Skills tree |
| `GET` | `/v1/knowledge/skills/{slug}/courses` | Courses that develop a skill |

## Pricing

| Item | Price |
|------|-------|
| Organisation base / month | **$1.00** (up to 50 students) |
| Additional student / month | **$0.20** |
| Certificate issuance | **$0.05** |
| Public verification (no key) | Free |
| AI Tutor query | **$0.02** |

Sandbox: 10 students, 100 certificates / month, limited AI Tutor.

## SDK examples

```javascript
// Create a course + lesson
const course = await tk.knowledge.courses.create({
  title: 'Advanced React Patterns',
  language: 'en',
  duration_hours: 12,
  skills: ['react_advanced', 'state_management'],
});

await tk.knowledge.lessons.create({
  courseId: course.id,
  title: 'useReducer in practice',
  content: '# Introduction\n...',
  video_url: 'https://...',
});

// Enroll a student
const enrollment = await tk.knowledge.enrollments.create({
  courseId: course.id,
  studentId: 'usr_8xk2',
});
```

```php
$course = $tk->knowledge->courses->create([
    'title' => 'Advanced React Patterns',
    'language' => 'en',
    'duration_hours' => 12,
]);
```

## Verifiable certificate

Every certificate is:

- Signed with SHA-256 hash
- Permanently valid (unless explicitly revoked)
- Verifiable without an account — anyone scanning the QR gets a public page
- Issued under your organisation's branding, not TKAWEN's

The public verification page at `verify.tkawen.com/cert_8xk2` shows:

- Issuing organisation
- Issue date
- Skills acquired
- Validity state (live / revoked)
- TKAWEN digital signature

## AI Tutor

```bash
curl -X POST https://api.tkawen.com/v1/knowledge/ai-tutor \
  -H "Authorization: Bearer $TKAWEN_KEY" \
  -d '{
    "course_id": "crs_abc",
    "question": "Explain the difference between useState and useReducer.",
    "language": "en"
  }'
```

The AI Tutor responds based on course content only — no hallucination outside the syllabus. Student data stays within your organisation's tenant.

## Webhooks

```
course.created          course.published
enrollment.created      enrollment.completed
certificate.issued      certificate.revoked
quiz.submitted          quiz.passed
ai_tutor.queried
```

## Related

- Consumer product: [algeriacertify.com](https://algeriacertify.com)
- Verification page: [verify.tkawen.com](https://verify.tkawen.com)
- Next: [06 · Logistics](/pillars/logistics/)
