"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, Trash2, ChevronRight, CheckCircle2, Loader2, ArrowLeft, X, Upload, Download, FlaskConical, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReportSectionsPanel, { TestStatusPanel, visibleSectionsForGender } from "@/components/admin/ReportSectionsPanel";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://zenlife-backend-j5q9.onrender.com").replace(/\/api\/v1\/?$/, "");
const BASE = `${API_URL}/api/v1`;

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
    Promise.all([
      fetch(`${BASE}/admin/markers`).then(r => r.json()),
      fetch(`${BASE}/admin/reports/${reportId}/sections/blood`).then(r => r.json()).catch(() => null),
      fetch(`${BASE}/admin/reports/${reportId}/sections/urine`).then(r => r.json()).catch(() => null),
    ]).then(([markersData, bloodSection, urineSection]) => {
      setMarkers(markersData.markers);
      const sectionParams: Record<string, string> = {};
      for (const sec of [bloodSection, urineSection]) {
        if (sec?.parameters) {
          for (const [name, data] of Object.entries(sec.parameters)) {
            const val = typeof data === "object" && data !== null ? (data as Record<string, string>).value : String(data);
            if (val && val !== "Not Found") sectionParams[name.toLowerCase()] = val;
          }
        }
      }
      setRows(markersData.markers.map((m: LabMarker) => {
        const preloaded = sectionParams[m.name.toLowerCase()];
        if (preloaded) {
          return { ...m, value: preloaded, severity: classifySeverityClient(preloaded, m.normal_range) };
        }
        return { ...m, value: "", severity: "normal" };
      }));
    }).finally(() => setLoading(false));
  }, [reportId]);

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

  useEffect(() => {
    const sectionMap: Record<string, (vals: ScanValues) => void> = {
      dexa: setDexaValues,
      calcium_score: setCalciumValues,
      mri: setMriValues,
      chest_xray: setXrayValues,
      usg: setUsgValues,
    };
    for (const [sectionType, setter] of Object.entries(sectionMap)) {
      fetch(`${BASE}/admin/reports/${reportId}/sections/${sectionType}`)
        .then(r => r.json())
        .then(data => {
          if (data?.parameters && Object.keys(data.parameters).length > 0) {
            const vals: ScanValues = {};
            for (const [name, d] of Object.entries(data.parameters)) {
              const val = typeof d === "object" && d !== null ? (d as Record<string, string>).value : String(d);
              if (val && val !== "Not Found") vals[name] = val;
            }
            setter(vals);
          }
        })
        .catch(() => {});
    }
  }, [reportId]);

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

// ── Organ Sync Section ────────────────────────────────────────────────────

type OrganRow = { id: number; icon: string; organ_name: string; severity: string; risk_label: string; critical_count: number; major_count: number; minor_count: number; normal_count: number };

