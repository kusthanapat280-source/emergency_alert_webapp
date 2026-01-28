"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "./Navbar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <main>{children}</main>
    </LanguageProvider>
  );
}
