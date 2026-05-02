"use client";
import { X, Stethoscope, Lightbulb, Activity, FlaskConical } from "lucide-react";
import { useState } from "react";
import { Finding, OrganScore } from "@/lib/api";
import { cn } from "@/lib/utils";

// ── CBC twin merge (% + absolute count → single combined card) ─────────────
const CBC_PAIRS: Record<string, string> = {
  "basophils":               "basophils - count",
  "eosinophils":             "eosinophils - count",
  "lymphocytes":             "lymphocytes - count",
  "monocytes":               "monocytes - count",
  "neutrophils":             "neutrophils - count",
  "immature granulocytes %": "immature granulocytes",
  "nucleated rbc %":         "nucleated rbc",
};

function mergePairs(findings: Finding[]): Finding[] {
  const byKey = new Map<string, Finding>();
  for (const f of findings) byKey.set((f.name || "").toLowerCase().trim(), f);
  const out: Finding[] = [];
  const consumed = new Set<string>();
  for (const f of findings) {
    const key = (f.name || "").toLowerCase().trim();
    if (consumed.has(key)) continue;
    const primaryKey = CBC_PAIRS[key];
    const secondaryKey = Object.keys(CBC_PAIRS).find((k) => CBC_PAIRS[k] === key);
    if (primaryKey && byKey.has(primaryKey)) {
      const primary = byKey.get(primaryKey)!;
      out.push({
        ...primary,
        value: `${f.value || "—"}% · ${primary.value || "—"}${primary.unit ? ` ${primary.unit}` : ""}`,
        unit: "",
        normal_range: `${f.normal_range || "—"} (%) · ${primary.normal_range || "—"} (count)`,
      });
      consumed.add(key); consumed.add(primaryKey);
    } else if (secondaryKey && byKey.has(secondaryKey)) {
      const secondary = byKey.get(secondaryKey)!;
      out.push({
        ...f,
        value: `${secondary.value || "—"}% · ${f.value || "—"}${f.unit ? ` ${f.unit}` : ""}`,
        unit: "",
        normal_range: `${secondary.normal_range || "—"} (%) · ${f.normal_range || "—"} (count)`,
      });
      consumed.add(key); consumed.add(secondaryKey);
    } else {
      out.push(f);
      consumed.add(key);
    }
  }
  return out;
}

// ── Stitch severity tokens ─────────────────────────────────────────────────
type SevKey = "critical" | "major" | "minor" | "normal";

const SEV: Record<SevKey, {
  bar: string;        // left edge accent
  bg: string;         // chip background
  text: string;       // chip / heading text
  dot: string;        // dot in chip + gauge marker
  label: string;
  zone: string;       // gauge "normal range" zone
}> = {
  critical: { bar: "bg-[#ba1a1a]", bg: "bg-[#ba1a1a]/10", text: "text-[#ba1a1a]", dot: "bg-[#ba1a1a]", label: "Critical", zone: "bg-[#ba1a1a]/20" },
  major:    { bar: "bg-[#e4c465]", bg: "bg-[#ffe088]/60", text: "text-[#735c00]", dot: "bg-[#e4c465]", label: "Major",    zone: "bg-[#e4c465]/30" },
  minor:    { bar: "bg-[#5cd8e2]", bg: "bg-[#7cf4ff]/40", text: "text-[#004f54]", dot: "bg-[#5cd8e2]", label: "Minor",    zone: "bg-[#5cd8e2]/30" },
  normal:   { bar: "bg-[#bcc9ca]", bg: "bg-[#dee3e4]",    text: "text-[#3d494a]", dot: "bg-[#bcc9ca]", label: "Normal",   zone: "bg-[#10B981]/20" },
};

function getSev(s?: string | null): typeof SEV[SevKey] {
  const k = (s?.toLowerCase() ?? "normal") as SevKey;
  return SEV[k] ?? SEV.normal;
}

