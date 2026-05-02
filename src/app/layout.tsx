import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Stitch "Vibrant Health Tech" type pairing — used by the patient report.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ZenLife — India's Most Advanced Full-Body Health Intelligence",
  description:
    "Detect 200+ conditions early with ZenLife's ZenScan — full-body MRI, DEXA, Calcium Score, ECG, and blood tests with AI insights from Zeno.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.className} ${newsreader.variable} ${inter.variable}`}>
      <body className="min-h-full bg-cream">{children}</body>
    </html>
  );
}
