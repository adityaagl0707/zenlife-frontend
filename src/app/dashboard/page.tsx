"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Download,
  HelpCircle,
  Activity,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Leaf,
  LogOut,
  FileText,
  Plus,
  Stethoscope,
} from "lucide-react";
import { api, Order } from "@/lib/api";
import { isLoggedIn, clearToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDateLong(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(d: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  return {
    day: dt.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: dt.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    year: dt.getFullYear().toString().slice(2),
  };
}

// ── Status pill (3-stage journey) ───────────────────────────────────────────

function getOrderStage(order: Order): "billing_done" | "test_complete" | "published" {
  if (order.is_published) return "published";
  if (order.tests_complete) return "test_complete";
  return "billing_done";
}

const STAGE_CONFIG = {
  billing_done:  { label: "Billing Done · Test Pending",     bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  test_complete: { label: "Test Complete · Report Pending",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  published:     { label: "Report Published",                bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
};

function StatusPill({ order }: { order: Order }) {
  const cfg = STAGE_CONFIG[getOrderStage(order)];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", cfg.bg, cfg.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ── Scan logbook entry ──────────────────────────────────────────────────────

function ScanEntry({ order, isLatest }: { order: Order; isLatest: boolean }) {
  const dateParts = formatDateShort(order.scan_date);

  return (
    <article
      className={cn(
        "group grid grid-cols-[72px_1fr] gap-0 rounded-2xl overflow-hidden transition-shadow hover:shadow-md",
        isLatest ? "ring-2 ring-zen-200" : "ring-1 ring-black/5"
      )}
    >
      {/* Date column */}
      <div className={cn(
        "flex flex-col items-center justify-center gap-0.5 py-5",
        isLatest ? "bg-zen-900 text-white" : "bg-cream-dark text-zen-900"
      )}>
        {dateParts ? (
          <>
            <span className="text-[22px] font-extrabold leading-none">{dateParts.day}</span>
            <span className={cn("text-[9px] font-bold tracking-[0.18em]", isLatest ? "text-white/50" : "text-gray-400")}>
              {dateParts.month}
            </span>
            <span className={cn("text-[11px] font-semibold", isLatest ? "text-white/40" : "text-gray-400")}>
              &apos;{dateParts.year}
            </span>
          </>
        ) : (
          <span className={cn("text-[11px]", isLatest ? "text-white/40" : "text-gray-400")}>TBD</span>
        )}
      </div>

      {/* Content column */}
      <div className="bg-white px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {isLatest && (
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zen-600 bg-zen-50 rounded-full px-2 py-0.5">
                  Latest
                </span>
              )}
              <StatusPill order={order} />
            </div>
            <h3 className="mt-2 font-display text-[1.2rem] leading-tight text-zen-900">
              {order.patient_name}
            </h3>
            <p className="mt-0.5 text-[12px] text-gray-400">
              {order.patient_age ? `${order.patient_age} yrs · ` : ""}
              {order.patient_gender ? `${order.patient_gender} · ` : ""}
              {order.scan_type}
            </p>
            <p className="mt-1 text-[11px] font-mono text-gray-300">
              {order.zen_id ? <>Patient ID: <span className="text-gray-500">{order.zen_id}</span> · </> : null}
              Booking: {order.booking_id}
            </p>
            {order.tests_total !== undefined && order.tests_total > 0 && !order.is_published && (
              <p className="mt-1 text-[11px] text-gray-400">
                Tests: {order.tests_completed}/{order.tests_total} complete
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <p className="text-[11px] text-gray-400 font-medium">Paid</p>
            <p className="text-[15px] font-extrabold text-zen-900">
              ₹{order.amount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Action strip — only enable Open ZenReport when published */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-50 pt-3">
          {order.is_published && order.report_id ? (
            <>
              <Link
                href={`/report/${order.report_id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-zen-900 px-4 py-2 text-[12px] font-bold text-white hover:bg-zen-800 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Open ZenReport
              </Link>
              <Link
                href={`/report/${order.report_id}/chat`}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/8 px-3.5 py-2 text-[12px] font-semibold text-zen-900 hover:bg-cream transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Ask Zeno
              </Link>
              <Link
                href={`/report/${order.report_id}/download`}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/8 px-3.5 py-2 text-[12px] font-semibold text-gray-500 hover:bg-cream transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                PDF
              </Link>
            </>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-[12px] font-bold text-amber-700 cursor-not-allowed"
              title={order.status === "completed" ? "Your report is being prepared" : "Awaiting your scan"}
            >
              <Clock className="h-3.5 w-3.5" />
              In Progress
            </button>
          )}
          {!(order.is_published && order.report_id) && (
            <span className="text-[11px] text-gray-400 italic">
              {order.tests_complete
                ? "Report being prepared by ZenLife team"
                : "Tests pending — your report will be available after all tests are complete"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Stat chip ───────────────────────────────────────────────────────────────

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white ring-1 ring-black/5 px-5 py-4">
      <span className="font-display text-[1.6rem] text-zen-900 leading-none">{value}</span>
      <span className="mt-1 text-[11px] text-gray-400 font-medium text-center">{label}</span>
    </div>
  );
}

// ── Action link ──────────────────────────────────────────────────────────────

function ActionLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl bg-white ring-1 ring-black/5 px-4 py-3 text-[13px] font-semibold text-zen-900 hover:bg-cream hover:ring-black/10 transition-all group"
    >
      <Icon className="h-4 w-4 text-gray-400 group-hover:text-zen-900 transition-colors" />
      {label}
      <ChevronRight className="h-3.5 w-3.5 ml-auto text-gray-300 group-hover:text-zen-900 transition-colors" />
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    api.orders
      .list()
      .then(setOrders)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  const completedOrders = orders.filter((o) => o.has_report && o.report_id);
  const latestOrder = orders[0] ?? null;
  const latestReportOrder = completedOrders[0] ?? null;
  const totalScans = orders.length;

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Minimal top bar ──────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zen-900/20 px-4 py-2 text-[12px] font-semibold text-zen-900 hover:bg-zen-50 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Book scan
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-medium text-gray-400 hover:bg-black/5 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="pt-[60px]">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
            My Health Records
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">
            {totalScans > 0
              ? "Your health logbook."
              : "Begin your record."}
          </h1>
          {totalScans > 0 && latestOrder?.scan_date && (
            <p className="mt-2 text-[14px] text-gray-400">
              {totalScans} scan{totalScans !== 1 ? "s" : ""} recorded
              · Last entry: {formatDateLong(latestOrder.scan_date)}
            </p>
          )}
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 pb-20">

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[120px] rounded-2xl bg-white/70 animate-pulse ring-1 ring-black/5"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-zen-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zen-800"
            >
              Try again
            </button>
          </div>

        ) : orders.length === 0 ? (

          /* ── Empty state ────────────────────────────────────────────── */
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="rounded-3xl bg-white ring-1 ring-black/5 overflow-hidden">
              {/* Decorative top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
              <div className="px-8 py-10">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-4">
                  No records yet
                </span>
                <blockquote className="font-display text-[2rem] leading-tight text-zen-900">
                  &ldquo;Most diseases are silent.<br />Until they aren&apos;t.&rdquo;
                </blockquote>
                <p className="mt-4 text-[14px] text-gray-500 leading-relaxed max-w-md">
                  ZenScan screens 300+ conditions across 10 organ systems —
                  before symptoms appear. Your first scan takes 3–4 hours.
                </p>
                <Link
                  href="/book"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-zen-900 px-7 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-lg"
                >
                  Book ZenScan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-3 border-t border-gray-50 divide-x divide-gray-50">
                {[
                  { v: "3–4h", l: "Scan duration" },
                  { v: "300+", l: "Conditions screened" },
                  { v: "5–7d", l: "Report turnaround" },
                ].map((s) => (
                  <div key={s.l} className="px-6 py-5 text-center">
                    <p className="font-display text-[1.4rem] text-zen-900">{s.v}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <ActionLink href="/scan" icon={BookOpen} label="How ZenScan works" />
              <ActionLink href="/science" icon={Activity} label="The science" />
              <ActionLink href="/faqs" icon={HelpCircle} label="FAQs" />
            </div>
          </div>

        ) : (

          /* ── Has scans — logbook layout ─────────────────────────────── */
          <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_220px]">

            {/* ── Left: timeline ──────────────────────────────────────── */}
            <div>
              {/* Stats row */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <StatChip value={String(totalScans)} label="Total scans" />
                <StatChip value={String(completedOrders.length)} label="Reports ready" />
                <StatChip
                  value={latestOrder?.scan_date
                    ? new Date(latestOrder.scan_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                    : "—"}
                  label="Last scan"
                />
              </div>

              {/* Pending note */}
              {orders.some((o) => o.status === "pending" || o.status === "scheduled") && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-amber-700 leading-relaxed">
                    Your report will be available within 5–7 business days after your scan.
                    We&apos;ll notify you by SMS when it&apos;s ready.
                  </p>
                </div>
              )}

              {/* Section label */}
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                Scan history · {totalScans} entr{totalScans === 1 ? "y" : "ies"}
              </p>

              {/* Logbook entries */}
              <div className="space-y-3">
                {orders.map((order, i) => (
                  <ScanEntry key={order.id} order={order} isLatest={i === 0} />
                ))}
              </div>

            </div>

            {/* ── Right: contextual actions ────────────────────────────── */}
            <div className="space-y-2">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 px-1 mb-3">
                Actions
              </p>

              {latestReportOrder?.report_id && (
                <>
                  <ActionLink
                    href={`/report/${latestReportOrder.report_id}/chat`}
                    icon={MessageCircle}
                    label="Ask Zeno AI"
                  />
                  <ActionLink
                    href={`/report/${latestReportOrder.report_id}/download`}
                    icon={Download}
                    label="Download PDF"
                  />
                  <ActionLink
                    href={`/report/${latestReportOrder.report_id}/notes`}
                    icon={Stethoscope}
                    label="Doctor&apos;s notes"
                  />
                </>
              )}
              <ActionLink href="/book" icon={CalendarDays} label="Book a scan" />
              <ActionLink href="/faqs" icon={HelpCircle} label="Help & FAQs" />

              {/* Annual card */}
              <div className="mt-4 rounded-2xl bg-zen-900 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                  Annual re-scan
                </p>
                <p className="text-[12px] text-white/60 leading-relaxed">
                  ZenLife recommends a full ZenScan once a year to track
                  changes and catch new developments early.
                </p>
                <Link
                  href="/book"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-white hover:text-zen-200 transition-colors"
                >
                  Schedule now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Support */}
              <div className="rounded-xl border border-black/5 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold text-gray-500">Need help?</p>
                <a
                  href="tel:8954010099"
                  className="mt-0.5 flex items-center gap-1.5 text-[13px] font-bold text-zen-900 hover:text-zen-700"
                >
                  <Activity className="h-3.5 w-3.5" />
                  8954010099
                </a>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
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
