import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Heart, Target, Users, Award } from "lucide-react";

const TEAM = [
  { name: "Dr. Arjun Mehta", role: "Founder & CEO", bg: "bg-zen-800", initials: "AM", bio: "Interventional cardiologist with 18 years of clinical practice. Former Head of Cardiology at Manipal Hospitals." },
  { name: "Dr. Priya Nair", role: "Chief Medical Officer", bg: "bg-emerald-700", initials: "PN", bio: "Radiologist specialising in MRI and preventive imaging. MD from AIIMS Delhi, Fellowship from Johns Hopkins." },
  { name: "Vikram Singh", role: "CTO", bg: "bg-gold-500", initials: "VS", bio: "10+ years in healthtech. Previously built clinical AI at Apollo Hospitals. IIT Bombay alumnus." },
  { name: "Meera Krishnan", role: "Head of Clinical Operations", bg: "bg-zen-600", initials: "MK", bio: "MBA from ISB, 8 years scaling diagnostic operations. Ensures every ZenScan meets our clinical quality standard." },
];

const VALUES = [
  { icon: Target, title: "Prevention First", desc: "We believe the best medicine is the kind you never need. Every product decision starts with: does this help someone act before they're sick?" },
  { icon: Heart, title: "Radical Transparency", desc: "We show you everything — not just the good news. Your health intelligence should be complete, honest, and yours." },
  { icon: Users, title: "Access for All", desc: "Premium preventive healthcare shouldn't be for the few. We're building towards a future where every Indian can afford to know their body." },
  { icon: Award, title: "Clinical Rigour", desc: "Every protocol, every AI model, every report is reviewed by our clinical board. We won't launch features that aren't backed by evidence." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-zen-900 pt-32 pb-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-300">Our Mission</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight">
              We started ZenLife because<br />
              <span className="text-zen-300">someone we loved got sick too late.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zen-200/80">
              Arjun's father died of a heart attack at 58. The calcification had been building for a decade — invisible, symptomless, treatable. We built ZenLife so that no family has to go through what ours did.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900">India's preventive health problem</h2>
                <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                  <p>India has one of the highest rates of premature death from non-communicable diseases in the world. 28% of deaths occur before age 70 — most from conditions that are detectable and preventable.</p>
                  <p>Yet the Indian healthcare system is almost entirely reactive. We build hospitals for sick people, not intelligence platforms for healthy ones.</p>
                  <p>ZenLife is our answer: a company built around the belief that knowing your body deeply, early, and continuously is the highest-leverage thing you can do for your health.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "28%", label: "Indians die before 70 from NCDs" },
                  { value: "4–7 yrs", label: "average detection lead time with ZenScan" },
                  { value: "300+", label: "conditions ZenScan screens for" },
                  { value: "₹27,500", label: "all-inclusive — no surprises" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <p className="text-3xl font-extrabold text-zen-800">{s.value}</p>
                    <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">What We Stand For</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="card">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zen-50">
                      <Icon className="h-6 w-6 text-zen-800" />
                    </div>
                    <h3 className="font-bold text-gray-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">The Team</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((member) => (
                <div key={member.name} className="card text-center">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white text-xl font-bold ${member.bg}`}>
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-zen-600 font-medium">{member.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zen-900 py-20 text-white text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="text-3xl font-extrabold">Join us on our mission.</h2>
            <p className="mt-4 text-zen-200">We're hiring across clinical operations, engineering, and growth. Come build India's preventive health company.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="rounded-full bg-white px-8 py-3 font-bold text-zen-900 hover:bg-zen-50 transition-colors">
                Book ZenScan
              </Link>
              <a href="mailto:careers@zenlife.health" className="rounded-full border border-white/30 px-8 py-3 font-medium text-white hover:bg-white/10 transition-colors">
                View Careers
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
