"use client";
import { useEffect, useState, useCallback } from "react";
import { X, Loader2, Sparkles, EyeOff, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = (process.env.NEXT_PUBLIC_API_URL || "https://zenlife.health/api/v1");

type ParamMeta = { name: string; unit: string; normal: string; paired_secondary: string | null };
type UnfilledResp = {
  ignored_params: string[];
  unfilled_by_section: Record<string, ParamMeta[]>;
  section_meta: Record<string, { label: string; icon: string }>;
};

interface Props {
  reportId: number;
  open: boolean;
  onClose: () => void;
  onProceed: () => void;     // called when admin hits "Generate Report"
}

/**
 * Right-side drawer that surfaces every parameter the admin hasn't entered
 * a value for, before the report is generated. Three actions per row:
 *
 *   1. Type a value → saves to the section, the row drops off the list
 *   2. Click "Ignore for this patient" → adds the param to the report's
 *      ignored_params list. The patient view excludes it from totals so the
 *      organ score isn't inflated by phantom 'Normal' entries
 *   3. Click "Restore" on an ignored row → un-ignore
 *
 * After the admin is done, "Generate Report" runs the original generation
 * pipeline (ZenScore + Body Age + Priorities).
 */
export default function PreGenerateDrawer({ reportId, open, onClose, onProceed }: Props) {
  const [data, setData] = useState<UnfilledResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingParam, setSavingParam] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/admin/reports/${reportId}/unfilled-params`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  if (!open) return null;

  async function saveValue(sectionType: string, name: string) {
    const value = (editValues[name] || "").trim();
    if (!value) return;
    setSavingParam(name);
    try {
      // Use the existing section-update endpoint: read current section then patch
      const cur = await fetch(`${BASE}/admin/reports/${reportId}/sections/${sectionType}`).then((r) => r.json());
      const params = cur.parameters || {};
      params[name] = {
        ...(params[name] || {}),
        value,
        severity: params[name]?.severity || "normal",
        clinical_findings: params[name]?.clinical_findings || "",
        recommendations: params[name]?.recommendations || "",
      };
      await fetch(`${BASE}/admin/reports/${reportId}/sections/${sectionType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_findings: cur.key_findings || "", parameters: params }),
      });
      setEditValues((p) => { const c = { ...p }; delete c[name]; return c; });
      await refresh();
    } finally {
      setSavingParam(null);
    }
  }

  async function ignoreParam(name: string) {
    setSavingParam(name);
    try {
      await fetch(`${BASE}/admin/reports/${reportId}/ignored-params`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ add: [name] }),
      });
      await refresh();
    } finally { setSavingParam(null); }
  }

  async function unignoreParam(name: string) {
    setSavingParam(name);
    try {
      await fetch(`${BASE}/admin/reports/${reportId}/ignored-params`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remove: [name] }),
      });
      await refresh();
    } finally { setSavingParam(null); }
  }

  const totalUnfilled = data ? Object.values(data.unfilled_by_section).reduce((s, l) => s + l.length, 0) : 0;
  const ignoredCount = data?.ignored_params.length || 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl bg-cream shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-black/5 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-zen-900">Review unfilled parameters</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {totalUnfilled} unfilled · {ignoredCount} ignored · enter a value or mark Ignore so blanks aren't treated as &lsquo;Normal&rsquo;
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zen-600" /></div>
          ) : !data ? (
            <p className="text-sm text-gray-500">Failed to load.</p>
          ) : totalUnfilled === 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              ✓ All parameters have values or are explicitly ignored. Ready to generate.
            </div>
          ) : (
            Object.entries(data.unfilled_by_section).map(([sec, params]) => {
              const meta = data.section_meta[sec] || { label: sec, icon: "•" };
              return (
                <section key={sec}>
                  <h3 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">
                    {meta.icon} {meta.label} <span className="ml-1 text-gray-400">({params.length})</span>
                  </h3>
                  <div className="space-y-1.5">
                    {params.map((p) => (
                      <div key={p.name} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800">{p.name}</p>
                          {(p.unit || p.normal) && (
                            <p className="truncate text-[11px] text-gray-400">
                              {p.unit && <>Unit: {p.unit}</>}
                              {p.unit && p.normal ? " · " : ""}
                              {p.normal && <>Normal: {p.normal}</>}
                            </p>
                          )}
                        </div>
                        <input
                          type="text"
                          value={editValues[p.name] || ""}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") saveValue(sec, p.name); }}
                          placeholder="Value"
                          className="w-28 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-zen-500"
                          disabled={savingParam === p.name}
                        />
                        <button
                          onClick={() => saveValue(sec, p.name)}
                          disabled={!(editValues[p.name] || "").trim() || savingParam === p.name}
                          className="rounded-lg bg-zen-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-zen-600 disabled:opacity-30"
                        >
                          {savingParam === p.name ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                        </button>
                        <button
                          onClick={() => ignoreParam(p.name)}
                          disabled={savingParam === p.name}
                          title="Exclude this parameter from this patient's report"
                          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] font-semibold text-gray-500 hover:bg-gray-50"
                        >
                          <EyeOff className="h-3 w-3" /> Ignore
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}

          {/* Ignored list — let admin restore */}
          {data && data.ignored_params.length > 0 && (
            <section>
              <h3 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">
                Ignored for this patient ({data.ignored_params.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.ignored_params.map((n) => (
                  <button
                    key={n}
                    onClick={() => unignoreParam(n)}
                    disabled={savingParam === n}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold text-gray-600 hover:bg-cream"
                    title="Restore — include this parameter again"
                  >
                    <Eye className="h-3 w-3" /> {n}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-black/5 bg-white px-6 py-4 flex items-center justify-between gap-3">
          <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-zen-900">
            Cancel
          </button>
          <button
            onClick={() => { onClose(); onProceed(); }}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md",
              totalUnfilled === 0 ? "bg-zen-800 hover:bg-zen-700" : "bg-zen-600 hover:bg-zen-500"
            )}
          >
            <Sparkles className="h-4 w-4" />
            {totalUnfilled === 0 ? "Generate Report" : `Generate anyway (${totalUnfilled} unfilled)`}
          </button>
        </footer>
      </div>
    </>
  );
}
