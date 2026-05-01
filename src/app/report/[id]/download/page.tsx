"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Share2, CheckCircle2, Loader2, Leaf } from "lucide-react";
import { api, Report } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

const DOWNLOADS = [
  {
    title: "Full ZenReport PDF",
    description: "Complete scan report with all findings, organ scores, and AI insights",
    icon: FileText,
    tag: "Recommended",
    size: "~4.2 MB",
  },
  {
    title: "Executive Summary",
    description: "One-page summary of your ZenScore and top health priorities",
    icon: FileText,
    tag: "Quick share",
    size: "~0.8 MB",
  },
  {
    title: "Lab Data (CSV)",
    description: "Raw biomarker and blood test values for your own records or physician",
    icon: FileText,
    tag: "Data export",
    size: "~0.1 MB",
  },
];

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const reportId = parseInt(id);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    api.reports.get(reportId).then(setReport).finally(() => setLoading(false));
  }, [reportId, router]);

  function simulateDownload(index: number) {
    setTimeout(() => {
      setDownloaded((d) => new Set([...d, index]));
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
          </Link>
          <Link
            href={`/report/${reportId}`}
            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-zen-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to report
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-[60px] pb-20">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          {/* Page header */}
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">ZenReport · Downloads</p>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">Download &amp; share.</h1>
            {report && (
              <p className="mt-3 text-[14px] text-gray-500">
                {report.patient_name}{report.report_date ? ` · ${new Date(report.report_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-zen-600" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Download cards */}
              <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
                {DOWNLOADS.map((item, i) => {
                  const Icon = item.icon;
                  const done = downloaded.has(i);
                  return (
                    <div key={i} className="flex items-center gap-5 px-6 py-5 border-b border-black/5 last:border-0">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cream-dark">
                        <Icon className="h-6 w-6 text-zen-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] font-bold text-zen-900">{item.title}</p>
                          <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-gray-500">{item.description}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">{item.size}</p>
                      </div>
                      <button
                        onClick={() => simulateDownload(i)}
                        className={
                          done
                            ? "flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-[12px] font-bold text-emerald-600"
                            : "flex items-center gap-1.5 rounded-full bg-zen-900 px-4 py-2 text-[12px] font-bold text-white hover:bg-zen-800 transition-colors"
                        }
                      >
                        {done ? (
                          <><CheckCircle2 className="h-4 w-4" /> Saved</>
                        ) : (
                          <><Download className="h-4 w-4" /> Download</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Share section */}
              <div className="rounded-2xl bg-zen-900 p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-[1.25rem] leading-snug text-white">Share with your doctor.</h2>
                    <p className="mt-1.5 text-[13px] text-white/60 leading-relaxed">
                      Generate a secure, time-limited link to share your ZenReport with your physician.
                    </p>
                    <button className="mt-4 rounded-full border border-white/20 px-6 py-2.5 text-[12px] font-semibold text-white hover:border-white/40 transition-colors">
                      Generate Secure Link
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-[11px] text-gray-400 pt-2">
                Your report is encrypted and only accessible to you. ZenLife does not share your health data with third parties.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-300">© 2025 ZenLife Health Intelligence</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[11px] text-gray-400 hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-gray-400 hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
