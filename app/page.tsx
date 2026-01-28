"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface EventData {
  timestamp: string;
  event: string;
  event_type: string;
  email: string;
  status: "Success" | "In Process" | "Failed";
}

// Mock data for demonstration - replace with actual API call
const eventData: EventData[] = [
  {
    timestamp: "2026-01-21 10:30:00",
    event: "Fire alarm triggered",
    event_type: "Emergency",
    email: "admin@company.com",
    status: "Success",
  },
  {
    timestamp: "2026-01-21 09:15:00",
    event: "Equipment malfunction",
    event_type: "Breakdown",
    email: "tech@company.com",
    status: "In Process",
  },
  {
    timestamp: "2026-01-20 16:45:00",
    event: "Power outage",
    event_type: "Emergency",
    email: "facilities@company.com",
    status: "Failed",
  },
];

function StatusBadge({ status, t }: { status: EventData["status"]; t: (key: string) => string }) {
  const badgeStyles = {
    Success: "bg-green-500 text-white",
    "In Process": "bg-blue-400 text-gray-900",
    Failed: "bg-red-500 text-white",
  };

  const statusLabels = {
    Success: t("status_success"),
    "In Process": t("status_in_process"),
    Failed: t("status_failed"),
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {t("home_title")}
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 mb-16 pb-8">
          <Link
            href="/emergency"
            className="bg-red-600 hover:bg-red-700 text-white text-xl font-semibold py-4 px-10 rounded-lg transition-colors duration-200 shadow-lg"
          >
            {t("btn_emergency")}
          </Link>
          <Link
            href="/breakdown"
            className="text-white text-xl font-semibold py-4 px-10 rounded-lg transition-colors duration-200 shadow-lg"
            style={{ backgroundColor: "#45cf13" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3db810")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#45cf13")
            }
          >
            {t("btn_breakdown")}
          </Link>
        </div>

        {/* Data Table */}
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
          {t("recent_events")}
        </h3>
        <div className="overflow-x-auto mb-16 pb-16">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-center">{t("th_no")}</th>
                <th className="px-4 py-3 text-center">{t("th_timestamp")}</th>
                <th className="px-4 py-3 text-center">{t("th_event")}</th>
                <th className="px-4 py-3 text-center">{t("th_type")}</th>
                <th className="px-4 py-3 text-center">{t("th_email")}</th>
                <th className="px-4 py-3 text-center">{t("th_status")}</th>
              </tr>
            </thead>
            <tbody>
              {eventData.length > 0 ? (
                eventData.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {event.timestamp}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {event.event}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="truncate block max-w-xs">
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {event.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={event.status} t={t} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {t("no_events")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