// ── Test-type → display label ──────────────────────────────────────────────
function testTypeLabel(t?: string | null): string {
  if (!t) return "";
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Numeric gauge ──────────────────────────────────────────────────────────
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
    if (v >= l) return 30 + 20;
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

// ── Finding card (Stitch) ──────────────────────────────────────────────────
function FindingCard({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const sev = getSev(finding.severity);
  const hasDetails = !!(finding.clinical_findings || finding.recommendations);
  const isNumericRange = /[<>≤≥0-9]/.test((finding.normal_range || "").trim());
  const gaugePos = isNumericRange ? parseGaugePosition(finding.value, finding.normal_range) : null;

  return (
    <article className="bg-white ring-1 ring-black/5 rounded-xl overflow-hidden relative">
      {/* Left severity edge bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", sev.bar)} />

      <div className="p-6 pl-8">
        {/* Header — chips + serif name */}
        <header className="flex items-start justify-between mb-4 gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {/* Severity chip */}
              <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full", sev.bg)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", sev.dot)} />
                <span className={cn("font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-[0.18em] uppercase", sev.text)}>
                  {sev.label}
                </span>
              </span>
              {/* Test type chip */}
              {finding.test_type && (
                <span className="font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#3d494a] flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {testTypeLabel(finding.test_type)}
                </span>
              )}
            </div>
            <h3 className="font-[family-name:var(--font-newsreader)] text-[20px] leading-[1.25] text-[#006970]">
              {finding.name}
            </h3>
          </div>
        </header>

        {/* Value display */}
        {(finding.value || finding.normal_range) && (
          <>
            {isNumericRange && gaugePos !== null ? (
              // Numeric: gauge with normal-range zone + value marker dot
              <div className="mt-5 p-4 bg-[#eff5f5] rounded-lg ring-1 ring-black/5">
                <div className="flex justify-between items-end mb-1">
                  <div className="font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">Your Value</div>
                  <div className="font-[family-name:var(--font-inter)] text-[18px] text-[#006970] font-semibold tabular-nums">
                    {finding.value || "—"}
                    {finding.unit && <span className="text-[12px] text-[#6d797b] ml-1.5">{finding.unit}</span>}
                  </div>
                </div>
                <div className="relative h-2 bg-[#bcc9ca]/30 rounded-full mt-4 mb-3">
                  {/* Normal range zone */}
                  <div className={cn("absolute left-[20%] right-[20%] h-full rounded-full", sev.zone)} />
                  {/* Value marker */}
                  <div
                    className={cn("absolute w-3.5 h-3.5 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 ring-2 ring-white", sev.dot)}
                    style={{ left: `${Math.min(Math.max(gaugePos, 4), 96)}%` }}
                  />
                </div>
                <div className="flex justify-between font-[family-name:var(--font-inter)] text-[11px] text-[#6d797b]">
                  <span>Low</span>
                  <span>Normal: {finding.normal_range}</span>
                  <span>High</span>
                </div>
              </div>
            ) : (
              // Qualitative or no range: single right-aligned value row
              <div className="mt-5 grid grid-cols-[120px_1fr] gap-4 items-baseline pb-5 border-b border-[#dee3e4]">
                <span className="font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">Your Value</span>
                <span className={cn("font-[family-name:var(--font-inter)] text-[14px] font-semibold", sev.text)}>
                  {finding.value || "—"}
                  {finding.unit && <span className="text-[12px] text-[#6d797b] ml-1.5">{finding.unit}</span>}
                  {finding.normal_range && !isNumericRange && (
                    <span className="font-normal text-[#6d797b] ml-2 text-[12px]">(Normal: {finding.normal_range})</span>
                  )}
                </span>
              </div>
            )}
          </>
        )}

        {/* Description (radiologist's note / verbatim if present) */}
        {finding.description && (
          <p className="mt-4 font-[family-name:var(--font-inter)] text-[13px] text-[#171d1d] leading-[1.6]">
            {finding.description}
          </p>
        )}

        {/* Expandable: What this means / What to do */}
        {hasDetails && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-5 inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#006970] hover:text-[#004f54] transition-colors"
            >
              {expanded ? "Hide details" : "What this means + what to do"}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={cn("transition-transform", expanded && "rotate-180")}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {expanded && (
              <div className="mt-5 space-y-5 pt-5 border-t border-[#dee3e4]">
                {finding.clinical_findings && (
                  <div className="flex gap-3">
                    <Stethoscope className="h-4 w-4 text-[#6d797b] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#006970] mb-1">What this means</h4>
                      <p className="font-[family-name:var(--font-inter)] text-[13px] text-[#3d494a] leading-[1.6]">{finding.clinical_findings}</p>
                    </div>
                  </div>
                )}
                {finding.recommendations && (
                  <div className="flex gap-3">
                    <Lightbulb className="h-4 w-4 text-[#6d797b] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#006970] mb-1">What to do</h4>
                      <p className="font-[family-name:var(--font-inter)] text-[13px] text-[#3d494a] leading-[1.6]">{finding.recommendations}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

// ── Panel ───────────────────────────────────────────────────────────────────

interface Props {
  organ: OrganScore | null;
  findings: Finding[];
  onClose: () => void;
}

const TABS = ["all", "critical", "major", "minor", "normal"] as const;

export default function FindingsPanel({ organ, findings, onClose }: Props) {
  const [filter, setFilter] = useState<typeof TABS[number]>("all");

  const merged = mergePairs(findings);

  const counts = Object.fromEntries(
    TABS.map((s) => [s, s === "all" ? merged.length : merged.filter((f) => f.severity?.toLowerCase() === s).length])
  ) as Record<typeof TABS[number], number>;

  const filtered = filter === "all" ? merged : merged.filter((f) => f.severity?.toLowerCase() === filter);
  const title = organ ? organ.organ_name : "All Findings";
  const eyebrow = organ ? `Organ Report · ${merged.length} Findings` : `Full Report · ${merged.length} Findings`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Drawer (Stitch dossier) */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-cream z-50 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.08)] border-l border-[#bcc9ca]/30">

        {/* Header */}
        <header className="flex-none px-8 pt-8 pb-5 border-b border-[#bcc9ca]/30 bg-cream/95 backdrop-blur-md z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-px h-7 bg-[#6d797b]" />
                <span className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3d494a]">
                  {eyebrow}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-newsreader)] text-[32px] leading-[1.2] text-[#006970] tracking-tight">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#3d494a] hover:bg-[#dee3e4] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006970]"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Tab strip */}
          <nav className="flex gap-6 overflow-x-auto border-b border-[#bcc9ca]/30">
            {TABS.map((s) => {
              const active = filter === s;
              const disabled = counts[s] === 0 && s !== "all";
              return (
                <button
                  key={s}
                  onClick={() => !disabled && setFilter(s)}
                  disabled={disabled}
                  className={cn(
                    "pb-3 -mb-px border-b-2 font-[family-name:var(--font-inter)] text-[13px] font-medium whitespace-nowrap transition-colors capitalize",
                    active
                      ? "border-[#006970] text-[#006970]"
                      : "border-transparent text-[#3d494a] hover:text-[#006970]",
                    disabled && "text-[#bcc9ca] cursor-not-allowed hover:text-[#bcc9ca]"
                  )}
                >
                  {s === "all" ? "All" : s} ({counts[s]})
                </button>
              );
            })}
          </nav>
        </header>

        {/* Findings list */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {findings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-[#dee3e4] flex items-center justify-center mb-4">
                <FlaskConical className="h-7 w-7 text-[#6d797b]" />
              </div>
              <p className="font-[family-name:var(--font-inter)] text-[14px] font-semibold text-[#3d494a]">No parameters recorded</p>
              <p className="font-[family-name:var(--font-inter)] text-[12px] text-[#6d797b] mt-1 leading-relaxed max-w-xs">
                No tests for this organ system were uploaded in this report.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-[#dee3e4] flex items-center justify-center mb-4">
                <FlaskConical className="h-7 w-7 text-[#6d797b]" />
              </div>
              <p className="font-[family-name:var(--font-inter)] text-[14px] font-semibold text-[#3d494a]">No findings for this filter</p>
              <p className="font-[family-name:var(--font-inter)] text-[12px] text-[#6d797b] mt-1">Try selecting a different severity</p>
            </div>
          ) : (
            filtered.map((f) => <FindingCard key={f.id} finding={f} />)
          )}
        </div>

        {/* Footer */}
        <footer className="flex-none p-5 border-t border-[#bcc9ca]/30 bg-cream flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#006970] hover:bg-[#004f54] text-white font-[family-name:var(--font-inter)] text-[13px] font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Close
          </button>
        </footer>
      </aside>
    </>
  );
}
