# Authorized Curriculum Corpus Policy (Jordan Data Residency)

1. **Zero Copyrighted Textbook Scraping**: No copyrighted Jordanian textbook prose or unlicensed third-party materials may be committed or ingested into `data/ai/corpus/`.
2. **Permitted Sources**:
   - Operator-provided authorized standards metadata and learning outcomes.
   - Public/open-license Ministry of Education learning standards codes (`JO-MOE-*`).
   - Authorized Pearson BTEC International Level 3 unit specification descriptors (`JO-MOE-BTEC-*`).
3. **Mandatory Verification**: Every corpus item in `manifest.example.json` must carry `licenseVerified: true` and `containsStudentPii: false`.
