"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  Share2,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { api, Report } from "@/lib/api";
import { isLoggedIn, getToken } from "@/lib/auth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://zenlife.health").replace(/\/api\/v1\/?$/, "");
const BASE = `${API_URL}/api/v1`;

const DOWNLOADS = [
  {
    title: "Full ZenReport PDF",
    description: "Complete scan report with all findings, organ scores, and AI insights",
    icon: FileText,
    tag: "Recommended",
    path: "full.pdf",
    fallbackName: "ZenReport.pdf",
  },
  {
    title: "Executive Summary",
    description: "One-page summary of your ZenScore and top health priorities",
    icon: FileText,
    tag: "Quick share",
    path: "summary.pdf",
    fallbackName: "ZenReport_Summary.pdf",
  },
  {
    title: "Lab Data (CSV)",
    description: "Raw biomarker and blood test values for your own records or physician",
    icon: FileText,
    tag: "Data export",
    path: "lab-data.csv",
    fallbackName: "ZenReport_LabData.csv",
  },
];

async function authedDownload(reportId: number, path: string, fallbackName: string) {
  const token = getToken();
  const res = await fetch(`${BASE}/reports/${reportId}/download/${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Download failed (HTTP ${res.status})`);
  // Pull filename from Content-Disposition if present
  const cd = res.headers.get("Content-Disposition") || "";
  const m = cd.match(/filename="?([^";]+)"?/i);
  const filename = m?.[1] || fallbackName;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const reportId = parseInt(id);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set());
  const [downloading, setDownloading] = useState<Set<number>>(new Set());

  // Secure share link state
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareExpires, setShareExpires] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    api.reports.get(reportId).then(setReport).finally(() => setLoading(false));
  }, [reportId, router]);

  async function handleDownload(index: number) {
    if (downloading.has(index)) return;
    const item = DOWNLOADS[index];
    setDownloading((d) => new Set([...d, index]));
    try {
      await authedDownload(reportId, item.path, item.fallbackName);
      setDownloaded((d) => new Set([...d, index]));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Download failed. Please try again.");
    } finally {
      setDownloading((d) => {
        const next = new Set(d);
        next.delete(index);
        return next;
      });
    }
  }

  async function handleGenerateShare() {
    setShareLoading(true);
    setShareError("");
    setCopied(false);
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/reports/${reportId}/share-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setShareUrl(data.url);
      setShareExpires(data.expires_at);
    } catch (e: unknown) {
      setShareError(e instanceof Error ? e.message : "Could not create share link");
    } finally {
      setShareLoading(false);
    }
  }

  async function handleCopyShare() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select the input
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} priority />
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
                  const isLoading = downloading.has(i);
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
                      </div>
                      <button
                        onClick={() => handleDownload(i)}
                        disabled={isLoading}
                        className={
                          isLoading
                            ? "flex items-center gap-1.5 rounded-full bg-zen-100 px-4 py-2 text-[12px] font-bold text-zen-700"
                            : done
                            ? "flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-[12px] font-bold text-emerald-600 hover:bg-emerald-100 transition-colors"
                            : "flex items-center gap-1.5 rounded-full bg-zen-900 px-4 py-2 text-[12px] font-bold text-white hover:bg-zen-800 transition-colors"
                        }
                      >
                        {isLoading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                        ) : done ? (
                          <><CheckCircle2 className="h-4 w-4" /> Download again</>
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
                      Generate a secure, time-limited link valid for 7 days. Anyone with the link can view this report.
                    </p>

                    {!shareUrl ? (
                      <button
                        onClick={handleGenerateShare}
                        disabled={shareLoading}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-6 py-2.5 text-[12px] font-semibold text-white hover:border-white/40 transition-colors disabled:opacity-50"
                      >
                        {shareLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</> : "Generate Secure Link"}
                      </button>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <div className="flex gap-2 items-center rounded-xl bg-white/10 px-3 py-2">
                          <input
                            readOnly
                            value={shareUrl}
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            className="flex-1 bg-transparent text-[12px] text-white/90 outline-none truncate"
                          />
                          <button
                            onClick={handleCopyShare}
                            className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-white text-zen-900 px-3 py-1 text-[11px] font-bold hover:bg-white/90 transition-colors"
                          >
                            {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                          </button>
                        </div>
                        {shareExpires && (
                          <p className="text-[11px] text-white/50">
                            Expires {new Date(shareExpires).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        <button
                          onClick={() => { setShareUrl(null); setShareExpires(null); }}
                          className="text-[11px] text-white/60 hover:text-white underline"
                        >
                          Regenerate link
                        </button>
                      </div>
                    )}

                    {shareError && (
                      <p className="mt-3 text-[12px] text-red-200 bg-red-500/20 rounded-lg px-3 py-2">{shareError}</p>
                    )}
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
