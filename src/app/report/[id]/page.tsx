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
  Stethoscope,
  Bot,
  Leaf,
} from "lucide-react";
import { api, Report, OrganScore, Finding, HealthPriority, BodyAge, HealthPlan } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import OrganGrid from "@/components/report/OrganGrid";
import FindingsPanel, { mergePairs } from "@/components/report/FindingsPanel";
import { findingsForOrgan } from "@/lib/organParamMap";
import ZenAgeCard from "@/components/report/ZenAgeCard";
import CoverageMap from "@/components/report/CoverageMap";

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
  // Single toggle that expands ALL category columns at once — admin asked
  // for the row layout so Diet / Exercise / Sleep / Supplements sit
  // side-by-side rather than stacked, and reveal together on click.
  const [expanded, setExpanded] = useState(false);
  const sections = PRIORITY_SECTION_CONFIG.filter(
    (s) => Array.isArray(priority[s.key]) && (priority[s.key] as string[]).length > 0
  );

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
      {/* Header — number + title + why */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-zen-900 text-white text-[13px] font-black">
            {priority.priority_order}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-zen-900 leading-snug">{priority.title}</h3>
            <p className="mt-1.5 text-[12px] text-gray-500 leading-relaxed">{priority.why_important}</p>
          </div>
        </div>
      </div>

      {sections.length > 0 && (
        <>
          {/* Expanded: all categories shown side-by-side as columns */}
          {expanded && (
            <div className="border-t border-black/5 px-5 py-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sections.map((s) => {
                const items = priority[s.key] as string[];
                return (
                  <div key={s.label}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn("inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg", s.bg)}>
                        <s.icon className={cn("h-3.5 w-3.5", s.color)} />
                      </span>
                      <span className={cn("text-[11px] font-bold uppercase tracking-[0.15em]", s.color)}>
                        {s.label}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-gray-700 leading-relaxed">
                          <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-400 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* Single toggle — opens / closes all columns at once */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-3 border-t border-black/5 text-[11px] font-semibold text-gray-500 hover:bg-cream/60 transition-colors flex items-center justify-between"
          >
            <span>{expanded ? "Hide recommendations" : "View recommendations"}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={cn("transition-transform duration-200", expanded && "rotate-180")}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ── Integrated Health Plan card ──────────────────────────────────────────────

const HEALTH_PLAN_SECTIONS: {
  key: keyof HealthPlan;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  ring: string;
}[] = [
  { key: "medical_consultations", label: "Medical Consultations", icon: Stethoscope,    color: "text-red-600",    bg: "bg-red-50",    ring: "ring-red-100" },
  { key: "diet_plan",             label: "Diet & Nutrition",      icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-100" },
  { key: "exercise_plan",         label: "Exercise & Movement",   icon: Dumbbell,        color: "text-blue-600",   bg: "bg-blue-50",   ring: "ring-blue-100" },
  { key: "sleep_and_stress",      label: "Sleep & Stress",        icon: Moon,            color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-100" },
  { key: "supplements",           label: "Supplements",           icon: Pill,            color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-100" },
  { key: "monitoring",            label: "What to Monitor",       icon: Activity,        color: "text-emerald-600",bg: "bg-emerald-50",ring: "ring-emerald-100" },
];

function HealthPlanCard({ plan }: { plan: HealthPlan }) {
  const sections = HEALTH_PLAN_SECTIONS.filter((s) => {
    const items = plan[s.key];
    return Array.isArray(items) && items.length > 0;
  });
  if (!sections.length) return null;
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
      <div className="bg-gradient-to-br from-zen-50 to-cream px-5 py-4 border-b border-black/5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zen-900">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zen-700">Your prescription</p>
          <p className="text-[12px] text-gray-500">Mix of medical, lifestyle and tracking — all in one place</p>
        </div>
      </div>
      <div className="grid gap-px bg-black/5 sm:grid-cols-2">
        {sections.map((s) => {
          const items = (plan[s.key] || []) as string[];
          return (
            <div key={s.key} className="bg-white p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1", s.bg, s.ring)}>
                  <s.icon className={cn("h-4 w-4", s.color)} />
                </span>
                <h3 className="text-[13px] font-bold text-zen-900">{s.label}</h3>
                <span className="ml-auto text-[10px] font-bold text-gray-400 tabular-nums">{items.length}</span>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-gray-700 leading-relaxed">
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-400 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
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
  // When the chat back-link drops us back here it sets ?return=<context>
  // &finding=<name>; we re-open the same drawer and scroll/expand that card.
  const [expandFinding, setExpandFinding] = useState<string | null>(null);
  const [panelContextLabel, setPanelContextLabel] = useState<string>("");
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

  function openOrganPanel(organ: OrganScore, opts?: { expandFinding?: string | null }) {
    const organFindings = findingsForOrgan(organ.organ_name, visibleFindings);
    setPanelOrgan(organ);
    setPanelFindings(organFindings);
    setPanelContextLabel(`organ:${organ.organ_name}`);
    setExpandFinding(opts?.expandFinding ?? null);
    setPanelOpen(true);
  }

  function openSeverityPanel(sev: string, opts?: { expandFinding?: string | null }) {
    const sevFindings = visibleFindings.filter((f) => f.severity?.toLowerCase() === sev);
    if (sevFindings.length) {
      setPanelOrgan(null);
      setPanelFindings(sevFindings);
      setPanelContextLabel(`severity:${sev}`);
      setExpandFinding(opts?.expandFinding ?? null);
      setPanelOpen(true);
    }
  }

  function openTestPanel(testKey: string, label: string, icon: string, opts?: { expandFinding?: string | null }) {
    const testFindings = visibleFindings.filter((f) => f.test_type?.toLowerCase() === testKey);
    if (!testFindings.length) return;
    setPanelOrgan({
      id: -1,
      organ_name: label,
      severity: "normal",
      risk_label: "",
      critical_count: 0,
      major_count: 0,
      minor_count: 0,
      normal_count: 0,
      icon,
    });
    setPanelFindings(testFindings);
    setPanelContextLabel(`test:${testKey}|${label}|${icon}`);
    setExpandFinding(opts?.expandFinding ?? null);
    setPanelOpen(true);
  }

  // Restore drawer state from chat back-link: ?return=<context>&finding=<name>
  // Context tokens: "organ:<organName>", "severity:<sev>", "test:<key>|<label>|<icon>", "all".
  useEffect(() => {
    if (loading) return;
    const url = new URL(window.location.href);
    const ret = url.searchParams.get("return");
    const findingName = url.searchParams.get("finding");
    if (!ret) return;
    if (ret === "all") {
      setPanelOrgan(null);
      setPanelFindings(visibleFindings);
      setPanelContextLabel("all");
      setExpandFinding(findingName);
      setPanelOpen(true);
    } else if (ret.startsWith("organ:")) {
      const organName = ret.slice(6);
      const o = organs.find((x) => x.organ_name === organName);
      if (o) openOrganPanel(o, { expandFinding: findingName });
    } else if (ret.startsWith("severity:")) {
      openSeverityPanel(ret.slice(9), { expandFinding: findingName });
    } else if (ret.startsWith("test:")) {
      const [key, label, icon] = ret.slice(5).split("|");
      openTestPanel(key, label || key, icon || "🧪", { expandFinding: findingName });
    }
    // Clean URL so a refresh doesn't re-open
    url.searchParams.delete("return");
    url.searchParams.delete("finding");
    window.history.replaceState({}, "", url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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

  // Single source of truth for every count on this page: the actual findings
  // array, post-pending-filter, post-CBC-merge. Backend `finding_counts`
  // counts raw rows (CBC twins separately, pending placeholders included)
  // which mismatched the drawer + button — so we derive everything in one
  // pass here so all four tiles + button + organ cards reconcile exactly.
  // Rollup labels like "Liver and Digestive Health: Degenerative" are
  // radiology category headers, not actionable measurements — the organ-card
  // counter already strips them. Strip from the drawer too so the All-tab
  // total reconciles with the sum of organ-card counts.
  const ROLLUP_RX = /:\s*(degenerative|post-infective|inflammation|traumatic issues|tumours|infective-active|ischemic causes|congenital causes)\b/i;
  const visibleFindings = findings.filter((f) => {
    const v = (f.value ?? "").trim().toLowerCase();
    const sev = (f.severity || "").toLowerCase();
    if (!v || ["—", "-", "n/a", "na", "not found", "not measured"].includes(v)) return false;
    if (sev === "pending") return false;
    if (ROLLUP_RX.test(f.name || "")) return false;
    return true;
  });
  const mergedFindings = mergePairs(visibleFindings);
  const totalFindings = mergedFindings.length;
  const critical = mergedFindings.filter((f) => f.severity?.toLowerCase() === "critical").length;
  const major    = mergedFindings.filter((f) => f.severity?.toLowerCase() === "major").length;
  const minor    = mergedFindings.filter((f) => f.severity?.toLowerCase() === "minor").length;
  const normal   = mergedFindings.filter((f) => f.severity?.toLowerCase() === "normal").length;
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
            ...(report.source !== "self_uploaded" && bodyAge?.zen_age != null ? [{ label: "Body Age", href: "#body-age" }] : []),
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
            {report.source === "self_uploaded"
              ? "Partial report · Self-uploaded"
              : `ZenReport · ${report.booking_id}`}
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">
            {report.patient_name}
          </h1>
          <p className="mt-2 text-[14px] text-gray-400">
            {report.patient_age ?? "—"} years · {report.patient_gender ?? "—"}
            {report.source === "self_uploaded" ? null : " · ZenScan Full Body"}
          </p>
        </div>
      </div>

      {/* ── Overview card (compact) ────────────────────────────────────── */}
      <div id="overview" className="mx-auto max-w-5xl px-6 pb-6">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

            {/* Left: status pill + IDs + dates inline */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-mono text-gray-400">
                <SeverityPill sev={overallSev} />
                {report.source === "self_uploaded" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-700 ring-1 ring-indigo-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Self-uploaded · Partial
                  </span>
                ) : (
                  <span><span className="text-gray-300">Order</span> {report.booking_id}</span>
                )}
                {report.zen_id && (
                  <span><span className="text-gray-300">Zen ID</span> {report.zen_id}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px]">
                <span className="inline-flex items-center gap-1.5 text-gray-500">
                  <Calendar className="h-3 w-3 text-gray-300" />
                  <span className="text-gray-400">Scan</span>
                  <span className="font-semibold text-zen-900">{formatDate(report.report_date)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-500">
                  <Calendar className="h-3 w-3 text-gray-300" />
                  <span className="text-gray-400">Next visit</span>
                  <span className="font-semibold text-zen-900">{formatDate(report.next_visit)}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setPanelOrgan(null); setPanelFindings(visibleFindings); setPanelContextLabel("all"); setExpandFinding(null); setPanelOpen(true); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zen-900 px-4 py-2 text-[11px] font-bold text-white hover:bg-zen-800 transition-colors"
                >
                  <Activity className="h-3 w-3" /> All {totalFindings} Findings
                </button>
                <Link
                  href={`/report/${reportId}/chat`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-[11px] font-semibold text-zen-900 hover:bg-cream transition-colors"
                >
                  <MessageCircle className="h-3 w-3" /> Ask Zeno
                </Link>
                {/* Download (PDF) only for ZenScan reports — self-uploaded
                    reports are partial assessments, not formal reports. */}
                {report.source !== "self_uploaded" && (
                  <Link
                    href={`/report/${reportId}/download`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-[11px] font-semibold text-gray-500 hover:bg-cream transition-colors"
                  >
                    <Download className="h-3 w-3" /> Download
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Zeno AI Health Assessment — replaces the ring score */}
            {report.summary && (
              <div className="sm:max-w-md sm:w-1/2 sm:border-l sm:border-black/5 sm:pl-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900 flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-zen-900 leading-tight">Zeno — AI Health Assessment</p>
                    <p className="text-[9px] text-gray-400 leading-tight">Personalised analysis of your ZenScan</p>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                </div>
                {/* Render the summary as bullet points — splits on sentence
                    boundaries so each clinical observation reads as a
                    discrete bullet rather than a wall of prose. */}
                <ul className="space-y-1.5">
                  {report.summary
                    .split(/(?<=[.!?])\s+(?=[A-Z])/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((sentence, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-gray-700 leading-[1.55]">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-zen-700" />
                        <span>{sentence}</span>
                      </li>
                    ))}
                </ul>
                <Link
                  href={`/report/${reportId}/chat`}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-zen-700 hover:text-zen-900 transition-colors"
                >
                  Ask Zeno a follow-up <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className={cn("mx-auto max-w-5xl px-6 space-y-12", isAdminPreview ? "pb-32" : "pb-20")}>

        {/* ── Key stats ───────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatChip icon={Activity} label="Total Findings" value={totalFindings} sub={`${organs.length} organ systems`} />
            <StatChip icon={AlertTriangle} label="Critical" value={critical} sub={critical > 0 ? "needs attention" : "none found"} accent={critical > 0 ? "red" : undefined} />
            <StatChip icon={Target} label="Priorities" value={priorities.length} sub="personalised actions" />
          </div>
        </section>

        {/* ── Coverage Map (self-uploaded reports only) ─────────────── */}
        {report.source === "self_uploaded" && (
          <section id="coverage">
            <SectionHeading
              label="What you've uploaded"
              title="Coverage Map"
              subtitle="The picture sharpens with every report. Empty tiles are upsell hooks for ZenScan."
            />
            <CoverageMap uploadedSections={report.uploaded_sections || []} />
          </section>
        )}

        {/* ── Organ Analysis ──────────────────────────────────────────── */}
        <section id="organs">
          <SectionHeading
            label="ZenCore"
            title="Organ Analysis"
            subtitle="Click any organ card to explore detailed parameter findings"
            action={
              <button
                onClick={() => { setPanelOrgan(null); setPanelFindings(visibleFindings); setPanelContextLabel("all"); setExpandFinding(null); setPanelOpen(true); }}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold text-gray-600 hover:bg-cream transition-colors"
              >
                All {totalFindings} findings <ChevronRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <OrganGrid organs={organs} findings={visibleFindings} onSelect={openOrganPanel} />
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

        {/* ── Findings by Test ────────────────────────────────────────── */}
        {(() => {
          const TEST_CONFIG = [
            { key: "blood",         label: "Blood Report",     icon: "🩸" },
            { key: "urine",         label: "Urine Analysis",   icon: "🧪" },
            { key: "dexa",          label: "DEXA Scan",        icon: "🦴" },
            { key: "calcium_score", label: "Calcium Score",    icon: "💛" },
            { key: "ecg",           label: "ECG Report",       icon: "💓" },
            { key: "chest_xray",    label: "Chest X-Ray",      icon: "🫁" },
            { key: "usg",           label: "USG Report",       icon: "🔊" },
            { key: "mri",           label: "MRI Report",       icon: "🧲" },
            { key: "mammography",   label: "Mammography",      icon: "🎀" },
          ];
          // Roll up parameters per test type — apply the same CBC twin
          // merge the drawer applies so the card's "N parameters" matches
          // the drawer header exactly.
          const rows = TEST_CONFIG.map((t) => {
            const ts = mergePairs(visibleFindings.filter((f) => f.test_type?.toLowerCase() === t.key));
            const c = { critical: 0, major: 0, minor: 0, normal: 0 } as Record<string, number>;
            for (const f of ts) {
              const sev = (f.severity || "normal").toLowerCase();
              if (sev in c) c[sev]++;
            }
            return { ...t, total: ts.length, counts: c };
          }).filter((r) => r.total > 0);

          if (!rows.length) return null;
          return (
            <section id="findings-by-test">
              <SectionHeading
                label="Findings"
                title="By Test"
                subtitle="See the breakdown of every test performed in this scan"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {rows.map((r) => {
                  const abnormal = r.counts.critical + r.counts.major + r.counts.minor;
                  return (
                    <button
                      key={r.key}
                      onClick={() => openTestPanel(r.key, r.label, r.icon)}
                      className="rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3.5 flex items-center gap-3 hover:bg-cream/60 hover:ring-black/10 hover:-translate-y-0.5 transition-all text-left group shadow-sm"
                    >
                      <span className="text-[20px] flex-shrink-0">{r.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-zen-900 leading-snug truncate">{r.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {r.total} {r.total === 1 ? "parameter" : "parameters"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 flex-shrink-0 justify-end max-w-[140px]">
                        {abnormal === 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            All healthy
                          </span>
                        ) : (
                          (["critical", "major", "minor"] as const)
                            .filter((sev) => r.counts[sev] > 0)
                            .map((sev) => {
                              const cfg = SEV_CONFIG[sev];
                              return (
                                <span
                                  key={sev}
                                  className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold", cfg.bg, cfg.text)}
                                >
                                  <span className={cn("h-1 w-1 rounded-full", cfg.bar)} />
                                  {r.counts[sev]}
                                </span>
                              );
                            })
                        )}
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* ── Health Priorities ───────────────────────────────────────── */}
        {/* Self-uploaded reports below 25% coverage skip priorities to
            avoid generating advice from a single CBC. The Coverage Map
            above already nudges them to upload more or book a ZenScan. */}
        {priorities.length > 0 && !(report.source === "self_uploaded" && (report.uploaded_sections?.length ?? 0) < 2) && (
          <section id="priorities">
            <SectionHeading
              label="Action Plan"
              title="Your Health Priorities"
              subtitle="A personalised plan generated by Zeno AI based on your scan results"
            />
            <div className="space-y-3">
              {priorities.map((p) => (
                <PriorityCard key={p.id} priority={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── Low-coverage upsell (self-uploaded only, blocks priorities) ── */}
        {report.source === "self_uploaded" && (report.uploaded_sections?.length ?? 0) < 2 && (
          <section id="coverage-upsell">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-cream ring-1 ring-indigo-200 p-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700 mb-2">More data needed</p>
              <h3 className="text-[20px] font-extrabold text-zen-900">Health priorities unlock at 2+ test types</h3>
              <p className="mt-2 text-[13px] text-gray-600 leading-relaxed max-w-md mx-auto">
                A single test isn&apos;t enough to safely generate a personal action plan. Upload one or two more reports
                — or book a ZenScan to fill all 8 in one visit.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
                <Link href="/upload" className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300 bg-white px-4 py-2 text-[12px] font-bold text-indigo-700 hover:bg-indigo-50 transition-colors">
                  Upload more reports
                </Link>
                <Link href="/book" className="inline-flex items-center gap-1.5 rounded-full bg-zen-900 px-4 py-2 text-[12px] font-bold text-white hover:bg-zen-800 transition-colors">
                  Book a ZenScan
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Integrated Health Plan ──────────────────────────────────── */}
        {report.health_plan && (
          <section id="health-plan">
            <SectionHeading
              label="Your Plan"
              title="Your Integrated Health Plan"
              subtitle="One holistic prescription — medical follow-ups, diet, exercise, sleep, supplements and what to track. Generated by Zeno AI."
            />
            <HealthPlanCard plan={report.health_plan} />
          </section>
        )}

        {/* ── ZenAge ─ hidden for self-uploaded reports (insufficient data) */}
        {report.source !== "self_uploaded" && bodyAge && bodyAge.zen_age != null && (
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
          reportId={reportId}
          returnContext={panelContextLabel}
          expandFinding={expandFinding}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