function OrganSyncSection({ reportId, organs, onSynced }: { reportId: number; organs: OrganRow[]; onSynced: () => void }) {
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function syncOrgans() {
    setSyncing(true);
    try {
      await api(`/admin/reports/${reportId}/sync-organs`, "POST");
      onSynced();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Sync failed"); }
    finally { setSyncing(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader title="Organ Scores" subtitle="Auto-computed from imported findings. Sync after importing from Report Data." />
        <button onClick={syncOrgans} disabled={syncing}
          className="flex items-center gap-1.5 rounded-full bg-zen-800 px-4 py-2 text-xs font-bold text-white hover:bg-zen-700 disabled:opacity-50 flex-shrink-0">
          {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {syncing ? "Syncing…" : "Sync Organ Scores"}
        </button>
      </div>

      {organs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500 mb-3">No organ scores yet. Import findings from Report Data, then click Sync.</p>
          <button onClick={syncOrgans} disabled={syncing}
            className="btn-primary py-2 text-sm flex items-center gap-2 mx-auto disabled:opacity-50">
            {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Create All 13 Organ Scores
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {organs.map(o => {
            const isOpen = expanded === o.id;
            const total = o.critical_count + o.major_count + o.minor_count + o.normal_count;
            return (
              <div key={o.id} className={cn("rounded-xl border overflow-hidden", SEVERITY_COLOR[o.severity] || "border-gray-200")}>
                <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-left"
                  onClick={() => setExpanded(isOpen ? null : o.id)}>
                  <span className="font-semibold">{o.icon} {o.organ_name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">{total} parameters mapped</span>
                    <span className="capitalize font-semibold">{o.severity}</span>
                    <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-current/10 px-4 pb-4 pt-3">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Critical", count: o.critical_count, cls: "bg-red-100 text-red-700 border-red-200" },
                        { label: "Major", count: o.major_count, cls: "bg-amber-100 text-amber-700 border-amber-200" },
                        { label: "Minor", count: o.minor_count, cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                        { label: "Normal", count: o.normal_count, cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                      ].map(({ label, count, cls }) => (
                        <div key={label} className={cn("rounded-lg border p-3 text-center", cls)}>
                          <p className="text-2xl font-extrabold">{count}</p>
                          <p className="text-[11px] font-semibold mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{o.risk_label}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ── Priorities Section ────────────────────────────────────────────────────

function PrioritiesSection({ reportId, priorities, onChanged }: { reportId: number; priorities: Array<{id: number; priority_order: number; title: string}>; onChanged: () => void }) {
  const [generating, setGenerating] = useState(false);

  async function generateAI() {
    setGenerating(true);
    try {
      await api(`/admin/reports/${reportId}/generate-priorities`, "POST");
      onChanged();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : "AI generation failed"); }
    finally { setGenerating(false); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader title="Health Priorities" subtitle="AI-generated personalised action items shown on the patient's report." />
        <button onClick={generateAI} disabled={generating}
          className="flex items-center gap-1.5 rounded-full bg-zen-800 px-4 py-2 text-xs font-bold text-white hover:bg-zen-700 disabled:opacity-50 flex-shrink-0">
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {generating ? "Generating…" : "Generate with AI"}
        </button>
      </div>

      {priorities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-3">No priorities yet. Sync organ scores first, then generate with AI.</p>
          <button onClick={generateAI} disabled={generating}
            className="btn-primary py-2 text-sm flex items-center gap-2 mx-auto disabled:opacity-50">
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {generating ? "Generating…" : "Generate Priorities with AI"}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {priorities.map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zen-800 text-xs font-bold text-white">{p.priority_order}</span>
              <span className="font-medium text-gray-800">{p.title}</span>
            </div>
          ))}
        </div>
      )}

      {priorities.length > 0 && (
        <PriorityForm reportId={reportId} onAdded={onChanged} />
      )}
    </div>
  );
}


// ── Body Age Section ───────────────────────────────────────────────────────

function BodyAgeSection({ reportId }: { reportId: number }) {
  const [loading, setLoading] = useState(false);
  interface BodyAgeResult {
    ok: boolean;
    zen_age: number | null;
    pheno_age: number | null;
    chronological_age: number | null;
    age_difference: number | null;
    confidence: string;
    interpretation: string;
    markers_used: string[];
    markers_missing: string[];
    sub_ages: Record<string, number | null>;
  }
  const [result, setResult] = useState<BodyAgeResult | null>(null);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://zenlife-backend-j5q9.onrender.com/api/v1";

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${reportId}/calculate-body-age`, { method: "POST" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || "Failed"); }
      const data = await res.json() as BodyAgeResult;
      setResult(data);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  const SUB_LABELS: Record<string, string> = {
    metabolic_age: "Metabolic", cardiovascular_age: "Vascular",
    bone_age: "Bone & Muscle", inflammatory_age: "Inflammation", renal_age: "Kidney",
  };

  const diffColor = (diff: number) => diff <= -2 ? "text-emerald-600" : diff > 3 ? "text-red-600" : diff > 0 ? "text-amber-600" : "text-emerald-500";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <SectionHeader title="ZenAge — Biological Age" subtitle="Uses PhenoAge formula (9 blood biomarkers) + Claude AI synthesis across all scan data." />
        <button onClick={calculate} disabled={loading}
          className="flex items-center gap-1.5 rounded-full bg-violet-700 px-4 py-2 text-xs font-bold text-white hover:bg-violet-600 disabled:opacity-50 flex-shrink-0">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>🧬</span>}
          {loading ? "Calculating…" : "Calculate Body Age"}
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</p>}

      {!result && !loading && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-4xl mb-3">🧬</p>
          <p className="text-sm font-semibold text-gray-600 mb-1">No body age calculated yet</p>
          <p className="text-xs text-gray-400">Ensure blood lab findings are imported, then click Calculate Body Age.</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Main age card */}
          <div className="rounded-2xl bg-violet-50 border border-violet-100 p-5">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-500 mb-1">ZenAge</p>
                <p className={`text-6xl font-black leading-none ${diffColor((result.age_difference as number) ?? 0)}`}>
                  {result.zen_age != null ? Math.round(result.zen_age as number) : "—"}
                </p>
                <p className="text-xs text-violet-400 mt-1">years</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Chronological age: <span className="font-bold text-gray-800">{result.chronological_age != null ? Math.round(result.chronological_age as number) : "—"} yrs</span></p>
                {result.pheno_age != null && (
                  <p className="text-sm text-gray-500">PhenoAge (formula): <span className="font-semibold text-gray-700">{(result.pheno_age as number).toFixed(1)} yrs</span></p>
                )}
                <p className={`mt-1 text-sm font-bold ${diffColor((result.age_difference as number) ?? 0)}`}>
                  {(result.age_difference as number) < 0
                    ? `${Math.abs(result.age_difference as number).toFixed(1)} years younger`
                    : (result.age_difference as number) > 0
                    ? `${(result.age_difference as number).toFixed(1)} years older`
                    : "At par with chronological age"}
                </p>
                <p className="mt-1 text-xs text-gray-400">Confidence: <span className="font-semibold capitalize">{result.confidence as string}</span></p>
              </div>
            </div>
            {result.interpretation && (
              <p className="mt-4 text-sm text-gray-600 bg-white rounded-xl px-4 py-3 leading-relaxed">{result.interpretation as string}</p>
            )}
          </div>

          {/* Sub-ages */}
          {result.sub_ages && Object.keys(result.sub_ages as object).length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Domain Sub-Ages</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(result.sub_ages as Record<string, number>)
                  .filter(([, v]) => v != null)
                  .map(([key, val]) => {
                    const diff = val - ((result.chronological_age as number) ?? 0);
                    return (
                      <div key={key} className="rounded-xl bg-white border border-gray-100 p-3 text-center">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          {SUB_LABELS[key] ?? key.replace(/_age$/, "").replace(/_/g, " ")}
                        </p>
                        <p className={`text-3xl font-black leading-none ${diffColor(diff)}`}>{Math.round(val)}</p>
                        <p className="text-[9px] text-gray-400 mt-1">
                          {diff < -0.5 ? `↓ ${Math.abs(diff).toFixed(1)} younger` : diff > 0.5 ? `↑ ${diff.toFixed(1)} older` : "At par"}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Markers */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
              <p className="font-bold text-emerald-700 mb-1">Markers Used ({(result.markers_used as string[]).length})</p>
              <p className="text-gray-500 leading-relaxed">{(result.markers_used as string[]).map(m => m.replace(/_/g, " ")).join(", ") || "—"}</p>
            </div>
            {(result.markers_missing as string[]).length > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                <p className="font-bold text-amber-700 mb-1">Missing ({(result.markers_missing as string[]).length})</p>
                <p className="text-gray-400 leading-relaxed">{(result.markers_missing as string[]).map(m => m.replace(/_/g, " ")).join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ── Main page ──────────────────────────────────────────────────────────────

type PatientStatus = "registered_unpaid" | "paid_test_pending" | "test_done_report_awaited" | "report_published";
type Patient = {
  id: number;
  name: string;
  phone: string;
  age: number;
  gender: string;
  zen_id?: string | null;
  status: PatientStatus;
  orders: { id: number; booking_id: string; status: string; has_report: boolean; report_id: number | null; is_published: boolean; tests_complete: boolean }[];
};

const STATUS_TABS: { key: PatientStatus | "all"; label: string; color: string }[] = [
  { key: "all", label: "All", color: "bg-gray-100 text-gray-800" },
  { key: "registered_unpaid", label: "Registered · Not Paid", color: "bg-slate-100 text-slate-800" },
  { key: "paid_test_pending", label: "Paid · Test Pending", color: "bg-amber-100 text-amber-800" },
  { key: "test_done_report_awaited", label: "Test Done · Report Awaited", color: "bg-blue-100 text-blue-800" },
  { key: "report_published", label: "Report Published", color: "bg-emerald-100 text-emerald-800" },
];

const STATUS_BADGE: Record<PatientStatus, { label: string; cls: string }> = {
  registered_unpaid: { label: "Registered · Not Paid", cls: "bg-slate-100 text-slate-700" },
  paid_test_pending: { label: "Paid · Test Pending", cls: "bg-amber-100 text-amber-700" },
  test_done_report_awaited: { label: "Test Done · Report Awaited", cls: "bg-blue-100 text-blue-700" },
  report_published: { label: "Report Published", cls: "bg-emerald-100 text-emerald-700" },
};

function SyncAllOrgansButton() {
  const [syncing, setSyncing] = useState(false);

  async function syncAll() {
    if (!confirm("This will sync organ systems across ALL reports. Continue?")) return;
    setSyncing(true);
    try {
      const res = await api("/admin/sync-all-organs", "POST");
      alert(`✅ Synced ${res.organ_systems} organ systems across ${res.reports_synced} report(s).`);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <button
      onClick={syncAll}
      disabled={syncing}
      className="flex items-center gap-1.5 rounded-full border border-zen-700 px-4 py-2 text-xs font-bold text-zen-800 hover:bg-zen-50 disabled:opacity-50 transition-colors"
    >
      {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
      {syncing ? "Syncing…" : "Sync All Organ Systems"}
    </button>
  );
}

export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "new-patient" | "patient">("list");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportDetail, setReportDetail] = useState<Record<string, unknown> | null>(null);
  const [reportStep, setReportStep] = useState<"report" | "test_status" | "data" | "done">("test_status");

  // New patient form
  const [patientForm, setPatientForm] = useState({ phone: "", name: "", age: "", gender: "Male" });
  const [orderForm, setOrderForm] = useState({ booking_id: "", scan_date: "", amount: "", scan_type: "ZenScan", status: "completed" });
  const [reportForm, setReportForm] = useState({ report_date: "", next_visit: "" });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [resetCounter, setResetCounter] = useState(0); // bumps on clear-data → remounts BodyAgeSection
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
    const num = Math.floor(Math.random() * 900000) + 100000;
    setOrderForm(f => ({ ...f, booking_id: `Order${num}` }));
  }

  async function handleCreatePatient(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      const user = await api("/admin/patients", "POST", {
        phone: patientForm.phone || null,
        name: patientForm.name || null,
        age: patientForm.age ? parseInt(patientForm.age) : null,
        gender: patientForm.gender || null,
      });
      const order = await api(`/admin/patients/${user.id}/orders`, "POST", {
        ...orderForm,
        amount: orderForm.amount ? parseFloat(orderForm.amount) : 0,
        scan_date: orderForm.scan_date || new Date().toISOString().split("T")[0],
      });
      const report = await api(`/admin/orders/${order.id}/report`, "POST", {
        coverage_index: 0,
        overall_severity: "normal",
        summary: "",
        report_date: reportForm.report_date || new Date().toISOString().split("T")[0],
        next_visit: reportForm.next_visit || "",
      });
      setSelectedReportId(report.id);
      setReportStep("test_status");
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
              <div className="flex items-center gap-2">
                <button onClick={() => { setView("new-patient"); genBookingId(); }} className="btn-primary py-2 text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Patient
                </button>
              </div>
            </div>

            {/* Status filter tabs */}
            {!loading && patients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {STATUS_TABS.map(tab => {
                  const count = tab.key === "all"
                    ? patients.length
                    : patients.filter(p => p.status === tab.key).length;
                  const active = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-xs font-bold transition-colors flex items-center gap-2",
                        active
                          ? "border-zen-900 bg-zen-900 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-zen-700 hover:text-zen-900"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        active ? "bg-white/20 text-white" : tab.color
                      )}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zen-600" /></div>
            ) : patients.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No patients yet. Add one above.</p>
            ) : (() => {
              const filtered = statusFilter === "all" ? patients : patients.filter(p => p.status === statusFilter);
              if (filtered.length === 0) {
                return <p className="text-center text-gray-400 py-10">No patients in this status.</p>;
              }
              return (
              <div className="space-y-3">
                {filtered.map(p => (
                  <div key={p.id} className="card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zen-800 text-white font-bold">
                        {(p.name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{p.name || "(no name)"}</p>
                          {p.zen_id && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zen-700 bg-zen-50 rounded-full px-2 py-0.5">
                              {p.zen_id}
                            </span>
                          )}
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5", STATUS_BADGE[p.status].cls)}>
                            {STATUS_BADGE[p.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{p.phone}{p.age ? ` · ${p.age} yrs` : ""}{p.gender ? ` · ${p.gender}` : ""}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {p.orders.length} order{p.orders.length !== 1 ? "s" : ""} ·{" "}
                          {p.orders.filter(o => o.has_report).length} report{p.orders.filter(o => o.has_report).length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPatient(p);
                        if (p.orders[0]?.report_id) { setSelectedReportId(p.orders[0].report_id); setReportStep("test_status"); }
                        else { setSelectedOrderId(p.orders[0]?.id ?? null); setReportStep("test_status"); }
                        setView("patient");
                      }}
                      className="rounded-full border border-gray-200 p-2 hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
              );
            })()}
          </div>
        )}

        {/* ── NEW PATIENT FORM ── */}
        {view === "new-patient" && (
          <div className="space-y-6">
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-zen-800">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <form onSubmit={handleCreatePatient} className="card space-y-6">
              <SectionHeader title="Add New Patient" subtitle="Fill in patient details and scan info. ZenScore & summary are auto-generated after data entry." />

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 border-b pb-2">Patient Information</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name">
                    <Input value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} />
                  </Field>
                  <Field label="Phone Number">
                    <Input value={patientForm.phone} onChange={e => setPatientForm({...patientForm, phone: e.target.value})} maxLength={10} />
                  </Field>
                  <Field label="Age">
                    <Input type="number" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} min={1} max={120} />
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
                      <Input value={orderForm.booking_id} onChange={e => setOrderForm({...orderForm, booking_id: e.target.value})} placeholder="Order000035" required />
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
              <div className="ml-auto" />
            </div>

            {/* Step tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {([
                { id: "test_status", label: "📋 Test Status" },
                { id: "data", label: "🧪 Enter Report Data" },
                { id: "done", label: "📄 Report" },
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

                {reportStep === "test_status" && (
                  <div className="card">
                    <SectionHeader title="Test Status" subtitle="Mark each test complete as the patient finishes it. The dashboard status updates automatically." />
                    <TestStatusPanel
                      reportId={selectedReportId}
                      sections={visibleSectionsForGender(selectedPatient?.gender)}
                      onSaved={() => loadReportDetail(selectedReportId!)}
                    />
                  </div>
                )}

                {reportStep === "data" && (
                  <ReportSectionsPanel
                    reportId={selectedReportId}
                    patientGender={selectedPatient?.gender}
                    onSaved={() => loadReportDetail(selectedReportId!)}
                  />
                )}

                {reportStep === "done" && (() => {
                  // ── ZenScore auto-compute ─────────────────────────────────
                  type OrganRow = { organ_name: string; severity: string };
                  const organs = (reportDetail?.organs as OrganRow[] | undefined) ?? [];
                  const criticalOrgans = organs.filter(o => o.severity?.toLowerCase() === "critical");
                  const majorOrgans   = organs.filter(o => o.severity?.toLowerCase() === "major");
                  const minorOrgans   = organs.filter(o => o.severity?.toLowerCase() === "minor");

                  const computedScore = Math.max(0, Math.min(100, Math.round(
                    100 - criticalOrgans.length * 15 - majorOrgans.length * 7 - minorOrgans.length * 3
                  )));

                  const overallSeverity =
                    criticalOrgans.length > 0 ? "critical" :
                    majorOrgans.length   > 0 ? "major" :
                    minorOrgans.length   > 0 ? "minor" : "normal";

                  const firstName = selectedPatient?.name?.split(" ")[0] ?? "The patient";
                  function autoSummary(): string {
                    const parts: string[] = [];
                    if (criticalOrgans.length > 0)
                      parts.push(`${firstName}'s report reveals critical concerns in ${criticalOrgans.map(o => o.organ_name).join(" and ")}, requiring urgent medical attention.`);
                    if (majorOrgans.length > 0)
                      parts.push(`${majorOrgans.map(o => o.organ_name).join(" and ")} ${majorOrgans.length > 1 ? "show" : "shows"} high health risk and need prompt review.`);
                    if (minorOrgans.length > 0)
                      parts.push(`${minorOrgans.map(o => o.organ_name).join(" and ")} ${minorOrgans.length > 1 ? "show" : "shows"} mild concerns worth monitoring.`);
                    const normalCount = organs.filter(o => o.severity?.toLowerCase() === "normal").length;
                    if (parts.length === 0)
                      return `${firstName}'s health report shows all organ systems within normal range — excellent overall health. Continue current lifestyle habits and schedule a follow-up next year.`;
                    if (normalCount > 0) parts.push(`All other organ systems are within healthy range.`);
                    if (criticalOrgans.length > 0) parts.push(`Immediate specialist consultation is strongly recommended.`);
                    else if (majorOrgans.length > 0) parts.push(`A follow-up consultation is recommended to address these findings.`);
                    else parts.push(`Lifestyle modifications and periodic monitoring are advised.`);
                    return parts.join(" ");
                  }

                  const generatedSummary = autoSummary();
                  const scoreColor =
                    computedScore >= 85 ? "text-emerald-600" :
                    computedScore >= 70 ? "text-yellow-600" :
                    computedScore >= 50 ? "text-amber-600" : "text-red-600";
                  const scoreBg =
                    computedScore >= 85 ? "bg-emerald-50 border-emerald-200" :
                    computedScore >= 70 ? "bg-yellow-50 border-yellow-200" :
                    computedScore >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

                  const isPublished = !!(reportDetail?.is_published);
                  const priorities = (reportDetail?.priorities as Array<{id: number; priority_order: number; title: string}>) ?? [];
                  const isGenerated = priorities.length > 0 || generated;

                  async function handleGenerate() {
                    if (!selectedReportId) return;
                    setGenerating(true);
                    try {
                      // 1. Save ZenScore + Summary
                      await api(`/admin/reports/${selectedReportId}`, "PATCH", {
                        coverage_index: computedScore,
                        overall_severity: overallSeverity,
                        summary: editedSummary || generatedSummary,
                      });
                      // 2. Calculate Body Age (non-blocking failure)
                      try {
                        await fetch(`${BASE}/admin/reports/${selectedReportId}/calculate-body-age`, { method: "POST" });
                      } catch { /* body age missing data is ok */ }
                      // 3. Generate Priorities with AI
                      await api(`/admin/reports/${selectedReportId}/generate-priorities`, "POST");
                      setGenerated(true);
                      loadReportDetail(selectedReportId);
                    } catch (e: unknown) { alert(e instanceof Error ? e.message : "Generation failed"); }
                    finally { setGenerating(false); }
                  }

                  async function handlePublish() {
                    if (!selectedReportId) return;
                    setPublishing(true);
                    try {
                      await api(`/admin/reports/${selectedReportId}/publish`, "POST");
                      loadReportDetail(selectedReportId);
                      loadPatients();
                    } finally { setPublishing(false); }
                  }

                  async function handleUnpublish() {
                    if (!selectedReportId) return;
                    setPublishing(true);
                    try {
                      await api(`/admin/reports/${selectedReportId}/unpublish`, "POST");
                      loadReportDetail(selectedReportId);
                      loadPatients();
                    } finally { setPublishing(false); }
                  }

                  async function handleClearData() {
                    if (!selectedReportId) return;
                    if (!confirm("This will delete ALL findings, organ scores, sections and reset the report. Are you sure?")) return;
                    setClearing(true);
                    try {
                      await api(`/admin/reports/${selectedReportId}/clear-data`, "DELETE");
                      setGenerated(false);
                      setEditedSummary("");
                      setResetCounter((c) => c + 1); // forces BodyAgeSection to remount with empty state
                      loadReportDetail(selectedReportId);
                      loadPatients();
                    } finally { setClearing(false); }
                  }

                  return (
                    <div className="space-y-5">

                      {/* ── 1. Generate Report button — always at top ── */}
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full rounded-2xl bg-zen-800 py-4 text-base font-bold text-white hover:bg-zen-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-md"
                      >
                        {generating ? (
                          <><Loader2 className="h-5 w-5 animate-spin" /> Generating — ZenScore · Body Age · Priorities…</>
                        ) : isGenerated ? (
                          <><RefreshCw className="h-5 w-5" /> Regenerate Report</>
                        ) : (
                          <><Sparkles className="h-5 w-5" /> Generate Report</>
                        )}
                      </button>

                      {/* ── 2. ZenScore — always visible, placeholder when no data ── */}
                      <div className={`card border flex items-center gap-6 ${organs.length > 0 ? scoreBg : "bg-gray-50 border-gray-200"}`}>
                        <div className="text-center min-w-[80px]">
                          {organs.length > 0 ? (
                            <p className={`text-5xl font-black ${scoreColor}`}>{computedScore}</p>
                          ) : (
                            <p className="text-5xl font-black text-gray-300">—</p>
                          )}
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ZenScore</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {organs.length > 0 ? (
                            <>
                              <p className="text-sm font-bold text-gray-700">Auto-computed from organ scores</p>
                              <div className="flex flex-wrap gap-2 text-[11px]">
                                {criticalOrgans.length > 0 && <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 font-semibold">{criticalOrgans.length} critical (−{criticalOrgans.length * 15} pts)</span>}
                                {majorOrgans.length   > 0 && <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 font-semibold">{majorOrgans.length} major (−{majorOrgans.length * 7} pts)</span>}
                                {minorOrgans.length   > 0 && <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 font-semibold">{minorOrgans.length} minor (−{minorOrgans.length * 3} pts)</span>}
                                {organs.filter(o => o.severity?.toLowerCase() === "normal").length > 0 && <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-semibold">{organs.filter(o => o.severity?.toLowerCase() === "normal").length} normal</span>}
                              </div>
                              <p className="text-[11px] text-gray-400">100 − (critical×15) − (major×7) − (minor×3)</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-semibold text-gray-400">Will be computed after report data is entered</p>
                              <p className="text-[11px] text-gray-300">Formula: 100 − (critical×15) − (major×7) − (minor×3)</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* ── 3. AI Summary — always visible, placeholder when no data ── */}
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-zen-600" />
                          <p className="text-sm font-bold text-gray-700">AI Summary <span className="text-xs font-normal text-gray-400">(auto-generated · edit if needed)</span></p>
                        </div>
                        {organs.length > 0 ? (
                          <Textarea
                            rows={4}
                            value={editedSummary || generatedSummary}
                            onChange={e => setEditedSummary(e.target.value)}
                            className="text-sm text-gray-700"
                          />
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
                            <p className="text-sm text-gray-400">AI summary will appear here after report data is entered and generated.</p>
                          </div>
                        )}
                      </div>

                      {/* ── 4. Body Age — always visible, placeholder until generated ── */}
                      <BodyAgeSection key={`bodyage-${selectedReportId}-${resetCounter}`} reportId={selectedReportId!} />

                      {/* ── 5. Health Priorities — always visible, placeholder until generated ── */}
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          <p className="text-sm font-bold text-gray-700">Health Priorities</p>
                        </div>
                        {priorities.length > 0 ? (
                          <div className="space-y-1.5">
                            {priorities.map(p => (
                              <div key={p.id} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zen-800 text-[10px] font-bold text-white">{p.priority_order}</span>
                                <span className="text-gray-700">{p.title}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
                            <p className="text-sm text-gray-400">Health priorities will be AI-generated when you click Generate Report.</p>
                          </div>
                        )}
                      </div>

                      {/* ── Preview Report — always visible ── */}
                      <Link
                        href={`/report/${selectedReportId}?admin=1`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full rounded-2xl border-2 border-zen-800 py-3 text-sm font-bold text-zen-800 hover:bg-zen-50 transition-all"
                      >
                        Preview Report →
                      </Link>

                      {/* ── Publish / Status — always visible ── */}
                      <div className={cn("rounded-2xl border px-5 py-4 space-y-3", isPublished ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200")}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2.5 w-2.5 rounded-full", isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-400")} />
                              <p className={cn("text-sm font-semibold", isPublished ? "text-emerald-700" : "text-gray-600")}>
                                {isPublished ? "Published — visible to patient" : "Draft — hidden from patient"}
                              </p>
                            </div>
                            {isPublished && (
                              <button onClick={handleUnpublish} disabled={publishing} className="text-xs text-gray-400 hover:text-gray-600 underline">
                                Unpublish
                              </button>
                            )}
                          </div>
                          {!isPublished && (
                            <button
                              onClick={handlePublish}
                              disabled={publishing}
                              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                            >
                              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                              {publishing ? "Publishing…" : "Publish Report"}
                            </button>
                          )}
                        </div>

                      {/* Danger zone */}
                      <div className="card border border-red-100 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-red-400">Danger Zone</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">Delete all findings, organ scores & sections and reset this report.</p>
                          <button onClick={handleClearData} disabled={clearing} className="flex-shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 flex items-center gap-1.5">
                            {clearing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                            Clear All Data
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button onClick={() => { setView("list"); loadPatients(); setSelectedReportId(null); setReportDetail(null); setGenerated(false); setEditedSummary(""); }} className="rounded-full border-2 border-zen-800 px-8 py-3 text-sm font-semibold text-zen-800 hover:bg-zen-50">
                          Back to Patient List
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
