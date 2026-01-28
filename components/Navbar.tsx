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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/KMUTNB_Logo.svg.png"
                alt="KMUTNB Logo"
                width={36}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={scrollToFooter}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {t("nav_contact")}
              </button>
            </div>
          </div>

          {/* Language Toggle Button - Right (Desktop) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
            >
              <span className="mr-2">{language === "en" ? "EN" : "TH"}</span>
              <span className="text-gray-400">|</span>
              <span className="ml-2 text-gray-400">
                {language === "en" ? "TH" : "EN"}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={scrollToFooter}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white text-left"
              >
                {t("nav_contact")}
              </button>
              {/* Language Toggle for Mobile */}
              <button
                onClick={toggleLanguage}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200 w-fit"
              >
                <span className="mr-2">{language === "en" ? "EN" : "TH"}</span>
                <span className="text-gray-400">|</span>
                <span className="ml-2 text-gray-400">
                  {language === "en" ? "TH" : "EN"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
