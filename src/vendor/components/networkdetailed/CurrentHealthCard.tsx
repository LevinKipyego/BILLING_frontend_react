
import {
  Cpu,
  Layers,
  Activity,
  Thermometer,
  Users,
  SignalHigh,
} from "lucide-react";

import type { CurrentHealth } from "../../types/networkdetailed";

interface Props {
  health: CurrentHealth;
}

const CurrentHealthCard = ({ health }: Props) => {
  const status = health.status?.toLowerCase();
  const isOnline = status === "online";

  const getMetricColor = (value: number) => {
    if (value > 80) return "text-rose-600 dark:text-rose-400";
    if (value > 60) return "text-amber-600 dark:text-amber-400";
    return "text-slate-800 dark:text-slate-100";
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return "bg-rose-500";
    if (value > 60) return "bg-amber-500";
    return "bg-slate-500 dark:bg-slate-400";
  };

  const metrics = [
    {
      label: "Latency",
      value: health.latency,
      unit: "ms",
      icon: SignalHigh,
      critical: false,
    },
    {
      label: "Temperature",
      value: health.temperature,
      unit: "°C",
      icon: Thermometer,
      critical: health.temperature > 60,
    },
    {
      label: "Active PPPoE",
      value: health.pppoe_sessions,
      unit: "sessions",
      icon: Users,
      critical: false,
    },
  ];

  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-3 dark:border-slate-700 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Activity
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-slate-500 dark:text-slate-400"
          />

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Hardware vitals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              System resource utilization
            </p>
          </div>
        </div>

        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1 dark:border-slate-700">
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />

          <span className="text-xs font-medium capitalize text-slate-600 dark:text-slate-300">
            {health.status}
          </span>
        </div>
      </header>

      {/* Main metrics */}
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 p-3 sm:grid-cols-2 sm:p-4">
        {/* CPU */}
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Cpu size={14} />
              CPU load
            </span>

            <span
              className={`text-sm font-semibold tabular-nums ${getMetricColor(
                health.cpu
              )}`}
            >
              {health.cpu}%
            </span>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-gray-900"
            role="progressbar"
            aria-label="CPU load"
            aria-valuenow={Math.min(100, Math.max(0, health.cpu))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${getProgressColor(
                health.cpu
              )}`}
              style={{
                width: `${Math.min(100, Math.max(0, health.cpu))}%`,
              }}
            />
          </div>
        </div>

        {/* Memory */}
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Layers size={14} />
              Memory
            </span>

            <span
              className={`text-sm font-semibold tabular-nums ${getMetricColor(
                health.memory
              )}`}
            >
              {health.memory}%
            </span>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-gray-900"
            role="progressbar"
            aria-label="Memory utilization"
            aria-valuenow={Math.min(100, Math.max(0, health.memory))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${getProgressColor(
                health.memory
              )}`}
              style={{
                width: `${Math.min(100, Math.max(0, health.memory))}%`,
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="col-span-full h-px bg-slate-100 dark:bg-slate-700/80" />

        {/* Supporting metrics */}
        <div className="col-span-full grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 p-3 transition-colors dark:border-slate-700"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700">
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={
                      metric.critical
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </p>

                  <p className="mt-0.5 break-words text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                    {metric.value}
                    <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                      {metric.unit}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CurrentHealthCard;
