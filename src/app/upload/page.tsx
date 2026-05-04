"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Upload, Loader2, CheckCircle2, AlertTriangle, Sparkles, FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * Self-serve upload — patient uploads PDFs/images of any tests they
 * already have. Each section is its own drop zone so we can route the
 * file to the right AI extractor. Multi-section uploads run sequentially
 * (one AI call at a time) so the patient sees progress per section.
 */

const SECTIONS = [
  { key: "blood",         label: "Blood Report",      icon: "🩸", hint: "CBC, lipids, sugar, thyroid, vitamins…" },
  { key: "urine",         label: "Urine Analysis",    icon: "🧪", hint: "Routine urine + microalbumin" },
  { key: "dexa",          label: "DEXA Scan",         icon: "🦴", hint: "Body composition + bone density" },
  { key: "calcium_score", label: "Calcium Score",     icon: "💛", hint: "Coronary calcium / Agatston score" },
  { key: "ecg",           label: "ECG",               icon: "💓", hint: "Heart rate, rhythm, intervals" },
  { key: "chest_xray",    label: "Chest X-Ray",       icon: "🫁", hint: "Lung fields + mediastinum" },
  { key: "usg",           label: "Ultrasound (USG)",  icon: "🔊", hint: "Abdomen, pelvis, neck…" },
  { key: "mri",           label: "MRI",               icon: "🧲", hint: "Whole-body / regional" },
] as const;

type SectionStatus = "idle" | "uploading" | "done" | "error";

interface SectionState {
  status: SectionStatus;
  message?: string;
  findingsCount?: number;
}

export default function UploadPage() {
  const router = useRouter();
  const [reportId, setReportId] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<Record<string, SectionState>>({});
  const [finalizing, setFinalizing] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?next=/upload");
      return;
    }
    api.selfUpload
      .start()
      .then((r) => {
        setReportId(r.report_id);
        // Mark sections that already have data as "done"
        const next: Record<string, SectionState> = {};
        for (const s of r.uploaded_sections) {
          next[s] = { status: "done", message: "Already uploaded" };
        }
        setStatuses(next);
      })
      .catch((e) => setGlobalError(e instanceof Error ? e.message : String(e)));
  }, [router]);

  async function handleFile(sectionKey: string, file: File) {
    if (!reportId) return;
    setStatuses((s) => ({ ...s, [sectionKey]: { status: "uploading" } }));
    try {
      const r = await api.selfUpload.upload(reportId, sectionKey, file);
      setStatuses((s) => ({
        ...s,
        [sectionKey]: {
          status: "done",
          message: `Read ${r.extracted_param_count} parameters`,
          findingsCount: r.findings_count,
        },
      }));
    } catch (e) {
      setStatuses((s) => ({
        ...s,
        [sectionKey]: { status: "error", message: e instanceof Error ? e.message : String(e) },
      }));
    }
  }

  async function viewReport() {
    if (!reportId) return;
    setFinalizing(true);
    try {
      await api.selfUpload.finalize(reportId);
      router.push(`/report/${reportId}`);
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : String(e));
      setFinalizing(false);
    }
  }

  const completedCount = Object.values(statuses).filter((s) => s.status === "done").length;
  const hasAny = completedCount > 0;
  const anyUploading = Object.values(statuses).some((s) => s.status === "uploading");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-black/5 bg-cream/95 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-zen-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zen-700">Upload existing reports</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8">
          <h1 className="text-[28px] font-extrabold text-zen-900 leading-tight">
            Upload reports you already have
          </h1>
          <p className="mt-3 text-[14px] text-gray-600 leading-relaxed">
            Drop a PDF or photo of any blood test, MRI, DEXA, ECG, X-ray, ultrasound or calcium-score report.
            Our AI reads it, classifies severity and builds a partial Zen Report. The more you upload, the
            more complete the picture.
          </p>
          <div className="mt-4 inline-flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[12px] text-amber-700 ring-1 ring-amber-100">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>This is a partial assessment based on what you upload — not a substitute for a full ZenScan.</span>
          </div>
        </section>

        {globalError && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
            {globalError}
          </div>
        )}

        {/* Section grid */}
        <section className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => {
            const st = statuses[s.key]?.status ?? "idle";
            const msg = statuses[s.key]?.message;
            const isDone = st === "done";
            const isUploading = st === "uploading";
            const isError = st === "error";
            return (
              <div
                key={s.key}
                className={cn(
                  "rounded-2xl bg-white px-4 py-4 ring-1 transition-all",
                  isDone ? "ring-emerald-200" : isError ? "ring-red-200" : "ring-black/5",
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-[22px] leading-none flex-shrink-0">{s.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-zen-900 leading-tight">{s.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{s.hint}</p>
                    </div>
                  </div>
                  {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                  {isError && <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                </div>

                <input
                  ref={(el) => { fileRefs.current[s.key] = el; }}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(s.key, f);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileRefs.current[s.key]?.click()}
                  disabled={isUploading || !reportId}
                  className={cn(
                    "mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors disabled:opacity-50",
                    isDone
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-zen-900 text-white hover:bg-zen-800",
                  )}
                >
                  {isUploading ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading…</>
                  ) : isDone ? (
                    <><Upload className="h-3.5 w-3.5" /> Replace</>
                  ) : (
                    <><Upload className="h-3.5 w-3.5" /> Upload PDF / image</>
                  )}
                </button>

                {msg && (
                  <p className={cn(
                    "mt-2 text-[11px] leading-snug",
                    isDone ? "text-emerald-600" : isError ? "text-red-600" : "text-gray-500",
                  )}>
                    {msg}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* Footer CTA */}
        <section className="mt-10 rounded-2xl bg-white px-5 py-5 ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[13px] font-bold text-zen-900">
                {completedCount === 0
                  ? "Upload at least one report to get started"
                  : `${completedCount} of ${SECTIONS.length} test types uploaded`}
              </p>
              <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">
                You can come back anytime to add more reports — the picture sharpens with each upload.
              </p>
            </div>
            <button
              onClick={viewReport}
              disabled={!hasAny || finalizing || anyUploading}
              className="inline-flex items-center gap-2 rounded-xl bg-zen-900 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-zen-800 disabled:opacity-50 transition-colors"
            >
              {finalizing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Building report…</>
              ) : (
                <><FileText className="h-4 w-4" /> View my report</>
              )}
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
          Want a complete picture? Book a <Link href="/book" className="font-semibold text-zen-700 hover:underline">ZenScan</Link>{" "}
          — covers all 8 test types in a single visit, with AI-generated priorities and a personal health plan.
        </p>
      </main>
    </div>
  );
}
