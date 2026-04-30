"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Phone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await api.auth.sendOtp(cleaned);
      setPhone(cleaned);
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const data = await api.auth.verifyOtp(phone, otp);
      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ── Top bar — matches dashboard ─────────────────────────────────── */}
      <header className="border-b border-black/5 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
          </Link>
          <Link
            href="/"
            className="text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* ── Page heading ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
          Health Records Access
        </p>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">
          {step === "phone" ? "Sign in to your logbook." : "Verify your identity."}
        </h1>
        <p className="mt-2 text-[14px] text-gray-400">
          {step === "phone"
            ? "Enter your registered mobile number to continue."
            : `We sent a 6-digit code to +91 ${phone}.`}
        </p>
      </div>

      {/* ── Main card + sidebar ──────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">

          {/* ── Form card ────────────────────────────────────────────────── */}
          <div className="rounded-3xl bg-white ring-1 ring-black/5 overflow-hidden">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />

            <div className="px-8 py-8 sm:px-10">

              {/* Icon */}
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-dark">
                {step === "phone"
                  ? <Phone className="h-5 w-5 text-zen-900" />
                  : <ShieldCheck className="h-5 w-5 text-zen-900" />
                }
              </div>

              {step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                      Mobile number
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-black/8 bg-cream focus-within:border-zen-600 focus-within:ring-2 focus-within:ring-zen-600/15 transition-all">
                      <span className="flex items-center border-r border-black/8 bg-cream-dark px-4 text-[13px] font-bold text-gray-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ""));
                          setError("");
                        }}
                        placeholder="98765 43210"
                        className="flex-1 bg-cream px-4 py-3.5 text-[14px] font-medium text-zen-900 outline-none placeholder:text-gray-300"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-md disabled:opacity-50"
                  >
                    {loading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><span>Send OTP</span><ArrowRight className="h-4 w-4" /></>
                    }
                  </button>

                  <p className="text-center text-[11px] text-gray-400">
                    By continuing you agree to our{" "}
                    <Link href="/terms" className="font-semibold text-zen-700 hover:underline">Terms</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-zen-700 hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                      One-time passcode
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                      placeholder="• • • • • •"
                      className="w-full rounded-xl border border-black/8 bg-cream px-4 py-4 text-center text-[1.6rem] font-bold tracking-[0.5em] text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all placeholder:text-gray-200 placeholder:tracking-normal"
                      required
                    />
                    <p className="mt-2 text-center text-[11px] text-gray-400">
                      Dev mode: use OTP <strong className="text-gray-600">123456</strong>
                    </p>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-md disabled:opacity-50"
                  >
                    {loading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><span>Verify &amp; Sign In</span><ArrowRight className="h-4 w-4" /></>
                    }
                  </button>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                      className="text-[12px] font-semibold text-gray-400 hover:text-zen-900 transition-colors"
                    >
                      ← Change number
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[12px] font-semibold text-zen-700 hover:text-zen-900 transition-colors"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Right sidebar — stat chips + trust ───────────────────────── */}
          <div className="space-y-3">

            {/* Stat chips */}
            {[
              { value: "300+", label: "Conditions screened" },
              { value: "3–4h", label: "Scan duration" },
              { value: "5–7d", label: "Report turnaround" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-2xl bg-white ring-1 ring-black/5 px-5 py-4 text-center"
              >
                <span className="font-display text-[1.6rem] text-zen-900 leading-none">{s.value}</span>
                <span className="mt-1 text-[11px] text-gray-400 font-medium">{s.label}</span>
              </div>
            ))}

            {/* Annual card */}
            <div className="rounded-2xl bg-zen-900 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                New patient?
              </p>
              <p className="text-[12px] text-white/60 leading-relaxed">
                Book a ZenScan to get your personalised health report and access this portal.
              </p>
              <Link
                href="/book"
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-white hover:text-zen-200 transition-colors"
              >
                Book ZenScan <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Support */}
            <div className="rounded-xl border border-black/5 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold text-gray-500">Need help?</p>
              <a
                href="tel:8954010099"
                className="mt-0.5 text-[13px] font-bold text-zen-900 hover:text-zen-700 transition-colors"
              >
                8954010099
              </a>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer — matches dashboard ───────────────────────────────────── */}
      <footer className="mt-auto border-t border-black/5">
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
