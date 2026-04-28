"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  FileText,
  Download,
  Calendar,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { api, Report, OrganScore, Finding, HealthPriority } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import OrganGrid from "@/components/report/OrganGrid";
import FindingsPanel from "@/components/report/FindingsPanel";
import ZenScoreRing from "@/components/report/ZenScoreRing";
import SeverityBadge from "@/components/ui/SeverityBadge";

const SEVERITY_BAR: Record<string, string> = {
  critical: "bg-red-500",
  major: "bg-amber-400",
  minor: "bg-yellow-400",
  normal: "bg-emerald-400",
};

function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 text-center">
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
  );
}

function PriorityCard({ priority }: { priority: HealthPriority }) {
  const sections = [
    { label: "Diet", items: priority.diet_recommendations },
    { label: "Exercise", items: priority.exercise_recommendations },
    { label: "Sleep", items: priority.sleep_recommendations },
    { label: "Supplements", items: priority.supplement_recommendations },
  ].filter((s) => s.items?.length > 0);

  return (
    <div className="card space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zen-800 text-sm font-bold text-white">
          {priority.priority_order}
        </span>
        <div>
          <h3 className="font-bold text-gray-900">{priority.title}</h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">{priority.why_important}</p>
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec.label}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{sec.label}</p>
          <ul className="space-y-1">
            {sec.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [organs, setOrgans] = useState<OrganScore[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [priorities, setPriorities] = useState<HealthPriority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOrgan, setPanelOrgan] = useState<OrganScore | null>(null);
  const [panelFindings, setPanelFindings] = useState<Finding[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const reportId = parseInt(id);

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    if (isNaN(reportId)) { setError("Invalid report ID"); setLoading(false); return; }

    Promise.all([
      api.reports.get(reportId),
      api.reports.organScores(reportId),
      api.reports.findings(reportId),
      api.reports.priorities(reportId),
    ])
      .then(([r, o, f, p]) => {
        setReport(r);
        setOrgans(o);
        setFindings(f);
        setPriorities(p);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [reportId, router]);

  function openOrganPanel(organ: OrganScore) {
    const organFindings = findings.filter(
      (f) => f.test_type?.toLowerCase().includes(organ.organ_name.toLowerCase()) ||
             organ.organ_name.toLowerCase().includes(f.test_type?.toLowerCase() ?? "")
    );
    // fallback: show all findings for this organ (or all if no match)
    setPanelOrgan(organ);
    setPanelFindings(organFindings.length ? organFindings : findings);
    setPanelOpen(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-zen-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-gray-600">{error || "Report not found"}</p>
        <Link href="/dashboard" className="btn-primary py-2 text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const { critical, major, minor, normal } = report.finding_counts;
  const totalFindings = critical + major + minor + normal;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-20 pb-24">
        {/* Report header */}
        <div className="bg-zen-900 text-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zen-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> My Orders
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Patient info */}
              <div>
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={report.overall_severity} className="text-xs" />
                  <span className="text-xs text-zen-400">{report.booking_id}</span>
                </div>
                <h1 className="mt-2 text-3xl font-extrabold">{report.patient_name}</h1>
                <p className="mt-1 text-zen-300">
                  {report.patient_age} yrs · {report.patient_gender} · ZenScan
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-zen-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Scan: {new Date(report.report_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Next Visit: {new Date(report.next_visit).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* ZenScore ring */}
              <div className="flex items-center gap-4 sm:gap-8">
                <ZenScoreRing score={report.coverage_index} severity={report.overall_severity} />
                <div className="min-w-0 flex-1 space-y-3">
                  {[
                    { label: "Critical", count: critical, color: "bg-red-500" },
                    { label: "Major", count: major, color: "bg-amber-400" },
                    { label: "Minor", count: minor, color: "bg-yellow-400" },
                    { label: "Normal", count: normal, color: "bg-emerald-400" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2 text-sm">
                      <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", s.color)} />
                      <span className="w-12 flex-shrink-0 text-zen-300">{s.label}</span>
                      <div className="h-1.5 flex-1 min-w-0 rounded-full bg-white/10">
                        <div
                          className={cn("h-full rounded-full", s.color)}
                          style={{ width: `${totalFindings > 0 ? (s.count / totalFindings) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="flex-shrink-0 font-semibold">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick action nav */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => { setPanelOrgan(null); setPanelFindings(findings); setPanelOpen(true); }}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zen-900 hover:bg-zen-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" /> Open Detailed Report
              </button>
              <Link
                href={`/report/${reportId}/chat`}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Ask Zeno AI
              </Link>
              <Link
                href={`/report/${reportId}/notes`}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <FileText className="h-4 w-4" /> Notes
              </Link>
              <Link
                href={`/report/${reportId}/download`}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <Download className="h-4 w-4" /> Download Report
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
          {/* Summary */}
          <section>
            <div className="rounded-2xl bg-zen-50 border border-zen-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-zen-600 mb-3">AI Summary · Zeno</p>
              <p className="text-gray-700 leading-relaxed">{report.summary}</p>
            </div>
          </section>

          {/* Stats */}
          <section>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatPill label="ZenCoverage™" value={`${report.coverage_index}%`} sub="body scanned" />
              <StatPill label="Total Findings" value={totalFindings} />
              <StatPill label="Critical" value={critical} sub="needs attention" />
              <StatPill label="Health Priorities" value={priorities.length} />
            </div>
          </section>

          {/* Organ grid */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">ZenCore Organ Analysis</h2>
                <p className="mt-1 text-sm text-gray-500">Click any organ to see detailed findings</p>
              </div>
              <button
                onClick={() => { setPanelOrgan(null); setPanelFindings(findings); setPanelOpen(true); }}
                className="flex items-center gap-1.5 text-sm font-medium text-zen-700 hover:text-zen-900"
              >
                All {totalFindings} findings <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <OrganGrid organs={organs} onSelect={openOrganPanel} />
          </section>

          {/* Severity breakdown */}
          <section>
            <h2 className="mb-5 text-2xl font-extrabold text-gray-900">Findings by Severity</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { sev: "critical", count: critical, label: "Critical", desc: "Immediate attention required" },
                { sev: "major", count: major, label: "Major", desc: "Monitor closely" },
                { sev: "minor", count: minor, label: "Minor", desc: "Low-priority findings" },
                { sev: "normal", count: normal, label: "Normal", desc: "Within healthy range" },
              ].map(({ sev, count, label, desc }) => (
                <button
                  key={sev}
                  onClick={() => {
                    const sFindings = findings.filter((f) => f.severity?.toLowerCase() === sev);
                    if (sFindings.length) {
                      setPanelOrgan(null);
                      setPanelFindings(sFindings);
                      setPanelOpen(true);
                    }
                  }}
                  className={cn(
                    "card text-left transition-all hover:scale-[1.02] hover:shadow-md",
                    count === 0 && "opacity-50 cursor-default"
                  )}
                  disabled={count === 0}
                >
                  <div className={cn("h-1.5 w-12 rounded-full mb-4", SEVERITY_BAR[sev])} />
                  <p className="text-3xl font-extrabold text-gray-900">{count}</p>
                  <p className="mt-1 font-semibold text-gray-700">{label}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Health priorities */}
          {priorities.length > 0 && (
            <section>
              <h2 className="mb-5 text-2xl font-extrabold text-gray-900">Health Priorities</h2>
              <p className="mb-6 text-sm text-gray-500">Personalised action plan based on your scan results.</p>
              <div className="grid gap-6 lg:grid-cols-2">
                {priorities.map((p) => <PriorityCard key={p.id} priority={p} />)}
              </div>
            </section>
          )}

          {/* Zeno CTA */}
          <section>
            <div className="rounded-3xl bg-zen-900 p-8 text-white text-center space-y-4">
              <p className="text-2xl font-extrabold">Have questions about your report?</p>
              <p className="text-zen-200">Ask Zeno, your personal AI health assistant — available 24/7 to explain findings in plain language.</p>
              <Link
                href={`/report/${reportId}/chat`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-zen-900 hover:bg-zen-50 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Chat with Zeno
              </Link>
            </div>
          </section>
        </div>
      </main>

      {panelOpen && (
        <FindingsPanel
          organ={panelOrgan}
          findings={panelFindings}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </>
  );
}
