"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2, AlertTriangle, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
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
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zen-50">
            <User className="h-5 w-5 text-zen-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{note.author}</p>
            <p className="text-xs text-gray-400">
              {NOTE_TYPE_LABELS[note.note_type] ?? note.note_type} ·{" "}
              {new Date(note.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-zen-50 px-3 py-1 text-xs font-semibold text-zen-700 capitalize">
          {NOTE_TYPE_LABELS[note.note_type] ?? note.note_type}
        </span>
      </div>

      <div className="rounded-xl bg-gray-50 p-5">
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{note.content}</p>
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
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <Link href={`/report/${reportId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-zen-800">
            <ArrowLeft className="h-4 w-4" /> Back to Report
          </Link>

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-600">ZenReport</p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Consultation Notes</h1>
            <p className="mt-2 text-gray-500">Expert notes from your care team following your ZenScan.</p>
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
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zen-50">
                <FileText className="h-8 w-8 text-zen-400" />
              </div>
              <p className="font-semibold text-gray-700">No consultation notes yet</p>
              <p className="text-sm text-gray-400">Notes from your care team will appear here after review.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notes.map((note) => <NoteCard key={note.id} note={note} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
