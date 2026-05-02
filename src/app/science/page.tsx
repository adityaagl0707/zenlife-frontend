import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Microscope, Brain, Heart, Activity, Shield, Zap, Waves, Bot, Sparkles, Mars, Venus } from "lucide-react";

const PILLARS = [
  {
    icon: Microscope,
    title: "Full-Body MRI",
    subtitle: "1.5T & 3T scanners · 100+ params",
    body: "Brain, spine, abdomen, pelvis and major vessels. Tumours, structural changes, vascular anomalies and per-organ inflammation, ischemia and degenerative findings — all without ionising radiation.",
  },
  {
    icon: Waves,
    title: "Whole-Abdomen Ultrasound",
    subtitle: "60+ soft-tissue parameters",
    body: "Liver (parenchyma, focal changes, fatty grading, portal/hepatic veins), gallbladder, pancreas, spleen, kidneys, urinary bladder, thyroid, adrenals and reproductive organs — radiation-free, real-time imaging.",
  },
  {
    icon: Activity,
    title: "DEXA Body Composition",
    subtitle: "Gold-standard composition",
    body: "Bone mineral density (T-score, Z-score), visceral fat, android:gynoid ratio, appendicular lean mass, ASMI for sarcopenia screening and Fat Mass Index — all auto-computed even when the source DEXA omits derived metrics.",
  },
  {
    icon: Heart,
    title: "CT Calcium Score",
    subtitle: "Per-vessel Agatston scoring",
    body: "LM, LAD, LCK and RCA scored individually, with calcified plaque volumes (mm³). Coronary calcification is the single strongest predictor of heart attack risk — a decade ahead of symptoms.",
  },
  {
    icon: Shield,
    title: "Chest X-Ray",
    subtitle: "Standard PA + lateral",
    body: "Lung parenchyma, pleural space and cavities, mediastinum and lymph nodes, lung vasculature and airway condition — screening for nodules, masses, fibrosis, COPD, infection and pneumonia.",
  },
  {
    icon: Zap,
    title: "12-Lead Resting ECG",
    subtitle: "Rhythm + intervals + ST",
    body: "Heart rate, rhythm, PR / QRS / QTc intervals, P-wave duration and ST segment analysis — picks up arrhythmias, conduction defects and silent ischaemia, interpreted alongside your calcium score.",
  },
  {
    icon: Brain,
    title: "150+ Lab Biomarkers",
    subtitle: "Blood + urine, deeper than routine",
    body: "Glucose & HbA1c, full lipid panel + ApoB + Lp(a), liver, kidney + Cystatin C + eGFR, electrolytes, thyroid (TSH, T3, T4 free, TPO, reverse T3), full CBC differential, iron studies, vitamins (D, B12, A, E, folate), minerals, hormones (Cortisol, DHEA, Testosterone, SHBG, IGF-1), inflammation (hs-CRP, ESR, IL-6 markers), coagulation, advanced cardiac (NT-proBNP), 25-parameter urinalysis.",
  },
  {
    icon: Sparkles,
    title: "Mammography (women 40+)",
    subtitle: "BI-RADS digital screening",
    body: "Bilateral mammographic screening: mass, calcifications, architectural distortion, asymmetry, skin thickening, lymphadenopathy, breast density and BI-RADS category for both breasts.",
  },
];

const REPORT_FEATURES = [
  {
    title: "ZenScore (0–100)",
    body: "Composite health-intelligence score across 15 organ systems. Critical findings dock 15 points each, major 7, minor 3 — giving you one comparable number against your previous scans and your peer group.",
  },
  {
    title: "ZenAge — Biological Age",
    body: "Built on the validated PhenoAge formula (9 blood biomarkers) plus a Claude AI synthesis across all your scan data. Returns 5 sub-ages: metabolic, vascular, bone & muscle, inflammation and kidney.",
  },
  {
    title: "15-Organ Analysis",
    body: "Heart, Endocrine & Metabolic, Liver & Digestive, Brain & Cognitive, Kidney & Urinary, Inflammation & Immune, Blood & Nutrients, Reproductive, Bone/Muscle/Joint, Lung & Respiratory, Vascular, Hormonal & Vitality, Mental & Stress, Men's Health, Women's Health.",
  },
  {
    title: "Personalised Health Priorities",
    body: "Top 3 things to act on this year — each with a specific diet plan, exercise prescription, sleep recommendation and supplement protocol generated from your unique findings.",
  },
];

