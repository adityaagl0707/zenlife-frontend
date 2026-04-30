import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const FAQ_SECTIONS = [
  {
    category: "About ZenScan",
    faqs: [
      {
        q: "What is ZenScan?",
        a: "ZenScan is India's most comprehensive preventive health scan. It combines full-body MRI, DEXA, Calcium Score, Lung CT, ECG, and 100+ blood biomarkers into a single 3–4 hour appointment, giving you a complete picture of your health.",
      },
      {
        q: "Who is ZenScan for?",
        a: "ZenScan is designed for health-conscious adults aged 25–70 who want to proactively screen for serious conditions — especially those with a family history of cancer, heart disease, diabetes, or osteoporosis, or anyone who wants peace of mind.",
      },
      {
        q: "How is this different from a regular health checkup?",
        a: "Standard checkups typically include a handful of blood tests and a physical exam. ZenScan uses advanced imaging (MRI, CT) and 100+ biomarkers to detect conditions years before they cause symptoms — things a routine checkup will never catch.",
      },
      {
        q: "Is ZenScan a diagnostic service?",
        a: "ZenScan is a preventive screening service. Findings that require further diagnosis or treatment are flagged, and you're guided to appropriate specialists. It is not a substitute for emergency or symptomatic care.",
      },
    ],
  },
  {
    category: "Booking & Logistics",
    faqs: [
      {
        q: "Where is ZenScan available?",
        a: "Currently available in Bengaluru, with Mumbai and Delhi NCR launching soon. We partner with premium diagnostic centres equipped with high-field MRI and advanced CT scanners.",
      },
      {
        q: "How do I book?",
        a: "Book directly on our website — select a date, pay online, and receive a confirmation. Our team will contact you 48 hours before your appointment with preparation instructions.",
      },
      {
        q: "What should I do to prepare?",
        a: "Avoid eating 4 hours before MRI components. Wear comfortable, metal-free clothing. Bring any previous reports if available. Your coordinator will send detailed instructions upon booking.",
      },
      {
        q: "Can I cancel or reschedule?",
        a: "Free cancellation or rescheduling up to 48 hours before your appointment. Within 48 hours, a 10% rescheduling fee applies. No-shows forfeit the full amount.",
      },
    ],
  },
  {
    category: "The Report & Zeno AI",
    faqs: [
      {
        q: "When will I receive my report?",
        a: "Your ZenReport is delivered within 72 hours of your scan via your ZenLife account. You'll receive an email and SMS notification when it's ready.",
      },
      {
        q: "What is ZenScore?",
        a: "ZenScore is your personalised health intelligence score (0–100) based on your ZenScan results. It reflects the overall status of your scanned body coverage and severity of findings.",
      },
      {
        q: "What is Zeno?",
        a: "Zeno is ZenLife's AI health assistant, powered by advanced language models. Zeno has read your full ZenReport and can answer questions, explain findings in plain language, and help you understand your health priorities — available 24/7 for 12 months.",
      },
      {
        q: "Is Zeno a replacement for my doctor?",
        a: "No. Zeno is an educational AI that explains your findings and helps you ask better questions. Always consult a qualified physician for medical decisions. A ZenLife physician consultation is included with every ZenScan.",
      },
    ],
  },
  {
    category: "Safety & Privacy",
    faqs: [
      {
        q: "Is the MRI safe?",
        a: "MRI is completely radiation-free and safe for most people. Those with certain metal implants (pacemakers, some cochlear implants) cannot undergo MRI. Our team will screen you for contraindications before your scan.",
      },
      {
        q: "How is my health data protected?",
        a: "Your data is encrypted at rest and in transit. We never sell or share your health information with third parties. You own your data and can request deletion at any time.",
      },
      {
        q: "Is my payment information safe?",
        a: "Payments are processed via Razorpay, a PCI-DSS compliant payment gateway. ZenLife never stores your card details.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="pt-32 pb-10 bg-cream">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Support</p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-zen-900">
              Frequently asked questions.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-500 leading-relaxed">
              Everything you need to know about ZenScan and ZenLife.
            </p>
          </div>
        </div>

        {/* FAQ sections */}
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-3xl px-6 space-y-16">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.category}>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">{section.category}</h2>
                <div className="space-y-3">
                  {section.faqs.map((faq) => (
                    <details key={faq.q} className="group bg-white ring-1 ring-black/5 rounded-2xl px-6 py-5 border-0">
                      <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-[14px] text-zen-900">
                        {faq.q}
                        <span className="ml-4 text-zen-600 group-open:rotate-45 transition-transform text-xl font-light flex-shrink-0">+</span>
                      </summary>
                      <p className="mt-4 text-[13px] leading-relaxed text-gray-500">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still have questions */}
        <section className="bg-white py-16 text-center">
          <div className="mx-auto max-w-xl px-6">
            <h2 className="font-display text-[2rem] text-zen-900">Still have questions?</h2>
            <p className="mt-3 text-gray-500">Our team is available Mon–Sat, 9am–7pm IST.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:8954010099" className="rounded-full bg-zen-900 py-3 px-8 text-[14px] font-bold text-white hover:bg-zen-800 transition-colors">Call 8954010099</a>
              <a href="mailto:support@zenlife.health" className="rounded-full border border-zen-900/20 py-3 px-8 font-semibold text-zen-900 hover:bg-zen-50 transition-colors">
                Email Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
