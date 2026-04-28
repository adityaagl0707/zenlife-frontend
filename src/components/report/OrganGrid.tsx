"use client";
import { cn } from "@/lib/utils";
import { OrganScore, Finding } from "@/lib/api";
import { computeOrganCounts } from "@/lib/organParamMap";

const SEVERITY_RING: Record<string, string> = {
  critical: "ring-red-500 bg-red-50",
  major: "ring-amber-400 bg-amber-50",
  minor: "ring-yellow-400 bg-yellow-50",
  normal: "ring-emerald-400 bg-emerald-50",
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-red-600",
  major: "text-amber-600",
  minor: "text-yellow-600",
  normal: "text-emerald-600",
};

const COUNT_STYLES = {
  critical: "bg-red-100 text-red-700 border border-red-200",
  major: "bg-amber-100 text-amber-700 border border-amber-200",
  minor: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  normal: "bg-emerald-100 text-emerald-700 border border-emerald-200",
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {organs.map((organ) => {
        const s = organ.severity?.toLowerCase() ?? "normal";
        const computed = computeOrganCounts(organ.organ_name, findings);
        const total = computed.critical + computed.major + computed.minor + computed.normal;

        // Use computed counts if findings were imported; fall back to DB counts
        const counts = total > 0 ? computed : {
          critical: organ.critical_count ?? 0,
          major: organ.major_count ?? 0,
          minor: organ.minor_count ?? 0,
          normal: organ.normal_count ?? 0,
        };

        const countTotal = counts.critical + counts.major + counts.minor + counts.normal;

        return (
          <button
            key={organ.id}
            onClick={() => onSelect(organ)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl p-4 ring-2 transition-all hover:scale-105 hover:shadow-md text-left w-full",
              SEVERITY_RING[s] ?? SEVERITY_RING.normal
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-2xl">{organ.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-800 leading-tight">{organ.organ_name}</p>
                <span className={cn("text-[11px] font-semibold capitalize", SEVERITY_TEXT[s] ?? SEVERITY_TEXT.normal)}>
                  {organ.risk_label}
                </span>
              </div>
            </div>

            {countTotal > 0 ? (
              <div className="grid grid-cols-2 gap-1 w-full">
                {(["critical", "major", "minor", "normal"] as const).map((sev) => (
                  <div
                    key={sev}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-2 py-1 text-[10px] font-semibold",
                      COUNT_STYLES[sev]
                    )}
                  >
                    <span className="capitalize">{sev}</span>
                    <span className="font-bold">{counts[sev]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400">No parameters mapped yet</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
