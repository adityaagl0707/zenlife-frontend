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
        <section className="bg-zen-900 pt-32 pb-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-300">Everything Included</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight md:text-6xl">
              The ZenScan<br />
              <span className="text-zen-300">Experience</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zen-200/80">
              One appointment. Every major health risk screened. A complete picture of your body — in 72 hours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zen-200">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> 3–4 hours</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bengaluru (more cities soon)</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4" /> 4.9 / 5 avg. rating</span>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900">What's Included at ₹27,500</h2>
              <p className="mt-4 text-gray-500">No hidden fees. No surprise add-ons. One comprehensive package.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
              <div className="grid gap-3 sm:grid-cols-2">
                {INCLUSIONS.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/book" className="btn-primary flex-1 py-4 text-center text-base font-bold">
                  Book ZenScan — ₹27,500
                </Link>
                <Link href="/science" className="flex-1 rounded-full border-2 border-zen-800 py-4 text-center text-base font-bold text-zen-800 hover:bg-zen-50 transition-colors">
                  See the Science
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-10 text-center text-4xl font-extrabold text-gray-900">Common Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5">
                  <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-gray-800">
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
            <h2 className="text-3xl font-extrabold">Your health can't wait.</h2>
            <p className="mt-4 text-zen-200">Most critical conditions are silent until they're not. ZenScan finds them early.</p>
            <Link href="/book" className="mt-8 inline-block rounded-full bg-white px-10 py-4 font-bold text-zen-900 hover:bg-zen-50 transition-colors">
              Book Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
