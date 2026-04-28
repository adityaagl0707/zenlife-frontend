import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Cancellation & Refund Policy</h1>
          <p className="mt-2 text-sm text-gray-400">Last updated: January 2025</p>

          <div className="mt-10 space-y-8 text-gray-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900">Cancellation Policy</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
                {[
                  { timing: "More than 48 hours before appointment", charge: "Full refund" },
                  { timing: "24–48 hours before appointment", charge: "10% rescheduling fee; refund of 90%" },
                  { timing: "Less than 24 hours before appointment", charge: "50% refund" },
                  { timing: "No-show", charge: "No refund" },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-2 gap-4 px-5 py-4 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="font-medium text-gray-700">{row.timing}</span>
                    <span className="text-gray-600">{row.charge}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900">Rescheduling</h2>
              <p className="mt-3">You may reschedule your appointment free of charge up to 48 hours before the scheduled time. Rescheduling within 48 hours incurs a 10% fee. Each booking allows up to two rescheduling requests.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900">Medical Cancellations</h2>
              <p className="mt-3">If your scan cannot be completed due to a medical contraindication identified on the day (e.g., implant identified during pre-scan screening), you will receive a full refund or reschedule at no cost.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900">Refund Processing</h2>
              <p className="mt-3">Approved refunds are processed within 7–10 business days to your original payment method. For Razorpay UPI and net banking, refunds may appear within 3–5 business days.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900">How to Cancel</h2>
              <p className="mt-3">To cancel your appointment, contact us at support@zenlife.health or call 8954010099 (Mon–Sat, 9am–7pm IST). Please have your booking ID ready.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
