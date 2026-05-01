"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Sparkles, Download, CheckCircle2, AlertTriangle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://zenlife-backend-j5q9.onrender.com").replace(/\/api\/v1\/?$/, "");

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  major:    "bg-orange-100 text-orange-700 border-orange-200",
  minor:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  normal:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending:  "bg-gray-100 text-gray-400 border-gray-200",
};

export const SECTION_META: Record<string, { label: string; icon: string; has_key_findings: boolean; female_only?: boolean }> = {
  blood:         { label: "Blood Report",         icon: "🩸", has_key_findings: false },
  urine:         { label: "Urine Analysis",       icon: "🧪", has_key_findings: false },
  dexa:          { label: "DEXA Scan",            icon: "🦴", has_key_findings: true },
  calcium_score: { label: "Calcium Score",        icon: "💛", has_key_findings: true },
  ecg:           { label: "ECG Report",           icon: "💓", has_key_findings: false },
  chest_xray:    { label: "Chest X-Ray",          icon: "🫁", has_key_findings: true },
  usg:           { label: "USG Report",           icon: "🔊", has_key_findings: true },
  mri:           { label: "MRI Report",           icon: "🧲", has_key_findings: true },
  mammography:   { label: "Mammography",          icon: "🎀", has_key_findings: true, female_only: true },
};

export const SECTION_ORDER = ["blood", "urine", "dexa", "calcium_score", "ecg", "chest_xray", "usg", "mri", "mammography"];

export function visibleSectionsForGender(gender?: string): string[] {
  const isFemale = (gender || "").toUpperCase() === "F" || (gender || "").toUpperCase() === "FEMALE";
  return SECTION_ORDER.filter((st) => !SECTION_META[st].female_only || isFemale);
}

type ParamDef = { name: string; unit: string; normal: string };
type ParamValue = { value: string; severity: string; clinical_findings: string; recommendations: string };
type SectionData = { key_findings: string; parameters: Record<string, ParamValue>; param_definitions: ParamDef[] };

function SeverityBadge({ sev }: { sev: string }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border", SEVERITY_COLORS[sev] || SEVERITY_COLORS.normal)}>
      {sev}
    </span>
  );
}

