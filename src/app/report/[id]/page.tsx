"use client";
import { useEffect, useState, useRef, use } from "react";
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
  Activity,
  Target,
  UtensilsCrossed,
  Dumbbell,
  Moon,
  Pill,
  Sparkles,
  Shield,
  Bot,
  Leaf,
} from "lucide-react";
import { api, Report, OrganScore, Finding, HealthPriority, BodyAge } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import OrganGrid from "@/components/report/OrganGrid";
import FindingsPanel from "@/components/report/FindingsPanel";
import ZenScoreRing from "@/components/report/ZenScoreRing";
import { ORGAN_PARAM_MAP } from "@/lib/organParamMap";
import ZenAgeCard from "@/components/report/ZenAgeCard";

// ── Severity config ────────────────────────────────────────────────────────

const SEV_CONFIG = {
  critical: {
    bar: "bg-red-500",
    border: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
    label: "Critical",
    desc: "Immediate attention required",
  },
  major: {
    bar: "bg-amber-400",
    border: "border-l-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    label: "Major",
    desc: "Monitor closely",
  },
  minor: {
    bar: "bg-yellow-400",
    border: "border-l-yellow-400",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
    label: "Minor",
    desc: "Low-priority findings",
  },
  normal: {
    bar: "bg-emerald-400",
    border: "border-l-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Normal",
    desc: "Within healthy range",
  },
} as const;

// ── Severity pill ───────────────────────────────────────────────────────────

function SeverityPill({ sev }: { sev: string }) {
  const cfg = SEV_CONFIG[sev as keyof typeof SEV_CONFIG] ?? SEV_CONFIG.normal;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]", cfg.bg, cfg.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.bar)} />
      {cfg.label}
    </span>
  );
}

// ── Stat chip ───────────────────────────────────────────────────────────────

