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
        <div className="pt-32 pb-10 bg-cream">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Evidence-Based Medicine</p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-zen-900">
              The science behind ZenScan.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-500 leading-relaxed">
              ZenLife's ZenCore Protocol is built on decades of peer-reviewed research in preventive medicine, oncology, cardiology, and metabolomics.
            </p>
          </div>
        </div>

        {/* Modalities */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">The Modalities</p>
              <h2 className="font-display text-[2rem] text-zen-900">What ZenScan measures.</h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Six complementary modalities that together screen for 300+ conditions across every major organ system.</p>
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

        {/* Protocol */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">The Protocol</p>
              <h2 className="font-display text-[2rem] text-zen-900">Your health journey.</h2>
              <p className="mt-4 text-gray-500">Your end-to-end health intelligence journey — from booking to action plan.</p>
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
            <p className="mt-4 text-zen-200">Join thousands of Indians who've taken charge of their health with ZenScan.</p>
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
