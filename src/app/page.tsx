import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ArrowUpRight } from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────

const SCANS = [
  {
    num: "01",
    name: "Full-Body MRI",
    tag: "Zero radiation",
    desc: "High-resolution imaging across brain, spine, abdomen, pelvis and major vessels — tumours, structural changes, organ anatomy, vascular anomalies. 100+ MRI parameters reviewed per scan, with no ionising radiation.",
  },
  {
    num: "02",
    name: "Whole-Abdomen Ultrasound",
    tag: "Soft-tissue clarity",
    desc: "Liver, gallbladder, pancreas, spleen, kidneys, urinary bladder and reproductive organs. Real-time, radiation-free imaging that complements MRI for fatty liver grading, gallstones, cysts and thyroid lesions.",
  },
  {
    num: "03",
    name: "DEXA Scan",
    tag: "Body composition",
    desc: "Bone mineral density (T-score, Z-score), visceral fat, appendicular lean mass, ASMI and Fat Mass Index. The gold standard for sarcopenia, osteoporosis screening and metabolic risk — what the bathroom scale never sees.",
  },
  {
    num: "04",
    name: "CT Calcium Score",
    tag: "Cardiac risk",
    desc: "Per-vessel Agatston scoring (LM, LAD, LCK, RCA) for coronary artery calcification — the single strongest predictor of heart attack risk, more accurate than cholesterol alone.",
  },
  {
    num: "05",
    name: "Chest X-Ray",
    tag: "Lung & thoracic",
    desc: "Lung parenchyma, pleural space, vasculature, mediastinum and lymph nodes — screening for nodules, infection, fibrosis and structural changes in the chest.",
  },
  {
    num: "06",
    name: "12-Lead ECG",
    tag: "Cardiac rhythm",
    desc: "Resting ECG with PR interval, QRS duration, QTc, ST segment and rhythm analysis — picks up arrhythmias, conduction defects and silent ischaemia, interpreted alongside your calcium score.",
  },
  {
    num: "07",
    name: "150+ Lab Biomarkers",
    tag: "Blood & urine",
    desc: "Glucose, full lipid panel, liver, kidney, electrolytes, thyroid, full CBC differential, iron studies, vitamins (D, B12, A, E, Folate), minerals, hormones, inflammation (hs-CRP), advanced cardiovascular (NT-proBNP, ApoB, Lp(a)) plus 25-parameter urinalysis.",
  },
  {
    num: "08",
    name: "Mammography",
    tag: "Women only",
    desc: "Digital mammography screening with BI-RADS categorisation across both breasts — included for women aged 40+, optional for younger members.",
  },
];

const FINDINGS = [
  { pct: "4%", title: "Had critical hidden conditions", sub: "Caught before the first symptom" },
  { pct: "28%", title: "Had major findings needing action", sub: "Overlooked by routine checkups" },
  { pct: "68%", title: "Changed their health behaviour", sub: "Within 3 months of their ZenScan" },
];

const STORIES = [
  {
    quote: "The ZenScan found a calcium score of 480 at age 34. My routine ECG the month before was completely normal. This literally saved my life.",
    name: "Rohit S.",
    detail: "34 · Software Engineer · Noida",
    finding: "Calcium Score 480 — Critical cardiac risk",
  },
  {
    quote: "I booked it thinking I was healthy. Zeno walked me through every finding at midnight. I left knowing more about my body than in 41 years of living in it.",
    name: "Priya M.",
    detail: "41 · Founder · Noida",
    finding: "Silent fatty liver + elevated homocysteine",
  },
  {
    quote: "2.8cm thyroid nodule on USG. My GP had been doing blood tests for three years and never flagged it. The ultrasound found it on day one.",
    name: "Vikram N.",
    detail: "29 · Consultant · Noida",
    finding: "2.8cm thyroid nodule — surgically removed",
  },
];

const STEPS = [
  { n: "1", title: "Book & prepare", body: "Pick a date and complete a pre-scan questionnaire. At-home blood and urine collection is arranged the day before your scan." },
  { n: "2", title: "Your scan day", body: "3–4 hours at our facility — Full-body MRI, Whole-abdomen USG, DEXA, Calcium Score CT, Chest X-Ray, 12-lead ECG. Mammography for women 40+." },
  { n: "3", title: "AI-powered analysis", body: "ZenCore Protocol analyses 400+ parameters across 15 organ systems, computes your ZenScore, ZenAge biological age and personalised health priorities." },
  { n: "4", title: "Your ZenReport", body: "Physician-reviewed report with Zeno AI explaining every finding in plain language. Diet, exercise, sleep and supplement plan included. Delivered in 5–7 business days." },
];

