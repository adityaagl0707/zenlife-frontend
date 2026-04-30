import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Legal</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">Privacy Policy</h1>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Last updated: January 2025</p>

          <div className="mt-10 space-y-8 text-gray-600 text-[13px] leading-relaxed">
            {[
              {
                title: "1. Information We Collect",
                body: "We collect information you provide directly (name, age, gender, contact details, health history), information generated through your ZenScan (scan results, biomarker data, imaging findings), and usage data from our platform (login sessions, report views, Zeno chat history).",
              },
              {
                title: "2. How We Use Your Information",
                body: "Your data is used to provide your ZenReport, power Zeno AI responses, enable physician consultations, and improve our clinical protocols. We use anonymised and aggregated data for research. We do not sell your personal health information to third parties.",
              },
              {
                title: "3. Data Security",
                body: "All health data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access is restricted to authorised clinical and engineering staff on a need-to-know basis. We conduct annual security audits and penetration testing.",
              },
              {
                title: "4. Your Rights",
                body: "You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@zenlife.health. We will respond within 30 days. Deletion requests will be completed within 90 days, subject to regulatory retention requirements.",
              },
              {
                title: "5. Cookies",
                body: "We use essential cookies for authentication and session management. We use analytics cookies (Google Analytics 4) to understand platform usage. You can disable non-essential cookies in your browser settings.",
              },
              {
                title: "6. Contact",
                body: "For privacy-related queries, contact our Data Protection Officer at privacy@zenlife.health or write to ZenLife Health Pvt. Ltd., Bengaluru, Karnataka, India.",
              },
            ].map((s) => (
              <section key={s.title} className="rounded-2xl bg-white ring-1 ring-black/5 p-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zen-900 mb-3">{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
