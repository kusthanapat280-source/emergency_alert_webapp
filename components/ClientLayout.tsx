"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
