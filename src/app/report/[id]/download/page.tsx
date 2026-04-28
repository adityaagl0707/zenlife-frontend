"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Share2, CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
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
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-6">
          <Link href={`/report/${reportId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-zen-800">
            <ArrowLeft className="h-4 w-4" /> Back to Report
          </Link>

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-600">ZenReport</p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Download & Share</h1>
            {report && (
              <p className="mt-2 text-gray-500">
                {report.patient_name} · {new Date(report.report_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-zen-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {DOWNLOADS.map((item, i) => {
                const Icon = item.icon;
                const done = downloaded.has(i);
                return (
                  <div key={i} className="card flex items-center gap-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zen-50">
                      <Icon className="h-6 w-6 text-zen-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <span className="rounded-full bg-zen-50 px-2 py-0.5 text-[10px] font-semibold text-zen-700">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{item.size}</p>
                    </div>
                    <button
                      onClick={() => simulateDownload(i)}
                      className={
                        done
                          ? "flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600"
                          : "flex items-center gap-1.5 rounded-full bg-zen-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zen-700 transition-colors"
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

              {/* Share section */}
              <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
                <Share2 className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                <p className="font-semibold text-gray-700">Share with your doctor</p>
                <p className="mt-1 text-sm text-gray-400">
                  Generate a secure, time-limited link to share your ZenReport with your physician.
                </p>
                <button className="mt-4 rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 hover:border-zen-400 hover:text-zen-800 transition-colors">
                  Generate Secure Link
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 pt-2">
                Your report is encrypted and only accessible to you. ZenLife does not share your health data with third parties.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