const PROTOCOL_STEPS = [
  { step: "01", title: "Pre-Scan Consultation", desc: "A health coordinator reviews your history, medications, family history and goals. At-home blood and urine collection scheduled the day before." },
  { step: "02", title: "ZenScan Day (3–4 hrs)", desc: "All 8 modalities completed in a single visit — MRI, USG, DEXA, Calcium Score CT, Chest X-Ray, ECG, lab samples (already drawn), Mammography (women 40+)." },
  { step: "03", title: "AI Analysis by ZenCore", desc: "Every value across 400+ parameters is extracted, gender-filtered, severity-classified and routed to the right organ system. Claude AI generates clinical findings and recommendations per parameter." },
  { step: "04", title: "Physician Review", desc: "A ZenLife physician reviews every finding, edits AI-generated notes where needed, then publishes the report. Average turnaround: 5–7 business days." },
  { step: "05", title: "ZenReport + Zeno AI", desc: "You get the full digital report, your top 3 personalised health priorities, a 30-min physician video consultation and 12 months of 24/7 access to Zeno — your AI health assistant that has read your entire report." },
  { step: "06", title: "Doctor-Shareable Link", desc: "Generate a JWT-secured 7-day link from any device — share your full report with a specialist or family physician without giving up your account credentials." },
];

const EVIDENCE = [
  { stat: "400+", label: "Parameters tracked", sub: "across imaging, body composition, blood and urine" },
  { stat: "15", label: "Organ systems scored", sub: "from cardiovascular to cognitive to reproductive" },
  { stat: "8", label: "Diagnostic modalities", sub: "in a single 3–4 hour appointment" },
  { stat: "24/7", label: "Zeno AI access", sub: "for 12 months after your scan" },
];

