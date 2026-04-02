"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav_home") },
    { href: "/emergency", label: t("nav_emergency") },
    { href: "/breakdown", label: t("nav_breakdown") },
    { href: "/login_admin", label: "Admin" },
    { href: "/operator_login", label: "Operator" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-sm group-hover:bg-red-500/30 transition-all duration-300" />
                <Image
                  src="/KMUTNB_Logo.svg.png"
                  alt="KMUTNB Logo"
                  width={36}
                  height={36}
                  className="h-9 w-auto relative"
                />
              </div>
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-red-600/20 rounded-lg border border-red-500/30" />
                    )}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
              <button
                onClick={scrollToFooter}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
              >
                {t("nav_contact")}
              </button>
            </div>
          </div>

          {/* Language Toggle - Desktop */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-600/60 hover:border-slate-500/50 transition-all duration-200"
            >
              <span className={language === "en" ? "text-white font-semibold" : "text-slate-500"}>EN</span>
              <span className="text-slate-600">|</span>
              <span className={language === "th" ? "text-white font-semibold" : "text-slate-500"}>TH</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:text-white transition-all"
            >
              {language === "en" ? "TH" : "EN"}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-slate-700/50 transition-all"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-0.5 bg-current rounded transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-80 pb-4" : "max-h-0"}`}>
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-700/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-red-600/20 text-white border border-red-500/30"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={scrollToFooter}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all text-left"
            >
              {t("nav_contact")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
