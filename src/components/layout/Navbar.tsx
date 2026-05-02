"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { clearToken, isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/science", label: "The Science" },
  { href: "/scan", label: "The Scan" },
  { href: "/stories", label: "Stories" },
  { href: "/faqs", label: "FAQs" },
  { href: "/about", label: "About Us" },
  { href: "/corporate", label: "Corporate" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-black/5" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zen-900">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[15px] font-extrabold tracking-tight text-zen-900">ZenLife</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-zen-700",
                pathname === l.href ? "text-zen-800 font-semibold" : "text-gray-600"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-zen-800">
                Logout
              </button>
              <Link href="/dashboard" className="btn-primary py-2 text-xs">
                My Reports
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-zen-800">
                Login
              </Link>
              <Link href="/book" className="btn-primary py-2 text-xs">
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/5 bg-cream px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700">
                {l.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            {loggedIn ? (
              <button onClick={handleLogout} className="text-left text-sm font-medium text-gray-600">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium text-gray-600">
                Login
              </Link>
            )}
            <Link href="/book" className="btn-primary text-center">
              Book ZenScan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
