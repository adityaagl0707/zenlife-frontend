import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Shield, Brain, Zap, ChevronDown } from "lucide-react";

const SCAN_TYPES = [
  { icon: "🧲", name: "Full-Body MRI", desc: "Radiation-free high-resolution imaging for cancer, tumours & structural abnormalities across all organs." },
  { icon: "🦴", name: "DEXA Scan", desc: "Body composition & bone density — visceral fat, muscle mass, osteoporosis risk." },
  { icon: "❤️", name: "Calcium Score CT", desc: "Calcium buildup in coronary arteries — the single best early predictor of heart attack." },
  { icon: "🫁", name: "Lung Scan", desc: "High-resolution CT for early-stage lung nodules, fibrosis & airway disease." },
  { icon: "⚡", name: "ECG", desc: "12-lead resting ECG to detect arrhythmias, conduction defects & ischaemia." },
  { icon: "🩸", name: "100+ Biomarkers", desc: "Comprehensive metabolic, hormonal, inflammatory & nutritional blood panel." },
];

const FEATURES = [
  { icon: Shield, title: "ZenCore Protocol", desc: "Our proprietary screening protocol targets 300+ conditions responsible for 80%+ of preventable deaths in India." },
  { icon: Brain, title: "ZenScore Organ Intelligence", desc: "Every organ system gets a risk score. Understand your body at the organ level, not just with a list of numbers." },
  { icon: Zap, title: "Zeno AI Health Assistant", desc: "Ask Zeno anything about your report — plain-English explanations of every finding, personalised to your data." },
];

const STATS = [
  { value: "4%", label: "of members had critical hidden issues detected before symptoms appeared", type: "critical" },
  { value: "28%", label: "had major conditions requiring timely medical action", type: "major" },
  { value: "300+", label: "conditions screened in a single ZenScan session", type: "zen" },
  { value: "90%+", label: "ZenCoverage™ index — the most comprehensive scan in India", type: "zen" },
];

const TESTIMONIALS = [
  { name: "Rohit S., 34", role: "Software Engineer, Bangalore", initials: "RS", quote: "The ZenScan found a calcium score of 480 at age 34. My routine ECG was completely normal. This literally saved my life." },
  { name: "Priya M., 41", role: "Founder, Mumbai", initials: "PM", quote: "I booked ZenLife for a comprehensive picture. The report was unlike anything I've seen — Zeno answered my questions at midnight." },
  { name: "Vikram N., 29", role: "Consultant, Hyderabad", initials: "VN", quote: "Found a 2.8cm thyroid nodule. Doctor said another 6 months and treatment would have been far more complex." },
];

