"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  CheckCircle2, Calendar, Clock, ChevronRight,
  Loader2, ArrowLeft, MapPin, Phone, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Data ───────────────────────────────────────────────────────────────────

const SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 2);
  return d;
});

const INCLUDES = [
  "Full-Body MRI",
  "DEXA Body Composition",
  "CT Calcium Score",
  "Lung CT Scan",
  "12-Lead ECG",
  "100+ Blood & Urine Biomarkers",
  "ZenScore Organ Report",
  "Zeno AI (12-month access)",
  "Doctor-reviewed findings",
  "Physician consultation",
];

const STEPS = [
  { n: 1, label: "Schedule" },
  { n: 2, label: "Details" },
  { n: 3, label: "Confirm" },
];

// ── Step indicator ─────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-all",
              step > s.n
                ? "bg-zen-500 text-white"
                : step === s.n
                ? "bg-zen-900 text-white ring-4 ring-zen-900/10"
                : "bg-black/8 text-gray-400"
            )}>
              {step > s.n ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.n}
            </div>
            <span className={cn(
              "text-[12px] font-semibold hidden sm:block",
              step === s.n ? "text-zen-900" : "text-gray-400"
            )}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("mx-3 h-px w-10 sm:w-14 transition-colors", step > s.n ? "bg-zen-400" : "bg-black/10")} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Booking sidebar ────────────────────────────────────────────────────────

