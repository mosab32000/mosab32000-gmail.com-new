# Feature Slice: Grounded AI Chat (`features/ai-chat`)

## Architectural Rules
- **Feature-Sliced Design**: Separated into `ui/`, `model/`, `api/`, and `lib/`.
- **Grounded Curriculum Only**: Queries are executed through `GroundedRagOrchestrator` against authorized open-metadata and Pearson BTEC syllabus descriptors.
- **Minor Protection & Consent**: Requires verified parental/school consent (`consentVerified: true`) and automatically redacts Jordanian National IDs, mobile numbers, emails, and tokens before processing.
- **No Autonomous Final Grading**: Any grade/assessment inquiry automatically sets `teacherReviewRequired: true`.
