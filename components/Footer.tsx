"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg font-semibold mb-2">{t("footer_contact")}</p>
        <p className="text-gray-300">
          {t("footer_name")} <a href="tel:0812583826" className="hover:text-white">0812583826</a>
        </p>
      </div>
    </footer>
  );
}
