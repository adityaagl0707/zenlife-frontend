"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, Trash2, ChevronRight, CheckCircle2, Loader2, ArrowLeft, X, Upload, Download, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

const SEVERITIES = ["normal", "minor", "major", "critical"];
const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-600 bg-red-50 border-red-200",
  major: "text-amber-600 bg-amber-50 border-amber-200",
  minor: "text-yellow-600 bg-yellow-50 border-yellow-200",
  normal: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const ORGAN_EMOJIS = ["❤️","🧠","🫁","🫘","⚡","🛡️","🩸","🌿","🦴","🫧","👁️","🦷","🩺","💊","🔬"];
const TEST_TYPES = ["calcium_score", "dexa", "blood_urine", "ecg", "mri", "lung_ct", "other"];

// ── Input helpers ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-zen-500 focus:ring-1 focus:ring-zen-500/30" />;
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-zen-500">{children}</select>;
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-zen-500 focus:ring-1 focus:ring-zen-500/30 resize-none" />;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-gray-100 pb-4 mb-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Step components ────────────────────────────────────────────────────────

function OrganForm({ reportId, onAdded }: { reportId: number; onAdded: () => void }) {
  const [form, setForm] = useState({ organ_name: "", severity: "normal", risk_label: "Healthy and Stable", icon: "❤️", critical_count: 0, major_count: 0, minor_count: 0, normal_count: 0, display_order: 0 });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const RISK_LABELS: Record<string, string> = {
    normal: "Healthy and Stable",
    minor: "Mild Health Concern",
    major: "High Health Risk",
    critical: "Urgent Medical Attention",
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      await api(`/admin/reports/${reportId}/organs`, "POST", form);
      setForm({ organ_name: "", severity: "normal", risk_label: "Healthy and Stable", icon: "❤️", critical_count: 0, major_count: 0, minor_count: 0, normal_count: 0, display_order: 0 });
      onAdded();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-700">Add Organ Score</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Organ Name">
          <Input value={form.organ_name} onChange={e => setForm({...form, organ_name: e.target.value})} placeholder="Heart Health" required />
        </Field>
        <Field label="Emoji Icon">
          <div className="flex gap-1 flex-wrap">
            {ORGAN_EMOJIS.map(e => (
              <button type="button" key={e} onClick={() => setForm({...form, icon: e})}
                className={cn("h-8 w-8 rounded-lg text-lg flex items-center justify-center border", form.icon === e ? "border-zen-500 bg-zen-50" : "border-gray-200 bg-white hover:bg-gray-50")}>
                {e}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Severity">
          <Select value={form.severity} onChange={e => setForm({...form, severity: e.target.value, risk_label: RISK_LABELS[e.target.value]})}>
            {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Risk Label">
          <Input value={form.risk_label} onChange={e => setForm({...form, risk_label: e.target.value})} required />
        </Field>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[["Critical", "critical_count"], ["Major", "major_count"], ["Minor", "minor_count"], ["Normal", "normal_count"]].map(([l, k]) => (
          <Field key={k} label={l}>
            <Input type="number" min={0} value={(form as Record<string, unknown>)[k] as number} onChange={e => setForm({...form, [k]: parseInt(e.target.value) || 0})} />
          </Field>
        ))}
      </div>
      {err && <p className="text-xs text-red-600">{err}</p>}
      <button type="submit" disabled={saving} className="btn-primary py-2 text-sm flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />} Add Organ
      </button>
    </form>
  );
}

function FindingForm({ reportId, onAdded }: { reportId: number; onAdded: () => void }) {
  const [form, setForm] = useState({ test_type: "blood_urine", name: "", severity: "normal", value: "", normal_range: "", unit: "", description: "", clinical_findings: "", recommendations: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      await api(`/admin/reports/${reportId}/findings`, "POST", form);
      setForm({ test_type: "blood_urine", name: "", severity: "normal", value: "", normal_range: "", unit: "", description: "", clinical_findings: "", recommendations: "" });
      onAdded();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-700">Add Finding</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Finding Name">
          <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Agatston Score" required />
        </Field>
        <Field label="Test Type">
          <Select value={form.test_type} onChange={e => setForm({...form, test_type: e.target.value})}>
            {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Severity">
          <Select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
            {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Value">
          <Input value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="550" />
        </Field>
        <Field label="Normal Range">
          <Input value={form.normal_range} onChange={e => setForm({...form, normal_range: e.target.value})} placeholder="0" />
        </Field>
        <Field label="Unit">
          <Input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="mg/dL" />
        </Field>
      </div>
      <Field label="Description (optional)">
        <Textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief explanation of this finding..." />
      </Field>
      <Field label="Clinical Findings (optional)">
        <Textarea rows={2} value={form.clinical_findings} onChange={e => setForm({...form, clinical_findings: e.target.value})} placeholder="Clinical interpretation..." />
      </Field>
      <Field label="Recommendations (optional)">
        <Textarea rows={2} value={form.recommendations} onChange={e => setForm({...form, recommendations: e.target.value})} placeholder="What the patient should do..." />
      </Field>
      {err && <p className="text-xs text-red-600">{err}</p>}
      <button type="submit" disabled={saving} className="btn-primary py-2 text-sm flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />} Add Finding
      </button>
    </form>
  );
}

function PriorityForm({ reportId, onAdded }: { reportId: number; onAdded: () => void }) {
  const [form, setForm] = useState({ priority_order: 1, title: "", why_important: "", diet_recommendations: [""], exercise_recommendations: [""], sleep_recommendations: [""], supplement_recommendations: [""] });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function getList(key: string): string[] { return ((form as unknown as Record<string, string[]>)[key]) ?? []; }
  function updateList(key: string, idx: number, val: string) {
    const arr = [...getList(key)];
    arr[idx] = val;
    setForm({...form, [key]: arr});
  }
  function addItem(key: string) { setForm({...form, [key]: [...getList(key), ""]}); }
  function removeItem(key: string, idx: number) {
    const arr = [...getList(key)];
    arr.splice(idx, 1);
    setForm({...form, [key]: arr.length ? arr : [""]});
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    const cleaned = {
      ...form,
      diet_recommendations: form.diet_recommendations.filter(Boolean),
      exercise_recommendations: form.exercise_recommendations.filter(Boolean),
      sleep_recommendations: form.sleep_recommendations.filter(Boolean),
      supplement_recommendations: form.supplement_recommendations.filter(Boolean),
    };
    try {
      await api(`/admin/reports/${reportId}/priorities`, "POST", cleaned);
      setForm({ priority_order: form.priority_order + 1, title: "", why_important: "", diet_recommendations: [""], exercise_recommendations: [""], sleep_recommendations: [""], supplement_recommendations: [""] });
      onAdded();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }

  const listField = (label: string, key: string) => {
    const arr = getList(key);
    return (
      <Field label={label}>
        <div className="space-y-1.5">
          {arr.map((v, i) => (
            <div key={i} className="flex gap-2">
              <Input value={v} onChange={e => updateList(key, i, e.target.value)} placeholder="Enter recommendation..." />
              <button type="button" onClick={() => removeItem(key, i)} className="text-gray-400 hover:text-red-500"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => addItem(key)} className="text-xs text-zen-600 hover:text-zen-800 font-medium">+ Add item</button>
        </div>
      </Field>
    );
  };

  return (
    <form onSubmit={save} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-700">Add Health Priority</p>
      <div className="grid grid-cols-4 gap-3">
        <Field label="Priority #">
          <Input type="number" min={1} value={form.priority_order} onChange={e => setForm({...form, priority_order: parseInt(e.target.value)})} />
        </Field>
        <div className="col-span-3">
          <Field label="Title">
            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Reduce Cardiovascular Risk" required />
          </Field>
        </div>
      </div>
      <Field label="Why Important">
        <Textarea rows={2} value={form.why_important} onChange={e => setForm({...form, why_important: e.target.value})} placeholder="Why this matters for the patient..." required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        {listField("Diet Recommendations", "diet_recommendations")}
        {listField("Exercise Recommendations", "exercise_recommendations")}
        {listField("Sleep Recommendations", "sleep_recommendations")}
        {listField("Supplement Recommendations", "supplement_recommendations")}
      </div>
      {err && <p className="text-xs text-red-600">{err}</p>}
      <button type="submit" disabled={saving} className="btn-primary py-2 text-sm flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />} Add Priority
      </button>
    </form>
  );
}

// ── Lab Results Section ───────────────────────────────────────────────────

type LabMarker = { name: string; description: string; normal_range: string; unit: string; test_type: string; organs: string[] };
type LabRow = LabMarker & { value: string; severity: string };

const SEVERITY_BG: Record<string, string> = {
  critical: "bg-red-50 border-red-200 text-red-700",
  major: "bg-amber-50 border-amber-200 text-amber-700",
  minor: "bg-yellow-50 border-yellow-200 text-yellow-700",
  normal: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

function classifySeverityClient(value: string, normal_range: string): string {
  if (!value || !normal_range) return "normal";
  const v = parseFloat(value.replace(/[^\d.-]/g, ""));
  if (isNaN(v)) return "normal";
  const s = normal_range.trim();
  const upper = s.match(/^[<≤]=?\s*([\d.]+)/);
  if (upper) {
    const u = parseFloat(upper[1]);
    if (v <= u) return "normal";
    const r = (v - u) / u;
    return r <= 0.2 ? "minor" : r <= 0.75 ? "major" : "critical";
  }
  const lower = s.match(/^[>≥]=?\s*([\d.]+)/);
  if (lower) {
    const l = parseFloat(lower[1]);
    if (v >= l) return "normal";
    const r = (l - v) / l;
    return r <= 0.2 ? "minor" : r <= 0.5 ? "major" : "critical";
  }
  const range = s.match(/^([\d.]+)\s*[-–]\s*([\d.]+)/);
  if (range) {
    const lo = parseFloat(range[1]), hi = parseFloat(range[2]);
    if (v >= lo && v <= hi) return "normal";
    const span = hi - lo;
    const dev = Math.max(lo - v, v - hi);
    const r = dev / span;
    return r <= 0.3 ? "minor" : r <= 1.0 ? "major" : "critical";
  }
  return "normal";
}

function LabResultsSection({ reportId, onImported }: { reportId: number; onImported: () => void }) {
  const [markers, setMarkers] = useState<LabMarker[]>([]);
  const [rows, setRows] = useState<LabRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<"all" | "abnormal">("all");
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${BASE}/admin/markers`)
      .then(r => r.json())
      .then(d => {
        setMarkers(d.markers);
        setRows(d.markers.map((m: LabMarker) => ({ ...m, value: "", severity: "normal" })));
      })
      .finally(() => setLoading(false));
  }, []);

  function updateValue(idx: number, value: string) {
    setRows(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], value, severity: value ? classifySeverityClient(value, next[idx].normal_range) : "normal" };
      return next;
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BASE}/admin/upload-lab-results`, { method: "POST", body: fd });
      const data = await res.json();
      const uploaded: Array<{ name: string; value: string; severity: string }> = data.findings || [];
      setRows(prev => prev.map(r => {
        const match = uploaded.find(u => u.name.toLowerCase() === r.name.toLowerCase());
        return match ? { ...r, value: match.value, severity: match.severity } : r;
      }));
    } catch { alert("Upload failed. Please use the template format."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  async function handleImport() {
    const toImport = rows.filter((_, i) => selected.has(i) && rows[i].value);
    if (!toImport.length) return;
    setImporting(true);
    try {
      for (const row of toImport) {
        await api(`/admin/reports/${reportId}/findings`, "POST", {
          test_type: row.test_type,
          name: row.name,
          severity: row.severity,
          value: row.value,
          normal_range: row.normal_range,
          unit: row.unit,
          description: row.description,
        });
      }
      setSelected(new Set());
      onImported();
      alert(`Imported ${toImport.length} finding${toImport.length > 1 ? "s" : ""} to report.`);
    } catch { alert("Import failed. Please try again."); }
    finally { setImporting(false); }
  }

  const abnormal = rows.filter(r => r.value && r.severity !== "normal");
  const displayed = rows.filter(r => {
    const matchFilter = filter === "all" || (r.value && r.severity !== "normal");
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function toggleAll() {
    const visibleAbnormal = displayed.filter(r => r.value && r.severity !== "normal").map(r => rows.indexOf(r));
    const allSelected = visibleAbnormal.every(i => selected.has(i));
    setSelected(prev => {
      const next = new Set(prev);
      visibleAbnormal.forEach(i => allSelected ? next.delete(i) : next.add(i));
      return next;
    });
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-zen-600" /></div>;

  return (
    <div className="space-y-4">
      <SectionHeader title="Lab Results" subtitle="Enter values manually or upload the filled Excel template. Severity is auto-classified." />

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <a href={`${BASE}/admin/lab-template`} download className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">
          <Download className="h-3.5 w-3.5" /> Download Template
        </a>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-zen-300 bg-zen-50 px-3 py-2 text-xs font-semibold text-zen-700 hover:bg-zen-100 disabled:opacity-50">
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading…" : "Upload Excel"}
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-0.5 text-xs">
          <button onClick={() => setFilter("all")} className={cn("px-3 py-1.5 rounded-md font-medium", filter === "all" ? "bg-zen-800 text-white" : "text-gray-600 hover:bg-gray-50")}>All ({rows.length})</button>
          <button onClick={() => setFilter("abnormal")} className={cn("px-3 py-1.5 rounded-md font-medium", filter === "abnormal" ? "bg-zen-800 text-white" : "text-gray-600 hover:bg-gray-50")}>Abnormal ({abnormal.length})</button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search markers…" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-zen-500 w-40" />
        {selected.size > 0 && (
          <button onClick={handleImport} disabled={importing}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-zen-800 px-4 py-2 text-xs font-bold text-white hover:bg-zen-700 disabled:opacity-50">
            {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FlaskConical className="h-3.5 w-3.5" />}
            Import {selected.size} Selected to Report
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-6">
                <input type="checkbox" onChange={toggleAll} className="rounded" />
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 min-w-[160px]">Marker</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-24">Normal Range</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-16">Unit</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-28">Your Value</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-20">Severity</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row) => {
              const idx = rows.indexOf(row);
              const isAbnormal = row.value && row.severity !== "normal";
              return (
                <tr key={idx} className={cn("border-b border-gray-50 hover:bg-gray-50/50", isAbnormal ? "bg-orange-50/30" : "")}>
                  <td className="px-3 py-1.5">
                    {isAbnormal ? (
                      <input type="checkbox" checked={selected.has(idx)} onChange={() => setSelected(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; })} className="rounded" />
                    ) : <span className="w-4 h-4 block" />}
                  </td>
                  <td className="px-3 py-1.5">
                    <p className="font-medium text-gray-800">{row.name}</p>
                    <p className="text-gray-400">{row.description}</p>
                  </td>
                  <td className="px-3 py-1.5 text-gray-500">{row.normal_range}</td>
                  <td className="px-3 py-1.5 text-gray-500">{row.unit}</td>
                  <td className="px-3 py-1.5">
                    <input
                      type="text"
                      value={row.value}
                      onChange={e => updateValue(idx, e.target.value)}
                      placeholder="—"
                      className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-zen-500"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    {row.value ? (
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold border", SEVERITY_BG[row.severity] || SEVERITY_BG.normal)}>
                        {row.severity}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Scan Findings Section ─────────────────────────────────────────────────

const DEXA_FIELDS = [
  { name: "Body Fat %", normal_range: "10 - 25", unit: "%", description: "Overall Body Fat" },
  { name: "Visceral Fat Area", normal_range: "< 100", unit: "cm²", description: "Abdominal Fat" },
  { name: "Lean Body Mass", normal_range: "> 60", unit: "%", description: "Muscle Mass" },
  { name: "Bone Mineral Density (Spine)", normal_range: "> -1.0", unit: "T-score", description: "Spinal Bone Strength" },
  { name: "Bone Mineral Density (Hip)", normal_range: "> -1.0", unit: "T-score", description: "Hip Bone Strength" },
  { name: "Gynoid Fat", normal_range: "< 30", unit: "%", description: "Hip/Thigh Fat" },
  { name: "Android Fat", normal_range: "< 25", unit: "%", description: "Abdominal Region Fat" },
  { name: "Visceral Fat %", normal_range: "< 10", unit: "%", description: "Visceral Fat Percentage" },
];

const CALCIUM_FIELDS = [
  { name: "Agatston Score", normal_range: "< 100", unit: "", description: "Coronary Calcium Score" },
  { name: "Volume Score", normal_range: "< 100", unit: "mm³", description: "Calcium Volume" },
  { name: "Mass Score", normal_range: "< 100", unit: "mg", description: "Calcium Mass" },
];

const MRI_REGIONS = ["Brain", "Spine (Cervical)", "Spine (Lumbar)", "Abdomen", "Pelvis", "Heart (Cardiac MRI)", "Joints (Knee/Shoulder)", "Other"];
const XRAY_FIELDS = ["Heart Size & Shape", "Lung Fields", "Pleural Spaces", "Mediastinum", "Bones & Ribs", "Diaphragm", "Overall Impression"];
const USG_ORGANS = ["Liver", "Gallbladder & Bile Ducts", "Pancreas", "Spleen", "Right Kidney", "Left Kidney", "Bladder", "Aorta", "Overall Impression"];

type ScanValues = Record<string, string>;

function ScanFindingsSection({ reportId, onImported }: { reportId: number; onImported: () => void }) {
  const [scanTab, setScanTab] = useState<"dexa" | "calcium" | "mri" | "xray" | "usg">("dexa");
  const [dexaValues, setDexaValues] = useState<ScanValues>({});
  const [calciumValues, setCalciumValues] = useState<ScanValues>({});
  const [mriValues, setMriValues] = useState<ScanValues>({});
  const [xrayValues, setXrayValues] = useState<ScanValues>({});
  const [usgValues, setUsgValues] = useState<ScanValues>({});
  const [saving, setSaving] = useState(false);

  async function importNumericFindings(fields: typeof DEXA_FIELDS, values: ScanValues, testType: string) {
    const toImport = fields.filter(f => values[f.name]);
    for (const f of toImport) {
      const severity = classifySeverityClient(values[f.name], f.normal_range);
      await api(`/admin/reports/${reportId}/findings`, "POST", {
        test_type: testType,
        name: f.name,
        severity,
        value: values[f.name],
        normal_range: f.normal_range,
        unit: f.unit,
        description: f.description,
      });
    }
    return toImport.length;
  }

  async function importTextFindings(fields: string[], values: ScanValues, testType: string, labelPrefix: string) {
    const toImport = fields.filter(f => values[f] && values[f].trim().toLowerCase() !== "normal" && values[f].trim() !== "");
    for (const f of toImport) {
      await api(`/admin/reports/${reportId}/findings`, "POST", {
        test_type: testType,
        name: `${labelPrefix}: ${f}`,
        severity: "minor",
        value: values[f],
        description: f,
        clinical_findings: values[f],
      });
    }
    return toImport.length;
  }

  async function handleSave() {
    setSaving(true);
    try {
      let count = 0;
      if (scanTab === "dexa") count = await importNumericFindings(DEXA_FIELDS, dexaValues, "dexa");
      else if (scanTab === "calcium") count = await importNumericFindings(CALCIUM_FIELDS, calciumValues, "calcium_score");
      else if (scanTab === "mri") count = await importTextFindings(MRI_REGIONS, mriValues, "mri", "MRI");
      else if (scanTab === "xray") count = await importTextFindings(XRAY_FIELDS, xrayValues, "xray", "X-Ray");
      else if (scanTab === "usg") count = await importTextFindings(USG_ORGANS, usgValues, "usg", "USG");
      if (count > 0) { onImported(); alert(`Imported ${count} finding${count > 1 ? "s" : ""} from ${scanTab.toUpperCase()}.`); }
      else alert("No values entered to import.");
    } catch { alert("Failed to import findings."); }
    finally { setSaving(false); }
  }

  const SCAN_TABS = [
    { id: "dexa" as const, label: "DEXA" },
    { id: "calcium" as const, label: "Calcium Score" },
    { id: "mri" as const, label: "MRI" },
    { id: "xray" as const, label: "Chest X-Ray" },
    { id: "usg" as const, label: "USG" },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader title="Scan & Imaging Findings" subtitle="Enter findings from DEXA, Calcium Score, MRI, Chest X-Ray, and Ultrasound." />

      <div className="flex gap-1.5 flex-wrap">
        {SCAN_TABS.map(t => (
          <button key={t.id} onClick={() => setScanTab(t.id)}
            className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              scanTab === t.id ? "bg-zen-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-zen-400")}>
            {t.label}
          </button>
        ))}
      </div>

      {(scanTab === "dexa" || scanTab === "calcium") && (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-3 py-2 text-left font-semibold text-gray-500">Parameter</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-28">Normal Range</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-16">Unit</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-28">Value</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-500 w-20">Severity</th>
            </tr></thead>
            <tbody>
              {(scanTab === "dexa" ? DEXA_FIELDS : CALCIUM_FIELDS).map(f => {
                const vals = scanTab === "dexa" ? dexaValues : calciumValues;
                const setVals = scanTab === "dexa" ? setDexaValues : setCalciumValues;
                const val = vals[f.name] || "";
                const sev = val ? classifySeverityClient(val, f.normal_range) : "";
                return (
                  <tr key={f.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-3 py-2"><p className="font-medium text-gray-800">{f.name}</p><p className="text-gray-400">{f.description}</p></td>
                    <td className="px-3 py-2 text-gray-500">{f.normal_range}</td>
                    <td className="px-3 py-2 text-gray-500">{f.unit}</td>
                    <td className="px-3 py-2">
                      <input type="text" value={val} placeholder="—"
                        onChange={e => setVals(prev => ({ ...prev, [f.name]: e.target.value }))}
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-zen-500" />
                    </td>
                    <td className="px-3 py-2">
                      {sev ? <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold border", SEVERITY_BG[sev])}>{sev}</span> : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {(scanTab === "mri" || scanTab === "xray" || scanTab === "usg") && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">Enter findings for each area. Leave blank if not assessed. Write "Normal" for normal findings — only non-normal entries will be imported.</p>
          {(scanTab === "mri" ? MRI_REGIONS : scanTab === "xray" ? XRAY_FIELDS : USG_ORGANS).map(field => {
            const vals = scanTab === "mri" ? mriValues : scanTab === "xray" ? xrayValues : usgValues;
            const setVals = scanTab === "mri" ? setMriValues : scanTab === "xray" ? setXrayValues : setUsgValues;
            return (
              <div key={field} className="grid grid-cols-4 gap-3 items-start">
                <label className="col-span-1 pt-2 text-xs font-semibold text-gray-600">{field}</label>
                <div className="col-span-3">
                  <Textarea rows={2} value={vals[field] || ""} placeholder={`Findings for ${field}…`}
                    onChange={e => setVals(prev => ({ ...prev, [field]: e.target.value }))} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={handleSave} disabled={saving}
        className="btn-primary py-2 text-sm flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        Import {scanTab.toUpperCase()} Findings to Report
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

type Patient = { id: number; name: string; phone: string; age: number; gender: string; orders: { id: number; booking_id: string; status: string; has_report: boolean; report_id: number | null }[] };

export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "new-patient" | "patient">("list");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportDetail, setReportDetail] = useState<Record<string, unknown> | null>(null);
  const [reportStep, setReportStep] = useState<"report" | "organs" | "findings" | "labs" | "scans" | "priorities" | "done">("report");

  // New patient form
  const [patientForm, setPatientForm] = useState({ phone: "", name: "", age: "", gender: "Male" });
  const [orderForm, setOrderForm] = useState({ booking_id: "", scan_date: "", amount: "27500", scan_type: "ZenScan", status: "completed" });
  const [reportForm, setReportForm] = useState({ coverage_index: "90", overall_severity: "normal", summary: "", report_date: "", next_visit: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function loadPatients() {
    api("/admin/patients").then(setPatients).finally(() => setLoading(false));
  }

  function loadReportDetail(id: number) {
    api(`/admin/reports/${id}/detail`).then(d => setReportDetail(d as Record<string, unknown>));
  }

  useEffect(() => { loadPatients(); }, []);
  useEffect(() => { if (selectedReportId) loadReportDetail(selectedReportId); }, [selectedReportId]);

  // Generate booking ID
  function genBookingId() {
    const num = Math.floor(Math.random() * 90000) + 10000;
    setOrderForm(f => ({ ...f, booking_id: `ZEN${num}` }));
  }

  async function handleCreatePatient(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      const user = await api("/admin/patients", "POST", { ...patientForm, age: parseInt(patientForm.age) });
      const order = await api(`/admin/patients/${user.id}/orders`, "POST", {
        ...orderForm,
        amount: parseFloat(orderForm.amount),
        scan_date: orderForm.scan_date || new Date().toISOString().split("T")[0],
      });
      const report = await api(`/admin/orders/${order.id}/report`, "POST", {
        ...reportForm,
        coverage_index: parseFloat(reportForm.coverage_index),
        report_date: reportForm.report_date || new Date().toISOString().split("T")[0],
        next_visit: reportForm.next_visit || "",
      });
      setSelectedReportId(report.id);
      setReportStep("organs");
      loadPatients();
      setView("patient");
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-zen-900 px-6 py-5">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zen-300">ZenLife</p>
            <h1 className="text-xl font-extrabold text-white">Admin Panel</h1>
          </div>
          <Link href="/" className="text-xs text-zen-300 hover:text-white">← Back to site</Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* ── PATIENT LIST ── */}
        {view === "list" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-gray-900">Patients</h2>
              <button onClick={() => { setView("new-patient"); genBookingId(); }} className="btn-primary py-2 text-sm flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Patient
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zen-600" /></div>
            ) : patients.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No patients yet. Add one above.</p>
            ) : (
              <div className="space-y-3">
                {patients.map(p => (
                  <div key={p.id} className="card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zen-800 text-white font-bold">
                        {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.phone} · {p.age} yrs · {p.gender}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {p.orders.length} order{p.orders.length !== 1 ? "s" : ""} ·{" "}
                          {p.orders.filter((o: {has_report: boolean}) => o.has_report).length} report{p.orders.filter((o: {has_report: boolean}) => o.has_report).length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.orders.map((o: {id: number; booking_id: string; has_report: boolean; report_id: number | null; status: string}) => (
                        <div key={o.id} className="text-right">
                          <p className="text-xs font-semibold text-gray-600">{o.booking_id}</p>
                          {o.has_report && o.report_id && (
                            <Link href={`/report/${o.report_id}`} className="text-xs text-zen-600 hover:underline">View Report →</Link>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setSelectedPatient(p);
                          if (p.orders[0]?.report_id) { setSelectedReportId(p.orders[0].report_id); setReportStep("organs"); }
                          else { setSelectedOrderId(p.orders[0]?.id ?? null); setReportStep("report"); }
                          setView("patient");
                        }}
                        className="rounded-full border border-gray-200 p-2 hover:bg-gray-100"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── NEW PATIENT FORM ── */}
        {view === "new-patient" && (
          <div className="space-y-6">
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-zen-800">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <form onSubmit={handleCreatePatient} className="card space-y-6">
              <SectionHeader title="Add New Patient" subtitle="Fill in patient details, scan info, and report summary." />

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 border-b pb-2">Patient Information</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name">
                    <Input value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} placeholder="Arjun Mehta" required />
                  </Field>
                  <Field label="Phone Number">
                    <Input value={patientForm.phone} onChange={e => setPatientForm({...patientForm, phone: e.target.value})} placeholder="9876543210" required maxLength={10} />
                  </Field>
                  <Field label="Age">
                    <Input type="number" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} placeholder="35" min={1} max={120} required />
                  </Field>
                  <Field label="Gender">
                    <Select value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </Select>
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 border-b pb-2">Scan / Order Info</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Booking ID">
                    <div className="flex gap-2">
                      <Input value={orderForm.booking_id} onChange={e => setOrderForm({...orderForm, booking_id: e.target.value})} placeholder="ZEN00035" required />
                      <button type="button" onClick={genBookingId} className="rounded-lg border border-gray-200 px-3 text-xs text-gray-500 hover:bg-gray-50 whitespace-nowrap">Auto</button>
                    </div>
                  </Field>
                  <Field label="Scan Date">
                    <Input type="date" value={orderForm.scan_date} onChange={e => setOrderForm({...orderForm, scan_date: e.target.value})} />
                  </Field>
                  <Field label="Amount (₹)">
                    <Input type="number" value={orderForm.amount} onChange={e => setOrderForm({...orderForm, amount: e.target.value})} />
                  </Field>
                  <Field label="Status">
                    <Select value={orderForm.status} onChange={e => setOrderForm({...orderForm, status: e.target.value})}>
                      <option value="completed">Completed</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="pending">Pending</option>
                    </Select>
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 border-b pb-2">Report Summary</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="ZenScore (0–100)">
                    <Input type="number" min={0} max={100} value={reportForm.coverage_index} onChange={e => setReportForm({...reportForm, coverage_index: e.target.value})} />
                  </Field>
                  <Field label="Overall Severity">
                    <Select value={reportForm.overall_severity} onChange={e => setReportForm({...reportForm, overall_severity: e.target.value})}>
                      {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </Field>
                  <Field label="Next Visit Date">
                    <Input type="date" value={reportForm.next_visit} onChange={e => setReportForm({...reportForm, next_visit: e.target.value})} />
                  </Field>
                </div>
                <Field label="AI Summary (shown on report)">
                  <Textarea rows={3} value={reportForm.summary} onChange={e => setReportForm({...reportForm, summary: e.target.value})} placeholder="Overall health summary for this patient..." required />
                </Field>
              </div>

              {err && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{err}</p>}

              <button type="submit" disabled={saving} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                Create Patient & Continue to Report Builder
              </button>
            </form>
          </div>
        )}

        {/* ── REPORT BUILDER (organ/findings/priorities) ── */}
        {view === "patient" && selectedReportId && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button onClick={() => { setView("list"); loadPatients(); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-zen-800">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div>
                <p className="text-xs text-gray-400">Report #{selectedReportId}</p>
                <h2 className="text-xl font-bold text-gray-900">{selectedPatient?.name ?? "Report Builder"}</h2>
              </div>
              <Link href={`/report/${selectedReportId}`} target="_blank" className="ml-auto text-sm text-zen-600 hover:text-zen-800 font-medium">
                Preview Report →
              </Link>
            </div>

            {/* Step tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {([
                { id: "organs", label: "Organs" },
                { id: "findings", label: "Findings" },
                { id: "labs", label: "🧪 Lab Results" },
                { id: "scans", label: "🩻 Scans" },
                { id: "priorities", label: "Priorities" },
                { id: "done", label: "✓ Done" },
              ] as const).map(({ id, label }) => (
                <button key={id} onClick={() => setReportStep(id)}
                  className={cn("flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                    reportStep === id ? "bg-zen-800 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-zen-400")}>
                  {label}
                </button>
              ))}
            </div>

            {/* Existing items */}
            {reportDetail && (
              <div className="space-y-4">

                {reportStep === "organs" && (
                  <>
                    <SectionHeader title="Organ Scores" subtitle="Add one row per organ system. Set counts for each severity level." />
                    {((reportDetail.organs as unknown[]) ?? []).length > 0 && (
                      <div className="space-y-2">
                        {((reportDetail.organs as Array<{id: number; icon: string; organ_name: string; severity: string; risk_label: string; critical_count: number; major_count: number; minor_count: number; normal_count: number}>) ?? []).map(o => (
                          <div key={o.id} className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-sm", SEVERITY_COLOR[o.severity] || "")}>
                            <span>{o.icon} <strong>{o.organ_name}</strong> — {o.risk_label}</span>
                            <div className="flex items-center gap-3 text-xs">
                              <span>{o.critical_count}c · {o.major_count}M · {o.minor_count}m · {o.normal_count}n</span>
                              <button onClick={async () => { await api(`/admin/reports/${selectedReportId}/organs/${o.id}`, "DELETE"); loadReportDetail(selectedReportId!); }} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <OrganForm reportId={selectedReportId} onAdded={() => loadReportDetail(selectedReportId!)} />
                  </>
                )}

                {reportStep === "findings" && (
                  <>
                    <SectionHeader title="Individual Findings" subtitle="Add specific biomarkers, scan results, or test values." />
                    {((reportDetail.findings as unknown[]) ?? []).length > 0 && (
                      <div className="space-y-2">
                        {((reportDetail.findings as Array<{id: number; severity: string; name: string; test_type: string; value: string; unit: string; normal_range: string}>) ?? []).map(f => (
                          <div key={f.id} className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-sm", SEVERITY_COLOR[f.severity] || "")}>
                            <span><strong>{f.name}</strong> · {f.test_type} · {f.value}{f.unit ? ` ${f.unit}` : ""}{f.normal_range ? ` (Normal: ${f.normal_range})` : ""}</span>
                            <button onClick={async () => { await api(`/admin/reports/${selectedReportId}/findings/${f.id}`, "DELETE"); loadReportDetail(selectedReportId!); }} className="text-gray-400 hover:text-red-500 ml-3"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FindingForm reportId={selectedReportId} onAdded={() => loadReportDetail(selectedReportId!)} />
                  </>
                )}

                {reportStep === "labs" && (
                  <LabResultsSection reportId={selectedReportId} onImported={() => loadReportDetail(selectedReportId!)} />
                )}

                {reportStep === "scans" && (
                  <ScanFindingsSection reportId={selectedReportId} onImported={() => loadReportDetail(selectedReportId!)} />
                )}

                {reportStep === "priorities" && (
                  <>
                    <SectionHeader title="Health Priorities" subtitle="Add personalised action items shown on the patient's report." />
                    {((reportDetail.priorities as unknown[]) ?? []).length > 0 && (
                      <div className="space-y-2">
                        {((reportDetail.priorities as Array<{id: number; priority_order: number; title: string}>) ?? []).map(p => (
                          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zen-800 text-xs font-bold text-white">{p.priority_order}</span>
                            <span className="font-medium text-gray-800">{p.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <PriorityForm reportId={selectedReportId} onAdded={() => loadReportDetail(selectedReportId!)} />
                  </>
                )}

                {reportStep === "done" && (
                  <div className="card text-center space-y-5">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Report Ready</h3>
                      <p className="mt-2 text-gray-500">The patient can now log in and view their ZenReport.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href={`/report/${selectedReportId}`} className="btn-primary px-8 py-3 text-sm">
                        Preview Report
                      </Link>
                      <button onClick={() => { setView("list"); loadPatients(); setSelectedReportId(null); setReportDetail(null); }} className="rounded-full border-2 border-zen-800 px-8 py-3 text-sm font-semibold text-zen-800 hover:bg-zen-50">
                        Add Another Patient
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
