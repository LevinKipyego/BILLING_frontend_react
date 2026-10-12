
import React from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  AlertCircle,
  HardDrive,
  Clock,
} from "lucide-react";

interface InterfaceProps {
  iface: {
    name: string;
    rx_rate: number;
    tx_rate: number;
    capacity_mbps: number;
    isUplink: boolean;
    risk_level: "low" | "medium" | "high" | "critical";
    predicted_30min: number;
    alerts: string[];
    status?: "up" | "down";
  };
}

const InterfaceNodeCard: React.FC<InterfaceProps> = ({ iface }) => {
  const rxRate = Number(iface.rx_rate) || 0;
  const txRate = Number(iface.tx_rate) || 0;
  const capacity = Number(iface.capacity_mbps) || 0;
  const forecast = Number(iface.predicted_30min) || 0;

  const totalUsage = Math.max(0, rxRate + txRate);
  const usagePercent =
    capacity > 0
      ? Math.min(100, Math.max(0, (totalUsage / capacity) * 100))
      : 0;

  const riskConfig = {
    low: {
      label: "Low",
      color: "text-emerald-600 dark:text-emerald-400",
      indicator: "bg-emerald-500",
    },
    medium: {
      label: "Medium",
      color: "text-amber-600 dark:text-amber-400",
      indicator: "bg-amber-500",
    },
    high: {
      label: "High",
      color: "text-orange-600 dark:text-orange-400",
      indicator: "bg-orange-500",
    },
    critical: {
      label: "Critical",
      color: "text-rose-600 dark:text-rose-400",
      indicator: "bg-rose-500",
    },
  } as const;

  const risk = riskConfig[iface.risk_level] ?? riskConfig.low;
  const isUp = iface.status === "up";
  const hasAlerts = iface.alerts.length > 0;

  const formatRate = (value: number) => value.toFixed(2);

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      {/* Header */}
      <header className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 ${
              isUp
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <HardDrive size={16} />
          </div>

          <div className="min-w-0">
            <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <span className="truncate">{iface.name}</span>
              {iface.isUplink && (
                <span className="shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  UPLINK
                </span>
              )}
            </h3>

            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isUp ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {isUp ? "Connected" : "Disconnected"}
              <span className="text-slate-300 dark:text-slate-600">·</span>
              {capacity > 0 ? `${capacity} Mb/s capacity` : "Capacity unavailable"}
            </p>
          </div>
        </div>

        <div
          className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold ${risk.color}`}
          title={`${risk.label} risk`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${risk.indicator}`} />
          {risk.label}
        </div>
      </header>

      {/* Capacity utilization */}
      <div className="py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Capacity utilization
          </span>

          <span
            className={`text-xs font-semibold ${
              usagePercent >= 85
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-700 dark:text-slate-200"
            }`}
          >
            {usagePercent.toFixed(1)}%
          </span>
        </div>

        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-gray-900"
          role="progressbar"
          aria-label="Capacity utilization"
          aria-valuenow={Math.round(usagePercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${
              usagePercent >= 85 ? "bg-rose-500" : "bg-blue-500"
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <div className="mt-1.5 flex justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span>{totalUsage.toFixed(2)} Mb/s combined</span>
          <span>{Math.max(0, capacity - totalUsage).toFixed(2)} Mb/s available</span>
        </div>
      </div>

      {/* RX / TX throughput */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <div className="mb-2 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <ArrowDown size={14} />
            <span className="text-xs font-medium">Download (RX)</span>
          </div>

          <p className="truncate text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-xl">
            {formatRate(rxRate)}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
            Mb/s
          </p>
        </div>

        <div className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <div className="mb-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ArrowUp size={14} />
            <span className="text-xs font-medium">Upload (TX)</span>
          </div>

          <p className="truncate text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-xl">
            {formatRate(txRate)}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
            Mb/s
          </p>
        </div>
      </div>

      {/* Forecast */}
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-2">
          <Activity
            size={15}
            className="shrink-0 text-slate-500 dark:text-slate-400"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Traffic forecast
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Next 30 minutes
            </p>
          </div>
        </div>

        <p className="shrink-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {forecast.toFixed(2)}
          <span className="ml-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
            Mb/s
          </span>
        </p>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <div className="flex items-start gap-2">
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0 text-rose-500"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {iface.alerts.length}{" "}
                {iface.alerts.length === 1 ? "Alert" : "Alerts"}
              </p>

              <ul className="mt-1 space-y-1">
                {iface.alerts.map((alert, index) => (
                  <li
                    key={`${alert}-${index}`}
                    className="break-words text-xs leading-4 text-slate-600 dark:text-slate-300"
                  >
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!hasAlerts && (
        <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-slate-500 dark:text-slate-400">
          <Clock size={13} />
          No active interface alerts
        </div>
      )}
    </section>
  );
};

export default InterfaceNodeCard;
