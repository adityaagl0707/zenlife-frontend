import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Star } from "lucide-react";

const STORIES = [
  {
    name: "Rajesh Kumar",
    age: 44,
    city: "Bengaluru",
    initials: "RK",
    color: "bg-zen-800",
    condition: "Silent heart disease detected",
    quote:
      "I thought I was perfectly healthy. My Calcium Score came back at 480 — the physician said I was at very high risk for a heart attack in the next 5 years. ZenScan probably saved my life. I'm now on medication and lifestyle changes, and my cardiologist is monitoring me closely.",
    stars: 5,
  },
  {
    name: "Priya Shankar",
    age: 38,
    city: "Mumbai",
    initials: "PS",
    color: "bg-gold-500",
    condition: "Early-stage thyroid nodule identified",
    quote:
      "I booked ZenScan on a whim after my husband got his done. My MRI showed a small thyroid nodule — completely asymptomatic. Caught at Stage 1, my treatment was a simple outpatient procedure. Zeno helped me understand what the finding meant without panicking me.",
    stars: 5,
  },
  {
    name: "Amit Desai",
    age: 52,
    city: "Delhi",
    initials: "AD",
    color: "bg-emerald-700",
    condition: "Severe osteoporosis (DEXA) + action plan",
    quote:
      "I'm a fitness enthusiast — I run marathons. I never expected my bone density to be this low. The DEXA scan revealed severe osteoporosis in my spine. Thanks to ZenLife's health priorities, I now understand my calcium and Vitamin D needs. The Zeno chat feature is something I use every week.",
    stars: 5,
  },
  {
    name: "Meera Nair",
    age: 34,
    city: "Kochi",
    initials: "MN",
    color: "bg-zen-600",
    condition: "Metabolic syndrome diagnosed early",
    quote:
      "My standard blood tests always came back 'normal'. ZenScan's extended panel picked up insulin resistance, elevated ApoB, and a fatty liver on MRI — none of which a routine checkup would catch. I'm 34. This was a wake-up call at exactly the right time.",
    stars: 5,
  },
  {
    name: "Vikram Reddy",
    age: 47,
    city: "Hyderabad",
    initials: "VR",
    color: "bg-amber-600",
    condition: "Lung nodule — monitoring initiated",
    quote:
      "I smoked for 15 years and quit 8 years ago. The Lung CT found a 6mm nodule. It's being monitored every 6 months. I'm grateful every day that I caught this before it became something worse. The report was detailed, and the physician consultation was incredibly reassuring.",
    stars: 5,
  },
  {
    name: "Ananya Iyer",
    age: 29,
    city: "Chennai",
    initials: "AI",
    color: "bg-purple-700",
    condition: "Peace of mind — all clear",
    quote:
      "I booked ZenScan because cancer runs in my family and I was anxious. Everything came back normal — my ZenScore was 94. Just knowing I was clear was worth every rupee. I'll be back every two years as recommended.",
    stars: 5,
  },
];

export default function StoriesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-zen-900 pt-32 pb-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-300">Real People. Real Results.</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight">
              Stories That<br />
              <span className="text-zen-300">Changed Lives</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zen-200/80">
              Every ZenScan tells a story. Here are a few from our community of proactive health seekers.
            </p>
          </div>
        </section>

        {/* Stories grid */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {STORIES.map((s) => (
                <div key={s.name} className="card flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-bold ${s.color}`}>
                      {s.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.age} · {s.city}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-zen-50 px-4 py-2 text-xs font-semibold text-zen-700">
                    {s.condition}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 italic">"{s.quote}"</p>
                  <div className="flex gap-1 mt-auto">
                    {Array.from({ length: s.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zen-900 py-20 text-white text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="text-3xl font-extrabold">Write your own story.</h2>
            <p className="mt-4 text-zen-200">Join thousands of Indians discovering what's happening inside their bodies — before symptoms appear.</p>
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
