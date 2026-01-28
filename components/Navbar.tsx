"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("nav_home") },
    { href: "/emergency", label: t("nav_emergency") },
    { href: "/breakdown", label: t("nav_breakdown") },
    { href: "/contact", label: t("nav_contact") },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
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
          </div>

          {/* Language Toggle Button */}
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
      </div>
    </nav>
  );
}
