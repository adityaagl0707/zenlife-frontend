"use client";
import { cn } from "@/lib/utils";
import { OrganScore, Finding } from "@/lib/api";
import { computeOrganCounts, organTotalParams } from "@/lib/organParamMap";

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

const SEV_BG_LIGHT: Record<string, string> = {
  critical: "bg-red-50",
  major:    "bg-amber-50",
  minor:    "bg-yellow-50",
  normal:   "bg-emerald-50",
};

const SEV_DOT: Record<string, string> = {
  critical: "bg-red-500",
  major:    "bg-amber-400",
  minor:    "bg-yellow-400",
  normal:   "bg-emerald-400",
};

const PILL_STYLE: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  major:    "bg-amber-100 text-amber-700",
  minor:    "bg-yellow-100 text-yellow-700",
  normal:   "bg-emerald-100 text-emerald-700",
};

export default function OrganGrid({
  organs,
  findings = [],
  onSelect,
}: {
  organs: OrganScore[];
  findings?: Finding[];
  onSelect: (organ: OrganScore) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {organs.map((organ) => {
        const s = organ.severity?.toLowerCase() ?? "normal";
        const counts = computeOrganCounts(organ.organ_name, findings);
        const totalParams = organTotalParams(organ.organ_name);
        const imported = counts.critical + counts.major + counts.minor + counts.normal;

        // Mini severity distribution bar segments
        const segments = [
          { key: "critical", val: counts.critical, color: "bg-red-500" },
          { key: "major",    val: counts.major,    color: "bg-amber-400" },
          { key: "minor",    val: counts.minor,    color: "bg-yellow-400" },
          { key: "normal",   val: counts.normal,   color: "bg-emerald-400" },
        ].filter(seg => seg.val > 0);

        return (
          <button
            key={organ.id}
            onClick={() => onSelect(organ)}
            className="group relative flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm ring-1 ring-black/5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-black/10"
          >
            {/* Severity colour band at top */}
            <div className={cn("h-[3px] w-full", SEV_TOP[s] ?? SEV_TOP.normal)} />

            <div className="flex flex-col gap-2 p-4 flex-1">
              {/* Icon + Name */}
              <div className="flex items-start gap-2">
                <span className="text-2xl leading-none mt-0.5">{organ.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-gray-900 leading-snug">{organ.organ_name}</p>
                  <p className={cn("text-[11px] font-semibold capitalize leading-tight", SEV_TEXT[s] ?? SEV_TEXT.normal)}>
                    {organ.risk_label}
                  </p>
                </div>
              </div>

              {/* Param count */}
              {totalParams > 0 && (
                <p className="text-[10px] text-gray-400 font-medium">
                  {totalParams} parameters
                </p>
              )}

              <div className="mt-auto pt-2 border-t border-gray-100 space-y-2">
                {imported > 0 ? (
                  <>
                    {/* Mini distribution bar */}
                    {segments.length > 0 && (
                      <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
                        {segments.map(seg => (
                          <div
                            key={seg.key}
                            className={cn("h-full rounded-full", seg.color)}
                            style={{ flex: seg.val }}
                          />
                        ))}
                      </div>
                    )}
                    {/* Severity inline pills */}
                    <div className="flex flex-wrap gap-1">
                      {(["critical", "major", "minor", "normal"] as const).filter(sev => counts[sev] > 0).map(sev => (
                        <span key={sev} className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold", PILL_STYLE[sev])}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", SEV_DOT[sev])} />
                          {counts[sev]}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[10px] text-gray-300 italic">No data imported</p>
                )}
              </div>
            </div>

            {/* Hover caret */}
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        );
      })}
    </div>
  );
}
