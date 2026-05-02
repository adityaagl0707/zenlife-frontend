"use client";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganScore, Finding } from "@/lib/api";
import { computeOrganCounts } from "@/lib/organParamMap";

const SEV_TOP: Record<string, string> = {
  critical: "bg-red-500",
  major:    "bg-amber-400",
  minor:    "bg-yellow-400",
  normal:   "bg-emerald-400",
};

const SEV_TEXT: Record<string, string> = {
  critical: "text-red-600",
  major:    "text-amber-600",
  minor:    "text-yellow-600",
  normal:   "text-emerald-600",
};

const SEV_PILL: Record<string, string> = {
  critical: "bg-red-50 text-red-700",
  major:    "bg-amber-50 text-amber-700",
  minor:    "bg-yellow-50 text-yellow-700",
};

const SEV_DOT: Record<string, string> = {
  critical: "bg-red-500",
  major:    "bg-amber-400",
  minor:    "bg-yellow-400",
};

export default function OrganGrid({
  organs,
  findings = [],
  onSelect,
}: {
  organs: OrganScore[];
  findings?: Finding[];
  /** Kept for API compatibility — no longer used now that the denominator
   *  is the count of imported (non-pending) findings. */
  ignoredParams?: string[];
  patientGender?: string;
  onSelect: (organ: OrganScore) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 auto-rows-fr">
      {organs.map((organ) => {
        const s = organ.severity?.toLowerCase() ?? "normal";
        const counts = computeOrganCounts(organ.organ_name, findings);
        // Pending params (no Finding row yet) are excluded from the patient
        // view: the denominator is what's actually been imported, not the
        // theoretical applicable total. Operators see pending in admin.
        const imported = counts.critical + counts.major + counts.minor + counts.normal;
        const abnormal = counts.critical + counts.major + counts.minor;
        const totalParams = imported;
        const allNormal = imported > 0 && abnormal === 0;
        const noData = imported === 0;

        return (
          <button
            key={organ.id}
            onClick={() => onSelect(organ)}
            className="group relative flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm ring-1 ring-black/5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-black/10 min-h-[150px]"
          >
            {/* Severity colour band at top */}
            <div className={cn("h-[3px] w-full", SEV_TOP[s] ?? SEV_TOP.normal)} />

            <div className="flex flex-col gap-3 p-4 flex-1">
              {/* Header — icon + name + status */}
              <div className="flex items-start gap-2.5">
                <span className="text-[22px] leading-none mt-0.5 flex-shrink-0">{organ.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-gray-900 leading-snug truncate">{organ.organ_name}</p>
                  <p className={cn("text-[11px] font-semibold capitalize leading-tight mt-0.5", SEV_TEXT[s] ?? SEV_TEXT.normal)}>
                    {organ.risk_label}
                  </p>
                </div>
              </div>

              {/* Status footer — single, decisive line */}
              <div className="mt-auto pt-3 border-t border-gray-100">
                {noData ? (
                  <p className="text-[10px] text-gray-300 italic">No data imported</p>
                ) : allNormal ? (
                  /* Quietly reassuring — green check + single line */
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <Check className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-[11px] font-semibold">
                      All {imported} {imported === 1 ? "parameter" : "parameters"} healthy
                    </span>
                  </div>
                ) : (
                  /* Abnormal — focus only on what needs attention */
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-gray-500">
                      <span className="font-bold text-gray-800">{abnormal}</span>
                      <span className="text-gray-400"> of {totalParams} need attention</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(["critical", "major", "minor"] as const)
                        .filter((sev) => counts[sev] > 0)
                        .map((sev) => (
                          <span
                            key={sev}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                              SEV_PILL[sev]
                            )}
                          >
                            <span className={cn("h-1 w-1 rounded-full", SEV_DOT[sev])} />
                            {counts[sev]} {sev}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hover caret — top-right */}
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
