
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
import {
  TrafficThroughputChart,
  type TrafficItem,
} from "./components/TrafficThroughputChart";
import { PlanMarketShareChart } from "./components/PlanMarketShareChart";
import { InfrastructureVitals } from "./components/InfrastructureVitals";

export interface TelemetryData {
  stats: {
    active_plans: {
      value: number;
      trend: string;
    };

    mikrotik_nodes: {
      value: number;
      status: string;
    };

    active_users: {
      value: number;
      trend: string;
    };

    daily_revenue: {
      value: number;
      currency: string;
    };
  };

  traffic_throughput: TrafficItem[];

  plan_market_share: Array<{
    name: string;
    value: number;
  }>;

  infrastructure_vitals: {
    cpu_overhead: {
      value: number;
      status: string;
      progress: number;
    };

    ram_capacity: {
      value: string;
      status: string;
      progress: number;
    };

    system_uptime: {
      value: string;
      status: string;
      progress: number;
    };
  };
}

/*
 * Dashboard chart palette.
 *
 * Keep these colors aligned with the dashboard's
 * semantic visual language:
 *
 * Blue    → primary / plans
 * Violet  → secondary
 * Emerald → healthy / active
 * Amber   → warning / activity
 * Red     → critical
 */
const COLORS = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#D97706",
  "#DC2626",
];

export default function DashboardHome() {
  const [data, setData] =
    useState<TelemetryData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  // ---------------------------------------------
  // Fetch dashboard telemetry
  // ---------------------------------------------
  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("access_token");

      const response = await fetch(
        `${BaseUrl}/api/dashboard/telemetry/`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server responded with status: ${response.status}`
        );
      }

      const result: TelemetryData =
        await response.json();

      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load telemetry data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Initial telemetry load
  // ---------------------------------------------
  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div
      className="
        w-full
        max-w-7xl
        mx-auto
        space-y-5
        text-slate-900
        dark:text-slate-100
        transition-colors
      "
    >
      {/* ========================================= */}
      {/* 1. Dashboard Header                       */}
      {/* ========================================= */}

      <DashboardHeader
        loading={loading}
        onRefresh={fetchTelemetry}
      />

      {/* ========================================= */}
      {/* 2. Error Banner                           */}
      {/* ========================================= */}

      {error && (
        <div
          className="
            flex
            flex-col sm:flex-row
            items-start sm:items-center
            justify-between
            gap-3
            p-3 sm:p-3.5
            rounded-lg
            border
            border-red-200
            dark:border-red-900/50
            bg-red-50
            dark:bg-red-950/20
            text-red-700
            dark:text-red-400
            text-xs
          "
        >
          <div className="flex items-center gap-2 min-w-0">
            <ExclamationCircleIcon
              className="
                h-4 w-4
                shrink-0
                text-red-500
                dark:text-red-400
              "
            />

            <span className="truncate">
              {error}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchTelemetry}
            className="
              shrink-0
              px-2.5 py-1
              rounded
              border
              border-red-200
              dark:border-red-900/50
              bg-white/60
              dark:bg-red-950/20
              text-[10px]
              font-medium
              text-red-600
              dark:text-red-400
              hover:bg-red-100
              dark:hover:bg-red-900/30
              transition-colors
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================= */}
      {/* 3. Top Statistics                         */}
      {/* ========================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-3
        "
      >
        {/* Active Plans */}
        <StatCard
          title="Active Plans"
          value={
            data?.stats?.active_plans?.value
          }
          icon={TicketIcon}
          trend={
            data?.stats?.active_plans?.trend ||
            "0"
          }
          loading={loading}
        />

        {/* MikroTik Nodes */}
        <StatCard
          title="MikroTik Nodes"
          value={
            data?.stats?.mikrotik_nodes?.value
          }
          icon={CpuChipIcon}
          trend={
            data?.stats?.mikrotik_nodes?.status ||
            "OFFLINE"
          }
          loading={loading}
        />

        {/* Active Users */}
        <StatCard
          title="Active Users"
          value={
            data?.stats?.active_users?.value?.toLocaleString()
          }
          icon={UsersIcon}
          trend={
            data?.stats?.active_users?.trend ||
            "0%"
          }
          loading={loading}
        />

        {/* Daily Revenue */}
        <StatCard
          title="Daily Revenue"
          value={
            data?.stats?.daily_revenue
              ? `${data.stats.daily_revenue.value.toLocaleString()} ${data.stats.daily_revenue.currency}`
              : undefined
          }
          icon={BanknotesIcon}
          trend={
            data?.stats?.daily_revenue?.currency ||
            "KES"
          }
          loading={loading}
        />
      </div>

      {/* ========================================= */}
      {/* 4. Analytics / Traffic Section            */}
      {/* ========================================= */}
      {/*
       * 12-column layout:
       *
       * Traffic Throughput → 9 columns = 75%
       * Market Share       → 3 columns = 25%
       *
       * On mobile/tablet they stack vertically.
       */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-3
        "
      >
        {/* --------------------------------------- */}
        {/* Traffic Throughput — 75%                */}
        {/* --------------------------------------- */}

        <div className="lg:col-span-8 min-w-0">
          <TrafficThroughputChart
            data={
              data?.traffic_throughput || []
            }
            loading={loading}
          />
        </div>

        {/* --------------------------------------- */}
        {/* Plan Market Share — 25%                 */}
        {/* --------------------------------------- */}

        <div className="lg:col-span-4 min-w-0">
          <PlanMarketShareChart
            data={
              data?.plan_market_share || []
            }
            loading={loading}
            colors={COLORS}
          />
        </div>
      </div>

      {/* ========================================= */}
      {/* 5. Infrastructure Health                 */}
      {/* ========================================= */}

      <InfrastructureVitals
        vitals={
          data?.infrastructure_vitals
        }
        loading={loading}
      />
    </div>
  );
}
