import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChat } from "../../../features/ai-chat/ui/AIChat";
import {
  CryptoVault,
  EnvelopeCiphertextPayload,
} from "../../../packages/infrastructure/src/security/crypto-vault";
import { KeyRotationManager } from "../../../packages/infrastructure/src/security/key-rotation";
import { AuditSink } from "../../../packages/infrastructure/src/security/audit-sink";
import { POST as analyzeVisionPost } from "../../../apps/api/src/app/api/vision/analyze/route";
import { POST as privacyErasurePost } from "../../../apps/api/src/app/api/privacy/erasure/route";
import { POST as adminBackupsPost } from "../../../apps/api/src/app/api/admin/backups/route";
import {
  ShieldCheck,
  Eye,
  Lock,
  Scale,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  DatabaseBackup,
} from "lucide-react";

export function JordanEduPlatformSuite() {
  const [activeSubModule, setActiveSubModule] = useState<
    "grounded-rag" | "vision-formative" | "crypto-vault" | "privacy-portal"
  >("grounded-rag");

  // Vision Formative State
  const [visionNotes, setVisionNotes] = useState(
    "قمت بتصميم طوبولوجيا الشبكة للمدرسة في عمان مع توزيع VLANs، رقم هاتفي للاستفسار 0795544332.",
  );
  const [visionSubject, setVisionSubject] = useState<
    "IT-SYSTEMS" | "CYBER-SECURITY" | "STEM-PHYSICS"
  >("IT-SYSTEMS");
  const [visionResult, setVisionResult] = useState<{
    visionJobId: string;
    traceId: string;
    answerAr: string;
    confidenceScore: number;
    groundednessScore: number;
    teacherReviewRequired: boolean;
    piiRedactedCount: number;
  } | null>(null);

  // Crypto Vault State
  const [vaultPlaintext, setVaultPlaintext] = useState(
    "توصية تربوية خاصة: منح الطالب وقتاً إضافياً بنسبة 25% في جلسات المحاكاة العملية.",
  );
  const [vaultAad, setVaultAad] = useState("school-amman-01:student-105");
  const [sealedEnvelope, setSealedEnvelope] = useState<EnvelopeCiphertextPayload | null>(null);
  const [unsealedOutput, setUnsealedOutput] = useState<string | null>(null);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [keyVersions, setKeyVersions] = useState(() => KeyRotationManager.listKeyVersions());

  // Privacy & Dual-Control Governance State
  const [privacyStatusMsg, setPrivacyStatusMsg] = useState<string | null>(null);
  const [privacyIsError, setPrivacyIsError] = useState(false);

  const handleRunVisionAnalysis = async () => {
    const res = await analyzeVisionPost({
      schoolId: "school-amman-01",
      studentId: "student-amman-105",
      gradeLevel: "G11-BTEC",
      subjectCode: visionSubject,
      mimeType: "image/png",
      imageSizeBytes: 420_000,
      imageDigestSha256: "sha256-9f86d081884c7d659a2feaa0c55ad015",
      studentNotes: visionNotes,
      consentVerified: true,
    });

    if (res.status === 200 && "visionJobId" in res.body) {
      setVisionResult({
        visionJobId: res.body.visionJobId,
        traceId: res.body.traceId,
        answerAr: res.body.answerAr,
        confidenceScore: res.body.confidenceScore,
        groundednessScore: res.body.groundednessScore,
        teacherReviewRequired: res.body.teacherReviewRequired,
        piiRedactedCount: res.body.piiRedactedCount,
      });
    }
  };

  const handleSealField = () => {
    setVaultError(null);
    setUnsealedOutput(null);
    const res = CryptoVault.sealField(vaultPlaintext, vaultAad);
    if (res.isFailure) {
      setVaultError(res.error.message);
      return;
    }
    setSealedEnvelope(res.value);
  };

  const handleUnsealField = (tamperIntegrity = false) => {
    if (!sealedEnvelope) {
      return;
    }
    setVaultError(null);
    const candidate: EnvelopeCiphertextPayload = tamperIntegrity
      ? { ...sealedEnvelope, hmacIntegrityHex: "0000000000000000" + sealedEnvelope.hmacIntegrityHex.slice(16) }
      : sealedEnvelope;

    const res = CryptoVault.unsealField(candidate, vaultAad);
    if (res.isFailure) {
      setUnsealedOutput(null);
      setVaultError(`${res.error.code}: ${res.error.message}`);
      return;
    }
    setUnsealedOutput(res.value);
  };

  const handleRotateKey = () => {
    const nextVersion = `kms-jo-kek-v${keyVersions.length + 1}`;
    KeyRotationManager.rotateMasterKey(nextVersion);
    setKeyVersions(KeyRotationManager.listKeyVersions());
  };

  const handleTriggerGovernedErasure = async (attemptForbiddenNuke: boolean) => {
    const res = await privacyErasurePost({
      schoolId: "school-amman-01",
      requesterId: "parent-guardian-88",
      requesterRole: "parent",
      targetStudentId: "student-amman-105",
      requestType: "RIGHT_TO_ERASURE",
      dualControlApproverId: "dpo-officer-amman-01",
      mfaVerified: true,
      reasonAr: "طلب ولي الأمر لمسح مسودات الصور التكوينية بعد انتهاء الفصل الدراسي وفق قانون حماية البيانات الشخصية الأردني.",
      requestedEndpointAlias: attemptForbiddenNuke ? "/nuke" : undefined,
    });

    if (res.status >= 400 && "message" in res.body) {
      setPrivacyIsError(true);
      setPrivacyStatusMsg(`[HTTP ${res.status} — ${res.body.errorCode}] ${res.body.message}`);
    } else if ("workflowTicketId" in res.body) {
      setPrivacyIsError(false);
      setPrivacyStatusMsg(
        `تم اعتماد طلب المسح المحكوم بنجاح — رقم التذكرة: ${res.body.workflowTicketId} · الحالة: ${res.body.status} · بمصادقة مزدوجة من: ${res.body.dualControlApproverId}`,
      );
    }
  };

  const handleTriggerGovernedBackup = async (singleActorRestoreAttempt: boolean) => {
    const res = await adminBackupsPost({
      schoolId: "school-amman-01",
      adminActorId: "admin-ops-01",
      secondaryApproverId: singleActorRestoreAttempt ? "admin-ops-01" : "sec-lead-02",
      operation: singleActorRestoreAttempt ? "PRODUCTION_RESTORE" : "CREATE_ENCRYPTED_SNAPSHOT",
      mfaVerified: true,
    });

    if (res.status >= 400 && "message" in res.body) {
      setPrivacyIsError(true);
      setPrivacyStatusMsg(`[HTTP ${res.status} — ${res.body.errorCode}] ${res.body.message}`);
    } else if ("backupArtifactId" in res.body) {
      setPrivacyIsError(false);
      setPrivacyStatusMsg(
        `تم إنشاء النسخة الاحتياطية المشفرة بنجاح — المعرف: ${res.body.backupArtifactId} · مفتاح التشفير: ${res.body.encryptionKeyVersion}`,
      );
    }
  };

  const auditEvents = AuditSink.getEvents();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400">
              <span>JORDAN EDU AI PLATFORM v101</span>
              <span aria-hidden="true">·</span>
              <span>DATA RESIDENCY: JO-AMMAN-1</span>
              <span aria-hidden="true">·</span>
              <span>JORDAN PDPL 2023 COMPLIANT</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              المنظومة الهندسية الموحدة للتعليم الذكي وحوكمة الخصوصية (Jordan Edu AI Suite)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              تطبيق عملي مباشر للمواصفات المعمارية الإلزامية: المعلم الذكي المجذّر بالمناهج المعتمدة، التحليل البصري التكويني للواجبات بضمان مراجعة المعلم، الخزنة التشفيرية المغلفة (AES-256-GCM + HMAC)، وبوابة حقوق البيانات والمصادقة المزدوجة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubModule("grounded-rag")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubModule === "grounded-rag"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              المعلم الموثق (RAG)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubModule("vision-formative")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubModule === "vision-formative"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              تحليل صور الواجبات (Vision)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubModule("crypto-vault")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubModule === "crypto-vault"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              الخزنة التشفيرية (Crypto Vault)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubModule("privacy-portal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubModule === "privacy-portal"
                  ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              بوابة الخصوصية والنسخ الاحتياطي
            </button>
          </div>
        </div>
      </div>

      {/* Sub-module 1: Grounded AI Chat */}
      {activeSubModule === "grounded-rag" && <AIChat />}

      {/* Sub-module 2: Vision Homework Formative Analysis */}
      {activeSubModule === "vision-formative" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Eye className="h-4 w-4 text-sky-600" />
                <span>POST /api/vision/analyze</span>
                <span aria-hidden="true">·</span>
                <span>EPHEMERAL PROCESSING</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                تحليل صور الواجبات للتغذية الراجعة التكوينية (بإشراف المعلم الإلزامي)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
              NO AUTONOMOUS FINAL GRADING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  المادة والمعيار المرجعي
                </label>
                <select
                  value={visionSubject}
                  onChange={(e) =>
                    setVisionSubject(
                      e.target.value as "IT-SYSTEMS" | "CYBER-SECURITY" | "STEM-PHYSICS",
                    )
                  }
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="IT-SYSTEMS">JO-MOE-BTEC-L3-U1-A1 — أنظمة تكنولوجيا المعلومات</option>
                  <option value="CYBER-SECURITY">JO-MOE-BTEC-L3-U6-B2 — أمن الشبكات والتشفير</option>
                  <option value="STEM-PHYSICS">JO-MOE-STEM-G10-PHYS-04 — الفيزياء التطبيقية</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  وصف خطوات حل الطالب المرفقة مع صورة الواجب (يتم تنقيح أي هاتف أو رقم وطني)
                </label>
                <textarea
                  rows={4}
                  value={visionNotes}
                  onChange={(e) => setVisionNotes(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs leading-relaxed"
                />
              </div>

              <Button
                onClick={handleRunVisionAnalysis}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
              >
                <FileCheck2 className="h-4 w-4 ml-1.5" />
                <span>تحليل الواجب تكوينياً وإحالته لمراجعة المعلم</span>
              </Button>
            </div>

            <div className="lg:col-span-6">
              {visionResult ? (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span>JOB: {visionResult.visionJobId}</span>
                    <span>TRACE: {visionResult.traceId}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {visionResult.answerAr}
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      التجذير: {Math.round(visionResult.groundednessScore * 100)}%
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      تنقيح PII: {visionResult.piiRedactedCount} عنصر
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                      teacherReviewRequired: {String(visionResult.teacherReviewRequired)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[200px] p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-xs text-slate-500 text-center">
                  اضغط على "تحليل الواجب تكوينياً" لمعاينة التغذية الراجعة الموثقة وبوابة مراجعة المعلم.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-module 3: Envelope Crypto Vault & KMS Key Rotation */}
      {activeSubModule === "crypto-vault" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Lock className="h-4 w-4 text-sky-600" />
                <span>packages/infrastructure/src/security/crypto-vault.ts</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                الخزنة التشفيرية المغلفة وتدوير مفاتيح KMS (AES-256-GCM Envelope + HMAC-SHA256)
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotateKey}
              className="text-xs h-8"
            >
              <KeyRound className="h-3.5 w-3.5 ml-1.5 text-sky-600" />
              <span>تدوير المفتاح الرئيسي (Rotate Master KEK)</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  البيانات الحساسة المراد تشفيرها على مستوى الحقل (Field-Level Envelope Encryption)
                </label>
                <textarea
                  rows={3}
                  value={vaultPlaintext}
                  onChange={(e) => setVaultPlaintext(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  سياق المصادقة الإضافي (Associated Authenticated Data — AAD)
                </label>
                <input
                  type="text"
                  value={vaultAad}
                  onChange={(e) => setVaultAad(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleSealField}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs"
                >
                  تشفير وإنشاء مغلف (Seal Field)
                </Button>
                {sealedEnvelope && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleUnsealField(false)}
                      className="text-xs"
                    >
                      فك التشفير والتحقق (Unseal Verified)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUnsealField(true)}
                      className="text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
                    >
                      محاكاة تلاعب بالمغلف (Tamper Test)
                    </Button>
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  سجل إصدارات مفاتيح KMS/Vault النشطة والسابقة:
                </span>
                <div className="space-y-1.5">
                  {keyVersions.map((kv) => (
                    <div
                      key={kv.keyVersionId}
                      className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    >
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {kv.keyVersionId}
                      </span>
                      <span
                        className={
                          kv.status === "ACTIVE" ? "text-emerald-600 font-bold" : "text-slate-500"
                        }
                      >
                        {kv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {vaultError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-mono text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{vaultError}</span>
                </div>
              )}

              {unsealedOutput && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                  <div className="font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تم التحقق من HMAC-SHA256 و AuthTag وفك التشفير بنجاح:</span>
                  </div>
                  <p>{unsealedOutput}</p>
                </div>
              )}

              {sealedEnvelope ? (
                <pre className="p-4 rounded-xl bg-slate-950 text-sky-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {JSON.stringify(sealedEnvelope, null, 2)}
                </pre>
              ) : (
                <div className="h-full min-h-[200px] p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-xs text-slate-500 text-center">
                  اضغط على "تشفير وإنشاء مغلف" لتوليد حمولة التشفير المغلف وفحص سلامة HMAC.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-module 4: Privacy Erasure Portal & Dual-Control Backup Governance */}
      {activeSubModule === "privacy-portal" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Scale className="h-4 w-4 text-sky-600" />
                <span>POST /api/privacy/erasure · POST /api/admin/backups</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                بوابة حقوق البيانات لولي الأمر والطالب وحوكمة النسخ الاحتياطي بالمصادقة المزدوجة
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              DUAL-CONTROL & MFA ENFORCED
            </span>
          </div>

          {privacyStatusMsg && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                privacyIsError
                  ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                  : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              }`}
            >
              {privacyIsError ? (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              ) : (
                <ShieldCheck className="h-4 w-4 shrink-0" />
              )}
              <span>{privacyStatusMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. حوكمة مسح البيانات وسحب الموافقة (بديل مسار /nuke المحظور)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                يخضع أي طلب مسح بيانات لقانون حماية البيانات الشخصية الأردني، ويتطلب تحققاً ثنائياً (MFA) وموافقة مسؤول حماية بيانات مستقل (Dual-Control)، مع حظر المسارات التدميرية الفردية.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleTriggerGovernedErasure(false)}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs"
                >
                  تنفيذ طلب مسح قانوني محكوم (Dual-Control)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerGovernedErasure(true)}
                  className="text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
                >
                  اختبار حظر المسار المحظور (/nuke)
                </Button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DatabaseBackup className="h-4 w-4 text-sky-600" />
                <span>2. النسخ الاحتياطي المشفر والاستعادة المزدوجة (PITR Backups)</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                يتم تشفير النسخ الاحتياطية لقاعدة بيانات PostgreSQL 16 بمفتاح KMS النشط، وتُرفض أي عملية استعادة إنتاجية بدون موافقة مسؤول ثانٍ مستقل.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleTriggerGovernedBackup(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                >
                  إنشاء لقطة احتياطية مشفرة (Encrypted Snapshot)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerGovernedBackup(true)}
                  className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  اختبار منع الاستعادة الفردية بدون مصادقة مزدوجة
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              أحدث سجلات التدقيق المنقحة من البيانات الشخصية (AuditSink Events — {auditEvents.length}):
            </span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
              {auditEvents.slice(0, 6).map((ev) => (
                <div
                  key={ev.eventId}
                  className="p-2.5 rounded-lg bg-slate-950 text-slate-200 flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="text-sky-400 font-bold">{ev.action}</span>
                  <span>trace: {ev.traceId}</span>
                  <span>PII Redacted: {ev.piiRedactedCount}</span>
                  <span
                    className={
                      ev.outcome === "DENIED" ? "text-rose-400 font-bold" : "text-emerald-400"
                    }
                  >
                    {ev.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
