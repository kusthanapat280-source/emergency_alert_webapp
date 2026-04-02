"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";

interface EmergencyRow {
  id: number;
  created_at: string;
  floor: string;
  description: string;
  email: string;
  status: string;
}

interface BreakdownRow {
  id: number;
  created_at: string;
  breakdown_type: string;
  floor: string;
  description: string;
  email: string;
  status: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { cls: string; dot: string }> = {
    Waiting: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      dot: "bg-amber-400 animate-pulse",
    },
    "In Process": {
      cls: "bg-blue-50 text-blue-700 border border-blue-200",
      dot: "bg-blue-400 animate-pulse",
    },
    Success: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
    },
    Failed: {
      cls: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
    },
  };
  const c = config[status] ?? { cls: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

function LoadingSpinner({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-slate-200 border-t-slate-500 rounded-full animate-spin-smooth" style={{ borderWidth: 3 }} />
          <span className="text-sm text-slate-400">Loading...</span>
        </div>
      </td>
    </tr>
  );
}

type ActiveTable = "emergency" | "breakdown";

export default function Home() {
  const { t } = useLanguage();
  const [activeTable, setActiveTable] = useState<ActiveTable>("emergency");
  const [emergencyRows, setEmergencyRows] = useState<EmergencyRow[]>([]);
  const [breakdownRows, setBreakdownRows] = useState<BreakdownRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (activeTable === "emergency") {
      supabase
        .from("emergency_data")
        .select("id, created_at, floor, description, email, status")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setEmergencyRows(data as EmergencyRow[]);
          setLoading(false);
        });
    } else {
      supabase
        .from("breakdown_data")
        .select("id, created_at, breakdown_type, floor, description, email, status")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setBreakdownRows(data as BreakdownRow[]);
          setLoading(false);
        });
    }
  }, [activeTable]);

  const thCls = "px-3 sm:px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap";
  const tdCls = "px-3 sm:px-4 py-3.5 text-sm text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Left mascot — emergency cat */}
        <div className="absolute left-0 bottom-0 hidden md:block select-none pointer-events-none">
          <Image
            src="/emergency_cat.png"
            alt="Emergency"
            width={160}
            height={180}
            className="object-contain object-bottom opacity-90"
          />
        </div>
        {/* Right mascot — breakdown dog */}
        <div className="absolute right-0 bottom-0 hidden md:block select-none pointer-events-none">
          <Image
            src="/breakdown_dog.png"
            alt="Breakdown"
            width={160}
            height={180}
            className="object-contain object-bottom opacity-90"
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 py-12 px-4 md:py-16 md:px-48 lg:px-56">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-medium tracking-wide uppercase">Live Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 animate-fadeInUp">
              {t("home_title")}
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto animate-fadeInUp delay-100">
              40 Building · KMUTNB
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Tab Selector */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 animate-fadeInUp delay-200">
          <button
            onClick={() => setActiveTable("emergency")}
            className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
              activeTable === "emergency"
                ? "bg-red-600 text-white shadow-red-500/30 scale-105"
                : "bg-white text-slate-500 hover:text-red-600 hover:shadow-md border border-slate-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeTable === "emergency" ? "bg-red-200" : "bg-red-400"}`} />
            <span className="hidden xs:inline">{t("btn_emergency")}</span>
            <span className="xs:hidden">Emergency</span>
          </button>
          <button
            onClick={() => setActiveTable("breakdown")}
            className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
              activeTable === "breakdown"
                ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-105"
                : "bg-white text-slate-500 hover:text-emerald-600 hover:shadow-md border border-slate-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeTable === "breakdown" ? "bg-emerald-200" : "bg-emerald-500"}`} />
            <span className="hidden xs:inline">{t("btn_breakdown")}</span>
            <span className="xs:hidden">Breakdown</span>
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeInUp delay-300 mb-16">
          {/* Card Header */}
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between ${
            activeTable === "emergency"
              ? "bg-gradient-to-r from-red-50 to-orange-50"
              : "bg-gradient-to-r from-emerald-50 to-teal-50"
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${activeTable === "emergency" ? "bg-red-500" : "bg-emerald-500"}`} />
              <h3 className="font-semibold text-slate-700 text-sm sm:text-base">
                {activeTable === "emergency" ? t("btn_emergency") : t("btn_breakdown")} — {t("recent_events")}
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {loading ? "" : `${activeTable === "emergency" ? emergencyRows.length : breakdownRows.length} records`}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[380px] custom-scroll">
            {activeTable === "emergency" && (
              <table className="w-full min-w-[560px]">
                <thead className="sticky top-0 z-10 bg-slate-800">
                  <tr>
                    <th className={thCls}>{t("th_no")}</th>
                    <th className={thCls}>{t("th_timestamp")}</th>
                    <th className={thCls}>{t("th_floor")}</th>
                    <th className={thCls}>{t("th_description")}</th>
                    <th className={thCls}>{t("th_email")}</th>
                    <th className={thCls}>{t("th_status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && <LoadingSpinner cols={6} />}
                  {!loading && emergencyRows.length === 0 && (
                    <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400">{t("no_events")}</td></tr>
                  )}
                  {!loading && emergencyRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className={`${tdCls} text-slate-400 font-medium w-10`}>{idx + 1}</td>
                      <td className={`${tdCls} text-slate-500 font-mono text-xs whitespace-nowrap`}>{formatTimestamp(r.created_at)}</td>
                      <td className={`${tdCls} font-medium`}>{r.floor}</td>
                      <td className={`${tdCls} max-w-[200px]`}><span className="line-clamp-2">{r.description}</span></td>
                      <td className={`${tdCls} text-slate-500 text-xs`}>{r.email}</td>
                      <td className={tdCls}><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === "breakdown" && (
              <table className="w-full min-w-[640px]">
                <thead className="sticky top-0 z-10 bg-slate-800">
                  <tr>
                    <th className={thCls}>{t("th_no")}</th>
                    <th className={thCls}>{t("th_timestamp")}</th>
                    <th className={thCls}>{t("th_type")}</th>
                    <th className={thCls}>{t("th_floor")}</th>
                    <th className={thCls}>{t("th_description")}</th>
                    <th className={thCls}>{t("th_email")}</th>
                    <th className={thCls}>{t("th_status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && <LoadingSpinner cols={7} />}
                  {!loading && breakdownRows.length === 0 && (
                    <tr><td colSpan={7} className="py-16 text-center text-sm text-slate-400">{t("no_events")}</td></tr>
                  )}
                  {!loading && breakdownRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className={`${tdCls} text-slate-400 font-medium w-10`}>{idx + 1}</td>
                      <td className={`${tdCls} text-slate-500 font-mono text-xs whitespace-nowrap`}>{formatTimestamp(r.created_at)}</td>
                      <td className={tdCls}>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">{r.breakdown_type}</span>
                      </td>
                      <td className={`${tdCls} font-medium`}>{r.floor}</td>
                      <td className={`${tdCls} max-w-[160px]`}><span className="line-clamp-2">{r.description}</span></td>
                      <td className={`${tdCls} text-slate-500 text-xs`}>{r.email}</td>
                      <td className={tdCls}><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
