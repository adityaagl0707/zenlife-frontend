"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Loader2,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

type Mode = "signin" | "signup";
type SignInStep = "phone" | "otp" | "password" | "force_change";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");

  // ── Sign In state ───────────────────────────────────────────────────────
  const [step, setStep] = useState<SignInStep>("password");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Force change password (first login) ─────────────────────────────────
  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");

  // ── Sign Up state ───────────────────────────────────────────────────────
  const [su, setSu] = useState({
    phone: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "Male",
    password: "",
    confirm_password: "",
  });
  const [suLoading, setSuLoading] = useState(false);
  const [suError, setSuError] = useState("");
  const [createdZenId, setCreatedZenId] = useState<string | null>(null);

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
      if (data.user.must_change_password) {
        setStep("force_change");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }
    setLoading(true);
    try {
      const data = await api.auth.login(cleaned, password);
      setToken(data.access_token);
      if (data.user.must_change_password) {
        setStep("force_change");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    if (newPwd.length < 6) {
      setPwdError("Password must be at least 6 characters");
      return;
    }
    if (newPwd !== newPwd2) {
      setPwdError("Passwords do not match");
      return;
    }
    setPwdLoading(true);
    try {
      await api.auth.changePassword(newPwd, newPwd2);
      router.push("/dashboard");
    } catch (err: unknown) {
      setPwdError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSuError("");
    const cleanedPhone = su.phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      setSuError("Enter a valid 10-digit mobile number");
      return;
    }
    if (!su.first_name.trim() || !su.last_name.trim()) {
      setSuError("Enter your first and last name");
      return;
    }
    const ageNum = parseInt(su.age, 10);
    if (!ageNum || ageNum <= 0 || ageNum > 120) {
      setSuError("Enter a valid age");
      return;
    }
    if (su.password.length < 6) {
      setSuError("Password must be at least 6 characters");
      return;
    }
    if (su.password !== su.confirm_password) {
      setSuError("Passwords do not match");
      return;
    }
    setSuLoading(true);
    try {
      const data = await api.auth.signup({
        phone: cleanedPhone,
        first_name: su.first_name.trim(),
        last_name: su.last_name.trim(),
        age: ageNum,
        gender: su.gender,
        password: su.password,
        confirm_password: su.confirm_password,
      });
      setToken(data.access_token);
      setCreatedZenId(data.user.zen_id || null);
      // Brief flash of the Zen ID, then redirect
      setTimeout(() => router.push("/dashboard"), 1600);
    } catch (err: unknown) {
      setSuError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setSuLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <header className="border-b border-black/5 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} priority />
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

      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-12 pb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
          Health Records Access
        </p>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">
          {mode === "signin"
            ? step === "force_change"
              ? "Set a new password."
              : step === "otp"
                ? "Verify your identity."
                : step === "phone"
                  ? "Sign in to your logbook."
                  : "Sign in to your logbook."
            : "Create your ZenLife account."}
        </h1>
        <p className="mt-2 text-[14px] text-gray-400">
          {mode === "signin"
            ? step === "force_change"
              ? "First-time login — please choose a new password to continue."
              : step === "otp"
                ? `We sent a 6-digit code to +91 ${phone}.`
                : step === "phone"
                  ? "Enter your registered mobile number to continue."
                  : "Enter your mobile number and password."
            : "A few details and we'll auto-generate your Zen ID."}
        </p>
      </div>

      {/* ── Main card + sidebar ──────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">

          {/* ── Form card ─────────────────────────────────────────────────── */}
          <div className="rounded-3xl bg-white ring-1 ring-black/5 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-zen-400 via-zen-600 to-zen-900" />

            {/* Tabs */}
            <div className="flex border-b border-black/5 bg-cream-dark/40">
              <button
                onClick={() => { setMode("signin"); setStep("password"); setError(""); setCreatedZenId(null); }}
                className={`flex-1 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  mode === "signin" ? "bg-white text-zen-900 border-b-2 border-zen-700" : "text-gray-400 hover:text-zen-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("signup"); setSuError(""); setCreatedZenId(null); }}
                className={`flex-1 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] transition-colors ${
                  mode === "signup" ? "bg-white text-zen-900 border-b-2 border-zen-700" : "text-gray-400 hover:text-zen-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="px-8 py-8 sm:px-10">

              {mode === "signin" ? (
                <>
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-dark">
                    {step === "force_change"
                      ? <Lock className="h-5 w-5 text-zen-900" />
                      : step === "otp"
                        ? <ShieldCheck className="h-5 w-5 text-zen-900" />
                        : <Phone className="h-5 w-5 text-zen-900" />
                    }
                  </div>

                  {step === "force_change" ? (
                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] text-amber-800">
                        Your account is using a temporary password. Set a new password to continue.
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">New password</label>
                        <input
                          type="password"
                          value={newPwd}
                          onChange={(e) => { setNewPwd(e.target.value); setPwdError(""); }}
                          placeholder="At least 6 characters"
                          minLength={6}
                          required
                          className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Confirm new password</label>
                        <input
                          type="password"
                          value={newPwd2}
                          onChange={(e) => { setNewPwd2(e.target.value); setPwdError(""); }}
                          placeholder="Re-enter password"
                          minLength={6}
                          required
                          className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                        />
                      </div>
                      {pwdError && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{pwdError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={pwdLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-md disabled:opacity-50"
                      >
                        {pwdLoading
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <><span>Submit</span><ArrowRight className="h-4 w-4" /></>
                        }
                      </button>
                    </form>
                  ) : step === "password" ? (
                    <form onSubmit={handlePasswordLogin} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Mobile number</label>
                        <div className="flex overflow-hidden rounded-xl border border-black/8 bg-cream focus-within:border-zen-600 focus-within:ring-2 focus-within:ring-zen-600/15 transition-all">
                          <span className="flex items-center border-r border-black/8 bg-cream-dark px-4 text-[13px] font-bold text-gray-500">+91</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                            placeholder="98765 43210"
                            className="flex-1 bg-cream px-4 py-3.5 text-[14px] font-medium text-zen-900 outline-none placeholder:text-gray-300"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                          required
                        />
                        <p className="mt-1.5 text-[11px] text-gray-400">
                          New patients added by admin: default password is <strong className="text-gray-600">123456</strong>.
                        </p>
                      </div>

                      {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-md disabled:opacity-50"
                      >
                        {loading
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>
                        }
                      </button>

                      <div className="flex items-center justify-between text-[11px]">
                        <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="font-semibold text-zen-700 hover:underline">
                          Sign in with OTP instead
                        </button>
                        <button type="button" onClick={() => setMode("signup")} className="font-semibold text-zen-700 hover:underline">
                          Create an account
                        </button>
                      </div>
                    </form>
                  ) : step === "phone" ? (
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
                            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                            placeholder="98765 43210"
                            className="flex-1 bg-cream px-4 py-3.5 text-[14px] font-medium text-zen-900 outline-none placeholder:text-gray-300"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>
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

                      <div className="flex items-center justify-between text-[11px]">
                        <button type="button" onClick={() => { setStep("password"); setError(""); }} className="font-semibold text-zen-700 hover:underline">
                          Sign in with password
                        </button>
                        <button type="button" onClick={() => setMode("signup")} className="font-semibold text-zen-700 hover:underline">
                          Create an account
                        </button>
                      </div>
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
                          onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                          placeholder="• • • • • •"
                          className="w-full rounded-xl border border-black/8 bg-cream px-4 py-4 text-center text-[1.6rem] font-bold tracking-[0.5em] text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all placeholder:text-gray-200 placeholder:tracking-normal"
                          required
                        />
                        <p className="mt-2 text-center text-[11px] text-gray-400">
                          Dev mode: use OTP <strong className="text-gray-600">123456</strong>
                        </p>
                      </div>

                      {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>
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
                </>
              ) : (
                /* ── Sign Up ────────────────────────────────────────────── */
                <>
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream-dark">
                    <UserPlus className="h-5 w-5 text-zen-900" />
                  </div>

                  {createdZenId ? (
                    <div className="space-y-5 text-center py-6">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-1">
                          Welcome to ZenLife
                        </p>
                        <p className="text-[14px] text-gray-500">Your Zen ID</p>
                        <p className="font-display text-[2rem] tracking-wide text-zen-900 mt-1">
                          {createdZenId}
                        </p>
                      </div>
                      <p className="text-[12px] text-gray-400">Taking you to your dashboard…</p>
                      <Loader2 className="mx-auto h-4 w-4 animate-spin text-zen-700" />
                    </div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                          Mobile number
                        </label>
                        <div className="flex overflow-hidden rounded-xl border border-black/8 bg-cream focus-within:border-zen-600 focus-within:ring-2 focus-within:ring-zen-600/15 transition-all">
                          <span className="flex items-center border-r border-black/8 bg-cream-dark px-4 text-[13px] font-bold text-gray-500">+91</span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={su.phone}
                            onChange={(e) => { setSu({ ...su, phone: e.target.value.replace(/\D/g, "") }); setSuError(""); }}
                            placeholder="98765 43210"
                            className="flex-1 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none placeholder:text-gray-300"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">First name</label>
                          <input
                            type="text"
                            value={su.first_name}
                            onChange={(e) => { setSu({ ...su, first_name: e.target.value }); setSuError(""); }}
                            placeholder="Arjun"
                            className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Last name</label>
                          <input
                            type="text"
                            value={su.last_name}
                            onChange={(e) => { setSu({ ...su, last_name: e.target.value }); setSuError(""); }}
                            placeholder="Mehta"
                            className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Age</label>
                          <input
                            type="number"
                            min={1}
                            max={120}
                            value={su.age}
                            onChange={(e) => { setSu({ ...su, age: e.target.value }); setSuError(""); }}
                            placeholder="32"
                            className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Sex</label>
                          <select
                            value={su.gender}
                            onChange={(e) => setSu({ ...su, gender: e.target.value })}
                            className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Password</label>
                        <input
                          type="password"
                          value={su.password}
                          onChange={(e) => { setSu({ ...su, password: e.target.value }); setSuError(""); }}
                          placeholder="At least 6 characters"
                          className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                          required
                          minLength={6}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Confirm password</label>
                        <input
                          type="password"
                          value={su.confirm_password}
                          onChange={(e) => { setSu({ ...su, confirm_password: e.target.value }); setSuError(""); }}
                          placeholder="Re-enter password"
                          className="w-full rounded-xl border border-black/8 bg-cream px-4 py-3 text-[14px] font-medium text-zen-900 outline-none focus:border-zen-600 focus:ring-2 focus:ring-zen-600/15 transition-all"
                          required
                          minLength={6}
                        />
                      </div>

                      {suError && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{suError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={suLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zen-900 py-3.5 text-[14px] font-bold text-white hover:bg-zen-800 transition-all hover:shadow-md disabled:opacity-50"
                      >
                        {suLoading
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <><KeyRound className="h-4 w-4" /><span>Create Zen ID</span></>
                        }
                      </button>

                      <p className="text-center text-[11px] text-gray-400">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signin")}
                          className="font-semibold text-zen-700 hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Right sidebar ───────────────────────────────────────────── */}
          <div className="space-y-3">
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

            <div className="rounded-2xl bg-zen-900 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2">
                New patient?
              </p>
              <p className="text-[12px] text-white/60 leading-relaxed">
                Sign up to get your Zen ID, then book a ZenScan from your dashboard.
              </p>
              <button
                onClick={() => setMode("signup")}
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-white hover:text-zen-200 transition-colors"
              >
                Create account <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

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
