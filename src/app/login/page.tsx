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
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden flex-col justify-between bg-zen-900 px-12 py-16 lg:flex lg:w-[45%]">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white">ZenLife</span>
        </Link>

        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-300">Your health, intelligently decoded</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white">
              Know what's<br />
              <span className="text-zen-300">inside you.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zen-200/80">
              ZenScan combines 300+ biomarkers, full-body MRI, and AI insights from Zeno — so you can act before symptoms appear.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Conditions Screened", value: "300+" },
              { label: "Avg. Detection Lead", value: "4–7 yrs" },
              { label: "Scan Duration", value: "3–4 hrs" },
              { label: "AI Health Insights", value: "Zeno™" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/5 p-4">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-zen-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zen-400">
          © {new Date().getFullYear()} ZenLife Health Pvt. Ltd. · ZenScan is not a diagnostic service. Results should be reviewed with a qualified physician.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
        <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zen-800">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-extrabold text-zen-900">ZenLife</span>
        </Link>

        <div className="w-full max-w-sm">
          {step === "phone" ? (
            <>
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zen-50">
                  <Phone className="h-6 w-6 text-zen-800" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
                <p className="mt-2 text-gray-500">Enter your mobile number to receive a one-time passcode.</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Mobile number</label>
                  <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-zen-600 focus-within:ring-2 focus-within:ring-zen-600/20 transition-all">
                    <span className="flex items-center bg-gray-50 px-4 text-sm font-medium text-gray-500 border-r border-gray-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                      placeholder="98765 43210"
                      className="flex-1 bg-white px-4 py-3.5 text-sm outline-none placeholder:text-gray-300"
                      required
                    />
                  </div>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-400">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-zen-700 hover:underline">Terms</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-zen-700 hover:underline">Privacy Policy</Link>.
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zen-50">
                  <ShieldCheck className="h-6 w-6 text-zen-800" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Verify OTP</h2>
                <p className="mt-2 text-gray-500">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-700">+91 {phone}</span>.{" "}
                  <button
                    onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                    className="text-zen-700 hover:underline"
                  >
                    Change
                  </button>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">One-time passcode</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                    placeholder="• • • • • •"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/20 transition-all placeholder:text-gray-200 placeholder:tracking-normal"
                    required
                  />
                  <p className="mt-2 text-center text-xs text-gray-400">Dev mode: use OTP <strong>123456</strong></p>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify & Sign In <ArrowRight className="h-4 w-4" /></>}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full text-center text-sm text-gray-500 hover:text-zen-800"
                >
                  Resend OTP
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
