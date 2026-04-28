import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Microscope, Brain, Heart, Activity, Shield, Zap } from "lucide-react";

const PILLARS = [
  {
    icon: Microscope,
    title: "Full-Body MRI",
    subtitle: "1.5T & 3T scanners",
    body: "Non-invasive imaging covering brain, spine, abdomen, pelvis, and soft tissues. Detects tumors, structural abnormalities, and early organ changes invisible to standard checkups.",
  },
  {
    icon: Activity,
    title: "DEXA Bone & Body Composition",
    subtitle: "Gold-standard body composition",
    body: "Measures bone mineral density, visceral fat, muscle mass, and lean-to-fat ratio with precision — critical for osteoporosis prevention and metabolic health.",
  },
  {
    icon: Heart,
    title: "Calcium Score (CCTA)",
    subtitle: "Agatston score calculation",
    body: "Quantifies coronary artery calcification — the single strongest predictor of heart attack risk. Identifies atherosclerosis a decade before symptoms appear.",
  },
  {
    icon: Brain,
    title: "100+ Biomarker Blood Panel",
    subtitle: "Comprehensive laboratory analysis",
    body: "Hormone levels, inflammation markers (CRP, IL-6), lipid subfractions, thyroid, liver, kidney, metabolic, and micronutrient status — all in one draw.",
  },
  {
    icon: Shield,
    title: "Lung CT Screening",
    subtitle: "Low-dose CT protocol",
    body: "Early-stage lung nodule detection with low-dose radiation. Recommended for high-risk individuals. Detects cancers when surgical cure rates exceed 90%.",
  },
  {
    icon: Zap,
    title: "ECG & Cardiac Monitoring",
    subtitle: "12-lead resting ECG",
    body: "Resting ECG analysis for arrhythmias, ischemia, and conduction abnormalities. Establishes your cardiac baseline for ongoing monitoring.",
  },
];

const PROTOCOL_STEPS = [
  { step: "01", title: "Pre-Scan Consultation", desc: "A ZenLife health coordinator reviews your history, medications, and goals before your scan." },
  { step: "02", title: "ZenScan Day (3–4 hrs)", desc: "All modalities completed in a single visit at our premium diagnostic centre." },
  { step: "03", title: "AI Analysis by Zeno", desc: "Your results are processed by ZenCore Protocol, cross-referencing 10,000+ medical studies." },
  { step: "04", title: "Report Ready in 72 hrs", desc: "Your ZenReport with ZenScore, organ analysis, and personalised action plan is delivered." },
  { step: "05", title: "Post-Scan Physician Review", desc: "A dedicated physician walkthrough to explain findings and answer your questions." },
];

export default function SciencePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-zen-900 pt-32 pb-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-300">Evidence-Based Medicine</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight md:text-6xl">
              The Science Behind<br />
              <span className="text-zen-300">ZenScan</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zen-200/80">
              ZenLife's ZenCore Protocol is built on decades of peer-reviewed research in preventive medicine, oncology, cardiology, and metabolomics.
            </p>
          </div>
        </section>

        {/* Modalities */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900">What ZenScan Measures</h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Six complementary modalities that together screen for 300+ conditions across every major organ system.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="card hover:shadow-md transition-shadow">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zen-50">
                      <Icon className="h-6 w-6 text-zen-800" />
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

        {/* Protocol */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900">The ZenCore Protocol</h2>
              <p className="mt-4 text-gray-500">Your end-to-end health intelligence journey — from booking to action plan.</p>
            </div>
            <div className="relative space-y-0">
              {PROTOCOL_STEPS.map((s, i) => (
                <div key={s.step} className="flex gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zen-800 text-sm font-bold text-white">
                      {s.step}
                    </div>
                    {i < PROTOCOL_STEPS.length - 1 && <div className="mt-1 h-full w-0.5 bg-zen-100 flex-1" />}
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
            <h2 className="text-3xl font-extrabold">Ready to know your body inside out?</h2>
            <p className="mt-4 text-zen-200">Join thousands of Indians who've taken charge of their health with ZenScan.</p>
            <Link href="/book" className="mt-8 inline-block rounded-full bg-white px-10 py-4 font-bold text-zen-900 hover:bg-zen-50 transition-colors">
              Book ZenScan
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
