"use client";
import { cn } from "@/lib/utils";
import { BodyAge } from "@/lib/api";
import { Dna, TrendingDown, TrendingUp, Minus, Activity, Heart, Bone, Flame, Droplets } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function ageDiffColor(diff: number | null) {
  if (diff === null) return { text: "text-gray-500", bg: "bg-gray-100", bar: "bg-gray-300" };
  if (diff <= -2) return { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-400" };
  if (diff < 0)  return { text: "text-emerald-500", bg: "bg-emerald-50", bar: "bg-emerald-300" };
  if (diff < 2)  return { text: "text-gray-600",    bg: "bg-gray-50",    bar: "bg-gray-300"    };
  if (diff < 5)  return { text: "text-amber-600",   bg: "bg-amber-50",   bar: "bg-amber-400"   };
  return           { text: "text-red-600",     bg: "bg-red-50",     bar: "bg-red-400"     };
}

function AgeDiffLabel({ diff }: { diff: number | null }) {
  if (diff === null) return <span className="text-gray-400">Not yet calculated</span>;
  const abs = Math.abs(diff);
  const col = ageDiffColor(diff);
  if (diff < -0.5)
    return (
      <span className={cn("inline-flex items-center gap-1 font-bold", col.text)}>
        <TrendingDown className="h-4 w-4" />
        {abs.toFixed(1)} years younger than your age
      </span>
    );
  if (diff > 0.5)
    return (
      <span className={cn("inline-flex items-center gap-1 font-bold", col.text)}>
        <TrendingUp className="h-4 w-4" />
        {abs.toFixed(1)} years older than your age
      </span>
    );
  return (
    <span className={cn("inline-flex items-center gap-1 font-bold", col.text)}>
      <Minus className="h-4 w-4" />
      At par with your chronological age
    </span>
  );
}

// ── Age comparison visual ──────────────────────────────────────────────────

function AgeComparisonBar({
  zenAge,
  chronologicalAge,
}: {
  zenAge: number;
  chronologicalAge: number;
}) {
  const min = 20;
  const max = 80;
  const range = max - min;

  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  const pct = (v: number) => ((clamp(v) - min) / range) * 100;

  const diff = zenAge - chronologicalAge;
  const col = ageDiffColor(diff);

  return (
    <div className="mt-4 mb-2">
      <div className="relative h-3 rounded-full bg-gray-100">
        {/* Normal zone (chronological ±2) */}
        <div
          className="absolute inset-y-0 rounded-full bg-emerald-100"
          style={{
            left: `${pct(chronologicalAge - 3)}%`,
            right: `${100 - pct(chronologicalAge + 3)}%`,
          }}
        />
        {/* Chronological age marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${pct(chronologicalAge)}%` }}
        >
          <div className="h-4 w-1 rounded-full bg-gray-400" />
        </div>
        {/* ZenAge dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-all duration-700"
          style={{ left: `${pct(zenAge)}%` }}
        >
          <div className={cn("h-5 w-5 rounded-full border-2 border-white shadow-md ring-1 ring-black/10", col.bar)} />
        </div>
      </div>
      <div className="flex justify-between text-[9px] text-gray-300 mt-1 font-medium px-0.5">
        <span>{min}</span>
        <span>Age scale</span>
        <span>{max}</span>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-4 rounded-full bg-gray-400 inline-block" />
          Your age ({Math.round(chronologicalAge)})
        </span>
        <span className="flex items-center gap-1.5">
          <span className={cn("h-3 w-3 rounded-full inline-block", col.bar)} />
          ZenAge ({Math.round(zenAge)})
        </span>
      </div>
    </div>
  );
}

// ── Sub-age pill ────────────────────────────────────────────────────────────

const SUB_AGE_CONFIG = [
  { key: "metabolic_age",      label: "Metabolic",     Icon: Activity },
  { key: "cardiovascular_age", label: "Vascular",      Icon: Heart    },
  { key: "bone_age",           label: "Bone & Muscle", Icon: Bone     },
  { key: "inflammatory_age",   label: "Inflammation",  Icon: Flame    },
  { key: "renal_age",          label: "Kidney",        Icon: Droplets },
] as const;

function SubAgePill({
  label,
  age,
  chronologicalAge,
  Icon,
}: {
  label: string;
  age: number;
  chronologicalAge: number;
  Icon: React.ElementType;
}) {
  const diff = age - chronologicalAge;
  const col = ageDiffColor(diff);

  return (
    <div className={cn("rounded-xl p-3 flex flex-col gap-1", col.bg)}>
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", col.text)} />
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
      </div>
      <p className={cn("text-xl font-black leading-none", col.text)}>{Math.round(age)}</p>
      <p className="text-[9px] text-gray-400 font-medium">years</p>
    </div>
  );
}

// ── Confidence badge ────────────────────────────────────────────────────────

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const cfg = {
    high:   { label: "High confidence",   cls: "bg-emerald-100 text-emerald-700" },
    medium: { label: "Medium confidence", cls: "bg-amber-100 text-amber-700"     },
    low:    { label: "Low confidence",    cls: "bg-gray-100 text-gray-500"       },
  }[confidence] ?? { label: confidence, cls: "bg-gray-100 text-gray-500" };

  return (
    <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", cfg.cls)}>
      {cfg.label}
    </span>
  );
}

// ── Main card ───────────────────────────────────────────────────────────────

export default function ZenAgeCard({ bodyAge }: { bodyAge: BodyAge }) {
  const {
    zen_age,
    chronological_age,
    pheno_age,
    age_difference,
    confidence,
    interpretation,
    markers_used,
    markers_missing,
    sub_ages,
  } = bodyAge;

  const diff = age_difference;
  const col = ageDiffColor(diff);

  const subAgeEntries = SUB_AGE_CONFIG.filter(
    (cfg) => sub_ages[cfg.key] != null && chronological_age != null
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-violet-50 to-white flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
          <Dna className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-violet-700 leading-tight">ZenAge — Biological Age</p>
          <p className="text-[10px] text-gray-400">Powered by PhenoAge (Levine 2018) + Claude AI</p>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Main age comparison */}
        <div className="flex items-start gap-6">
          {/* ZenAge big number */}
          <div className="flex-shrink-0 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">ZenAge</p>
            <p className={cn("text-6xl font-black leading-none", col.text)}>
              {zen_age != null ? Math.round(zen_age) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">years</p>
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[11px] text-gray-400 mb-0.5">
              Chronological age: <span className="font-bold text-gray-700">{chronological_age != null ? Math.round(chronological_age) : "—"} yrs</span>
            </p>
            {pheno_age != null && (
              <p className="text-[11px] text-gray-400 mb-1.5">
                PhenoAge (formula): <span className="font-semibold text-gray-600">{pheno_age.toFixed(1)} yrs</span>
              </p>
            )}
            <AgeDiffLabel diff={diff} />
          </div>
        </div>

        {/* Visual bar */}
        {zen_age != null && chronological_age != null && (
          <AgeComparisonBar zenAge={zen_age} chronologicalAge={chronological_age} />
        )}

        {/* AI interpretation */}
        {interpretation && (
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[12px] text-gray-600 leading-relaxed">{interpretation}</p>
          </div>
        )}

        {/* Sub-ages grid */}
        {subAgeEntries.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Domain Ages</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {subAgeEntries.map(({ key, label, Icon }) => (
                <SubAgePill
                  key={key}
                  label={label}
                  age={sub_ages[key] as number}
                  chronologicalAge={chronological_age!}
                  Icon={Icon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Markers used / missing */}
        <div className="border-t border-gray-50 pt-4 grid grid-cols-2 gap-4 text-[11px]">
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Markers used ({markers_used.length})
            </p>
            <p className="text-gray-500 leading-relaxed">
              {markers_used.map((m) => m.replace(/_/g, " ")).join(", ") || "—"}
            </p>
          </div>
          {markers_missing.length > 0 && (
            <div>
              <p className="font-bold text-amber-500 uppercase tracking-wider mb-1.5">
                Missing ({markers_missing.length})
              </p>
              <p className="text-gray-400 leading-relaxed">
                {markers_missing.map((m) => m.replace(/_/g, " ")).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
