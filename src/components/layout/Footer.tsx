import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zen-800">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-zen-900">ZenLife</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              India's most advanced preventive health intelligence platform. Know your body. Live longer.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[["The Science", "/science"], ["The Scan", "/scan"], ["Pricing", "/book"], ["FAQs", "/faqs"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-gray-600 hover:text-zen-800">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[["About Us", "/about"], ["Stories", "/stories"], ["Corporate", "/corporate"], ["Careers", "#"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-gray-600 hover:text-zen-800">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="font-semibold text-zen-800">8954010099</li>
              <li><a href="mailto:support@zenlife.health" className="text-gray-600 hover:text-zen-800">support@zenlife.health</a></li>
              <li className="text-gray-600">Mon–Sat, 9am–7pm IST</li>
            </ul>
            <div className="mt-6 space-y-2 text-sm">
              {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Cancellation & Refund", "/refund"]].map(([l, h]) => (
                <div key={h}><Link href={h} className="text-gray-500 hover:text-zen-800">{l}</Link></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          ZenLife © {new Date().getFullYear()} All rights reserved. | ZenScan and ZenScore are trademarks of ZenLife Health Pvt. Ltd.
        </div>
      </div>
    </footer>
  );
}
