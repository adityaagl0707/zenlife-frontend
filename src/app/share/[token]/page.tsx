"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Download,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://zenlife.health").replace(/\/api\/v1\/?$/, "");
const BASE = `${API_URL}/api/v1`;

type SharedReport = {
  id: number;
  is_published: boolean;
  patient_name: string;
  patient_age?: number;
  patient_gender?: string;
  booking_id?: string;
  coverage_index?: number;
  overall_severity?: string;
  report_date?: string;
  next_visit?: string;
  summary?: string;
  finding_counts?: { critical: number; major: number; minor: number; normal: number };
};

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [report, setReport] = useState<SharedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE}/reports/share/${token}`)
      .then(async (r) => {
        if (!r.ok) {
          const e = await r.json().catch(() => ({}));
          throw new Error(e.detail || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load shared report"))
      .finally(() => setLoading(false));
  }, [token]);

  async function downloadPdf() {
    const url = `${BASE}/reports/share/${token}/download/full.pdf`;
    const res = await fetch(url);
    if (!res.ok) {
      alert("Could not download report");
      return;
    }
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = `ZenReport_${(report?.patient_name || "Patient").replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 2000);
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="border-b border-black/5 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} priority />
            <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure shared report
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-zen-600" /></div>
        ) : error ? (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="font-display text-2xl text-zen-900">Link expired or invalid</h1>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <p className="mt-4 text-xs text-gray-400">Ask the patient to generate a new share link from their ZenLife dashboard.</p>
          </div>
        ) : !report?.is_published ? (
          <div className="rounded-2xl bg-white ring-1 ring-black/5 p-8 text-center">
            <h1 className="font-display text-2xl text-zen-900">Report not yet published</h1>
            <p className="mt-2 text-sm text-gray-500">This report is still being prepared. Please check back later.</p>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">ZenReport · Shared with physician</p>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">{report.patient_name}</h1>
            <p className="mt-2 text-[14px] text-gray-500">
              {report.patient_age ? `${report.patient_age} yrs · ` : ""}
              {report.patient_gender ? `${report.patient_gender} · ` : ""}
              Booking {report.booking_id}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 text-center">
                <p className="font-display text-[2.4rem] text-zen-900 leading-none">{report.coverage_index ?? "—"}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">ZenScore</p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 text-center">
                <p className="font-display text-[2.4rem] text-red-600 leading-none">{report.finding_counts?.critical ?? 0}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Critical</p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 text-center">
                <p className="font-display text-[2.4rem] text-amber-600 leading-none">{report.finding_counts?.major ?? 0}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Major</p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 text-center">
                <p className="font-display text-[2.4rem] text-yellow-600 leading-none">{report.finding_counts?.minor ?? 0}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Minor</p>
              </div>
            </div>

            {report.summary && (
              <section className="mt-10 rounded-2xl bg-white ring-1 ring-black/5 p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">AI Health Assessment</p>
                <p className="mt-3 text-[14px] text-gray-700 leading-relaxed">{report.summary}</p>
              </section>
            )}

            <div className="mt-10 flex justify-center">
              <button
                onClick={downloadPdf}
                className="inline-flex items-center gap-2 rounded-full bg-zen-900 px-8 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-lg"
              >
                <Download className="h-4 w-4" /> Download Full ZenReport (PDF)
              </button>
            </div>

            <p className="mt-8 text-center text-[11px] text-gray-400">
              This is a time-limited shared view. ZenLife does not retain your access logs.
            </p>
          </>
        )}
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-4xl px-6 py-5 text-center">
          <p className="text-[11px] text-gray-300">© 2025 ZenLife Health Intelligence</p>
        </div>
      </footer>
    </div>
  );
}
