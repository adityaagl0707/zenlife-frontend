"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle2, Calendar, MapPin, Clock, ChevronRight, Loader2 } from "lucide-react";

const SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM",
];

const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 2);
  return d;
});

const INCLUSIONS = [
  "Full-body MRI", "DEXA scan", "Calcium Score", "Lung CT", "ECG", "100+ blood biomarkers",
  "ZenReport", "Physician consultation", "Zeno AI (12 months)",
];

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

  if (done) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Booking Confirmed!</h1>
              <p className="mt-3 text-gray-500">
                Your ZenScan is booked for{" "}
                <strong>{selectedDate?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</strong>{" "}
                at <strong>{selectedSlot}</strong>.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                You'll receive a confirmation on {form.phone} and {form.email}. Our coordinator will contact you 48 hours before your appointment.
              </p>
            </div>
            <Link href="/dashboard" className="btn-primary inline-block px-10 py-3">
              View My Orders
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
      <main className="min-h-screen bg-cream pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-600">Book ZenScan</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900">Your Health Intelligence Journey Starts Here</h1>
          </div>

          {/* Progress */}
          <div className="mb-10 flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step >= s ? "bg-zen-800 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`h-0.5 w-12 rounded-full ${step > s ? "bg-zen-800" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="card space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Select Date & Time</h2>
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4" /> Choose a date
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      {DATES.map((d) => (
                        <button
                          key={d.toISOString()}
                          onClick={() => setSelectedDate(d)}
                          className={`rounded-xl border py-2 text-center text-xs transition-all ${
                            selectedDate?.toDateString() === d.toDateString()
                              ? "border-zen-600 bg-zen-800 text-white"
                              : "border-gray-200 hover:border-zen-400"
                          }`}
                        >
                          <p className="font-semibold">{d.toLocaleDateString("en-IN", { weekday: "short" })}</p>
                          <p className="mt-0.5 text-[11px] opacity-80">{d.getDate()} {d.toLocaleDateString("en-IN", { month: "short" })}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedDate && (
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Clock className="h-4 w-4" /> Choose a time
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {SLOTS.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
                              selectedSlot === slot
                                ? "border-zen-600 bg-zen-800 text-white"
                                : "border-gray-200 hover:border-zen-400"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedDate || !selectedSlot}
                    className="btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-40"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="card space-y-5">
                  <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Arjun Mehta"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zen-500 focus:ring-2 focus:ring-zen-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        placeholder="30"
                        min="18"
                        max="90"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zen-500 focus:ring-2 focus:ring-zen-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zen-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Mobile Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="98765 43210"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zen-500 focus:ring-2 focus:ring-zen-500/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="arjun@example.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-zen-500 focus:ring-2 focus:ring-zen-500/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:border-zen-400">
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!form.name || !form.phone}
                      className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 disabled:opacity-40"
                    >
                      Review Booking <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="card space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Review & Confirm</h2>

                  <div className="rounded-2xl bg-gray-50 p-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-semibold">{selectedDate?.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time</span>
                      <span className="font-semibold">{selectedSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Patient</span>
                      <span className="font-semibold">{form.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="font-semibold flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Bengaluru</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-zen-800">₹27,500</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    By confirming, you agree to our{" "}
                    <Link href="/terms" className="text-zen-700 hover:underline">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link href="/refund" className="text-zen-700 hover:underline">Cancellation Policy</Link>.
                    Payment will be collected via Razorpay.
                  </p>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:border-zen-400">
                      Back
                    </button>
                    <button type="submit" disabled={submitting} className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 disabled:opacity-60">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Pay ₹27,500"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Summary sidebar */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-900">ZenScan Package</h3>
                <p className="mt-1 text-3xl font-extrabold text-zen-800">₹27,500</p>
                <p className="text-xs text-gray-400">All-inclusive · No hidden fees</p>
                <ul className="mt-5 space-y-2.5">
                  {INCLUSIONS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card bg-zen-50 border border-zen-100">
                <p className="text-sm font-semibold text-zen-800">Need help?</p>
                <p className="mt-1 text-sm text-zen-700">Call us at <a href="tel:8954010099" className="font-bold hover:underline">8954010099</a></p>
                <p className="text-xs text-zen-600 mt-0.5">Mon–Sat, 9am–7pm IST</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
