"use client";

import { useEffect, useState } from "react";
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

function getStatusStyle(s: string): string {
  if (s === "Waiting") return "bg-orange-400 text-white";
  if (s === "In Process") return "bg-blue-400 text-gray-900";
  if (s === "Success") return "bg-green-500 text-white";
  if (s === "Failed") return "bg-red-500 text-white";
  return "bg-gray-300 text-gray-800";
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

  const thClass = "px-4 py-3 text-center border border-gray-600";
  const tdClass = "px-4 py-3 text-center text-gray-700 border border-gray-200";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {t("home_title")}
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-8 mb-10">
          <button
            onClick={() => setActiveTable("emergency")}
            className="text-white text-xl font-semibold py-4 px-10 rounded-lg transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: "#dc2626",
              outline: activeTable === "emergency" ? "3px solid #7f1d1d" : "none",
              outlineOffset: "2px",
            }}
          >
            {t("btn_emergency")}
          </button>
          <button
            onClick={() => setActiveTable("breakdown")}
            className="text-white text-xl font-semibold py-4 px-10 rounded-lg transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: "#45cf13",
              outline: activeTable === "breakdown" ? "3px solid #166534" : "none",
              outlineOffset: "2px",
            }}
          >
            {t("btn_breakdown")}
          </button>
        </div>

        {/* Table Title */}
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
          {activeTable === "emergency" ? t("btn_emergency") : t("btn_breakdown")} — {t("recent_events")}
        </h3>

        {/* Table */}
        <div className="mb-16 pb-16 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[340px]">

            {/* Emergency Table */}
            {activeTable === "emergency" && (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-800 text-white">
                    <th className={thClass}>{t("th_no")}</th>
                    <th className={thClass}>{t("th_timestamp")}</th>
                    <th className={thClass}>{t("th_floor")}</th>
                    <th className={thClass}>{t("th_description")}</th>
                    <th className={thClass}>{t("th_email")}</th>
                    <th className={thClass}>{t("th_status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  )}
                  {!loading && emergencyRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">{t("no_events")}</td>
                    </tr>
                  )}
                  {!loading && emergencyRows.map((r: EmergencyRow, idx: number) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className={tdClass}>{idx + 1}</td>
                      <td className={tdClass}>{formatTimestamp(r.created_at)}</td>
                      <td className={tdClass}>{r.floor}</td>
                      <td className={tdClass}>{r.description}</td>
                      <td className={tdClass}>{r.email}</td>
                      <td className="px-4 py-3 text-center border border-gray-200">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Breakdown Table */}
            {activeTable === "breakdown" && (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-800 text-white">
                    <th className={thClass}>{t("th_no")}</th>
                    <th className={thClass}>{t("th_timestamp")}</th>
                    <th className={thClass}>{t("th_type")}</th>
                    <th className={thClass}>{t("th_floor")}</th>
                    <th className={thClass}>{t("th_description")}</th>
                    <th className={thClass}>{t("th_email")}</th>
                    <th className={thClass}>{t("th_status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  )}
                  {!loading && breakdownRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">{t("no_events")}</td>
                    </tr>
                  )}
                  {!loading && breakdownRows.map((r: BreakdownRow, idx: number) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className={tdClass}>{idx + 1}</td>
                      <td className={tdClass}>{formatTimestamp(r.created_at)}</td>
                      <td className={tdClass}>{r.breakdown_type}</td>
                      <td className={tdClass}>{r.floor}</td>
                      <td className={tdClass}>{r.description}</td>
                      <td className={tdClass}>{r.email}</td>
                      <td className="px-4 py-3 text-center border border-gray-200">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
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
