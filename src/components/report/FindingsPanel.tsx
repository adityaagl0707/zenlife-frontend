"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { Finding, OrganScore } from "@/lib/api";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  major: "bg-orange-100 text-orange-700",
  minor: "bg-yellow-100 text-yellow-700",
  normal: "bg-emerald-100 text-emerald-700",
};

function SevBadge({ severity }: { severity?: string }) {
  const s = severity?.toLowerCase() ?? "normal";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide", SEVERITY_COLORS[s] ?? SEVERITY_COLORS.normal)}>
      {severity ?? "Normal"}
    </span>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <h3 className="text-base font-bold text-gray-900 leading-snug">{finding.name}</h3>
        <SevBadge severity={finding.severity} />
      </div>

      {/* Description */}
      {finding.description && (
        <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{finding.description}</p>
      )}

      {/* Value vs Normal */}
      {(finding.value || finding.normal_range) && (
        <div className="mx-5 mb-4 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 font-medium mb-0.5">{finding.name}</p>
            <p className="text-xs text-gray-400">
              Normal: <span className="font-semibold text-gray-600">{finding.normal_range ?? "—"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <span className="text-lg font-extrabold text-gray-900">
              {finding.value ?? "—"}{finding.unit ? ` ${finding.unit}` : ""}
            </span>
            <SevBadge severity={finding.severity} />
          </div>
        </div>
      )}

      {/* Clinical Findings */}
      {finding.clinical_findings && (
        <div className="px-5 pb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Clinical Findings</p>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600 leading-relaxed">{finding.clinical_findings}</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {finding.recommendations && (
        <div className="px-5 pb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Recommendations</p>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600 leading-relaxed">{finding.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  organ: OrganScore | null;
  findings: Finding[];
  onClose: () => void;
}

export default function FindingsPanel({ findings, onClose }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const severities = ["all", "critical", "major", "minor", "normal"];
  const counts = Object.fromEntries(
    severities.map((s) => [s, s === "all" ? findings.length : findings.filter((f) => f.severity?.toLowerCase() === s).length])
  );

  const filtered = filter === "all" ? findings : findings.filter((f) => f.severity?.toLowerCase() === filter);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Right-side drawer */}
      <div className="fixed right-0 inset-y-0 z-50 flex w-full max-w-md flex-col bg-gray-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Overall Report by Severity</h2>
            <p className="text-xs text-gray-400 mt-0.5">{findings.length} total findings</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Severity filter tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-5 py-3">
          {severities.map((s) => {
            if (counts[s] === 0 && s !== "all") return null;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                  filter === s
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {s === "all" ? `All (${counts[s]})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
              </button>
            );
          })}
        </div>

        {/* Findings list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">No findings for this filter</p>
          ) : (
            filtered.map((f) => <FindingCard key={f.id} finding={f} />)
          )}
        </div>
      </div>
    </>
  );
}
