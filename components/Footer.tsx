"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-t border-slate-700/50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-red-500/60 rounded" />
            <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">{t("footer_contact")}</p>
            <div className="w-8 h-0.5 bg-red-500/60 rounded" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm">
                <span className="font-medium text-white">Baitan</span>{" "}
                <a href="tel:0812583826" className="text-slate-400 hover:text-white transition-colors">081-258-3826</a>
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-600" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm">
                <span className="font-medium text-white">On</span>{" "}
                <a href="tel:0878526457" className="text-slate-400 hover:text-white transition-colors">087-852-6457</a>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4">40 Building · KMUTNB</p>
        </div>
      </div>
    </footer>
  );
}
