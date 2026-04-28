import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-400">Last updated: January 2025</p>

          <div className="prose mt-10 space-y-8 text-gray-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
              <p className="mt-3">We collect information you provide directly (name, age, gender, contact details, health history), information generated through your ZenScan (scan results, biomarker data, imaging findings), and usage data from our platform (login sessions, report views, Zeno chat history).</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">2. How We Use Your Information</h2>
              <p className="mt-3">Your data is used to provide your ZenReport, power Zeno AI responses, enable physician consultations, and improve our clinical protocols. We use anonymised and aggregated data for research. We do not sell your personal health information to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">3. Data Security</h2>
              <p className="mt-3">All health data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access is restricted to authorised clinical and engineering staff on a need-to-know basis. We conduct annual security audits and penetration testing.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">4. Your Rights</h2>
              <p className="mt-3">You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@zenlife.health. We will respond within 30 days. Deletion requests will be completed within 90 days, subject to regulatory retention requirements.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">5. Cookies</h2>
              <p className="mt-3">We use essential cookies for authentication and session management. We use analytics cookies (Google Analytics 4) to understand platform usage. You can disable non-essential cookies in your browser settings.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">6. Contact</h2>
              <p className="mt-3">For privacy-related queries, contact our Data Protection Officer at privacy@zenlife.health or write to ZenLife Health Pvt. Ltd., Bengaluru, Karnataka, India.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