function BookingSidebar({ selectedDate, selectedSlot }: { selectedDate: Date | null; selectedSlot: string | null }) {
  return (
    <div className="space-y-4">
      {/* Price card */}
      <div className="rounded-2xl bg-zen-900 text-white p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">ZenScan</p>
        <p className="font-display text-4xl text-white leading-none">₹27,500</p>
        <p className="text-[12px] text-white/40 mt-1.5">
          <span className="line-through text-white/30">₹40,000</span> · Early access
        </p>
        {(selectedDate || selectedSlot) && (
          <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
            {selectedDate && (
              <div className="flex items-center gap-2 text-[13px]">
                <Calendar className="h-3.5 w-3.5 text-zen-400 flex-shrink-0" />
                <span className="text-white/70">
                  {selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </span>
              </div>
            )}
            {selectedSlot && (
              <div className="flex items-center gap-2 text-[13px]">
                <Clock className="h-3.5 w-3.5 text-zen-400 flex-shrink-0" />
                <span className="text-white/70">{selectedSlot}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-[13px]">
              <MapPin className="h-3.5 w-3.5 text-zen-400 flex-shrink-0" />
              <span className="text-white/70">Noida</span>
            </div>
          </div>
        )}
      </div>

      {/* What's included */}
      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-4">Everything included</p>
        <ul className="space-y-2.5">
          {INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[13px] text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-zen-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Trust signals */}
      <div className="rounded-2xl bg-cream-dark p-5 space-y-3">
        <div className="flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-zen-600 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-gray-600 leading-relaxed">
            Payment collected securely via Razorpay after booking confirmation.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 text-zen-600 flex-shrink-0" />
          <div>
            <a href="tel:8954010099" className="text-[13px] font-bold text-zen-900 hover:text-zen-700">8954010099</a>
            <p className="text-[10px] text-gray-400">Mon–Sat · 9am–7pm IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────

function Field({ label, type = "text", value, onChange, placeholder, required, min, max }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  required?: boolean; min?: string; max?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required} min={min} max={max}
        className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] text-zen-900 placeholder:text-gray-300 outline-none transition-all focus:border-zen-500 focus:ring-2 focus:ring-zen-500/15"
      />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1500);
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream pt-28 pb-20 flex items-center justify-center px-6">
          <div className="w-full max-w-lg">
            <div className="rounded-3xl bg-zen-900 text-white p-10 text-center mb-6">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-zen-700">
                <CheckCircle2 className="h-7 w-7 text-zen-300" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zen-400 mb-2">Booking confirmed</p>
              <h1 className="font-display text-[2rem] text-white mb-4 leading-snug">
                You&apos;re all set,<br />{form.name.split(" ")[0]}.
              </h1>
              <div className="rounded-xl bg-white/8 p-4 text-left space-y-2 mb-6">
                {[
                  { label: "Date", value: selectedDate?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) },
                  { label: "Time", value: selectedSlot },
                  { label: "Location", value: "Noida" },
                  { label: "Amount", value: "₹27,500" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-[13px]">
                    <span className="text-white/50">{label}</span>
                    <span className="text-white font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-white/40 leading-relaxed">
                Confirmation sent to <strong className="text-white/60">{form.phone}</strong>
                {form.email && <> and <strong className="text-white/60">{form.email}</strong></>}.
                Our coordinator will call you 48 hours before your appointment.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-zen-900 py-4 text-[14px] font-bold text-white hover:bg-zen-800 transition-colors"
            >
              View my reports <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pb-20">

        {/* ── Page header — cream, matches dashboard/login ──────────────── */}
        <div className="pt-32 pb-8">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Book ZenScan</p>
                <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">
                  Your scan, your schedule.
                </h1>
                <p className="mt-2 text-[14px] text-gray-400">
                  Full-body health intelligence · 3–4 hours · ₹27,500
                </p>
              </div>
              <StepIndicator step={step} />
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">

            {/* ── Left: form steps ───────────────────────────────────────── */}
            <div>

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
                  <div className="px-7 pt-6 pb-5 border-b border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">Step 1 of 3</p>
                    <h2 className="font-display text-2xl text-zen-900">Choose a date &amp; time</h2>
                  </div>
                  <div className="px-7 py-6 space-y-7">
                    {/* Date grid */}
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">
                        <Calendar className="h-3.5 w-3.5" /> Available dates
                      </p>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                        {DATES.map((d) => {
                          const active = selectedDate?.toDateString() === d.toDateString();
                          return (
                            <button
                              key={d.toISOString()}
                              onClick={() => setSelectedDate(d)}
                              className={cn(
                                "rounded-xl border py-2.5 text-center text-xs transition-all",
                                active
                                  ? "border-zen-600 bg-zen-900 text-white shadow-sm"
                                  : "border-black/8 bg-cream text-gray-600 hover:border-zen-300 hover:bg-zen-50"
                              )}
                            >
                              <p className="font-bold">
                                {d.toLocaleDateString("en-IN", { weekday: "short" })}
                              </p>
                              <p className="mt-0.5 text-[10px] opacity-70">
                                {d.getDate()} {d.toLocaleDateString("en-IN", { month: "short" })}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <div>
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">
                          <Clock className="h-3.5 w-3.5" /> Available slots
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {SLOTS.map((slot) => {
                            const active = selectedSlot === slot;
                            return (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={cn(
                                  "rounded-xl border py-3 text-[13px] font-semibold transition-all",
                                  active
                                    ? "border-zen-600 bg-zen-900 text-white shadow-sm"
                                    : "border-black/8 bg-cream text-gray-600 hover:border-zen-300 hover:bg-zen-50"
                                )}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedDate || !selectedSlot}
                      className="w-full rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Continue to patient details <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Patient details */}
              {step === 2 && (
                <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
                  <div className="px-7 pt-6 pb-5 border-b border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">Step 2 of 3</p>
                    <h2 className="font-display text-2xl text-zen-900">Patient details</h2>
                  </div>
                  <div className="px-7 py-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Arjun Mehta" required />
                      <Field label="Age" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} placeholder="30" min="18" max="90" />
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Gender</label>
                      <div className="flex gap-2">
                        {["Male", "Female", "Other"].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setForm({ ...form, gender: g })}
                            className={cn(
                              "flex-1 rounded-xl border py-2.5 text-[13px] font-semibold transition-all",
                              form.gender === g
                                ? "border-zen-600 bg-zen-900 text-white"
                                : "border-black/8 bg-cream text-gray-600 hover:border-zen-300"
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Field label="Mobile number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="98765 43210" required />
                    <Field label="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="arjun@example.com" />

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 rounded-full border border-black/10 px-5 py-3 text-[13px] font-semibold text-gray-500 hover:border-black/20 hover:text-gray-700 transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!form.name || !form.phone}
                        className="flex-1 rounded-full bg-zen-900 py-3 text-[14px] font-bold text-white hover:bg-zen-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Review booking <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & confirm */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />
                    <div className="px-7 pt-6 pb-5 border-b border-black/5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">Step 3 of 3</p>
                      <h2 className="font-display text-2xl text-zen-900">Review &amp; confirm</h2>
                    </div>
                    <div className="px-7 py-6 space-y-5">
                      {/* Summary rows */}
                      <div className="rounded-xl bg-cream divide-y divide-black/5">
                        {[
                          { label: "Date", value: selectedDate?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) },
                          { label: "Time", value: selectedSlot },
                          { label: "Location", value: "Noida" },
                          { label: "Patient", value: `${form.name}, ${form.age}${form.age ? " yrs" : ""} · ${form.gender}` },
                          { label: "Contact", value: form.phone },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between gap-4 px-4 py-3">
                            <span className="text-[12px] text-gray-400 font-medium">{label}</span>
                            <span className="text-[13px] text-zen-900 font-semibold text-right">{value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between gap-4 px-4 py-3">
                          <span className="text-[13px] font-bold text-zen-900">Total</span>
                          <span className="text-[15px] font-extrabold text-zen-900">₹27,500</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        By confirming you agree to our{" "}
                        <Link href="/terms" className="text-zen-700 hover:underline font-medium">Terms &amp; Conditions</Link>{" "}
                        and{" "}
                        <Link href="/refund" className="text-zen-700 hover:underline font-medium">Cancellation Policy</Link>.
                        Payment is collected securely via Razorpay after confirmation.
                      </p>

                      <div className="flex gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex items-center gap-1.5 rounded-full border border-black/10 px-5 py-3 text-[13px] font-semibold text-gray-500 hover:border-black/20 hover:text-gray-700 transition-colors"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {submitting
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                            : <>Confirm &amp; Pay ₹27,500 <ChevronRight className="h-4 w-4" /></>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ── Right: sidebar ────────────────────────────────────────── */}
            <div className="hidden lg:block">
              <BookingSidebar selectedDate={selectedDate} selectedSlot={selectedSlot} />
            </div>
          </div>

          {/* Mobile sidebar */}
          <div className="mt-6 lg:hidden">
            <BookingSidebar selectedDate={selectedDate} selectedSlot={selectedSlot} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
