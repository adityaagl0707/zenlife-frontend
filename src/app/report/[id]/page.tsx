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
  TrendingUp,
} from "lucide-react";

// Stitch dossier eyebrow — vertical bar + uppercase label, used before
// each top-level section on the patient report.
function DossierEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 mt-12 first:mt-0">
      <div className="w-px h-8 bg-[#6d797b]" />
      <h2 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">
        {label}
      </h2>
    </div>
  );
}
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
      <div className="p-4 border-b border-black/5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-zen-900 text-white text-[12px] font-black">
            {priority.priority_order}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-zen-900 leading-snug">{priority.title}</h3>
            <p className="mt-1 text-[11px] text-gray-500 leading-snug">{priority.why_important}</p>
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
            <div key={s.label} className="px-4 py-3">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 mb-2", s.bg)}>
                <s.icon className={cn("h-3 w-3", s.color)} />
                <p className={cn("text-[9px] font-bold uppercase tracking-[0.15em]", s.color)}>{s.label}</p>
              </div>
              <ul className="space-y-1">
                {(priority[s.key] as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700 leading-snug">
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-400 mt-0.5" />
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
  const [adminPublishing, setAdminPublishing] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const reportId = parseInt(id);

  // Detect admin preview mode (?admin=1)
  const isAdminPreview = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("admin") === "1"
    : false;

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    if (isNaN(reportId)) { setError("Invalid report ID"); setLoading(false); return; }

    const adminMode = new URLSearchParams(window.location.search).get("admin") === "1";

    api.reports.get(reportId)
      .then(r => {
        setReport(r);
        if (!r.is_published && !adminMode) { setLoading(false); return; } // show In Progress (skip for admin preview)
        return Promise.all([
          api.reports.organScores(reportId),
          api.reports.findings(reportId),
          api.reports.priorities(reportId),
          api.reports.bodyAge(reportId).catch(() => null),
        ]).then(([o, f, p, ba]) => {
          setOrgans(o);
          setFindings(f);
          setPriorities(p);
          setBodyAge(ba);
        });
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
    // Filter findings to only those belonging to this organ's parameter list
    const organFindings = findings.filter((f) => params.has(f.name?.toLowerCase().trim() ?? ""));
    setPanelOrgan(organ);
    setPanelFindings(organFindings);   // show only matched findings — never fall back to all
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

  // ── In Progress (not yet published — skip in admin preview mode) ─────────
  if (!report.is_published && !isAdminPreview) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 gap-6">
        <div className="bg-white rounded-3xl shadow-lg ring-1 ring-black/5 p-10 max-w-md w-full text-center space-y-5">
          <div className="mx-auto h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center">
            <Loader2 className="h-9 w-9 text-amber-400 animate-spin" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Report Status</p>
            <h2 className="text-2xl font-extrabold text-gray-900">In Progress</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hi {report.patient_name?.split(" ")[0]}, your ZenLife report is currently being prepared by our team.
              You will be notified once it's ready.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-100 px-5 py-4 text-left space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-500">Booking ID</p>
            <p className="text-base font-bold text-gray-800">{report.booking_id}</p>
          </div>
          <div className="space-y-2 text-[12px] text-gray-400">
            <p>✓ Your health data is being analysed</p>
            <p>✓ AI insights are being generated</p>
            <p>⏳ Final review by ZenLife team</p>
          </div>
          <Link href="/dashboard" className="inline-block rounded-full bg-zen-900 px-8 py-3 text-[13px] font-bold text-white hover:bg-zen-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { critical = 0, major = 0, minor = 0, normal = 0 } = report.finding_counts ?? {};
  const totalFindings = critical + major + minor + normal;
  const overallSev = report.overall_severity?.toLowerCase() ?? "normal";

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  // Admin publish helper
  async function adminPublish(publish: boolean) {
    setAdminPublishing(true);
    try {
      const BASE = (process.env.NEXT_PUBLIC_API_URL || "https://zenlife-backend-j5q9.onrender.com").replace(/\/api\/v1\/?$/, "");
      await fetch(`${BASE}/api/v1/admin/reports/${reportId}/${publish ? "publish" : "unpublish"}`, { method: "POST" });
      // Reload report to reflect new published state
      const r = await api.reports.get(reportId);
      setReport(r);
    } finally { setAdminPublishing(false); }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Admin preview bar ───────────────────────────────────────────── */}
      {isAdminPreview && (
        <div className={cn(
          "fixed inset-x-0 bottom-0 z-[60] border-t px-6 py-3 flex items-center justify-between gap-4",
          report.is_published ? "bg-emerald-900 border-emerald-700" : "bg-zen-900 border-zen-700"
        )}>
          <div className="flex items-center gap-3">
            <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", report.is_published ? "bg-emerald-700 text-emerald-100" : "bg-amber-500 text-white")}>
              {report.is_published ? "Published" : "Draft"}
            </span>
            <p className="text-sm font-semibold text-white">
              {report.is_published
                ? "This report is live — patient can view it."
                : "Admin Preview — patient cannot see this yet."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs text-white/60 hover:text-white">← Back to Admin</Link>
            {!report.is_published ? (
              <button
                onClick={() => adminPublish(true)}
                disabled={adminPublishing}
                className="flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {adminPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Publish Report
              </button>
            ) : (
              <button
                onClick={() => adminPublish(false)}
                disabled={adminPublishing}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
              >
                {adminPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Unpublish
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Top bar (Stitch dossier) ───────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-[#bcc9ca]/30">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006970]">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-[family-name:var(--font-newsreader)] text-[18px] font-semibold tracking-tight text-[#002022]">
              ZenLife
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Dossier", active: true },
              { label: "Insights", href: `#findings` },
              { label: "Zeno", href: `/report/${reportId}/chat` },
              { label: "Archive", href: "/dashboard" },
            ].map((nav) => (
              <Link
                key={nav.label}
                href={nav.href || "#"}
                className={cn(
                  "py-1 font-[family-name:var(--font-inter)] text-[13px] font-semibold transition-opacity hover:opacity-80",
                  nav.active ? "text-[#171d1d] border-b-2 border-[#171d1d]" : "text-[#6d797b]"
                )}
              >
                {nav.label}
              </Link>
            ))}
          </div>
          <Link
            href={`/report/${reportId}/chat`}
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-[13px] font-semibold text-[#171d1d] hover:opacity-80 transition-opacity"
          >
            Ask Zeno
            <MessageCircle className="h-4 w-4" />
          </Link>
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

      {/* ── Page header (Stitch dossier style) ─────────────────────────── */}
      <div ref={heroRef} className="pt-[53px]">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-6">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-[#006970] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            My Health Reports
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="font-[family-name:var(--font-newsreader)] text-[clamp(2.25rem,5vw,3rem)] leading-[1.1] text-[#006970] tracking-tight">
                {report.patient_name?.split(" ")[0]}&apos;s Health Dossier
              </h1>
              <p className="mt-3 flex items-center gap-3 font-[family-name:var(--font-inter)] text-[13px] text-[#3d494a]">
                <span>{report.patient_age ?? "—"} Years</span>
                <span className="w-1 h-1 rounded-full bg-[#bcc9ca]" />
                <span>{report.patient_gender ?? "—"}</span>
                <span className="w-1 h-1 rounded-full bg-[#bcc9ca]" />
                <span className="font-medium">Report ID: {report.booking_id}</span>
                {report.zen_id && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[#bcc9ca]" />
                    <span>Zen ID {report.zen_id}</span>
                  </>
                )}
              </p>
            </div>

            {/* Status chip — pulsing dot for critical, calm for the rest */}
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border self-start md:self-auto",
              overallSev === "critical" && "bg-[#ffdad6] border-[#ba1a1a]/20",
              overallSev === "major"    && "bg-[#ffe088] border-[#735c00]/20",
              overallSev === "minor"    && "bg-[#7cf4ff]/40 border-[#006970]/20",
              overallSev === "normal"   && "bg-[#dee3e4] border-[#bcc9ca]",
            )}>
              <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                overallSev === "critical" && "bg-[#ba1a1a] animate-pulse",
                overallSev === "major"    && "bg-[#735c00]",
                overallSev === "minor"    && "bg-[#006970]",
                overallSev === "normal"   && "bg-[#6d797b]",
              )} />
              <span className={cn(
                "font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase",
                overallSev === "critical" && "text-[#93000a]",
                overallSev === "major"    && "text-[#574500]",
                overallSev === "minor"    && "text-[#004f54]",
                overallSev === "normal"   && "text-[#3d494a]",
              )}>
                {overallSev === "critical" ? "Needs prompt attention"
                  : overallSev === "major"    ? "High health risk"
                  : overallSev === "minor"    ? "Mild health concern"
                  : "Healthy and stable"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#3d494a]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-[#bcc9ca]" />
              <span className="text-[#6d797b]">Scan</span>
              <span className="font-semibold text-[#006970]">{formatDate(report.report_date)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-[#bcc9ca]" />
              <span className="text-[#6d797b]">Next visit</span>
              <span className="font-semibold text-[#006970]">{formatDate(report.next_visit)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Overview card (compact) ────────────────────────────────────── */}
      <div id="overview" className="mx-auto max-w-5xl px-6 pb-6">
        {/* Bento overview: ZenScore (1 col) + AI Summary (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ZenScore card */}
          <div className="bg-white ring-1 ring-[#bcc9ca]/40 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className={cn(
              "absolute top-0 left-0 w-full h-1.5",
              overallSev === "critical" && "bg-[#ba1a1a]",
              overallSev === "major"    && "bg-[#e4c465]",
              overallSev === "minor"    && "bg-[#5cd8e2]",
              overallSev === "normal"   && "bg-[#bcc9ca]",
            )} />
            <h3 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a] mb-6 w-full text-left">
              ZenScore
            </h3>
            {/* Conic-gradient gauge */}
            <div
              className="relative w-32 h-32 flex items-center justify-center rounded-full mb-6"
              style={{
                background: `conic-gradient(${
                  overallSev === "critical" ? "#ba1a1a" :
                  overallSev === "major"    ? "#e4c465" :
                  overallSev === "minor"    ? "#5cd8e2" : "#7cf4ff"
                } 0% ${report.coverage_index ?? 0}%, #e4e2e4 ${report.coverage_index ?? 0}% 100%)`,
              }}
            >
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
                <span className={cn(
                  "font-[family-name:var(--font-newsreader)] text-[48px] font-medium leading-none tabular-nums",
                  overallSev === "critical" && "text-[#ba1a1a]",
                  overallSev === "major"    && "text-[#735c00]",
                  overallSev === "minor"    && "text-[#006970]",
                  overallSev === "normal"   && "text-[#006970]",
                )}>
                  {report.coverage_index ?? 0}
                </span>
              </div>
            </div>
            {/* 4 mini-stats below ring */}
            <div className="w-full flex justify-between items-center px-2 mt-2 border-t border-[#dee3e4] pt-4">
              {[
                { label: "Crit", v: critical, color: "text-[#ba1a1a]" },
                { label: "Maj",  v: major,    color: "text-[#735c00]" },
                { label: "Min",  v: minor,    color: "text-[#006970]" },
                { label: "Norm", v: normal,   color: "text-[#3d494a]" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className={cn("font-[family-name:var(--font-inter)] text-[15px] font-semibold tabular-nums", s.color)}>{s.v}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6d797b]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary card (2 cols) */}
          <div className="bg-white ring-1 ring-[#bcc9ca]/40 rounded-xl p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-[#006970]" />
                <h3 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">
                  Zeno Intelligence Summary
                </h3>
              </div>
              <p className="font-[family-name:var(--font-inter)] text-[14px] text-[#171d1d] leading-[1.65] max-w-2xl">
                {report.summary || "Your ZenReport is ready. Explore your organ analysis and findings below."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <button
                onClick={() => { setPanelOrgan(null); setPanelFindings(findings); setPanelOpen(true); }}
                className="bg-[#f5fafb] hover:bg-[#eff5f5] px-3 py-1.5 rounded border border-[#bcc9ca]/40 flex items-center gap-2 transition-colors"
              >
                <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#171d1d] font-semibold tabular-nums">{totalFindings}</span>
                <span className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">Total Findings</span>
              </button>
              {critical > 0 && (
                <div className="bg-[#ffdad6]/50 px-3 py-1.5 rounded border border-[#ba1a1a]/20 flex items-center gap-2">
                  <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#ba1a1a] font-semibold tabular-nums">{critical}</span>
                  <span className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#93000a]">Critical</span>
                </div>
              )}
              <div className="bg-[#f5fafb] px-3 py-1.5 rounded border border-[#bcc9ca]/40 flex items-center gap-2">
                <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#171d1d] font-semibold tabular-nums">{priorities.length}</span>
                <span className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">Priorities</span>
              </div>
              <Link
                href={`/report/${reportId}/chat`}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#006970] hover:bg-[#004f54] px-4 py-2 text-[12px] font-semibold text-white transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Ask Zeno a follow-up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content (Stitch dossier) ───────────────────────────────── */}
      <main className={cn("mx-auto max-w-5xl px-6", isAdminPreview ? "pb-32" : "pb-20")}>

        {/* ── Organ Analysis ──────────────────────────────────────────── */}
        <section id="organs">
          <DossierEyebrow label="Organ Analysis" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {organs.map((organ) => {
              const sev = organ.severity?.toLowerCase() ?? "normal";
              const sevBar =
                sev === "critical" ? "bg-[#ba1a1a]" :
                sev === "major"    ? "bg-[#e4c465]" :
                sev === "minor"    ? "bg-[#5cd8e2]" : "bg-[#bcc9ca]";
              const sevPill =
                sev === "critical" ? "bg-[#ffdad6] text-[#93000a]" :
                sev === "major"    ? "bg-[#ffe088] text-[#574500]" :
                sev === "minor"    ? "bg-[#7cf4ff] text-[#004f54]" : "bg-[#dee3e4] text-[#3d494a]";
              const iconColor =
                sev === "critical" ? "text-[#ba1a1a]" :
                sev === "major"    ? "text-[#735c00]" :
                sev === "minor"    ? "text-[#006970]" : "text-[#6d797b]";
              return (
                <button
                  key={organ.id}
                  onClick={() => openOrganPanel(organ)}
                  className="bg-white ring-1 ring-[#bcc9ca]/40 hover:ring-[#006970]/30 hover:-translate-y-0.5 transition-all rounded-xl p-6 relative overflow-hidden text-left group"
                >
                  <div className={cn("absolute top-0 left-0 w-full h-1.5", sevBar)} />
                  <div className="flex justify-between items-start mb-6">
                    <span className={cn("text-[28px] leading-none", iconColor)}>{organ.icon}</span>
                    <span className={cn("font-[family-name:var(--font-inter)] text-[9px] px-2 py-0.5 rounded uppercase font-semibold tracking-[0.18em]", sevPill)}>
                      {sev === "critical" ? "Critical" : sev === "major" ? "Major" : sev === "minor" ? "Minor" : "Normal"}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-newsreader)] text-[22px] leading-[1.2] text-[#006970] mb-1">
                    {organ.organ_name}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-[12px] text-[#3d494a] leading-snug">
                    {organ.risk_label || (sev === "normal" ? "All parameters within healthy range." : "Tap to view findings.")}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Findings By Severity ────────────────────────────────────── */}
        <section id="findings">
          <DossierEyebrow label="Findings By Severity" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {([
              { key: "critical", count: critical, color: "border-l-[#ba1a1a]" },
              { key: "major",    count: major,    color: "border-l-[#e4c465]" },
              { key: "minor",    count: minor,    color: "border-l-[#5cd8e2]" },
              { key: "normal",   count: normal,   color: "border-l-[#bcc9ca]" },
            ] as const).map((s) => (
              <button
                key={s.key}
                onClick={() => openSeverityPanel(s.key)}
                disabled={s.count === 0}
                className={cn(
                  "bg-white ring-1 ring-[#bcc9ca]/40 rounded-xl p-6 flex justify-between items-center border-l-4 hover:bg-[#eff5f5] transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed",
                  s.color
                )}
              >
                <div>
                  <h4 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a] mb-1">
                    {s.key === "critical" ? "Critical" : s.key === "major" ? "Major" : s.key === "minor" ? "Minor" : "Normal"}
                  </h4>
                  <span className="font-[family-name:var(--font-newsreader)] text-[32px] text-[#006970] tabular-nums">{s.count}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#6d797b]" />
              </button>
            ))}
          </div>
        </section>

        {/* ── Health Priorities ───────────────────────────────────────── */}
        {priorities.length > 0 && (
          <section id="priorities">
            <DossierEyebrow label="Health Priorities" />
            <div className="flex flex-col gap-3 mb-12">
              {priorities.map((p, idx) => {
                const isUrgent = idx < 2;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "bg-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden",
                      isUrgent ? "ring-1 ring-[#ba1a1a]/30" : "ring-1 ring-[#bcc9ca]/40"
                    )}
                  >
                    <div className={cn("absolute left-0 top-0 w-1 h-full", isUrgent ? "bg-[#ba1a1a]" : "bg-[#bcc9ca]")} />
                    <div className="flex items-center gap-4 pl-3">
                      <div className={cn(
                        "w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center font-[family-name:var(--font-inter)] text-[14px] font-bold",
                        isUrgent ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-[#dee3e4] text-[#3d494a]"
                      )}>{p.priority_order}</div>
                      <div className="min-w-0">
                        <h4 className="font-[family-name:var(--font-inter)] text-[14px] font-semibold text-[#006970] leading-snug">
                          {p.title}
                        </h4>
                        <p className="font-[family-name:var(--font-inter)] text-[12px] text-[#3d494a] mt-1 leading-snug">
                          {p.why_important}
                        </p>
                      </div>
                    </div>
                    {isUrgent && (
                      <button className="shrink-0 bg-[#006970] hover:bg-[#004f54] text-white font-[family-name:var(--font-inter)] text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors self-start sm:self-auto">
                        Action Required
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── ZenAge — Longevity Metric ───────────────────────────────── */}
        {bodyAge && bodyAge.zen_age != null && (
          <section id="body-age">
            <DossierEyebrow label="Longevity Metrics" />
            {(() => {
              const diff = bodyAge.age_difference ?? 0;
              const younger = diff < 0;
              return (
                <div className="bg-[#7cf4ff]/40 ring-1 ring-[#bcc9ca]/30 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-[32px]">⏳</span>
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#004f54] mb-1">
                        Biological ZenAge
                      </h3>
                      <div className="flex items-baseline gap-3">
                        <span className="font-[family-name:var(--font-newsreader)] text-[40px] text-[#002022] leading-none tabular-nums">
                          {Math.round(bodyAge.zen_age * 10) / 10}
                        </span>
                        <span className="font-[family-name:var(--font-inter)] text-[14px] text-[#004f54]">
                          Years
                          {bodyAge.chronological_age && (
                            <span className="ml-2 text-[#6d797b]">vs {bodyAge.chronological_age} chronological</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-full font-[family-name:var(--font-inter)] text-[13px] font-semibold flex items-center gap-2",
                    younger ? "bg-[#dee3e4] text-[#006970]" : "bg-[#ffe088] text-[#574500]"
                  )}>
                    <TrendingUp className={cn("h-4 w-4", younger && "rotate-180")} />
                    {Math.abs(diff)} years {younger ? "younger" : "older"} than chronological
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* ── Zeno CTA (Stitch dossier teal) ──────────────────────────── */}
        <section>
          <div className="rounded-2xl bg-[#002022] text-white overflow-hidden ring-1 ring-[#004f54]">
            <div className="px-8 py-8 md:flex md:items-center md:justify-between md:gap-8">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-[#7cf4ff]" />
                  <span className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#7cf4ff]">Zeno · Your AI Health Assistant</span>
                </div>
                <h3 className="font-[family-name:var(--font-newsreader)] text-[1.75rem] leading-tight text-white">
                  Questions about your results?
                </h3>
                <p className="mt-2 font-[family-name:var(--font-inter)] text-[13px] text-white/70 leading-relaxed max-w-md">
                  Zeno has read every line of your report. Ask anything in plain English — 24/7 for the next 12 months.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link
                  href={`/report/${reportId}/chat`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 font-[family-name:var(--font-inter)] text-[13px] font-semibold text-[#002022] hover:bg-[#7cf4ff] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Zeno
                </Link>
                <Link
                  href={`/report/${reportId}/download`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-7 py-3 font-[family-name:var(--font-inter)] text-[12px] font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Report
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
