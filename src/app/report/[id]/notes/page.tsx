"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Loader2,
  AlertTriangle,
  User,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { api, ConsultationNote } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

const NOTE_TYPE_LABELS: Record<string, string> = {
  physician: "Physician Note",
  radiologist: "Radiologist Report",
  nutritionist: "Nutrition Guidance",
  follow_up: "Follow-Up Instructions",
  general: "General Note",
};

function NoteCard({ note }: { note: ConsultationNote }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden border-l-4 border-zen-600">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cream-dark flex items-center justify-center">
              <User className="h-4 w-4 text-zen-700" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-zen-900">{note.author}</p>
              <p className="text-[11px] text-gray-400">
                {NOTE_TYPE_LABELS[note.note_type] ?? note.note_type} ·{" "}
                {new Date(note.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 capitalize">
            {NOTE_TYPE_LABELS[note.note_type] ?? note.note_type}
          </span>
        </div>

        <div className="rounded-xl bg-cream p-5 mt-4 text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
          {note.content}
        </div>
      </div>
    </div>
  );
}

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const reportId = parseInt(id);

  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) { router.push("/login"); return; }
    api.reports
      .notes(reportId)
      .then(setNotes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [reportId, router]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} priority />
            <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
          </Link>
          <Link
            href={`/report/${reportId}`}
            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-zen-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to report
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-[60px] pb-20">
        <div className="mx-auto max-w-5xl px-6 pt-12">
          {/* Page header */}
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">ZenReport · Consultation</p>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">Doctor&apos;s notes.</h1>
            <p className="mt-3 text-[14px] text-gray-500">Expert notes from your care team following your ZenScan.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-zen-600" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <AlertTriangle className="h-12 w-12 text-red-400" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-2xl bg-white ring-1 ring-black/5 p-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-dark">
                  <FileText className="h-7 w-7 text-zen-400" />
                </div>
              </div>
              <h2 className="font-display text-[1.5rem] leading-snug text-zen-900 mb-2">Notes coming soon.</h2>
              <p className="text-[13px] text-gray-400">Notes from your care team will appear here after review.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notes.map((note) => <NoteCard key={note.id} note={note} />)}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-5xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-300">© 2025 ZenLife Health Intelligence</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[11px] text-gray-400 hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-gray-400 hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
