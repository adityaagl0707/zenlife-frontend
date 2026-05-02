import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Clock, MapPin, CheckCircle2, Star } from "lucide-react";

const INCLUSIONS = [
  "Full-body MRI (brain, spine, abdomen, pelvis, vessels)",
  "Whole-abdomen Ultrasound (liver, kidneys, thyroid, reproductive)",
  "DEXA bone density & body composition",
  "Calcium Score CT — per-vessel Agatston (LM, LAD, LCK, RCA)",
  "Chest X-Ray — lung parenchyma, pleura, mediastinum",
  "12-lead resting ECG with PR / QRS / QTc analysis",
  "150+ lab biomarkers (blood) + 25-parameter urinalysis",
  "Mammography (women 40+, optional below)",
  "ZenScore — 15-organ health intelligence index",
  "ZenAge — biological age + 5 sub-ages",
  "ZenReport — full digital report with parameter-level findings",
  "Personalised Health Priorities (diet, exercise, sleep, supplements)",
  "Post-scan physician video consultation (30 min)",
  "Zeno AI — 24/7 health Q&A for 12 months",
  "Doctor-shareable secure link (7-day JWT)",
  "1-year health monitoring & trend tracking",
];

const FAQS = [
  {
    q: "How long does the ZenScan take?",
    a: "The full scan takes 3–4 hours at our facility. Lab samples (blood + urine) are collected at home the day before, so the in-person visit covers only imaging and ECG. Arrive 15 minutes early for registration.",
  },
  {
    q: "Do I need a doctor's referral?",
    a: "No referral needed. ZenScan is a self-pay preventive health service. You book directly and we manage the entire process — including the home lab collection and post-scan physician consultation.",
  },
  {
    q: "Is the scan radiation-free?",
    a: "MRI, Ultrasound and DEXA use zero ionising radiation. The Calcium Score CT and Chest X-Ray combined ≈ 1.2 mSv — roughly four months of natural background exposure. Mammography (women only) ≈ 0.4 mSv per screening.",
  },
  {
    q: "When will I get my report?",
    a: "Your ZenReport is delivered within 5–7 business days via your ZenLife account. You'll get an email and SMS notification when it's ready, plus an option to schedule your physician consultation.",
  },
  {
    q: "What's included in the report?",
    a: "ZenScore (0–100), ZenAge biological age (with 5 sub-ages), 15-organ analysis with severity per system, parameter-level findings with clinical context, your top 3 personalised health priorities (diet/exercise/sleep/supplements), and any flagged conditions to discuss with a specialist.",
  },
  {
    q: "What happens after the report?",
    a: "30-min video consultation with a ZenLife physician to walk through your findings. Zeno AI is available 24/7 for follow-up questions. You can also generate a doctor-shareable secure link to send your full report to any specialist.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Yes — cancellations or reschedules are free up to 48 hours before your appointment. Within 48 hours, a 10% rescheduling fee applies.",
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
              One appointment. Eight diagnostic modalities. 400+ parameters across 15 organ systems —
              synthesised into a single AI-reviewed report in 5–7 days.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-2 text-[12px] font-semibold text-zen-900">
                <Clock className="h-3.5 w-3.5" /> 3–4 hours
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-4 py-2 text-[12px] font-semibold text-zen-900">
                <MapPin className="h-3.5 w-3.5" /> Noida (more cities soon)
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
              <p className="mt-4 text-gray-500">No hidden fees. No surprise add-ons. One comprehensive package — every modality, every analysis layer, every follow-up.</p>
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

        {/* What you'll see in the report */}
        <section className="bg-cream-dark py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Inside the ZenReport</p>
              <h2 className="font-display text-[2rem] text-zen-900">More than data — direction.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { title: "ZenScore", body: "0–100 health-intelligence score across all 15 organ systems. Comparable across visits — see your baseline shift year over year." },
                { title: "ZenAge", body: "Your biological age vs your chronological age, computed from PhenoAge + AI synthesis. Five sub-ages: metabolic, vascular, bone & muscle, inflammation, kidney." },
                { title: "Organ Analysis", body: "Every organ system gets its own severity badge, parameter breakdown and clinical narrative — clickable cards drill into individual findings." },
                { title: "Health Priorities", body: "Top 3 things to act on this year, each with a tailored diet, exercise, sleep and supplement plan generated from your unique results." },
                { title: "Findings Panel", body: "Every parameter, every value, every normal range — with severity colour coding, clinical context and physician recommendations." },
                { title: "Zeno AI Chat", body: "Ask questions in plain English. Zeno has read every line of your report and answers like a friend who happens to be a doctor." },
              ].map((b) => (
                <div key={b.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
                  <p className="font-bold text-zen-900 mb-2">{b.title}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{b.body}</p>
                </div>
              ))}
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
            <h2 className="font-display text-[2rem] text-white">Your health can&apos;t wait.</h2>
            <p className="mt-4 text-zen-200">Most critical conditions are silent until they&apos;re not. ZenScan finds them early — across all 15 organ systems.</p>
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
