"use client";
import { X, FlaskConical, Stethoscope, Lightbulb, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Finding, OrganScore } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Render a "What to do" payload as either a single paragraph (one action)
 *  or a checklist of bullets (multiple actions). The AI service returns a
 *  string; we split on common multi-step delimiters so legacy data without
 *  arrays still gets the bullet treatment when it deserves it. */
function RecommendationItems({ text }: { text: string }) {
  // Split on " / ", " | ", "; " or sentence boundary. Keep single-sentence
  // recommendations as a paragraph — bullets would feel forced.
  const parts = text
    .split(/(?:\s\/\s|\s\|\s|;\s+|(?<=[.!?])\s+(?=[A-Z]))/)
    .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
  if (parts.length <= 1) {
    return <p className="text-[11px] text-gray-700 leading-snug">{text}</p>;
  }
  return (
    <ul className="space-y-1">
      {parts.map((p, i) => (
        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700 leading-snug">
          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

// CBC differential twins — % and absolute count are the same biological
// measurement. Merge them into one card so the patient doesn't see what
// looks like duplicate rows. Map: secondary (%-form) → primary (count-form).
const CBC_PAIRS: Record<string, string> = {
  "basophils":               "basophils - count",
  "eosinophils":             "eosinophils - count",
  "lymphocytes":             "lymphocytes - count",
  "monocytes":               "monocytes - count",
  "neutrophils":             "neutrophils - count",
  "immature granulocytes %": "immature granulocytes",
  "nucleated rbc %":         "nucleated rbc",
};
const PAIR_PRIMARIES = new Set(Object.values(CBC_PAIRS));

// Exported so the report header can show "All N findings" using the same
// post-merge count the drawer actually displays — keeps the button label
// and the drawer header in lockstep.
export function mergePairs(findings: Finding[]): Finding[] {
  const byKey = new Map<string, Finding>();
  for (const f of findings) byKey.set((f.name || "").toLowerCase().trim(), f);
  const out: Finding[] = [];
  const consumed = new Set<string>();
  for (const f of findings) {
    const key = (f.name || "").toLowerCase().trim();
    if (consumed.has(key)) continue;
    const primaryKey = CBC_PAIRS[key];                 // is f a secondary?
    const secondaryKey = Object.keys(CBC_PAIRS).find((k) => CBC_PAIRS[k] === key); // is f a primary?
    if (primaryKey && byKey.has(primaryKey)) {
      const primary = byKey.get(primaryKey)!;
      const merged: Finding = {
        ...primary,
        // Combine display value: "60% · 3.2 ×10³/µL"
        value: `${f.value || "—"}% · ${primary.value || "—"}${primary.unit ? ` ${primary.unit}` : ""}`,
        unit: "",
        normal_range: `${f.normal_range || "—"} (%) · ${primary.normal_range || "—"} (count)`,
      };
      out.push(merged);
      consumed.add(key); consumed.add(primaryKey);
    } else if (secondaryKey && byKey.has(secondaryKey)) {
      const secondary = byKey.get(secondaryKey)!;
      const merged: Finding = {
        ...f,
        value: `${secondary.value || "—"}% · ${f.value || "—"}${f.unit ? ` ${f.unit}` : ""}`,
        unit: "",
        normal_range: `${secondary.normal_range || "—"} (%) · ${f.normal_range || "—"} (count)`,
      };
      out.push(merged);
      consumed.add(key); consumed.add(secondaryKey);
    } else {
      out.push(f);
      consumed.add(key);
    }
  }
  return out;
}

// ── Severity tokens ────────────────────────────────────────────────────────

const SEV = {
  critical: {
    border: "border-l-red-500",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    value: "bg-red-50 text-red-700",
    tab: "bg-red-500 text-white",
    tabOff: "text-red-600 hover:bg-red-50",
    label: "Critical",
  },
  major: {
    border: "border-l-amber-400",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
    value: "bg-amber-50 text-amber-700",
    tab: "bg-amber-400 text-white",
    tabOff: "text-amber-600 hover:bg-amber-50",
    label: "Major",
  },
  minor: {
    border: "border-l-yellow-400",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-400",
    value: "bg-yellow-50 text-yellow-700",
    tab: "bg-yellow-400 text-white",
    tabOff: "text-yellow-600 hover:bg-yellow-50",
    label: "Minor",
  },
  normal: {
    border: "border-l-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
    value: "bg-emerald-50 text-emerald-700",
    tab: "bg-emerald-500 text-white",
    tabOff: "text-emerald-600 hover:bg-emerald-50",
    label: "Normal",
  },
};

function getSev(s?: string) {
  const key = (s?.toLowerCase() ?? "normal") as keyof typeof SEV;
  return SEV[key] ?? SEV.normal;
}

// ── Value gauge ────────────────────────────────────────────────────────────

function parseGaugePosition(value: string | null, range: string | null): number | null {
  if (!value || !range) return null;
  const v = parseFloat(value.replace(/[^\d.-]/g, ""));
  if (isNaN(v)) return null;

  const upper = range.trim().match(/^[<≤]=?\s*([\d.]+)/);
  if (upper) {
    const u = parseFloat(upper[1]);
    return Math.min((v / (u * 1.6)) * 100, 100);
  }
  const lower = range.trim().match(/^[>≥]=?\s*([\d.]+)/);
  if (lower) {
    const l = parseFloat(lower[1]);
    if (v >= l) return 30 + Math.random() * 20; // in range
    return Math.max(10, (v / l) * 40);
  }
  const rng = range.trim().match(/^([\d.]+)\s*[-–]\s*([\d.]+)/);
  if (rng) {
    const lo = parseFloat(rng[1]), hi = parseFloat(rng[2]);
    const span = hi - lo;
    return Math.min(Math.max(((v - lo) / span) * 60 + 20, 5), 95);
  }
  return null;
}

function ValueGauge({ value, range, severity }: { value: string | null; range: string | null; severity: string }) {
  const pos = parseGaugePosition(value, range);
  if (pos === null) return null;
  const sev = getSev(severity);

  return (
    <div className="mt-2 px-1">
      <div className="relative h-2 w-full rounded-full bg-gray-100 overflow-visible">
        {/* Normal zone highlight */}
        <div className="absolute inset-y-0 left-[20%] right-[20%] rounded-full bg-emerald-100" />
        {/* Pointer */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${Math.min(Math.max(pos, 4), 96)}%` }}
        >
          <div className={cn("h-4 w-4 rounded-full border-2 border-white shadow-md ring-1 ring-black/10", sev.dot)} />
        </div>
      </div>
      <div className="flex justify-between text-[9px] text-gray-300 mt-1 px-0.5 font-medium">
        <span>Low</span>
        <span>Normal Range</span>
        <span>High</span>
      </div>
    </div>
  );
}

// ── Finding card ────────────────────────────────────────────────────────────

function FindingCard({ finding, reportId, returnContext, autoExpand }: {
  finding: Finding;
  reportId: number;
  /** Encodes drawer state so the Ask Zeno chat back-link can restore it. */
  returnContext: string;
  /** When true, the card mounts already expanded (used after returning from chat). */
  autoExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState(!!autoExpand);
  const sev = getSev(finding.severity);
  const hasDetails = !!(finding.clinical_findings || finding.recommendations);
  // Scroll the auto-expanded card into view when returning from chat.
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoExpand && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [autoExpand]);

  const testTypeLabel = finding.test_type
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

  return (
    <div ref={cardRef} className={cn(
      "bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 border-l-[4px] transition-shadow hover:shadow-md",
      sev.border
    )}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-gray-900 leading-snug">{finding.name}</h3>
            {testTypeLabel && (
              <span className="mt-0.5 inline-block rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                {testTypeLabel}
              </span>
            )}
          </div>
          <span className={cn("flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", sev.badge)}>
            {sev.label}
          </span>
        </div>
      </div>

      {/* Value display
          - If we have a numeric normal range (something with digits, < / > /
            – etc.), show side-by-side compare + a gauge.
          - If the normal is missing or qualitative ("Normal", "Negative",
            "Absent", "None", "BIRADS 1", etc.), just show the patient's
            value alone — no gauge, no parallel "Normal Range" panel that
            would just say the same word.
       */}
      {(() => {
        const range = (finding.normal_range || "").trim();
        const isNumericRange = /[<>≤≥0-9]/.test(range);
        if (!finding.value && !range) return null;

        if (isNumericRange) {
          return (
            <div className="px-4 pb-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-gray-50 px-3 py-2 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Normal Range</p>
                  <p className="text-sm font-bold text-gray-600 truncate">{range}</p>
                  {finding.unit && <p className="text-[10px] text-gray-400">{finding.unit}</p>}
                </div>
                <div className={cn("rounded-xl px-3 py-2 text-center", sev.value)}>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Your Value</p>
                  <p className="text-sm font-bold truncate">
                    {finding.value || "—"}{finding.unit ? ` ${finding.unit}` : ""}
                  </p>
                </div>
              </div>
              <ValueGauge value={finding.value} range={finding.normal_range} severity={finding.severity} />
            </div>
          );
        }

        // Qualitative / no range — single full-width value card
        return (
          <div className="px-4 pb-3">
            <div className={cn("rounded-xl px-4 py-3 text-center", sev.value)}>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">Your Value</p>
              <p className="text-sm font-bold truncate">
                {finding.value || "—"}{finding.unit ? ` ${finding.unit}` : ""}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Description */}
      {finding.description && (
        <p className="px-4 pb-3 text-[11px] text-gray-500 leading-snug">{finding.description}</p>
      )}

      {/* Expandable details */}
      {hasDetails && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-2 border-t border-gray-50 text-[10px] font-semibold text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <span>{expanded ? "Hide interpretation" : "Interpretation & Recommendation"}</span>
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={cn("transition-transform duration-200", expanded && "rotate-180")}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {expanded && (
            <div className="border-t border-gray-50">
              {finding.clinical_findings && (
                <div className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Stethoscope className="h-3 w-3 text-blue-400" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Interpretation</p>
                  </div>
                  {/* Diagnosis stays as a single sentence — interpretation
                      reads better as connected prose. */}
                  <p className="text-[11px] text-gray-700 leading-snug">{finding.clinical_findings}</p>
                </div>
              )}
              {finding.recommendations && (
                <div className="px-4 py-2.5 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lightbulb className="h-3 w-3 text-amber-400" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Recommendation</p>
                  </div>
                  {/* Action items render as bullets when the AI returned 2+
                      steps (split by ' / ' or sentence boundary), otherwise
                      a single paragraph. Mirrors prescription style:
                      diagnosis-as-prose, plan-as-checklist. */}
                  <RecommendationItems text={finding.recommendations} />
                </div>
              )}
              {sev.label !== "Normal" && (
                <Link
                  href={`/report/${reportId}/chat?q=${encodeURIComponent(
                    `Tell me more about my ${finding.name} of ${finding.value || "—"}${finding.unit ? " " + finding.unit : ""} — what should I do?`
                  )}&return=${encodeURIComponent(returnContext)}&finding=${encodeURIComponent(finding.name)}`}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-gray-50 text-[11px] font-bold text-zen-700 hover:bg-zen-50/50 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Ask Zeno about this
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Panel ───────────────────────────────────────────────────────────────────

interface Props {
  organ: OrganScore | null;
  findings: Finding[];
  reportId: number;
  /** Opaque token the chat page reflects back so we can return to this exact
   *  drawer state. Built by the parent (e.g. "organ:Heart Health"). */
  returnContext?: string;
  /** When set, auto-expand the matching finding card on mount and scroll to it. */
  expandFinding?: string | null;
  onClose: () => void;
}

const TABS = ["all", "critical", "major", "minor", "normal"] as const;

export default function FindingsPanel({ organ, findings, reportId, returnContext, expandFinding, onClose }: Props) {
  const [filter, setFilter] = useState<typeof TABS[number]>("all");

  // Merge CBC twin pairs (% + absolute count) into single cards.
  const merged = mergePairs(findings);

  const counts = Object.fromEntries(
    TABS.map((s) => [s, s === "all" ? merged.length : merged.filter((f) => f.severity?.toLowerCase() === s).length])
  ) as Record<typeof TABS[number], number>;

  const filtered = filter === "all" ? merged : merged.filter((f) => f.severity?.toLowerCase() === filter);

  const title = organ ? organ.organ_name : "All Findings";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 inset-y-0 z-50 flex w-full max-w-[480px] flex-col bg-gray-50 shadow-2xl">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-0">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="h-4 w-4 text-zen-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zen-600">
                  {organ ? "Organ Report" : "Full Report"}
                </p>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {findings.length === 0
                  ? "No parameters recorded for this organ system"
                  : `${findings.length} finding${findings.length !== 1 ? "s" : ""} · click any card for details`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-xl p-2 hover:bg-gray-100 transition-colors mt-0.5"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0 -mx-1 px-1">
            {TABS.map((s) => {
              if (counts[s] === 0 && s !== "all") return null;
              const active = filter === s;
              const tok = getSev(s === "all" ? "normal" : s);
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-[11px] font-bold transition-all border-b-2",
                    active
                      ? "bg-gray-50 border-b-2 border-zen-800 text-zen-900"
                      : "border-transparent text-gray-400 hover:text-gray-700 bg-transparent"
                  )}
                >
                  {s !== "all" && (
                    <span className={cn("h-2 w-2 rounded-full flex-shrink-0", tok.dot)} />
                  )}
                  <span className="capitalize">{s === "all" ? "All" : s}</span>
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold",
                    active ? "bg-zen-800 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    {counts[s]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Findings list */}
        <div className="flex-1 overflow-y-auto">
          {findings.length === 0 ? (
            // No findings at all for this organ system
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FlaskConical className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No parameters recorded</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                No tests for this organ system were uploaded in this report.
                Upload the relevant report sections to see findings here.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            // Has findings but current severity filter returns nothing
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FlaskConical className="h-7 w-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No findings for this filter</p>
              <p className="text-xs text-gray-300 mt-1">Try selecting a different severity</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filtered.map((f) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  reportId={reportId}
                  returnContext={returnContext || ""}
                  autoExpand={expandFinding ? expandFinding.toLowerCase() === (f.name || "").toLowerCase() : false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