function ParamRow({
  def,
  val,
  onChange,
}: {
  def: ParamDef;
  val: ParamValue;
  onChange: (v: ParamValue) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPending = !val.value?.trim();
  const sev = isPending ? "pending" : (val.severity || "normal");

  // Auto-classify severity when value changes
  const autoClassify = useCallback(async (value: string) => {
    if (!value.trim() || !def.normal) return;
    setClassifying(true);
    try {
      const res = await fetch(`${API}/api/v1/admin/classify-value`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, normal_range: def.normal }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.severity) onChange({ ...val, value, severity: data.severity });
      }
    } catch { /* silent fail — user can set manually */ }
    finally { setClassifying(false); }
  }, [def.normal, val, onChange]);

  function handleValueChange(newValue: string) {
    onChange({ ...val, value: newValue });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (newValue.trim()) {
      debounceRef.current = setTimeout(() => autoClassify(newValue), 600);
    }
  }

  const borderColor = sev === "critical" ? "border-red-200" : sev === "major" ? "border-orange-200" : sev === "minor" ? "border-yellow-200" : "border-gray-100";

  return (
    <div className={cn("rounded-xl border mb-2 overflow-hidden", borderColor)}>
      {/* Header row */}
      <div className={cn("flex items-center gap-3 px-4 py-3", isPending ? "bg-gray-50" : "bg-white")}>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold truncate", isPending ? "text-gray-400" : "text-gray-800")}>{def.name}</p>
          <p className="text-xs text-gray-400">{def.unit ? `Unit: ${def.unit}` : ""}{def.normal ? ` · Normal: ${def.normal}` : ""}</p>
        </div>
        <input
          type="text"
          value={val.value || ""}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Value"
          className="w-28 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-zen-500"
        />
        {isPending ? (
          <span className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-400 w-[90px] text-center">
            ⏳ pending
          </span>
        ) : classifying ? (
          <span className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-semibold text-gray-400 w-[90px]">
            <Loader2 className="h-3 w-3 animate-spin" /> AI…
          </span>
        ) : (
          <select
            value={val.severity || "normal"}
            onChange={(e) => onChange({ ...val, severity: e.target.value })}
            className={cn("rounded-lg border px-2 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer", SEVERITY_COLORS[val.severity || "normal"] || SEVERITY_COLORS.normal)}
            title="AI-classified · click to override"
          >
            {["normal", "minor", "major", "critical"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded: clinical findings + recommendations */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Clinical Findings</p>
            <textarea
              value={val.clinical_findings || ""}
              onChange={(e) => onChange({ ...val, clinical_findings: e.target.value })}
              rows={2}
              placeholder="AI-generated or manually entered clinical interpretation..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zen-500 resize-none"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Recommendations</p>
            <textarea
              value={val.recommendations || ""}
              onChange={(e) => onChange({ ...val, recommendations: e.target.value })}
              rows={2}
              placeholder="AI-generated or manually entered recommendations..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zen-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionPanel({
  reportId,
  sectionType,
  initialData,
  onSaved,
}: {
  reportId: number;
  sectionType: string;
  initialData: SectionData | null;
  onSaved: () => void;
}) {
  const meta = SECTION_META[sectionType];
  const fileRef = useRef<HTMLInputElement>(null);

  const [keyFindings, setKeyFindings] = useState(initialData?.key_findings || "");
  const [params, setParams] = useState<Record<string, ParamValue>>(() => {
    const saved = initialData?.parameters || {};
    const defs = initialData?.param_definitions || [];
    const merged: Record<string, ParamValue> = {};
    for (const d of defs) {
      merged[d.name] = saved[d.name] || { value: "", severity: "normal", clinical_findings: "", recommendations: "" };
    }
    return merged;
  });
  const [defs, setDefs] = useState<ParamDef[]>(initialData?.param_definitions || []);
  const [extracting, setExtracting] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [filterSev, setFilterSev] = useState("all");
  const [search, setSearch] = useState("");
  const templateFileRef = useRef<HTMLInputElement>(null);

  const filteredDefs = defs.filter((d) => {
    const hasValue = !!(params[d.name]?.value?.trim());
    const effectiveSev = hasValue ? (params[d.name]?.severity || "normal") : "pending";
    const matchSev = filterSev === "all" || effectiveSev === filterSev;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  });

  // Counts per severity — only count parameters that have a value (skip pending)
  const counts = { critical: 0, major: 0, minor: 0, normal: 0 };
  for (const d of defs) {
    if (!params[d.name]?.value?.trim()) continue; // pending — exclude from C/M/m/N counts
    const s = (params[d.name]?.severity || "normal") as keyof typeof counts;
    counts[s] = (counts[s] || 0) + 1;
  }

  async function handleExtract(file: File) {
    setExtracting(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/api/v1/admin/reports/${reportId}/sections/${sectionType}/extract`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Extraction failed");
      }
      const data = await res.json();
      const extracted = data.extracted || {};
      setParams((prev) => {
        const updated = { ...prev };
        for (const [name, val] of Object.entries(extracted)) {
          if (typeof val === "object" && val !== null) {
            updated[name] = val as ParamValue;
          }
        }
        return updated;
      });
      setMsg("✓ AI extraction complete — review values below and save.");
    } catch (e: unknown) {
      setMsg(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setExtracting(false);
    }
  }

  // ── Filled-template (Excel) upload ────────────────────────────────────────
  async function handleTemplateUpload(file: File) {
    setUploadingTemplate(true);
    setMsg("Reading filled template…");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/api/v1/admin/upload-lab-results`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || "Upload failed");
      }
      const data = await res.json();
      const findings: Array<{ name: string; value: string; severity: string }> = data.findings || [];

      // Merge values into the section's param map (case-insensitive name match)
      setParams((prev) => {
        const updated = { ...prev };
        const lookup = new Map(defs.map((d) => [d.name.toLowerCase(), d.name]));
        let merged = 0;
        for (const f of findings) {
          const canonical = lookup.get(f.name.toLowerCase());
          if (canonical) {
            updated[canonical] = {
              ...(updated[canonical] || { value: "", severity: "normal", clinical_findings: "", recommendations: "" }),
              value: f.value,
              severity: f.severity || updated[canonical]?.severity || "normal",
            };
            merged++;
          }
        }
        setMsg(`✓ Imported ${merged} values from template — review below and save.`);
        return updated;
      });
    } catch (e: unknown) {
      setMsg(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setUploadingTemplate(false);
    }
  }

  async function handleSaveAndApply() {
    setSaving(true);
    setMsg("Saving data…");
    try {
      const saveRes = await fetch(`${API}/api/v1/admin/reports/${reportId}/sections/${sectionType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_findings: keyFindings, parameters: params }),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      setMsg("Applying to report…");
      const importRes = await fetch(`${API}/api/v1/admin/reports/${reportId}/sections/${sectionType}/import-findings`, {
        method: "POST",
      });
      if (!importRes.ok) throw new Error("Apply failed");
      const importData = await importRes.json();
      setMsg(`✓ Saved & applied. ${importData.imported} new findings added. Organ scores syncing in background.`);
      onSaved();
    } catch (e: unknown) {
      setMsg(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  const filledCount = defs.filter((d) => params[d.name]?.value && params[d.name]?.value !== "Not Found").length;

  return (
    <div className="space-y-5">
      {/* Upload — two paths */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Option 1: AI extraction */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 flex flex-col">
          <p className="text-sm font-semibold text-gray-700 mb-1">Option 1 · Upload report (PDF or image)</p>
          <p className="text-xs text-gray-500 mb-3">AI reads the report and auto-fills all parameters below.</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleExtract(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={extracting || uploadingTemplate}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-zen-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zen-700 disabled:opacity-50 transition-colors"
          >
            {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {extracting ? "Extracting with AI…" : "Upload & Extract with AI"}
          </button>
        </div>

        {/* Option 2: Template */}
        {(sectionType === "blood" || sectionType === "urine") ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 flex flex-col">
            <p className="text-sm font-semibold text-gray-700 mb-1">Option 2 · Excel template</p>
            <p className="text-xs text-gray-500 mb-3">Download the template, fill in values offline, then upload to import. Covers blood &amp; urine markers.</p>
            <input
              ref={templateFileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleTemplateUpload(file);
                e.target.value = "";
              }}
            />
            <div className="mt-auto flex flex-wrap gap-2">
              <a
                href={`${API}/api/v1/admin/lab-template?report_id=${reportId}&section=${sectionType}`}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download template
              </a>
              <button
                onClick={() => templateFileRef.current?.click()}
                disabled={extracting || uploadingTemplate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zen-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zen-800 disabled:opacity-50 transition-colors"
              >
                {uploadingTemplate ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploadingTemplate ? "Uploading…" : "Upload filled template"}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-5 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-400">Excel template available for Blood Report and Urine Analysis only.</p>
            <p className="text-[11px] text-gray-300 mt-1">Use Option 1, or fill values manually below.</p>
          </div>
        )}
      </div>

      {/* Key Findings */}
      {meta.has_key_findings && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Key Findings / Impression</p>
          <textarea
            value={keyFindings}
            onChange={(e) => setKeyFindings(e.target.value)}
            rows={3}
            placeholder={`Enter the key findings / radiologist impression from the ${meta.label}...`}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zen-500 resize-none"
          />
        </div>
      )}

      {/* Parameter Review Table */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Parameters — {filledCount}/{defs.length} filled
            </p>
            <div className="flex gap-3 mt-1 text-xs flex-wrap">
              {(["critical", "major", "minor", "normal"] as const).map((s) =>
                counts[s] > 0 ? (
                  <span key={s} className={cn("font-semibold", { critical: "text-red-600", major: "text-orange-600", minor: "text-yellow-600", normal: "text-emerald-600" }[s])}>
                    {s.charAt(0).toUpperCase()}: {counts[s]}
                  </span>
                ) : null
              )}
              {defs.length - filledCount > 0 && (
                <span className="font-semibold text-gray-400">
                  ⏳ {defs.length - filledCount} pending
                </span>
              )}
              {filledCount === 0 && <span className="text-gray-400 italic">No values entered yet</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search parameter…"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zen-500"
            />
            {["all", "critical", "major", "minor", "normal", "pending"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSev(s)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all",
                  filterSev === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[480px] overflow-y-auto pr-1">
          {filteredDefs.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No parameters match your filter.</p>
          ) : (
            filteredDefs.map((d) => (
              <ParamRow
                key={d.name}
                def={d}
                val={params[d.name] || { value: "", severity: "normal", clinical_findings: "", recommendations: "" }}
                onChange={(v) => setParams((prev) => ({ ...prev, [d.name]: v }))}
              />
            ))
          )}
        </div>
      </div>

      {/* Action bar */}
      {msg && (
        <div className={cn("rounded-xl px-4 py-3 text-sm", msg.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700")}>
          {msg}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSaveAndApply}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-zen-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zen-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {saving ? msg : `Save & Apply ${meta.label}`}
        </button>
        <p className="text-xs text-gray-400">Saves data and immediately updates the report. Organ scores auto-sync.</p>
      </div>
    </div>
  );
}

// ── Test Status Panel ───────────────────────────────────────────────────────

export function TestStatusPanel({ reportId, sections, onSaved }: { reportId: number; sections: string[]; onSaved?: () => void }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    fetch(`${API}/api/v1/admin/reports/${reportId}/test-status`)
      .then((r) => r.json())
      .then((d) => setStatuses(d.test_statuses || {}))
      .finally(() => setLoading(false));
  }, [reportId]);

  async function update(section: string, value: string) {
    const next = { ...statuses, [section]: value };
    setStatuses(next);
    setSaving(true);
    try {
      await fetch(`${API}/api/v1/admin/reports/${reportId}/test-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test_statuses: next }),
      });
      setSavedAt(new Date().toLocaleTimeString());
      onSaved?.();
    } finally { setSaving(false); }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-zen-600" /></div>;

  const completeCount = sections.filter((s) => statuses[s] === "complete").length;
  const allComplete = completeCount === sections.length;

  return (
    <div className="space-y-5">
      <div className={cn(
        "rounded-2xl px-5 py-4 border",
        allComplete ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
      )}>
        <p className={cn("text-sm font-bold", allComplete ? "text-emerald-700" : "text-amber-700")}>
          {allComplete
            ? `✓ All tests complete (${completeCount}/${sections.length}) — patient sees “Test Complete · Report Pending”`
            : `${completeCount}/${sections.length} tests marked complete — patient sees “Billing Done · Test Pending”`}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">
          When the report is published from the Report tab, status becomes “Report Published”.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Test</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 w-44">Status</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => {
              const m = SECTION_META[s];
              const cur = statuses[s] || "pending";
              return (
                <tr key={s} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <span className="mr-2">{m.icon}</span>
                    <span className="font-medium text-gray-800">{m.label}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <select
                      value={cur}
                      onChange={(e) => update(s, e.target.value)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer",
                        cur === "complete"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      )}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="complete">✓ Complete</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        {saving ? "Saving…" : savedAt ? `Saved at ${savedAt}` : "Changes save automatically."}
      </p>
    </div>
  );
}

