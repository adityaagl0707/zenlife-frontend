import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Building2, TrendingUp, Shield, Users, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Reduced absenteeism and productivity loss from preventable illness",
  "Lower long-term healthcare insurance premiums",
  "Demonstrate commitment to employee wellbeing — proven retention tool",
  "Early detection of conditions that cause unexpected leaves of absence",
  "Executive health reporting dashboard for HR leadership",
  "Dedicated ZenLife account manager for your organisation",
];

const PLANS = [
  {
    name: "Starter",
    employees: "5–20 employees",
    price: "₹24,500",
    note: "per person",
    color: "bg-white",
    features: ["ZenScan for each employee", "Individual ZenReports™", "Zeno AI access (12 months)", "Group health insights (anonymised)"],
  },
  {
    name: "Growth",
    employees: "21–100 employees",
    price: "₹22,000",
    note: "per person",
    color: "bg-zen-800 text-white",
    popular: true,
    features: ["Everything in Starter", "Priority scheduling (weekends available)", "HR dashboard — aggregate insights", "Quarterly health trend report", "Dedicated account manager"],
  },
  {
    name: "Enterprise",
    employees: "100+ employees",
    price: "Custom",
    note: "volume pricing",
    color: "bg-white",
    features: ["Everything in Growth", "On-site scan coordination", "Custom report branding", "API integration with HRMS", "Executive health advisory"],
  },
];

export default function CorporatePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-zen-900 pt-32 pb-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-zen-300">ZenLife for Business</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight">
              Healthy Employees.<br />
              <span className="text-zen-300">Exceptional Companies.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zen-200/80">
              Give your team the most advanced preventive health scan available. ZenLife Corporate makes ZenScan accessible, affordable, and seamlessly managed for organisations of all sizes.
            </p>
            <a href="mailto:corporate@zenlife.health" className="mt-10 inline-block rounded-full bg-white px-10 py-4 font-bold text-zen-900 hover:bg-zen-50 transition-colors">
              Talk to Our Team
            </a>
          </div>
        </section>

        {/* Why corporate */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900">The ROI of Preventive Health</h2>
              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                Every ₹1 invested in preventive health returns ₹3–6 in reduced medical costs, productivity gains, and insurance savings.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: TrendingUp, stat: "3–6x", label: "ROI on preventive health investment" },
                { icon: Users, stat: "28%", label: "reduction in absenteeism with proactive screening" },
                { icon: Shield, stat: "4–7 yrs", label: "earlier detection compared to reactive care" },
                { icon: Building2, stat: "40%", label: "of employees more likely to stay at health-invested companies" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="card text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zen-50">
                      <Icon className="h-6 w-6 text-zen-800" />
                    </div>
                    <p className="text-3xl font-extrabold text-zen-800">{item.stat}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900">What Your Organisation Gets</h2>
                <ul className="mt-8 space-y-4">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                      <p className="text-sm text-gray-600">{b}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-zen-50 p-8 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Trusted by leading organisations</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  From Series A startups to listed enterprises, ZenLife Corporate is the choice of forward-thinking CHROs and CFOs who understand that workforce health is a balance sheet issue, not just a benefits line item.
                </p>
                <a href="mailto:corporate@zenlife.health" className="inline-block rounded-full bg-zen-800 px-8 py-3 text-sm font-bold text-white hover:bg-zen-700 transition-colors">
                  Get a Corporate Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">Corporate Plans</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-8 ring-1 ring-black/5 shadow-sm ${plan.color}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-4 py-1 text-xs font-bold text-white">
                      Most Popular
                    </div>
                  )}
                  <p className={`text-xs font-semibold uppercase tracking-widest ${plan.popular ? "text-zen-300" : "text-zen-600"}`}>
                    {plan.employees}
                  </p>
                  <h3 className={`mt-1 text-2xl font-extrabold ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                  <div className="mt-4">
                    <span className={`text-4xl font-extrabold ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.price}</span>
                    <span className={`ml-2 text-sm ${plan.popular ? "text-zen-200" : "text-gray-400"}`}>{plan.note}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-zen-300" : "text-emerald-500"}`} />
                        <span className={`text-sm ${plan.popular ? "text-zen-100" : "text-gray-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:corporate@zenlife.health"
                    className={`mt-8 block rounded-full py-3 text-center text-sm font-bold transition-colors ${
                      plan.popular
                        ? "bg-white text-zen-900 hover:bg-zen-50"
                        : "border-2 border-zen-800 text-zen-800 hover:bg-zen-50"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