const FAQS = [
  { q: "What is ZenScan?", a: "ZenScan is ZenLife's full-body health intelligence scan — combining Full-Body MRI, DEXA, Calcium Score CT, Lung Scan, ECG, and 100+ blood biomarkers, guided by our proprietary ZenCore Protocol." },
  { q: "How long does the scan take?", a: "The full ZenScan session takes approximately 3–4 hours. You'll receive your AI-powered ZenScore report within 5–7 business days." },
  { q: "Who should get a ZenScan?", a: "Anyone above 25 who wants to proactively understand their health. Especially valuable if you have a family history of cancer, heart disease, or diabetes." },
  { q: "Is the MRI radiation-free?", a: "Yes — Full-Body MRI uses magnetic fields and radio waves with zero radiation. The only radiation component is the Calcium Score CT, which is equivalent to 1–2 chest X-rays." },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-cream pt-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zen-50 via-cream to-gold-50 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zen-100 px-4 py-2 text-xs font-semibold text-zen-700">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-zen-500" />
                Cancer · Heart Disease · AI-Led · 300+ Conditions
              </div>
              <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-zen-900 md:text-6xl">
                India&apos;s Most Advanced<br />
                <span className="bg-gradient-to-r from-zen-700 to-zen-500 bg-clip-text text-transparent">
                  Full-Body Intelligence
                </span>
              </h1>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zen-700">Know more. Live longer.</p>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                ZenScan combines Full-Body MRI, DEXA, Calcium Score, ECG, and 100+ biomarkers
                to screen 300+ conditions — powered by ZenCore Protocol and Zeno AI.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary text-base px-8 py-4">
                  Book ZenScan <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/scan" className="btn-outline text-base px-8 py-4">
                  How It Works <ChevronDown className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400">Or call us: <strong className="text-zen-800">8954010099</strong></p>
            </div>

            {/* Mock phone UI */}
            <div className="flex justify-center">
              <div className="relative h-[500px] w-[260px] rounded-[2.5rem] bg-zen-900 p-3 shadow-2xl shadow-zen-900/30">
                <div className="h-full w-full overflow-hidden rounded-[2rem] bg-white">
                  <div className="bg-zen-800 px-4 py-3">
                    <p className="text-xs font-medium text-zen-300">← ZenScore Report</p>
                    <p className="font-bold text-white">Arjun Mehta, 30</p>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Your Health Findings</p>
                    {[
                      { label: "1 Critical", bg: "bg-red-500", w: "w-10" },
                      { label: "2 Major", bg: "bg-amber-500", w: "w-16" },
                      { label: "38 Minor", bg: "bg-yellow-400", w: "w-28" },
                      { label: "279 Normal", bg: "bg-emerald-500", w: "w-40" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`h-2 rounded-full ${item.bg} ${item.w}`} />
                        <span className="text-xs text-gray-600">{item.label}</span>
                      </div>
                    ))}
                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-red-700">⚠ Heart — Critical</p>
                      <p className="mt-1 text-xs text-red-600">Agatston Score: 550</p>
                      <p className="mt-1 text-xs text-gray-500">Urgent cardiologist referral</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">✓ Brain — Normal</p>
                      <p className="mt-1 text-xs text-gray-500">42 normal findings detected.</p>
                    </div>
                    <div className="rounded-xl bg-zen-900 p-3">
                      <p className="text-xs font-semibold text-zen-300">Ask Zeno AI</p>
                      <p className="mt-1 text-xs text-white">&ldquo;What does my calcium score mean?&rdquo;</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-400/20 blur-3xl" />
                <div className="absolute -bottom-4 -left-8 h-24 w-24 rounded-full bg-zen-400/20 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark feature strip */}
      <section className="bg-zen-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zen-700">
                  <f.icon className="h-5 w-5 text-zen-200" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zen-300">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scans */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-zen-600">Advanced Detection · Zero Radiation Risk*</p>
          <h2 className="text-center text-4xl font-extrabold text-zen-900 md:text-5xl">Everything in One Session</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">ZenScan combines imaging, blood analysis, and AI synthesis for a complete picture.</p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SCAN_TYPES.map((s) => (
              <div key={s.name} className="card transition-shadow hover:shadow-md">
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-3 font-bold text-zen-900">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">*Full-Body MRI and DEXA are radiation-free. Calcium Score CT is equivalent to 1–2 chest X-rays.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream-dark py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-extrabold text-zen-900">Early Detection. Real Results.</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.value} className="card text-center">
                <div className={`text-5xl font-extrabold ${s.type === "critical" ? "text-red-600" : s.type === "major" ? "text-amber-600" : "text-zen-700"}`}>{s.value}</div>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-zen-600">Simple Pricing</p>
          <h2 className="text-center text-4xl font-extrabold text-zen-900">No Packages. No Tiers.</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">We don&apos;t dilute health into tiers. You get everything, at once.</p>
          <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-zen-900 p-8 text-white shadow-2xl shadow-zen-900/20">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold">ZenScan</h3>
                <p className="mt-1 text-zen-300">Full-body intelligence with ZenScore + Zeno AI</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-extrabold">₹27,500</div>
                <div className="text-sm text-zen-400 line-through">₹40,000</div>
                <div className="text-xs text-gold-400">Early access pricing</div>
              </div>
            </div>
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {["Full-Body MRI","DEXA Body Composition","Calcium Score CT","Lung Scan","12-lead ECG","100+ Blood Biomarkers","ZenScore Organ Report","Zeno AI Assistant","Doctor-reviewed report","Consultation included"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zen-200"><span className="text-zen-400">✓</span>{item}</div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-zen-800 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">Add ZenGenetics™ Module</p>
                  <p className="mt-0.5 text-xs text-zen-300">Genetic risk mapping for Heart, Brain, Cancer &amp; Metabolic Health</p>
                </div>
                <div className="shrink-0 font-bold text-gold-400">+₹27,500</div>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Link href="/book" className="flex-1 rounded-full bg-white py-3 text-center text-sm font-bold text-zen-900 hover:bg-zen-50 transition-colors">Book Now →</Link>
              <Link href="/scan" className="flex-1 rounded-full border border-zen-600 py-3 text-center text-sm font-semibold text-zen-200 hover:border-zen-400 transition-colors">Know More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-dark py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-extrabold text-zen-900">Don&apos;t Take Our Word For It</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zen-800 text-xs font-bold text-white">{t.initials}</div>
                  <div>
                    <p className="font-semibold text-zen-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/stories" className="btn-outline">Read More Stories <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-4xl font-extrabold text-zen-900">Frequently Asked Questions</h2>
          <div className="mt-12 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="card group cursor-pointer">
                <summary className="flex list-none items-center justify-between font-semibold text-zen-900">
                  {f.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faqs" className="text-sm font-semibold text-zen-700 hover:underline">See all FAQs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zen-800 py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-4xl font-extrabold text-white md:text-5xl">Know Early. Live Longer.</h2>
          <p className="mt-4 text-lg text-zen-200">ZenScan covers what routine checkups miss — giving you years of lead time against the diseases that matter most.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-gold text-base px-8 py-4">Book ZenScan <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:8954010099" className="rounded-full border-2 border-zen-400 px-8 py-4 text-base font-semibold text-zen-100 transition-all hover:bg-zen-700 inline-flex items-center gap-2">📞 8954010099</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
