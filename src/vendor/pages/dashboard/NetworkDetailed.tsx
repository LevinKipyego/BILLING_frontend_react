
// src/pages/dashboard/RouterDetail.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchRouterDetail } from "../../api/networkdetailed";
import type { RouterDetailResponse } from "../../types/networkdetailed";

import CurrentHealthCard from "../../components/networkdetailed/CurrentHealthCard";
import Stats24hCard from "../../components/networkdetailed/Stats24hCard";
import AlertsList from "../../components/networkdetailed/AlertsList";
import HealthChart from "../../components/networkdetailed/HealthChart";
import NetworkHealthGauge from "../../components/networkdetailed/NetworkHealthGauge";
import UplinkSpeedGauge from "../../components/networkdetailed/UplinkSpeedGauge";
import InterfaceCard from "../../components/networkdetailed/InterfaceCard";
import NetworkAlertsPanel from "../../components/networkdetailed/NetworkAlerts";
import ThroughputGraph from "../../components/networkdetailed/ThroughPutGraph";
import UplinkTrafficGraph from "../../components/networkdetailed/UplinkSpeedGraph";
import IdlePortsPanel from "../../components/networkdetailed/IdlePorts";

import {
  CpuChipIcon,
  SignalIcon,
  ShieldCheckIcon,
  CommandLineIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const surface =
  "min-w-0 rounded-xl border border-slate-200/80 bg-white shadow-sm " +
  "dark:border-slate-700/70 dark:bg-slate-800/80";

const sectionTitle =
  "flex items-center gap-2 text-sm font-semibold text-slate-800 " +
  "dark:text-slate-100";

const RouterDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<RouterDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Router ID is missing.");
      setLoading(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await fetchRouterDetail(id);

        if (active) {
          setData(result);
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load router details.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-8 dark:bg-gray-900 sm:px-4">
        <div className="mx-auto flex min-h-[45vh] max-w-7xl flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/50">
            <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Loading router details
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Retrieving network telemetry and interface statistics
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-5 dark:bg-gray-900 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-white p-4 shadow-sm dark:border-rose-900/60 dark:bg-gray-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/50">
              <ExclamationTriangleIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Unable to load router
              </h2>

              <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reload page
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-3 py-5 dark:bg-gray-900 sm:px-4">
        <div className="mx-auto max-w-7xl">
          <div className={`${surface} p-5`}>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Router details are unavailable.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const intelligence = data.interfaces ?? null;

  const interfaceCount =
    (intelligence?.downlinks?.length ?? 0) +
    (intelligence?.uplink ? 1 : 0);

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 text-slate-900 transition-colors dark:bg-gray-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1800px] space-y-5 px-3 py-4 sm:px-4 sm:py-5 lg:space-y-6 lg:px-5">

        {/* ======================================================
            ROUTER HEADER
        ====================================================== */}
        <section
          className={`${surface} flex min-w-0 flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-600/20">
              <CpuChipIcon className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="break-words text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  {data.router.name}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">
                  ID: {id?.slice(0, 8) ?? "N/A"}
                </span>

                <span className="hidden h-3 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <ShieldCheckIcon className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="break-all">{data.router.ip}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 dark:border-slate-700 sm:flex sm:items-center sm:border-0 sm:pt-0">
            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/70 sm:min-w-[130px]">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hardware
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                MikroTik
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RouterOS
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/70 sm:min-w-[130px]">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interfaces
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {interfaceCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reported links
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================
            1. ROUTER OVERVIEW
            Two wide cards, followed by a separate alerts row.
        ====================================================== */}
        <section className="min-w-0 space-y-3" aria-label="Router overview">
          <div className="flex items-center justify-between gap-3">
            <h2 className={sectionTitle}>
              <span className="h-4 w-1 rounded-full bg-blue-600" />
              Router overview
            </h2>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Recent status
            </span>
          </div>

          <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 xl:grid-cols-2">
            <div className="min-w-0">
              <CurrentHealthCard health={data.current_health} />
            </div>

            <div className="min-w-0">
              <Stats24hCard stats={data.stats_24h} />
            </div>
          </div>

          <div className="min-w-0">
            <AlertsList alerts={data.recent_alerts} />
          </div>
        </section>

        {/* ======================================================
            2. NETWORK INTELLIGENCE
        ====================================================== */}
        {intelligence && (
          <section className="min-w-0 space-y-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/40">
                <SignalIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  Network intelligence
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Uplink performance, health indicators and network alerts
                </p>
              </div>
            </div>

            {/* Network gauges: two full-width columns on desktop */}
            <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
              <div className="min-w-0">
                <NetworkHealthGauge
                  score={intelligence.network_health_score}
                />
              </div>

              <div className="min-w-0">
                <UplinkSpeedGauge uplink={intelligence.uplink} />
              </div>
            </div>

            {/* Network alerts: independent row */}
            <div className="min-w-0">
              <NetworkAlertsPanel
                alerts={intelligence.network_alerts}
              />
            </div>

            {/* Idle ports: full-width when present */}
            <div className="min-w-0">
              <IdlePortsPanel
                ports={intelligence.suspicious_idle_ports}
              />
            </div>

            {/* ==================================================
                3. ROUTER INTERFACES
                Keep detailed interface cards wide enough to read.
            ================================================== */}
            <section className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                    <CommandLineIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      Router interfaces
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Uplink and downstream connections
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {interfaceCount}{" "}
                  {interfaceCount === 1 ? "link" : "links"}
                </span>
              </div>

              {interfaceCount > 0 ? (
                <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                  {intelligence.uplink && (
                    <div className="min-w-0">
                      <InterfaceCard iface={intelligence.uplink} />
                    </div>
                  )}

                  {intelligence.downlinks.map((iface) => (
                    <div className="min-w-0" key={iface.name}>
                      <InterfaceCard iface={iface} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${surface} p-4`}>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No interface data is available for this router.
                  </p>
                </div>
              )}
            </section>

            {/* ==================================================
                4. TRAFFIC ANALYTICS
                Stack graphs to give their axes and tooltips room.
            ================================================== */}
            <section className="min-w-0 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  Traffic analytics
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Uplink distribution and aggregate throughput
                </p>
              </div>

              <div className="min-w-0 space-y-3">
                <div className={`${surface} min-w-0 overflow-hidden p-3 sm:p-4`}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Uplink traffic distribution
                    </h4>

                    <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      TX / RX
                    </span>
                  </div>

                  <div className="min-w-0">
                    <UplinkTrafficGraph
                      data={intelligence.uplink_history}
                    />
                  </div>
                </div>

                <div className={`${surface} min-w-0 overflow-hidden p-3 sm:p-4`}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Aggregate throughput
                    </h4>

                    <span className="shrink-0 rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                      Throughput
                    </span>
                  </div>

                  <div className="min-w-0">
                    <ThroughputGraph
                      data={intelligence.uplink_history}
                    />
                  </div>
                </div>
              </div>
            </section>
          </section>
        )}

        {/* ======================================================
            5. HISTORICAL HEALTH
        ====================================================== */}
        <section className={`${surface} min-w-0 overflow-hidden`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-3 dark:border-slate-700 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                <SignalIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  Historical health index
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Router health over time
                </p>
              </div>
            </div>

            <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              History
            </span>
          </div>

          <div className="min-w-0 p-3 sm:p-4">
            <HealthChart history={data.health_history} />
          </div>
        </section>

        <footer className="pb-2 text-center text-xs text-slate-400 dark:text-slate-500">
          Router monitoring · Network telemetry
        </footer>
      </div>
    </main>
  );
};

export default RouterDetail;
