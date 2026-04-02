"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAdminSession } from "@/lib/useAdminSession";
import { clearAdminSession } from "@/lib/adminSession";

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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Waiting: "bg-orange-400 text-white",
    "In Process": "bg-blue-400 text-gray-900",
    Success: "bg-green-500 text-white",
    Failed: "bg-red-500 text-white",
  };
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-300 text-gray-800"}`}>
      {status}
    </span>
  );
}

type ActiveTab = "emergency" | "breakdown";

export default function AdminPage() {
  const router = useRouter();
  useAdminSession();
  const [activeTab, setActiveTab] = useState<ActiveTab>("emergency");
  const [emergencyRows, setEmergencyRows] = useState<EmergencyRow[]>([]);
  const [breakdownRows, setBreakdownRows] = useState<BreakdownRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchEmergency = useCallback(async () => {
    const { data, error } = await supabase
      .from("emergency_data")
      .select("id, created_at, floor, description, email, status")
      .order("created_at", { ascending: false });
    if (!error && data) setEmergencyRows(data as EmergencyRow[]);
  }, []);

  const fetchBreakdown = useCallback(async () => {
    const { data, error } = await supabase
      .from("breakdown_data")
      .select("id, created_at, breakdown_type, floor, description, email, status")
      .order("created_at", { ascending: false });
    if (!error && data) setBreakdownRows(data as BreakdownRow[]);
  }, []);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([fetchEmergency(), fetchBreakdown()]);
      setLoading(false);
    }
    loadAll();
  }, [fetchEmergency, fetchBreakdown]);

  const acceptEmergency = async (id: number) => {
    setUpdating(id);
    await supabase
      .from("emergency_data")
      .update({ status: "In Process" })
      .eq("id", id);
    await fetchEmergency();
    setUpdating(null);
  };

  const acceptBreakdown = async (id: number) => {
    setUpdating(id);
    await supabase
      .from("breakdown_data")
      .update({ status: "In Process" })
      .eq("id", id);
    await fetchBreakdown();
    setUpdating(null);
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push("/login_admin");
  };

  // Stats
  const totalEmergency = emergencyRows.length;
  const totalBreakdown = breakdownRows.length;
  const waitingEmergency = emergencyRows.filter((r) => r.status === "Waiting").length;
  const waitingBreakdown = breakdownRows.filter((r) => r.status === "Waiting").length;
  const inProcessEmergency = emergencyRows.filter((r) => r.status === "In Process").length;
  const inProcessBreakdown = breakdownRows.filter((r) => r.status === "In Process").length;

  const thClass = "px-3 py-3 text-center border border-gray-600 text-sm";
  const tdClass = "px-3 py-3 text-center text-gray-700 border border-gray-200 text-sm";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/add_admin")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              Add Admin
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total Emergency</p>
            <p className="text-3xl font-bold text-red-600">{totalEmergency}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total Breakdown</p>
            <p className="text-3xl font-bold text-green-600">{totalBreakdown}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Waiting (Emergency)</p>
            <p className="text-3xl font-bold text-orange-500">{waitingEmergency}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Waiting (Breakdown)</p>
            <p className="text-3xl font-bold text-orange-500">{waitingBreakdown}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 text-sm">In Process (Emergency)</p>
            <p className="text-3xl font-bold text-blue-500">{inProcessEmergency}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500 text-sm">In Process (Breakdown)</p>
            <p className="text-3xl font-bold text-blue-500">{inProcessBreakdown}</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-6 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === "emergency"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Emergency
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`px-6 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === "breakdown"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Breakdown
          </button>
        </div>

        {/* Tables */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[420px]">

            {/* Emergency Table */}
            {activeTab === "emergency" && (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-800 text-white">
                    <th className={thClass}>No.</th>
                    <th className={thClass}>Timestamp</th>
                    <th className={thClass}>Floor</th>
                    <th className={thClass}>Description</th>
                    <th className={thClass}>Email</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  )}
                  {!loading && emergencyRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No records found</td>
                    </tr>
                  )}
                  {!loading && emergencyRows.map((r: EmergencyRow, idx: number) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className={tdClass}>{idx + 1}</td>
                      <td className={tdClass}>{formatTimestamp(r.created_at)}</td>
                      <td className={tdClass}>{r.floor}</td>
                      <td className={tdClass}>{r.description}</td>
                      <td className={tdClass}>{r.email}</td>
                      <td className="px-3 py-3 text-center border border-gray-200">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-3 py-3 text-center border border-gray-200">
                        {r.status === "Waiting" ? (
                          <button
                            onClick={() => acceptEmergency(r.id)}
                            disabled={updating === r.id}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded transition-colors disabled:opacity-50"
                          >
                            {updating === r.id ? "..." : "รับเรื่อง"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Breakdown Table */}
            {activeTab === "breakdown" && (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-800 text-white">
                    <th className={thClass}>No.</th>
                    <th className={thClass}>Timestamp</th>
                    <th className={thClass}>Type</th>
                    <th className={thClass}>Floor</th>
                    <th className={thClass}>Description</th>
                    <th className={thClass}>Email</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  )}
                  {!loading && breakdownRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No records found</td>
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
                      <td className="px-3 py-3 text-center border border-gray-200">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-3 py-3 text-center border border-gray-200">
                        {r.status === "Waiting" ? (
                          <button
                            onClick={() => acceptBreakdown(r.id)}
                            disabled={updating === r.id}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded transition-colors disabled:opacity-50"
                          >
                            {updating === r.id ? "..." : "รับเรื่อง"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
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
