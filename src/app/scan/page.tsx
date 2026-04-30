import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, MapPin, CheckCircle2, Star } from "lucide-react";

const INCLUSIONS = [
  "Full-body MRI (brain, spine, abdomen, pelvis)",
  "DEXA bone density & body composition",
  "Calcium Score (Agatston) — coronary artery risk",
  "Low-dose Lung CT screening",
  "12-lead resting ECG",
  "100+ biomarker blood panel",
  "ZenScore AI health intelligence report",
  "ZenReport — full digital report with organ-level analysis",
  "Post-scan physician video consultation (30 min)",
  "Zeno AI — 24/7 health Q&A for 12 months",
  "1-year health monitoring & trend tracking",
];

const FAQS = [
  {
    q: "How long does the ZenScan take?",
    a: "The full scan takes 3–4 hours. We recommend arriving 15 minutes early for registration. You can eat a light meal 2 hours before.",
  },
  {
    q: "Do I need a doctor's referral?",
    a: "No referral needed. ZenScan is a self-pay preventive health service. You book directly and we manage the entire process.",
  },
  {
    q: "Is the MRI safe? Any radiation?",
    a: "MRI uses no radiation — it uses magnetic fields and radio waves. The Lung CT uses low-dose radiation (~1.5 mSv, equivalent to ~7 months of background radiation).",
  },
  {
    q: "When will I get my report?",
    a: "Your ZenReport is delivered within 72 hours of your scan, directly to your ZenLife account with a full physician review included.",
  },
  {
    q: "What happens after the report?",
    a: "You get a 30-min video consultation with a ZenLife physician to walk through your findings. Zeno AI is available 24/7 for follow-up questions.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Yes — cancellations or reschedules are free up to 48 hours before your appointment. See our cancellation policy for details.",
  },
];

export default function ScanPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="pt-32 pb-10 bg-cream">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">ZenScan</p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-zen-900">
              The ZenScan experience.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-500 leading-relaxed">
              One appointment. Every major health risk screened. A complete picture of your body — in 72 hours.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-2 text-[12px] font-semibold text-zen-900">
                <Clock className="h-3.5 w-3.5" /> 3–4 hours
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-2 text-[12px] font-semibold text-zen-900">
                <MapPin className="h-3.5 w-3.5" /> Bengaluru (more cities soon)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-2 text-[12px] font-semibold text-zen-900">
                <Star className="h-3.5 w-3.5" /> 4.9 / 5 avg. rating
              </span>
            </div>
          </div>
        </div>

        {/* What's included */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Package</p>
              <h2 className="font-display text-[2rem] text-zen-900">Everything at ₹27,500.</h2>
              <p className="mt-4 text-gray-500">No hidden fees. No surprise add-ons. One comprehensive package.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
              <div className="grid gap-3 sm:grid-cols-2">
                {INCLUSIONS.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/book" className="flex-1 rounded-full bg-zen-900 py-4 text-center text-[14px] font-bold text-white">
                  Book ZenScan — ₹27,500
                </Link>
                <Link href="/science" className="flex-1 rounded-full border border-zen-900/20 py-4 text-center text-[14px] font-semibold text-zen-900 hover:bg-zen-50 transition-colors">
                  See the Science
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Questions</p>
              <h2 className="font-display text-[2rem] text-zen-900">Common questions.</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group bg-white ring-1 ring-black/5 rounded-2xl px-6 py-5 border-0">
                  <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-zen-900">
                    {faq.q}
                    <span className="ml-4 text-zen-600 group-open:rotate-45 transition-transform text-xl font-light">+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zen-900 py-20 text-white text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="font-display text-[2rem] text-white">Your health can't wait.</h2>
            <p className="mt-4 text-zen-200">Most critical conditions are silent until they're not. ZenScan finds them early.</p>
            <Link href="/book" className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-[14px] font-bold text-zen-900">
              Book Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
