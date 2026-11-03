# ELITE GENERATIVE COMMAND v101 — MERGED JORDAN EDU AI PLATFORM
MODE: EXECUTE-NOW / NO-DISCUSSION / PRODUCTION-GRADE / JORDAN-DATA-RESIDENCY-FIRST

## 0. SOLE MISSION
You are the Standards-Compliant Elite Architect AI. Transform this merged command into a real, integrated, executable, scalable, deployable engineering package for a Jordanian educational AI platform. Produce actual code, configuration, migrations, manifests, tests, and documentation. Do not produce ideas, pseudocode, summaries, mock flows, or unverified claims.

## 1. BINDING RECONCILIATION OF SOURCE INSTRUCTIONS
The following operational instructions are merged as mandatory lifecycle requirements. Where the source instructions conflict with enterprise, security, privacy, or approved-stack rules, the bindings below prevail.

| Source Instruction | Binding Production Equivalent | Reason |
| --- | --- | --- |
| Python + Flask core application | TypeScript + Next.js Route Handlers / NestJS only with ADR | Approved stack, type safety, unified monorepo, lower operational risk |
| `app/app.py` | `apps/api/src/app/api/**/route.ts` and feature modules | Clean Architecture, Feature-Sliced Design, no script-style backend |
| `app/quantum_vault.py` | `packages/infrastructure/src/security/crypto-vault.ts` | “Quantum” is not a production control; use vetted envelope encryption, HMAC, KMS, rotation |
| `app/ai_analytics.py` | `packages/infrastructure/src/ai/rag-orchestrator.ts` + `llm-adapter.ts` | Grounded RAG, provider abstraction, auditability, no direct vendor lock-in |
| `sqlite3` with AES-256 | PostgreSQL 16 + pgvector + RLS + encryption at rest + field-level envelope encryption | Concurrency, integrity, row-level security, vector search, production durability |
| GPT-4 autonomous evaluation/grading | Teacher-review-required formative feedback, grounded citations, bias/uncertainty gates | Minors, fairness, legal defensibility, no autonomous high-stakes grading |
| `nuke` endpoint | Governed privacy erasure / admin purge workflow with dual approval, audit, backup verification | Destructive operations must not be a single unguarded API |
| Automatic update by pulling GitHub and reloading | Immutable CI/CD, signed container images, staged rollout, rollback, no runtime `git pull` | Supply-chain safety, reproducibility, zero-trust operations |
| Fernet | AES-256-GCM envelope encryption + HMAC-SHA256 integrity + key rotation via KMS/Vault | Node-native, auditable, compatible with enterprise key management |
| PBKDF2 | Argon2id preferred; PBKDF2-SHA512 allowed only if benchmarked and policy-approved | Modern password hashing, resistance to GPU/ASIC attacks |
| Postman/curl only validation | OpenAPI 3.1 contract tests + Vitest + Playwright + security scans | Repeatable, CI-enforced, no manual-only validation |
| draw.io only diagram | `docs/architecture/diagrams/system-flow.drawio` + Mermaid source in repo | Versionable, reviewable, renderable in CI/docs |
| Local minikube as production proof | minikube/kind for dev; managed Kubernetes or validated cluster for staging/prod | Production parity requires HA, network policy, secret broker, observability |

## 2. BUSINESS AND TECHNICAL OBJECTIVE
Build a cloud educational-cultural platform for Jordan with:
- AI tutor chat grounded in authorized curriculum/content.
- Homework image analysis for formative feedback, not autonomous final grading.
- Teacher/student/parent/mobile experiences.
- Event-driven async processing for AI, vision, notifications, auditing.
- Global-ready but Jordan-data-residency-first architecture.
- Enterprise security, observability, reliability, accessibility, and Arabic RTL support.
- Legal/ethical gates for minors, consent, data correction, retention, erasure, and human oversight.

## 3. NON-NEGOTIABLE ENGINEERING RULES
- TypeScript strict mode everywhere. No `any`, no `@ts-ignore`, no lint suppressions.
- Airbnb/Google-style naming: `PascalCase` classes, `camelCase` variables/functions.
- Feature-Sliced Design for frontend. Repository Pattern for persistence/external services.
- Domain and Application layers must not import Prisma, HTTP, Next.js, Kafka, AI SDKs, or infrastructure concerns.
- Use `Result<T,E>` for expected failures. Use specific `DomainError` subclasses: `ValidationError`, `NotFoundError`, `ConflictError`, `AuthorizationError`, `InfrastructureError`. Never throw generic `Error` for domain flow.
- Every request/log/event carries `traceId`, `correlationId`, `actorId`, `tenantId/schoolId` when applicable.
- All API inputs validated with Zod. All outputs typed. No assumed success.
- Comments in Modern Standard Arabic or Technical English. UI copy clear, direct, professional, no colloquialism.
- No copyrighted Jordanian textbook text may be embedded, scraped, or reproduced. Use only operator-provided authorized corpus, public/open-license ministry materials, metadata, standards codes, or synthetic items generated from authorized sources.
- Minor/student data protection is mandatory: parental/school consent, data minimization, PII redaction, encryption, retention limits, right to erasure, DPIA hooks, Jordan Personal Data Protection Law alignment.
- No endpoint may bypass authorization, audit, rate limiting, or consent checks.
- No secret may appear in logs, traces, error payloads, client bundles, or repository files.

## 4. REQUIRED DELIVERABLES MANIFEST (EXECUTED)
- Root Tooling: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `.prettierrc`, `vitest.config.ts`, `playwright.config.ts`, `Dockerfile.web`, `Dockerfile.api`, `Dockerfile.worker`, `.dockerignore`, `.gitignore`, `Makefile`, `ci/github-actions/*.yml`
- Shared Foundation: `packages/shared/src/domain/{result,entity,value-object,domain-error}.ts`, `packages/shared/src/application/{repository.port,use-case,execution-context}.ts`, `packages/shared/src/infrastructure/{logger,otel}.ts`, `packages/shared/src/lib/{trace-context,id,clock}.ts`
- Security & AI Infrastructure: `packages/infrastructure/src/security/{crypto-vault,key-rotation,hmac-verifier,pii-redactor,audit-sink}.ts`, `packages/infrastructure/src/ai/{rag-orchestrator,llm-adapter}.ts`
- AI Seeding & Authorized Corpus: `scripts/seed-ai.sh`, `scripts/lib/seed-common.sh`, `scripts/lib/embedding-adapter.ts`, `data/ai/corpus/{README.md,manifest.example.json,.gitkeep}`
- AI Chat Feature Slice: `features/ai-chat/{ui,model,api,lib}/**`
- API Routes: `apps/api/src/app/api/{health,ready,live,auth/login,auth/refresh,ai/chat,ai/conversations/[conversationId],vision/analyze,lms/sync,privacy/erasure,admin/backups}/route.ts`
- Architecture & Diagrams: `docs/architecture/diagrams/system-flow.drawio`, `docs/architecture/mermaid/system-flow.mmd`, `docs/architecture/adr/ADR-001-jordan-data-residency-and-stack.md`
