"use client";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Finding, OrganScore } from "@/lib/api";
import SeverityBadge from "@/components/ui/SeverityBadge";
import { cn } from "@/lib/utils";

function FindingCard({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={finding.severity} />
            <span className="text-xs text-gray-400">{finding.test_type}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-800">{finding.name}</p>
          {finding.value && (
            <p className="mt-0.5 text-xs text-gray-500">
              {finding.value}{finding.unit ? ` ${finding.unit}` : ""}
              {finding.normal_range ? ` · Normal: ${finding.normal_range}` : ""}
            </p>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>

      {open && (finding.description || finding.clinical_findings || finding.recommendations) && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3 text-sm">
          {finding.description && (
            <p className="text-gray-600 leading-relaxed">{finding.description}</p>
          )}
          {finding.clinical_findings && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Clinical Findings</p>
              <p className="text-gray-600 leading-relaxed">{finding.clinical_findings}</p>
            </div>
          )}
          {finding.recommendations && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Recommendations</p>
              <p className="text-gray-600 leading-relaxed">{finding.recommendations}</p>
            </div>
          )}
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

export default function FindingsPanel({ organ, findings, onClose }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? findings : findings.filter((f) => f.severity?.toLowerCase() === filter);
  const severities = ["all", "critical", "major", "minor", "normal"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            {organ && <p className="text-2xl mb-1">{organ.icon}</p>}
            <h2 className="text-xl font-bold text-gray-900">{organ?.organ_name ?? "All"} Findings</h2>
            <p className="text-sm text-gray-500 mt-0.5">{findings.length} finding{findings.length !== 1 ? "s" : ""} total</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto px-6 py-3 border-b border-gray-100">
          {severities.map((s) => {
            const count = s === "all" ? findings.length : findings.filter((f) => f.severity?.toLowerCase() === s).length;
            if (count === 0 && s !== "all") return null;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all",
                  filter === s
                    ? "bg-zen-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Findings list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No findings for this filter</p>
          ) : (
            filtered.map((f) => <FindingCard key={f.id} finding={f} />)
          )}
        </div>
      </div>
    </div>
  );
}
