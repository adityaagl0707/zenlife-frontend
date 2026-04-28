"use client";
import { cn } from "@/lib/utils";
import { OrganScore } from "@/lib/api";

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

export default function OrganGrid({ organs, onSelect }: { organs: OrganScore[]; onSelect: (organ: OrganScore) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {organs.map((organ) => {
        const s = organ.severity?.toLowerCase() ?? "normal";
        return (
          <button
            key={organ.id}
            onClick={() => onSelect(organ)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl p-4 ring-2 transition-all hover:scale-105 hover:shadow-md text-center",
              SEVERITY_RING[s] ?? SEVERITY_RING.normal
            )}
          >
            <span className="text-3xl">{organ.icon}</span>
            <p className="text-sm font-bold text-gray-800">{organ.organ_name}</p>
            <span className={cn("text-xs font-semibold capitalize", SEVERITY_TEXT[s] ?? SEVERITY_TEXT.normal)}>
              {organ.risk_label}
            </span>
            {(organ.critical_count > 0 || organ.major_count > 0) && (
              <div className="flex gap-1 flex-wrap justify-center">
                {organ.critical_count > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                    {organ.critical_count} critical
                  </span>
                )}
                {organ.major_count > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    {organ.major_count} major
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
