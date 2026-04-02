"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useOperatorSession } from "@/lib/useOperatorSession";
import { clearOperatorSession } from "@/lib/operatorSession";

interface EmergencyRow {
  id: number;
  created_at: string;
  floor: string;
  description: string;
  status: string;
}

interface BreakdownRow {
  id: number;
  created_at: string;
  floor: string;
  description: string;
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
  const config: Record<string, { cls: string; dot: string }> = {
    Waiting: { cls: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400 animate-pulse" },
    "In Process": { cls: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-400 animate-pulse" },
    Success: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    Failed: { cls: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-500" },
  };
  const c = config[status] ?? { cls: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${color} p-4 shadow-sm`}>
      <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

type ActiveTab = "emergency" | "breakdown";

export default function OperatorPage() {
  const router = useRouter();
  useOperatorSession();
  const [activeTab, setActiveTab] = useState<ActiveTab>("emergency");
  const [emergencyRows, setEmergencyRows] = useState<EmergencyRow[]>([]);
  const [breakdownRows, setBreakdownRows] = useState<BreakdownRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchEmergency = useCallback(async () => {
    const { data, error } = await supabase
      .from("emergency_data")
      .select("id, created_at, floor, description, status")
      .order("created_at", { ascending: false });
    if (!error && data) setEmergencyRows(data as EmergencyRow[]);
  }, []);

  const fetchBreakdown = useCallback(async () => {
    const { data, error } = await supabase
      .from("breakdown_data")
      .select("id, created_at, floor, description, status")
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

  const updateEmergencyStatus = async (id: number, status: string) => {
    setUpdating(id);
    await supabase.from("emergency_data").update({ status }).eq("id", id);
    await fetchEmergency();
    setUpdating(null);
  };

  const updateBreakdownStatus = async (id: number, status: string) => {
    setUpdating(id);
    await supabase.from("breakdown_data").update({ status }).eq("id", id);
    await fetchBreakdown();
    setUpdating(null);
  };

  const handleLogout = () => {
    clearOperatorSession();
    router.push("/operator_login");
  };

  const totalEmergency = emergencyRows.length;
  const totalBreakdown = breakdownRows.length;
  const inProcessEmergency = emergencyRows.filter((r) => r.status === "In Process").length;
  const inProcessBreakdown = breakdownRows.filter((r) => r.status === "In Process").length;
  const successEmergency = emergencyRows.filter((r) => r.status === "Success").length;
  const successBreakdown = breakdownRows.filter((r) => r.status === "Success").length;

  const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap";
  const tdCls = "px-4 py-3 text-sm text-slate-700";

  function ActionButtons({ id, currentStatus, onUpdate }: {
    id: number;
    currentStatus: string;
    onUpdate: (id: number, status: string) => void;
  }) {
    const isUpdating = updating === id;
    const isFinalized = currentStatus === "Success" || currentStatus === "Failed";

    if (isFinalized) {
      return <span className="text-slate-300 text-sm">—</span>;
    }

    if (isUpdating) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-medium border border-slate-200">
          <span className="w-2.5 h-2.5 border border-slate-300 border-t-indigo-400 rounded-full animate-spin-smooth" />
          Updating...
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5">
        <button
          onClick={() => onUpdate(id, "Success")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Success
        </button>
        <button
          onClick={() => onUpdate(id, "Failed")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-150"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Failed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 border-b border-slate-700/50">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Operator Dashboard</h1>
            <p className="text-xs text-slate-400">40 Building &middot; KMUTNB</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all border border-slate-600/50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 animate-fadeInUp">
          <StatCard label="Total Emergency" value={totalEmergency} color="border-red-500" />
          <StatCard label="Total Breakdown" value={totalBreakdown} color="border-emerald-500" />
          <StatCard label="In Process (Emergency)" value={inProcessEmergency} color="border-blue-500" />
          <StatCard label="In Process (Breakdown)" value={inProcessBreakdown} color="border-blue-500" />
          <StatCard label="Success (Emergency)" value={successEmergency} color="border-emerald-400" />
          <StatCard label="Success (Breakdown)" value={successBreakdown} color="border-emerald-400" />
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 mb-0 animate-fadeInUp delay-100">
          <button
            onClick={() => setActiveTab("emergency")}
            className={`px-6 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "emergency"
                ? "bg-white text-indigo-600 border-t border-x border-slate-200 shadow-sm font-semibold"
                : "bg-slate-200/70 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            }`}
          >
            Emergency
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`px-6 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "breakdown"
                ? "bg-white text-indigo-600 border-t border-x border-slate-200 shadow-sm font-semibold"
                : "bg-slate-200/70 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            }`}
          >
            Breakdown
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeInUp delay-200 mb-10">
          <div className="overflow-x-auto overflow-y-auto max-h-[480px] custom-scroll">

            {/* Emergency Table */}
            {activeTab === "emergency" && (
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-slate-800">
                  <tr>
                    <th className={thCls}>No.</th>
                    <th className={thCls}>Timestamp</th>
                    <th className={thCls}>Floor</th>
                    <th className={thCls}>Description</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-7 h-7 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin-smooth" />
                          <span className="text-sm text-slate-400">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && emergencyRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-sm text-slate-400">No records found</td>
                    </tr>
                  )}
                  {!loading && emergencyRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors duration-100">
                      <td className={`${tdCls} text-slate-400 w-10`}>{idx + 1}</td>
                      <td className={`${tdCls} font-mono text-xs text-slate-500 whitespace-nowrap`}>{formatTimestamp(r.created_at)}</td>
                      <td className={`${tdCls} font-medium whitespace-nowrap`}>{r.floor}</td>
                      <td className={`${tdCls} max-w-xs`}>
                        <span className="line-clamp-2">{r.description}</span>
                      </td>
                      <td className={tdCls}><StatusBadge status={r.status} /></td>
                      <td className={tdCls}>
                        <ActionButtons
                          id={r.id}
                          currentStatus={r.status}
                          onUpdate={updateEmergencyStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Breakdown Table */}
            {activeTab === "breakdown" && (
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-slate-800">
                  <tr>
                    <th className={thCls}>No.</th>
                    <th className={thCls}>Timestamp</th>
                    <th className={thCls}>Floor</th>
                    <th className={thCls}>Description</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-7 h-7 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin-smooth" />
                          <span className="text-sm text-slate-400">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && breakdownRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-sm text-slate-400">No records found</td>
                    </tr>
                  )}
                  {!loading && breakdownRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors duration-100">
                      <td className={`${tdCls} text-slate-400 w-10`}>{idx + 1}</td>
                      <td className={`${tdCls} font-mono text-xs text-slate-500 whitespace-nowrap`}>{formatTimestamp(r.created_at)}</td>
                      <td className={`${tdCls} font-medium whitespace-nowrap`}>{r.floor}</td>
                      <td className={`${tdCls} max-w-xs`}>
                        <span className="line-clamp-2">{r.description}</span>
                      </td>
                      <td className={tdCls}><StatusBadge status={r.status} /></td>
                      <td className={tdCls}>
                        <ActionButtons
                          id={r.id}
                          currentStatus={r.status}
                          onUpdate={updateBreakdownStatus}
                        />
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
