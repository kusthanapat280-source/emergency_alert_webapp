"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t("contact_title")}
        </h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-center">
            Contact information coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
