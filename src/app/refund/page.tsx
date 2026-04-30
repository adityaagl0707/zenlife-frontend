import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Legal</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-zen-900">Cancellation &amp; Refund</h1>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Last updated: January 2025</p>

          <div className="mt-10 space-y-6 text-gray-600 text-[13px] leading-relaxed">

            <section className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
              <div className="px-6 py-5 border-b border-black/5">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zen-900">Cancellation Policy</h2>
              </div>
              {[
                { timing: "More than 48 hours before appointment", charge: "Full refund" },
                { timing: "24–48 hours before appointment", charge: "10% rescheduling fee; refund of 90%" },
                { timing: "Less than 24 hours before appointment", charge: "50% refund" },
                { timing: "No-show", charge: "No refund" },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-2 gap-4 px-6 py-4 text-[13px] ${i % 2 === 0 ? "bg-white" : "bg-cream"}`}>
                  <span className="font-medium text-zen-900">{row.timing}</span>
                  <span className="text-gray-500">{row.charge}</span>
                </div>
              ))}
            </section>

            {[
              {
                title: "Rescheduling",
                body: "You may reschedule your appointment free of charge up to 48 hours before the scheduled time. Rescheduling within 48 hours incurs a 10% fee. Each booking allows up to two rescheduling requests.",
              },
              {
                title: "Medical Cancellations",
                body: "If your scan cannot be completed due to a medical contraindication identified on the day (e.g., implant identified during pre-scan screening), you will receive a full refund or reschedule at no cost.",
              },
              {
                title: "Refund Processing",
                body: "Approved refunds are processed within 7–10 business days to your original payment method. For Razorpay UPI and net banking, refunds may appear within 3–5 business days.",
              },
              {
                title: "How to Cancel",
                body: "To cancel your appointment, contact us at support@zenlife.health or call 8954010099 (Mon–Sat, 9am–7pm IST). Please have your booking ID ready.",
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