export default function ReportSectionsPanel({ reportId, patientGender, onSaved: externalOnSaved }: { reportId: number; patientGender?: string; onSaved?: () => void }) {
  const visibleSections = visibleSectionsForGender(patientGender);
  const [activeSection, setActiveSection] = useState(visibleSections[0] || "blood");
  const [allSections, setAllSections] = useState<Record<string, SectionData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    try {
      // Load saved parameters for all sections
      const [savedRes, defsRes] = await Promise.all([
        fetch(`${API}/api/v1/admin/reports/${reportId}/sections`),
        fetch(`${API}/api/v1/admin/section-params`),
      ]);
      const saved = savedRes.ok ? await savedRes.json() : {};
      const defs = defsRes.ok ? await defsRes.json() : { parameters: {} };

      const merged: Record<string, SectionData> = {};
      for (const st of visibleSections) {
        merged[st] = {
          key_findings: saved[st]?.key_findings || "",
          parameters: saved[st]?.parameters || {},
          param_definitions: defs.parameters[st] || [],
        };
      }
      setAllSections(merged);
      externalOnSaved?.();
    } catch {
      setError("Failed to load report sections.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [reportId]);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-zen-600" />
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      {error}
    </div>
  );

  // Compute filled counts per section for tab badges
  const sectionFillCounts: Record<string, number> = {};
  for (const st of visibleSections) {
    const data = allSections[st];
    sectionFillCounts[st] = data
      ? Object.values(data.parameters).filter((v) => (v as ParamValue).value && (v as ParamValue).value !== "Not Found").length
      : 0;
  }

  return (
    <div className="flex gap-0 min-h-[600px]">
      {/* Left sidebar: section tabs */}
      <div className="w-48 flex-shrink-0 border-r border-gray-100 pr-3 space-y-1">
        {visibleSections.map((st) => {
          const m = SECTION_META[st];
          const filled = sectionFillCounts[st];
          const total = allSections[st]?.param_definitions?.length || 0;
          return (
            <button
              key={st}
              onClick={() => setActiveSection(st)}
              className={cn(
                "w-full text-left rounded-xl px-3 py-2.5 text-sm transition-all",
                activeSection === st
                  ? "bg-zen-800 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <span className="mr-2">{m.icon}</span>
              <span>{m.label}</span>
              {filled > 0 && (
                <span className={cn("ml-1 text-xs", activeSection === st ? "text-zen-200" : "text-gray-400")}>
                  ({filled}/{total})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right: active section panel */}
      <div className="flex-1 pl-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {SECTION_META[activeSection].icon} {SECTION_META[activeSection].label}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Upload the report to auto-extract values, or enter manually. Expand any row to add clinical findings & recommendations.
          </p>
        </div>
        <SectionPanel
          key={activeSection}
          reportId={reportId}
          sectionType={activeSection}
          initialData={allSections[activeSection] || null}
          onSaved={loadAll}
        />
      </div>
    </div>
  );
}
