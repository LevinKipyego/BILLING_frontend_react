import { useEffect, useState } from "react";
import {
  TicketIcon,
  CpuChipIcon,
  UsersIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { BaseUrl } from "../../../../BaseUrl";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatCard } from "./components/StatCard";
import { TrafficThroughputChart } from "./components/TrafficThroughputChart";
import { PlanMarketShareChart } from "./components/PlanMarketShareChart";
import { InfrastructureVitals } from "./components/InfrastructureVitals";

interface TelemetryData {
  stats: {
    active_plans: { value: number; trend: string };
    mikrotik_nodes: { value: number; status: string };
    active_users: { value: number; trend: string };
    daily_revenue: { value: number; currency: string };
  };
  traffic_throughput: Array<{ name: string; usage: number; peak_bytes?: number }>;
  plan_market_share: Array<{ name: string; value: number }>;
  infrastructure_vitals: {
    cpu_overhead: { value: number; status: string; progress: number };
    ram_capacity: { value: string; status: string; progress: number };
    system_uptime: { value: string; status: string; progress: number };
  };
}

const COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626"];

export default function DashboardHome() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${BaseUrl}/api/dashboard/telemetry/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load telemetry data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-4 sm:px-4 md:px-6 space-y-6 animate-fadeIn dark:bg-gray-900 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Header */}
      <DashboardHeader loading={loading} onRefresh={fetchTelemetry} />

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-3.5 rounded-md border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTelemetry}
            className="underline font-semibold hover:text-rose-900 dark:hover:text-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Active Plans"
          value={data?.stats?.active_plans?.value}
          icon={TicketIcon}
          trend={data?.stats?.active_plans?.trend || "0"}
          loading={loading}
        />
        <StatCard
          title="MikroTik Nodes"
          value={data?.stats?.mikrotik_nodes?.value}
          icon={CpuChipIcon}
          trend={data?.stats?.mikrotik_nodes?.status || "OFFLINE"}
          loading={loading}
        />
        <StatCard
          title="Active Users"
          value={data?.stats?.active_users?.value?.toLocaleString()}
          icon={UsersIcon}
          trend={data?.stats?.active_users?.trend || "0%"}
          loading={loading}
        />
        <StatCard
          title="Daily Revenue"
          value={
            data?.stats?.daily_revenue?.value
              ? `${data.stats.daily_revenue.value.toLocaleString()} ${data.stats.daily_revenue.currency}`
              : undefined
          }
          icon={BanknotesIcon}
          trend={data?.stats?.daily_revenue?.currency || "KES"}
          loading={loading}
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TrafficThroughputChart
          data={data?.traffic_throughput || []}
          loading={loading}
        />
        <PlanMarketShareChart
          data={data?.plan_market_share || []}
          loading={loading}
          colors={COLORS}
        />
      </div>

      {/* 4. Hardware Health Grid */}
      <InfrastructureVitals
        vitals={data?.infrastructure_vitals}
        loading={loading}
      />
    </div>
  );
}