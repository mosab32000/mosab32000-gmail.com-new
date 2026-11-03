# ADR-001: Jordan Data-Residency-First Architecture, Approved TypeScript Stack & Controlled Exceptions

- **Status**: Accepted & Enforced
- **Date**: 2026-11-03
- **Context**: Jordanian Educational AI Platform (BTEC & Ministry Authorized Curriculum)

## 1. Decision Summary
We reconcile legacy script-oriented prototypes (`app.py`, `quantum_vault.py`, `ai_analytics.py`, `sqlite3`, `/nuke`) into a strict, auditable TypeScript monorepo architecture compliant with the **Jordan Personal Data Protection Law No. 24 of 2023** and international educational fairness standards.

## 2. Binding Legacy-to-Production Mapping
1. **`app/app.py` → `apps/api/src/app/api/**/route.ts`**: Clean Architecture route handlers with mandatory Zod validation, RBAC/ABAC, and minor consent verification.
2. **`app/quantum_vault.py` → `packages/infrastructure/src/security/crypto-vault.ts`**: Vetted AES-256-GCM envelope encryption with per-record data encryption keys (DEKs), HMAC-SHA256 integrity tags, and key rotation via KMS/Vault.
3. **`app/ai_analytics.py` → `packages/infrastructure/src/ai/rag-orchestrator.ts`**: Grounded RAG strictly filtered by `schoolId`, `gradeLevel`, `subjectCode`, and verified curriculum license metadata. Autonomous final grading is strictly prohibited (`teacherReviewRequired: true`).
4. **`/nuke` endpoint → `/api/privacy/erasure` & `/api/admin/backups`**: Unguarded destructive endpoints are banned and rejected at the routing and security guard layers. Data erasure requires guardian/data-subject verification, legal retention checks, dual-control approval, and immutable audit logging.

## 3. Controlled Exceptions
- **Kafka**: Restricted to asynchronous domain events (`AIChatRequested`, `VisionJobCreated`, `PrivacyErasureRequested`) via the transactional outbox pattern.
- **Vision Homework Analysis**: Ephemeral image processing with mandatory PII redaction and formative-only feedback gated by teacher review.
