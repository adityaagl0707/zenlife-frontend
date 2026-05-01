import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Legal</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">Terms &amp; Conditions</h1>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Last updated: January 2025</p>

          <div className="mt-10 space-y-8 text-gray-600 text-[13px] leading-relaxed">
            {[
              {
                title: "1. Service Description",
                body: 'ZenLife Health Pvt. Ltd. ("ZenLife") provides ZenScan, a preventive health screening service, and ZenReport, an AI-assisted health intelligence report. These services are not a substitute for medical diagnosis, emergency care, or treatment by a licensed physician.',
              },
              {
                title: "2. Eligibility",
                body: "ZenScan is available to individuals aged 18–70. Certain medical conditions (e.g., metallic implants, severe claustrophobia, pregnancy) may preclude participation in MRI components. You are responsible for disclosing relevant medical history during pre-scan consultation.",
              },
              {
                title: "3. Zeno AI Disclaimer",
                body: "Zeno is an AI health assistant designed for educational purposes. Responses from Zeno do not constitute medical advice, diagnosis, or treatment recommendations. Always consult a qualified medical professional before making health decisions.",
              },
              {
                title: "4. Payment",
                body: "All payments are processed via Razorpay, a PCI-DSS compliant payment gateway. Prices are displayed in Indian Rupees (INR) inclusive of applicable taxes. ZenLife reserves the right to modify pricing with 30 days' notice.",
              },
              {
                title: "5. Intellectual Property",
                body: "ZenScan, ZenScore, ZenReport, ZenCore, ZenCoverage, and Zeno are trademarks of ZenLife Health Pvt. Ltd. Your ZenReport is your personal health document. ZenLife retains the right to use anonymised data for research and product improvement.",
              },
              {
                title: "6. Limitation of Liability",
                body: "ZenLife's liability is limited to the amount paid for the specific service. ZenLife is not liable for any consequential, indirect, or punitive damages arising from use of our services or reliance on ZenReport findings without independent medical review.",
              },
              {
                title: "7. Governing Law",
                body: "These terms are governed by the laws of India. Disputes shall be subject to exclusive jurisdiction of the courts of Noida, Uttar Pradesh.",
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