function StatChip({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: "red" | "emerald";
}) {
  return (
    <div className={cn(
      "rounded-2xl bg-white ring-1 ring-black/5 p-5 flex items-start gap-4",
      accent === "red" && "ring-red-200",
      accent === "emerald" && "ring-emerald-200"
    )}>
      <div className={cn(
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
        accent === "red" ? "bg-red-50" : accent === "emerald" ? "bg-emerald-50" : "bg-cream-dark"
      )}>
        <Icon className={cn("h-4.5 w-4.5", accent === "red" ? "text-red-500" : accent === "emerald" ? "text-emerald-600" : "text-zen-900")} />
      </div>
      <div className="min-w-0">
        <p className="text-[1.4rem] font-extrabold text-zen-900 leading-none">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// ── Severity finding card ────────────────────────────────────────────────────

function SeverityCard({
  sev,
  count,
  totalFindings,
  onClick,
}: {
  sev: keyof typeof SEV_CONFIG;
  count: number;
  totalFindings: number;
  onClick: () => void;
}) {
  const cfg = SEV_CONFIG[sev];
  const pct = totalFindings > 0 ? Math.round((count / totalFindings) * 100) : 0;

  return (
    <button
      onClick={onClick}
      disabled={count === 0}
      className={cn(
        "group w-full text-left rounded-2xl bg-white border-l-4 ring-1 ring-black/5 p-5 transition-all",
        cfg.border,
        count > 0
          ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "opacity-40 cursor-default"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={cn("text-[10px] font-bold uppercase tracking-[0.15em]", cfg.text)}>{cfg.label}</span>
        {count > 0 && (
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
        )}
      </div>
      <p className="font-display text-[2.5rem] leading-none text-zen-900">{count}</p>
      <p className="mt-1 text-[11px] text-gray-400 leading-snug">{cfg.desc}</p>
      {totalFindings > 0 && (
        <div className="mt-3">
          <div className="h-1 w-full rounded-full bg-black/5 overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", cfg.bar)} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[10px] text-gray-400">{pct}% of findings</p>
        </div>
      )}
    </button>
  );
}

// ── Priority card ────────────────────────────────────────────────────────────

const PRIORITY_SECTION_CONFIG = [
  { key: "diet_recommendations" as keyof HealthPriority, label: "Diet", icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-50" },
  { key: "exercise_recommendations" as keyof HealthPriority, label: "Exercise", icon: Dumbbell, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "sleep_recommendations" as keyof HealthPriority, label: "Sleep", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-50" },
  { key: "supplement_recommendations" as keyof HealthPriority, label: "Supplements", icon: Pill, color: "text-purple-500", bg: "bg-purple-50" },
];

function PriorityCard({ priority }: { priority: HealthPriority }) {
  const [expanded, setExpanded] = useState(false);
  const sections = PRIORITY_SECTION_CONFIG.filter(
    (s) => Array.isArray(priority[s.key]) && (priority[s.key] as string[]).length > 0
  );

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
      <div className="p-5 border-b border-black/5">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-zen-900 text-white text-[13px] font-black">
            {priority.priority_order}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-bold text-zen-900 leading-snug">{priority.title}</h3>
            <p className="mt-1 text-[12px] text-gray-500 leading-relaxed">{priority.why_important}</p>
          </div>
        </div>
      </div>

      {!expanded && sections.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2">
          {sections.map((s) => (
            <span key={s.label} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", s.bg, s.color)}>
              <s.icon className="h-3 w-3" />
              {s.label}
            </span>
          ))}
        </div>
      )}

      {expanded && sections.length > 0 && (
        <div className="divide-y divide-black/5">
          {sections.map((s) => (
            <div key={s.label} className="px-5 py-4">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-3", s.bg)}>
                <s.icon className={cn("h-3.5 w-3.5", s.color)} />
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.15em]", s.color)}>{s.label}</p>
              </div>
              <ul className="space-y-2">
                {(priority[s.key] as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12px] text-gray-600 leading-relaxed">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {sections.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 border-t border-black/5 text-[11px] font-semibold text-gray-400 hover:bg-cream transition-colors flex items-center justify-between"
        >
          <span>{expanded ? "Collapse" : "View recommendations"}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={cn("transition-transform duration-200", expanded && "rotate-180")}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ label, title, subtitle, action }: {
  label: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
        <h2 className="font-display text-[1.6rem] leading-tight text-zen-900">{title}</h2>
        {subtitle && <p className="mt-1 text-[12px] text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

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
  const [stickyNav, setStickyNav] = useState(false);
  const [bodyAge, setBodyAge] = useState<BodyAge | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const reportId = parseInt(id);

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    if (isNaN(reportId)) { setError("Invalid report ID"); setLoading(false); return; }

    Promise.all([
      api.reports.get(reportId),
      api.reports.organScores(reportId),
      api.reports.findings(reportId),
      api.reports.priorities(reportId),
      api.reports.bodyAge(reportId).catch(() => null),
    ])
      .then(([r, o, f, p, ba]) => {
        setReport(r);
        setOrgans(o);
        setFindings(f);
        setPriorities(p);
        setBodyAge(ba);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [reportId, router]);

  useEffect(() => {
    const onScroll = () => setStickyNav(window.scrollY > (heroRef.current?.offsetHeight ?? 200));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openOrganPanel(organ: OrganScore) {
    const params = new Set((ORGAN_PARAM_MAP[organ.organ_name] ?? []).map((p) => p.toLowerCase()));
    const organFindings = findings.filter((f) => params.has(f.name?.toLowerCase().trim() ?? ""));
    setPanelOrgan(organ);
    setPanelFindings(organFindings.length ? organFindings : findings);
    setPanelOpen(true);
  }

  function openSeverityPanel(sev: string) {
    const sevFindings = findings.filter((f) => f.severity?.toLowerCase() === sev);
    if (sevFindings.length) {
      setPanelOrgan(null);
      setPanelFindings(sevFindings);
      setPanelOpen(true);
    }
  }

  // ── Loading / error ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream">
        <Loader2 className="h-7 w-7 animate-spin text-zen-600" />
        <p className="text-[13px] text-gray-400 font-medium">Loading your health report…</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <p className="text-gray-600 font-medium">{error || "Report not found"}</p>
        <Link href="/dashboard" className="rounded-full bg-zen-900 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-zen-800">
          Back to My Reports
        </Link>
      </div>
    );
  }

  const { critical, major, minor, normal } = report.finding_counts;
  const totalFindings = critical + major + minor + normal;
  const overallSev = report.overall_severity?.toLowerCase() ?? "normal";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/report/${reportId}/chat`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zen-900/20 px-4 py-2 text-[12px] font-semibold text-zen-900 hover:bg-zen-50 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask Zeno
            </Link>
            <Link
              href="/dashboard"
              className="text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              My Reports
            </Link>
          </div>
        </div>
      </header>

      {/* ── Sticky section nav ─────────────────────────────────────────── */}
      <div className={cn(
        "fixed top-[53px] inset-x-0 z-40 bg-cream/95 backdrop-blur-md border-b border-black/5 transition-all duration-300",
        stickyNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="mx-auto max-w-5xl px-6 flex items-center gap-1 h-10 overflow-x-auto">
          {[
            { label: "Overview", href: "#overview" },
            { label: "Organs", href: "#organs" },
            { label: "Findings", href: "#findings" },
            { label: "Priorities", href: "#priorities" },
            ...(bodyAge?.zen_age != null ? [{ label: "Body Age", href: "#body-age" }] : []),
          ].map((nav) => (
            <a
              key={nav.label}
              href={nav.href}
              className="flex-shrink-0 rounded-lg px-3 py-1 text-[11px] font-semibold text-gray-500 hover:text-zen-900 hover:bg-black/5 transition-colors"
            >
              {nav.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div ref={heroRef} className="pt-[53px]">
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-4">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-zen-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            My Health Reports
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
            ZenReport · {report.booking_id}
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">
            {report.patient_name}
          </h1>
          <p className="mt-2 text-[14px] text-gray-400">
            {report.patient_age} years · {report.patient_gender} · ZenScan Full Body
          </p>
        </div>
      </div>

      {/* ── Overview card ─────────────────────────────────────────────── */}
      <div id="overview" className="mx-auto max-w-5xl px-6 pb-6">
        <div className="rounded-3xl bg-white ring-1 ring-black/5 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
          <div className="p-6 flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">

            {/* Left: status, dates, actions */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <SeverityPill sev={overallSev} />
                <span className="text-[11px] text-gray-400 font-mono">{report.booking_id}</span>
              </div>

              {/* Dates */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 rounded-xl bg-cream-dark px-3 py-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em]">Scan Date</p>
                    <p className="text-[12px] text-zen-900 font-semibold">{formatDate(report.report_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-cream-dark px-3 py-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em]">Next Visit</p>
                    <p className="text-[12px] text-zen-900 font-semibold">{formatDate(report.next_visit)}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setPanelOrgan(null); setPanelFindings(findings); setPanelOpen(true); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zen-900 px-5 py-2.5 text-[12px] font-bold text-white hover:bg-zen-800 transition-colors"
                >
                  <Activity className="h-3.5 w-3.5" />
                  All {totalFindings} Findings
                </button>
                <Link
                  href={`/report/${reportId}/chat`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2.5 text-[12px] font-semibold text-zen-900 hover:bg-cream transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Ask Zeno
                </Link>
                <Link
                  href={`/report/${reportId}/download`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2.5 text-[12px] font-semibold text-gray-500 hover:bg-cream transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Link>
              </div>
            </div>

            {/* Right: ZenScore + severity bars */}
            <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col lg:items-end lg:gap-4 flex-shrink-0">
              <ZenScoreRing score={report.coverage_index} severity={report.overall_severity} />

              {/* Severity distribution */}
              <div className="w-full min-w-[180px] space-y-2">
                {(["critical", "major", "minor", "normal"] as const).map((sev) => {
                  const count = sev === "critical" ? critical : sev === "major" ? major : sev === "minor" ? minor : normal;
                  const pct = totalFindings > 0 ? (count / totalFindings) * 100 : 0;
                  const cfg = SEV_CONFIG[sev];
                  return (
                    <div key={sev} className="flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", cfg.bar)} />
                      <span className="w-12 flex-shrink-0 text-[10px] font-semibold text-gray-500">{cfg.label}</span>
                      <div className="flex-1 h-1 rounded-full bg-black/6 overflow-hidden">
                        <div className={cn("h-full rounded-full", cfg.bar)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-5 flex-shrink-0 text-right text-[12px] font-bold text-zen-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 pb-20 space-y-12">

        {/* ── AI Summary ──────────────────────────────────────────────── */}
        {report.summary && (
          <section>
            <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-black/5 bg-cream">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zen-900">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-zen-900 leading-tight">Zeno — AI Health Assessment</p>
                  <p className="text-[10px] text-gray-400">Personalised analysis of your ZenScan results</p>
                </div>
                <Sparkles className="h-4 w-4 text-gray-300" />
              </div>
              <div className="px-6 py-5">
                <p className="text-[13px] text-gray-600 leading-[1.8]">{report.summary}</p>
              </div>
              <div className="px-6 pb-5">
                <Link
                  href={`/report/${reportId}/chat`}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-zen-700 hover:text-zen-900 transition-colors"
                >
                  Ask Zeno a follow-up <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Key stats ───────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatChip icon={Shield} label="ZenCoverage" value={`${report.coverage_index}%`} sub="body scanned" accent="emerald" />
            <StatChip icon={Activity} label="Total Findings" value={totalFindings} sub={`${organs.length} organ systems`} />
            <StatChip icon={AlertTriangle} label="Critical" value={critical} sub={critical > 0 ? "needs attention" : "none found"} accent={critical > 0 ? "red" : undefined} />
            <StatChip icon={Target} label="Priorities" value={priorities.length} sub="personalised actions" />
          </div>
        </section>

        {/* ── Organ Analysis ──────────────────────────────────────────── */}
        <section id="organs">
          <SectionHeading
            label="ZenCore"
            title="Organ Analysis"
            subtitle="Click any organ card to explore detailed parameter findings"
            action={
              <button
                onClick={() => { setPanelOrgan(null); setPanelFindings(findings); setPanelOpen(true); }}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-gray-600 hover:bg-cream transition-colors"
              >
                All {totalFindings} findings <ChevronRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <OrganGrid organs={organs} findings={findings} onSelect={openOrganPanel} />
        </section>

        {/* ── Findings by Severity ────────────────────────────────────── */}
        <section id="findings">
          <SectionHeading
            label="Findings"
            title="By Severity"
            subtitle="Tap a card to view the complete list of findings in that category"
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(["critical", "major", "minor", "normal"] as const).map((sev) => {
              const count = sev === "critical" ? critical : sev === "major" ? major : sev === "minor" ? minor : normal;
              return (
                <SeverityCard
                  key={sev}
                  sev={sev}
                  count={count}
                  totalFindings={totalFindings}
                  onClick={() => openSeverityPanel(sev)}
                />
              );
            })}
          </div>
        </section>

        {/* ── Health Priorities ───────────────────────────────────────── */}
        {priorities.length > 0 && (
          <section id="priorities">
            <SectionHeading
              label="Action Plan"
              title="Your Health Priorities"
              subtitle="A personalised plan generated by Zeno AI based on your scan results"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              {priorities.map((p) => (
                <PriorityCard key={p.id} priority={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── ZenAge ──────────────────────────────────────────────────── */}
        {bodyAge && bodyAge.zen_age != null && (
          <section id="body-age">
            <SectionHeading
              label="Biological Age"
              title="ZenAge"
              subtitle="Calculated from blood biomarkers, scan data & AI analysis"
            />
            <ZenAgeCard bodyAge={bodyAge} />
          </section>
        )}

        {/* ── Zeno CTA ────────────────────────────────────────────────── */}
        <section>
          <div className="rounded-3xl bg-zen-900 text-white overflow-hidden">
            <div className="px-8 py-8 md:flex md:items-center md:justify-between md:gap-8">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Zeno AI</span>
                </div>
                <h3 className="font-display text-[1.8rem] leading-tight text-white">
                  Questions about<br />your results?
                </h3>
                <p className="mt-2 text-[13px] text-white/60 leading-relaxed max-w-md">
                  Zeno explains every finding in plain language and helps you understand what to do next — 24/7.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link
                  href={`/report/${reportId}/chat`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-[13px] font-bold text-zen-900 hover:bg-zen-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Zeno
                </Link>
                <Link
                  href={`/report/${reportId}/notes`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-3 text-[12px] font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Doctor&apos;s Notes
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-300">© 2025 ZenLife Health Intelligence</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[11px] text-gray-400 hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-gray-400 hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </footer>

      {panelOpen && (
        <FindingsPanel
          organ={panelOrgan}
          findings={panelFindings}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