export default function SciencePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="pt-32 pb-10 bg-cream">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Evidence-Based Medicine</p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-zen-900">
              The science behind ZenScan.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-500 leading-relaxed">
              ZenLife&apos;s ZenCore Protocol combines 8 diagnostic modalities and 400+ parameters
              into a unified 15-organ health picture — built on decades of peer-reviewed research
              in preventive medicine, oncology, cardiology and metabolomics, and cross-referenced
              by Claude AI against thousands of clinical studies.
            </p>
          </div>
        </div>

        {/* By the numbers */}
        <section className="bg-cream pt-4 pb-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {EVIDENCE.map((e) => (
                <div key={e.label} className="rounded-2xl bg-white ring-1 ring-black/5 px-5 py-6 text-center">
                  <p className="font-display text-4xl text-zen-900">{e.stat}</p>
                  <p className="mt-2 text-[13px] font-bold text-gray-800">{e.label}</p>
                  <p className="mt-1 text-[11px] text-gray-400 leading-snug">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modalities */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">The 8 Modalities</p>
              <h2 className="font-display text-[2rem] text-zen-900">What ZenScan measures.</h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Eight complementary modalities that together screen 400+ parameters across every major organ system.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="card hover:shadow-md transition-shadow">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-dark">
                      <Icon className="h-6 w-6 text-zen-900" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zen-600">{p.subtitle}</p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{p.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Report features */}
        <section className="bg-zen-900 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zen-400 mb-2">The ZenReport</p>
              <h2 className="font-display text-[2rem] text-white">Synthesis, not just data.</h2>
              <p className="mt-4 text-white/60 max-w-2xl mx-auto">
                Raw results are useless without context. Every ZenReport includes four layers of synthesis
                that turn 400+ data points into clear, prioritised actions.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {REPORT_FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <p className="font-bold text-white text-[15px] mb-2">{f.title}</p>
                  <p className="text-[12px] text-white/60 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tailored for sex — male / female test differences */}
        <section className="bg-cream-dark py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Tailored for you</p>
              <h2 className="font-display text-[2rem] text-zen-900">Different bodies, different tests.</h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                ZenScan automatically adapts to the patient&apos;s sex. Sex-specific imaging, hormone panels and screenings
                are added or removed so your report only shows what actually applies to you.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Men */}
              <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    <Mars className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-zen-900">Men&apos;s ZenScan</p>
                    <p className="text-[12px] text-gray-400">Sex-specific add-ons for male patients</p>
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Imaging</p>
                <div className="grid grid-cols-2 gap-1.5 text-[13px] text-gray-700 mb-5">
                  {["Prostate ultrasound", "Prostate volume", "Seminal vesicles"].map((x) => (
                    <span key={x} className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />{x}</span>
                  ))}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Lab</p>
                <div className="grid grid-cols-2 gap-1.5 text-[13px] text-gray-700 mb-5">
                  {["PSA", "Total testosterone", "Free testosterone", "SHBG", "DHEA", "IGF-1"].map((x) => (
                    <span key={x} className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />{x}</span>
                  ))}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Excluded for males</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Pap Smear, HPV DNA Test, Mammography, AMH, FSH, LH, Progesterone, Prolactin, HE4, CA 15-3, DHEA-S,
                  Pelvic / Transvaginal Ultrasound, Uterus / Ovaries / Cervix / Endometrium / Breast imaging.
                </p>
              </div>

              {/* Women */}
              <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
                    <Venus className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-zen-900">Women&apos;s ZenScan</p>
                    <p className="text-[12px] text-gray-400">Sex-specific add-ons for female patients</p>
                  </div>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Imaging</p>
                <div className="grid grid-cols-2 gap-1.5 text-[13px] text-gray-700 mb-5">
                  {["Mammography (40+)", "Breast ultrasound", "Pelvic ultrasound", "Transvaginal USG", "Endometrial thickness", "Uterus, Ovaries, Cervix"].map((x) => (
                    <span key={x} className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0" />{x}</span>
                  ))}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Lab & Screening</p>
                <div className="grid grid-cols-2 gap-1.5 text-[13px] text-gray-700 mb-5">
                  {["Pap Smear", "HPV DNA Test", "FSH", "LH", "Progesterone", "Prolactin", "AMH", "Estradiol (E2)", "DHEA-S", "HE4", "CA 15-3"].map((x) => (
                    <span key={x} className="flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-2 flex-shrink-0" />{x}</span>
                  ))}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Excluded for females</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  PSA, Prostate ultrasound and volume, Seminal vesicles imaging.
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-[12px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Some lab thresholds (HDL, RBC, Hemoglobin, Hematocrit, DHEA, Testosterone) also use sex-specific normal
              ranges so a value isn&apos;t flagged abnormal by a unisex cutoff that doesn&apos;t apply to you.
            </p>
          </div>
        </section>

        {/* Zeno AI */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-zen-900 mx-auto lg:mx-0">
                <Bot className="h-16 w-16 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Zeno AI</p>
                <h2 className="font-display text-[2rem] text-zen-900">Your personal health AI.</h2>
                <p className="mt-4 text-[15px] text-gray-500 leading-relaxed">
                  Zeno is built on Anthropic&apos;s Claude — given full read-access to your ZenReport,
                  organ scores, biomarkers, body composition and biological age. Ask any question
                  about your findings, in plain English, any time. 4 personalised conversation
                  starters appear the moment you open it, generated from your unique results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Protocol */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">The Protocol</p>
              <h2 className="font-display text-[2rem] text-zen-900">Your health journey.</h2>
              <p className="mt-4 text-gray-500">From booking to action plan — six steps to a clearer picture of your health.</p>
            </div>
            <div className="relative space-y-0">
              {PROTOCOL_STEPS.map((s, i) => (
                <div key={s.step} className="flex gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zen-900 text-sm font-bold text-white">
                      {s.step}
                    </div>
                    {i < PROTOCOL_STEPS.length - 1 && <div className="mt-1 h-full w-0.5 bg-black/8 flex-1" />}
                  </div>
                  <div className="pb-1 pt-1.5">
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zen-900 py-20 text-white text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="font-display text-[2rem] text-white">Ready to know your body inside out?</h2>
            <p className="mt-4 text-zen-200">Join hundreds of Indians who&apos;ve mapped their health across 15 organ systems with ZenScan.</p>
            <Link href="/book" className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-[14px] font-bold text-zen-900">
              Book ZenScan
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
