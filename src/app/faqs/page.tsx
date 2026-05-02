import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FAQ_SECTIONS = [
  {
    category: "About ZenScan",
    faqs: [
      {
        q: "What is ZenScan?",
        a: "ZenScan is India's most comprehensive preventive health scan. It combines full-body MRI, whole-abdomen ultrasound, DEXA, Calcium Score CT, Chest X-Ray, 12-lead ECG and 150+ blood + urine biomarkers (plus Mammography for women 40+) into a single 3–4 hour appointment, giving you a 15-organ picture of your health.",
      },
      {
        q: "Who is ZenScan for?",
        a: "ZenScan is designed for health-conscious adults aged 25–70 who want to proactively screen for serious conditions — especially those with a family history of cancer, heart disease, diabetes or osteoporosis, or anyone who wants a definitive baseline.",
      },
      {
        q: "How is this different from a regular health checkup?",
        a: "Standard checkups typically include a handful of blood tests and a physical exam. ZenScan uses 8 diagnostic modalities and 400+ parameters to detect conditions years before they cause symptoms — things a routine checkup will never catch. You also get a ZenScore, a ZenAge biological age, and personalised diet/exercise/sleep/supplement priorities.",
      },
      {
        q: "Is ZenScan a diagnostic service?",
        a: "ZenScan is a preventive screening service. Findings that need further diagnosis or treatment are flagged in your report, and you're guided to the right specialist. It is not a substitute for emergency or symptomatic care.",
      },
    ],
  },
  {
    category: "Tests included",
    faqs: [
      {
        q: "What modalities are included?",
        a: "Eight: (1) Full-Body MRI, (2) Whole-Abdomen Ultrasound, (3) DEXA Body Composition, (4) CT Calcium Score, (5) Chest X-Ray, (6) 12-Lead Resting ECG, (7) 150+ Lab Biomarkers (blood + urine), and (8) Mammography for women 40+. Every modality contributes to your 15-organ ZenScore.",
      },
      {
        q: "Do men and women get different tests?",
        a: "Yes — ZenScan automatically adapts to the patient's sex. Women receive: Mammography (40+), Pelvic / Transvaginal Ultrasound, Uterus / Ovaries / Cervix / Endometrium imaging, Pap Smear, HPV DNA Test, plus a hormone panel (FSH, LH, Progesterone, Prolactin, AMH, Estradiol, DHEA-S, HE4, CA 15-3). Men receive: Prostate Ultrasound (size + seminal vesicles), PSA blood test and a male hormone panel (Total + Free Testosterone, SHBG, IGF-1). Sex-irrelevant tests are filtered out so you only see what applies to you.",
      },
      {
        q: "What organ systems are tracked?",
        a: "Fifteen: Heart, Endocrine & Metabolic, Liver & Digestive, Brain & Cognitive, Kidney & Urinary, Inflammation & Immune, General Health (Blood & Nutrients), Reproductive, Bone/Muscle/Joint, Lung & Respiratory, Vascular, Hormonal & Vitality, Mental & Stress Resilience, Men's Health (males only), Women's Health (females only).",
      },
      {
        q: "How many parameters are measured?",
        a: "400+ unique canonical parameters — broadly: 126 blood markers, 25 urinalysis parameters, 20 DEXA composition values, 13 calcium-scoring values (per-vessel), 7 ECG values, 15 chest X-ray, 60+ ultrasound, 100+ MRI, and 18 mammography fields. Sex-specific parameters are filtered per patient.",
      },
    ],
  },
  {
    category: "Booking & Logistics",
    faqs: [
      {
        q: "Where is ZenScan available?",
        a: "Currently available in Noida. We partner with premium diagnostic centres equipped with high-field MRI and advanced CT scanners.",
      },
      {
        q: "How do I book?",
        a: "Book directly on our website — pick a date, pay online, and receive confirmation. Our team contacts you 48 hours before with preparation instructions and to schedule the home blood/urine collection for the day before your scan.",
      },
      {
        q: "What should I do to prepare?",
        a: "Avoid eating 4 hours before MRI components. Wear comfortable, metal-free clothing. Bring any previous reports if available. Your coordinator sends detailed instructions upon booking.",
      },
      {
        q: "Can I cancel or reschedule?",
        a: "Free cancellation or rescheduling up to 48 hours before your appointment. Within 48 hours, a 10% rescheduling fee applies. No-shows forfeit the full amount.",
      },
    ],
  },
  {
    category: "The Report — ZenScore, ZenAge, Priorities",
    faqs: [
      {
        q: "When will I receive my report?",
        a: "Your ZenReport is delivered within 5–7 business days of your scan, via your ZenLife account. You'll receive an email and SMS notification when it's ready.",
      },
      {
        q: "What is ZenScore?",
        a: "ZenScore is your 0–100 health-intelligence index calculated across all 15 organ systems. Critical findings dock 15 points each, major 7, minor 3. It gives you one comparable number to track over time and against your peer group.",
      },
      {
        q: "What is ZenAge?",
        a: "ZenAge is your biological age — derived from the validated PhenoAge formula (9 blood biomarkers) plus a Claude AI synthesis across all your scan data. It returns five sub-ages: metabolic, vascular, bone & muscle, inflammation and kidney. A ZenAge lower than your chronological age means you're ageing slower; higher means faster.",
      },
      {
        q: "What are Health Priorities?",
        a: "Your top 3 things to act on this year, generated by Claude AI from your unique findings. Each priority comes with a tailored diet plan, exercise prescription, sleep recommendation and supplement protocol.",
      },
      {
        q: "What if a parameter wasn't measured by my scan?",
        a: "Your physician explicitly reviews every unfilled parameter before publishing the report — they either fill it in (e.g. by computing a derived value), or mark it as Not Applicable for you, so blanks never get treated as 'normal' on your report.",
      },
    ],
  },
  {
    category: "Zeno AI",
    faqs: [
      {
        q: "What is Zeno?",
        a: "Zeno is your personal AI health assistant, built on Anthropic's Claude. Zeno has read your full ZenReport — every parameter, every organ score, your ZenAge and your Health Priorities — and can answer any question in plain English, 24/7 for 12 months after your scan.",
      },
      {
        q: "Is Zeno a replacement for my doctor?",
        a: "No. Zeno is an educational AI that explains your findings and helps you ask better questions. Always consult a qualified physician for medical decisions. A ZenLife physician consultation is included with every ZenScan.",
      },
      {
        q: "Can I share my report with my own doctor?",
        a: "Yes — generate a secure JWT-signed share link from your report's Download tab. The link is valid for 7 days and lets your specialist or family doctor view your full report without an account.",
      },
    ],
  },
  {
    category: "Safety & Privacy",
    faqs: [
      {
        q: "Is the scan radiation-free?",
        a: "MRI, Ultrasound and DEXA use zero ionising radiation. Calcium Score CT and Chest X-Ray combined ≈ 1.2 mSv — about four months of natural background radiation. Mammography (women only) ≈ 0.4 mSv per screening.",
      },
      {
        q: "Is the MRI safe for me?",
        a: "MRI is safe for most people. Those with certain metal implants (pacemakers, some cochlear implants, certain stents) cannot undergo MRI. Our team screens you for contraindications before your scan.",
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
              Everything you need to know about ZenScan, ZenScore, ZenAge and Zeno AI.
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
