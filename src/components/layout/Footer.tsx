import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900">
                <Leaf className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-500">
              India's most advanced preventive health intelligence platform. Know your body. Live longer.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Product</p>
            <ul className="mt-4 space-y-3">
              {[["The Science", "/science"], ["The Scan", "/scan"], ["Pricing", "/book"], ["FAQs", "/faqs"]].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-[13px] text-gray-500 hover:text-zen-900 transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Company</p>
            <ul className="mt-4 space-y-3">
              {[["About Us", "/about"], ["Stories", "/stories"], ["Corporate", "/corporate"], ["Careers", "#"]].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-[13px] text-gray-500 hover:text-zen-900 transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Contact</p>
            <ul className="mt-4 space-y-3">
              <li className="text-[13px] font-bold text-zen-900">8954010099</li>
              <li><a href="mailto:support@zenlife.health" className="text-[13px] text-gray-500 hover:text-zen-900 transition-colors">support@zenlife.health</a></li>
              <li className="text-[13px] text-gray-500">Mon–Sat, 9am–7pm IST</li>
            </ul>
            <div className="mt-5 space-y-2">
              {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Cancellation & Refund", "/refund"]].map(([l, h]) => (
                <div key={h}>
                  <Link href={h} className="text-[12px] text-gray-400 hover:text-zen-900 transition-colors">{l}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-black/5 pt-8 text-center text-[11px] text-gray-400">
          ZenLife © {new Date().getFullYear()} All rights reserved. ZenScan and ZenScore are trademarks of ZenLife Health Pvt. Ltd.
        </div>
      </div>
    </footer>
  );
}
