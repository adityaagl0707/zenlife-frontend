import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-gray-400">Last updated: January 2025</p>

          <div className="mt-10 space-y-8 text-gray-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900">1. Service Description</h2>
              <p className="mt-3">ZenLife Health Pvt. Ltd. ("ZenLife") provides ZenScan, a preventive health screening service, and ZenReport, an AI-assisted health intelligence report. These services are not a substitute for medical diagnosis, emergency care, or treatment by a licensed physician.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">2. Eligibility</h2>
              <p className="mt-3">ZenScan is available to individuals aged 18–70. Certain medical conditions (e.g., metallic implants, severe claustrophobia, pregnancy) may preclude participation in MRI components. You are responsible for disclosing relevant medical history during pre-scan consultation.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">3. Zeno AI Disclaimer</h2>
              <p className="mt-3">Zeno is an AI health assistant designed for educational purposes. Responses from Zeno do not constitute medical advice, diagnosis, or treatment recommendations. Always consult a qualified medical professional before making health decisions.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">4. Payment</h2>
              <p className="mt-3">All payments are processed via Razorpay, a PCI-DSS compliant payment gateway. Prices are displayed in Indian Rupees (INR) inclusive of applicable taxes. ZenLife reserves the right to modify pricing with 30 days' notice.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">5. Intellectual Property</h2>
              <p className="mt-3">ZenScan, ZenScore, ZenReport, ZenCore, ZenCoverage™, and Zeno are trademarks of ZenLife Health Pvt. Ltd. Your ZenReport is your personal health document. ZenLife retains the right to use anonymised data for research and product improvement.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">6. Limitation of Liability</h2>
              <p className="mt-3">ZenLife's liability is limited to the amount paid for the specific service. ZenLife is not liable for any consequential, indirect, or punitive damages arising from use of our services or reliance on ZenReport findings without independent medical review.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-900">7. Governing Law</h2>
              <p className="mt-3">These terms are governed by the laws of India. Disputes shall be subject to exclusive jurisdiction of the courts of Bengaluru, Karnataka.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
