"use client";

import Link from "next/link";
import { CheckCircle2, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { key: "blood",         label: "Blood Report",      icon: "🩸" },
  { key: "urine",         label: "Urine Analysis",    icon: "🧪" },
  { key: "dexa",          label: "DEXA Scan",         icon: "🦴" },
  { key: "calcium_score", label: "Calcium Score",     icon: "💛" },
  { key: "ecg",           label: "ECG",               icon: "💓" },
  { key: "chest_xray",    label: "Chest X-Ray",       icon: "🫁" },
  { key: "usg",           label: "Ultrasound",        icon: "🔊" },
  { key: "mri",           label: "MRI",               icon: "🧲" },
] as const;

/**
 * 8-tile grid that visualises which test types the patient has uploaded
 * vs which are still missing. Self-uploaded reports get this card up top
 * so the patient knows the report is partial — and missing tiles double
 * as the upsell surface ('book ZenScan to fill these in').
 */
export default function CoverageMap({
  uploadedSections = [],
  className,
}: {
  uploadedSections?: string[];
  className?: string;
}) {
  const uploaded = new Set(uploadedSections);
  const have = SECTIONS.filter((s) => uploaded.has(s.key)).length;
  const total = SECTIONS.length;
  const pct = Math.round((have / total) * 100);

  return (
    <div className={cn("rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden", className)}>
      <div className="bg-gradient-to-br from-zen-50 to-cream px-5 py-4 border-b border-black/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zen-700">Coverage</p>
            <p className="mt-1 text-[15px] font-bold text-zen-900">
              {have} of {total} test types
              <span className="ml-2 text-[12px] font-semibold text-gray-400">— {pct}% complete</span>
            </p>
          </div>
          <div className="text-right">
            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 rounded-full bg-zen-900 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-zen-800 transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add more
            </Link>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/5">
        {SECTIONS.map((s) => {
          const ok = uploaded.has(s.key);
          return (
            <div
              key={s.key}
              className={cn(
                "bg-white p-3 flex flex-col items-center text-center gap-1.5",
                !ok && "opacity-60",
              )}
            >
              <span className="text-[20px] leading-none">{s.icon}</span>
              <p className={cn(
                "text-[11px] font-semibold leading-tight",
                ok ? "text-zen-900" : "text-gray-500",
              )}>
                {s.label}
              </p>
              {ok ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Uploaded
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-gray-300">Missing</span>
              )}
            </div>
          );
        })}
      </div>

      {pct < 100 && (
        <Link
          href="/book"
          className="flex items-center justify-between gap-3 px-5 py-3 border-t border-black/5 hover:bg-cream/60 transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-3.5 w-3.5 text-zen-700" />
            <p className="text-[12px] font-semibold text-zen-900">
              Book a ZenScan to fill the missing {total - have} {total - have === 1 ? "test" : "tests"} in one visit
            </p>
          </div>
          <span className="text-[11px] font-bold text-zen-700 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      )}
    </div>
  );
}