const INCLUDES = [
  "Full-Body MRI", "Whole-Abdomen USG", "DEXA Body Composition",
  "CT Calcium Score", "Chest X-Ray", "12-Lead ECG",
  "150+ Lab Biomarkers", "ZenScore + ZenAge",
  "15-organ ZenReport", "Zeno AI (12 months)",
  "Personalised Priorities", "Physician consultation",
  "Doctor-shareable secure link",
];

const FAQS = [
  { q: "Who should get a ZenScan?", a: "Anyone above 25 who wants a definitive health baseline — especially those with a family history of cancer, heart disease, diabetes or metabolic conditions, or anyone who has never had a comprehensive scan." },
  { q: "How long is the scan?", a: "The full ZenScan session is 3–4 hours. Your report is delivered within 5–7 business days, with a physician consultation included." },
  { q: "Is the scan radiation-free?", a: "Mostly yes. MRI, DEXA and Ultrasound involve zero ionising radiation. The Calcium Score CT and Chest X-Ray involve very low radiation — combined dose roughly equivalent to 4 months of natural background exposure." },
  { q: "What does the ZenScore mean?", a: "ZenScore is a 0–100 health-intelligence index calculated across 15 organ systems. It synthesises imaging findings, body composition and 150+ biomarkers into one comparable number." },
  { q: "What is ZenAge?", a: "ZenAge is your biological age — derived from the validated PhenoAge formula plus a Claude AI synthesis across all your scan data, including five sub-ages: metabolic, vascular, bone & muscle, inflammation and kidney." },
  { q: "Is a doctor consultation included?", a: "Yes. Every ZenScan includes a physician consultation to walk you through your findings, plus 12 months of access to Zeno AI for follow-up questions any time." },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-cream pt-28 pb-0 overflow-hidden">
        {/* Subtle grain texture via box-shadow */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_380px]">

            {/* Left — headline */}
            <div className="pb-20 lg:pb-28">
              <p className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
                <span className="h-px w-8 bg-zen-500" />
                Full-body health intelligence
              </p>
              <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] text-zen-900">
                Most diseases<br />
                are silent.<br />
                <em className="not-italic text-zen-700">Until they aren&apos;t.</em>
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-gray-500">
                ZenScan screens 400+ parameters across 15 organ systems —
                combining MRI, USG, DEXA, CT, X-Ray, ECG and 150+ lab
                biomarkers into one AI-powered report. Before symptoms appear.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-zen-900 px-8 py-4 text-[15px] font-semibold text-white transition-all hover:bg-zen-800 hover:shadow-xl active:scale-95"
                >
                  Book ZenScan
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/scan"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-zen-900 underline decoration-zen-900/20 underline-offset-4 hover:decoration-zen-900/60 transition-all"
                >
                  How it works
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Or call <a href="tel:8954010099" className="font-semibold text-gray-600 hover:text-gray-900">8954010099</a>
              </p>
            </div>

            {/* Right — Organ score panel (completely different from phone mockup) */}
            <div className="hidden lg:block self-end">
              <div className="rounded-t-3xl bg-zen-900 px-6 pt-8 pb-0 text-white shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-5">ZenScore — 15 Organ Systems</p>
                <div className="space-y-3 mb-6">
                  {[
                    { organ: "Heart Health", score: 42, sev: "critical", bar: "bg-red-500" },
                    { organ: "Endocrine & Metabolic", score: 58, sev: "major", bar: "bg-amber-400" },
                    { organ: "Liver & Digestive", score: 81, sev: "normal", bar: "bg-emerald-400" },
                    { organ: "Brain & Cognition", score: 91, sev: "normal", bar: "bg-emerald-400" },
                    { organ: "Bone, Muscle & Joint", score: 74, sev: "minor", bar: "bg-yellow-400" },
                    { organ: "Vascular Health", score: 88, sev: "normal", bar: "bg-emerald-400" },
                  ].map((r) => (
                    <div key={r.organ}>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="text-white/70 font-medium">{r.organ}</span>
                        <span className={`font-bold ${r.sev === "critical" ? "text-red-400" : r.sev === "major" ? "text-amber-400" : "text-emerald-400"}`}>
                          {r.score}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${r.bar}`} style={{ width: `${r.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Ask Zeno AI</p>
                      <p className="text-[13px] text-white/80 mt-0.5">&ldquo;Why is my heart score low?&rdquo;</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-zen-600 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────────────────────── */}
      <div className="bg-zen-900 py-3 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap w-max">
          {[
            "Full-Body MRI", "Whole-Abdomen USG", "DEXA Body Composition", "CT Calcium Score",
            "Chest X-Ray", "12-Lead ECG", "150+ Lab Biomarkers", "ZenScore",
            "ZenAge — Biological Age", "Zeno AI", "15 Organ Systems", "400+ Parameters Tracked",
            "Full-Body MRI", "Whole-Abdomen USG", "DEXA Body Composition", "CT Calcium Score",
            "Chest X-Ray", "12-Lead ECG", "150+ Lab Biomarkers", "ZenScore",
            "ZenAge — Biological Age", "Zeno AI", "15 Organ Systems", "400+ Parameters Tracked",
          ].map((item, i) => (
            <span key={i} className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
              {item}
              <span className="ml-12 text-zen-600">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── TAILORED FOR SEX ──────────────────────────────────────────────── */}
      <section className="bg-cream py-12 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
                <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
                Tailored to your sex
              </p>
              <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.9rem)] leading-tight text-zen-900">
                Different bodies. Different tests.
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-1">For men</p>
                <p className="text-[13px] text-gray-600 leading-snug">
                  Adds prostate ultrasound, PSA blood test, total + free testosterone, SHBG and IGF-1.
                </p>
              </div>
              <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-pink-600 mb-1">For women</p>
                <p className="text-[13px] text-gray-600 leading-snug">
                  Adds Mammography (40+), Pelvic + Transvaginal USG, Pap Smear, HPV DNA, AMH, FSH, LH, Estradiol.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-gray-400">
            Sex-irrelevant tests are filtered out so your report only shows what actually applies to you. <Link href="/science" className="font-semibold text-zen-700 hover:text-zen-900">See the full list →</Link>
          </p>
        </div>
      </section>

      {/* ── WHAT WE FIND ──────────────────────────────────────────────────── */}
      <section className="py-28 bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr] items-end mb-16">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
                <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
                Real findings from real members
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-zen-900">
                What a ZenScan<br />
                actually finds.
              </h2>
            </div>
            <p className="text-gray-500 leading-relaxed pb-2">
              These aren&apos;t edge cases. These are the kinds of findings that
              appear in one in three scans — hidden from routine blood tests and
              annual checkups.
            </p>
          </div>

          {/* Three findings as large horizontal cards */}
          <div className="space-y-px">
            {FINDINGS.map((f, i) => (
              <div
                key={i}
                className="group flex flex-col sm:flex-row sm:items-center gap-6 bg-white px-8 py-8 border-b border-gray-100 first:rounded-t-2xl last:rounded-b-2xl hover:bg-gray-50 transition-colors"
              >
                <p className="font-display text-[clamp(3rem,7vw,5rem)] leading-none text-zen-900 w-48 flex-shrink-0">
                  {f.pct}
                </p>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-zen-900">{f.title}</p>
                  <p className="mt-1 text-sm text-gray-400">{f.sub}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCANS ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-zen-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] mb-16">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-400">
                <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
                The protocol
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-white">
                Eight scans.<br />
                One session.<br />
                Zero guesswork.
              </h2>
            </div>
            <p className="text-white/50 leading-relaxed text-lg self-end pb-2">
              ZenCore Protocol runs eight complementary diagnostic modalities in a single
              visit, then synthesises every result into a unified 15-organ health picture —
              something no single specialist visit could replicate.
            </p>
          </div>

          {/* Scan list — numbered rows, not emoji cards */}
          <div className="divide-y divide-white/8">
            {SCANS.map((s) => (
              <div
                key={s.num}
                className="group grid grid-cols-[48px_1fr] sm:grid-cols-[64px_200px_1fr_120px] gap-4 sm:gap-8 items-start py-8 hover:bg-white/3 transition-colors rounded-xl px-2 -mx-2"
              >
                <span className="font-display text-2xl text-white/20 mt-1">{s.num}</span>
                <div>
                  <p className="font-bold text-white text-[15px]">{s.name}</p>
                  <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-widest text-zen-500 bg-zen-900/60 rounded-full px-2.5 py-0.5">
                    {s.tag}
                  </span>
                </div>
                <p className="col-span-2 sm:col-span-1 text-[14px] text-white/50 leading-relaxed">{s.desc}</p>
                <div className="hidden sm:flex items-start justify-end pt-1">
                  <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/8">
            <p className="text-[12px] text-white/30">
              * MRI, Ultrasound and DEXA involve zero ionising radiation. CT Calcium Score and Chest X-Ray combined ≈ 4 months of natural background exposure.
              Mammography included for women 40+, optional below.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-cream-dark">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
              <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
              The process
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-zen-900">
              From booking<br />
              to full clarity.
            </h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={i} className="relative p-8 border-l border-gray-200 first:border-l-0 sm:first:border-l sm:[&:nth-child(odd)]:border-l-0 lg:[&:nth-child(odd)]:border-l lg:first:border-l-0">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-zen-900">
                  <span className="font-display text-white text-lg">{s.n}</span>
                </div>
                <p className="text-[15px] font-bold text-zen-900 mb-2">{s.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBER STORIES ───────────────────────────────────────────────── */}
      <section className="py-28 bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
              <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
              Member stories
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-zen-900">
              Found before<br />
              it was too late.
            </h2>
          </div>

          {/* Editorial stacked quotes — completely different from 3-column cards */}
          <div className="space-y-0 divide-y divide-gray-100">
            {STORIES.map((s, i) => (
              <div key={i} className="group grid gap-6 py-12 lg:grid-cols-[64px_1fr_280px] items-start">
                <span className="font-display text-[4rem] leading-none text-gray-200 select-none mt-[-8px]">&ldquo;</span>
                <div className="min-w-0">
                  <p className="text-xl leading-relaxed text-zen-900 font-medium">{s.quote}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <p className="font-bold text-zen-900">{s.name}</p>
                    <p className="text-sm text-gray-400">{s.detail}</p>
                  </div>
                </div>
                <div className="lg:text-right">
                  <span className="inline-block rounded-full bg-red-50 border border-red-100 px-3 py-1.5 text-[11px] font-bold text-red-700 leading-tight">
                    {s.finding}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <Link href="/stories" className="inline-flex items-center gap-2 text-[15px] font-semibold text-zen-900 hover:text-zen-700 transition-colors">
              Read all member stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-cream-dark">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] items-start">
            {/* Left: headline + philosophy */}
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
                <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
                Transparent pricing
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-zen-900">
                One complete<br />
                scan. One price.
              </h2>
              <p className="mt-6 text-gray-500 leading-relaxed max-w-sm">
                We don&apos;t build packages that leave tests out to hit a price point.
                ZenScan gives you everything, every time — because partial information
                is worse than no information.
              </p>
              <div className="mt-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Included in every ZenScan</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {INCLUDES.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[13px] text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-zen-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: price card — light, not dark */}
            <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">ZenScan</p>
                  <p className="font-display text-5xl text-zen-900">₹27,500</p>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="line-through">₹40,000</span> · Early access pricing
                  </p>
                </div>
                <span className="inline-block rounded-full bg-zen-100 text-zen-700 text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider flex-shrink-0">
                  Best value
                </span>
              </div>

              <Link
                href="/book"
                className="block w-full text-center rounded-2xl bg-zen-900 py-4 text-[15px] font-semibold text-white hover:bg-zen-800 transition-colors mb-4"
              >
                Book ZenScan
              </Link>
              <Link
                href="/scan"
                className="block w-full text-center rounded-2xl border border-gray-200 py-4 text-[15px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors mb-8"
              >
                Learn what&apos;s included
              </Link>

              {/* Genetics add-on — different presentation */}
              <div className="rounded-2xl bg-cream p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Optional add-on</p>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-zen-900">ZenGenetics Module</p>
                    <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">
                      NGS polygenic risk screening for Heart, Brain, Cancer & Metabolic Health
                    </p>
                  </div>
                  <p className="font-display text-2xl text-zen-900 flex-shrink-0 mt-0.5">+₹27,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
              <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
              Questions
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.1] text-zen-900">
              Things people<br />
              usually ask.
            </h2>
          </div>

          {/* 2-column grid — different from single-column accordion */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white rounded-2xl p-6 ring-1 ring-black/5">
                <p className="font-bold text-zen-900 leading-snug mb-3">{f.q}</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/faqs" className="inline-flex items-center gap-2 text-[15px] font-semibold text-zen-900 hover:text-zen-700 transition-colors">
              See all questions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-32 bg-cream-dark">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zen-600">
            <span className="h-px w-8 bg-zen-500 inline-block align-middle mr-3" />
            Get started
          </p>
          <h2 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-zen-900">
            Your health.<br />
            Fully mapped.<br />
            <em className="not-italic text-zen-700">Once a year.</em>
          </h2>
          <p className="mt-8 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Most of what ZenScan finds would never have surfaced in a routine checkup.
            The question isn&apos;t whether you can afford to know — it&apos;s whether
            you can afford not to.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-zen-900 px-10 py-4 text-[15px] font-semibold text-white hover:bg-zen-800 hover:shadow-xl transition-all active:scale-95"
            >
              Book ZenScan <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:8954010099"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 px-8 py-4 text-[15px] font-semibold text-gray-600 hover:border-gray-500 hover:text-gray-900 transition-all"
            >
              Call 8954010099
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Marquee animation */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
