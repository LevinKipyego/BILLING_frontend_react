
import {
  BarChart3,
  Clock,
  Activity,
  AlertTriangle,
  History,
  TrendingUp,
  Thermometer,
} from "lucide-react";

import type { Stats24h } from "../../types/networkdetailed";

interface Props {
  stats: Stats24h;
}

const Stats24hCard = ({ stats }: Props) => {
  const uptime = Number(stats.uptime_percent) || 0;
  const avgCpu = Number(stats.avg_cpu) || 0;
  const avgLatency = Number(stats.avg_latency) || 0;
  const maxTemperature = Number(stats.max_temperature) || 0;
  const totalDowntime = Number(stats.total_down_minutes_24h) || 0;
  const currentDowntime = Number(stats.current_down_minutes) || 0;
  const lastIncident = stats.last_down_minutes;

  const getReliabilityColor = (value: number) => {
    if (value >= 99.9) return "text-emerald-600 dark:text-emerald-400";
    if (value >= 95) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const metrics = [
    {
      label: "Reliability",
      value: `${uptime}%`,
      icon: Activity,
      valueClass: getReliabilityColor(uptime),
    },
    {
      label: "Avg. CPU",
      value: `${avgCpu}%`,
      icon: TrendingUp,
      valueClass: "text-slate-800 dark:text-slate-100",
    },
    {
      label: "Avg. Latency",
      value: avgLatency,
      unit: "ms",
      icon: Activity,
      valueClass: "text-slate-800 dark:text-slate-100",
    },
    {
      label: "Max. Temperature",
      value: maxTemperature,
      unit: "°C",
      icon: Thermometer,
      valueClass: "text-slate-800 dark:text-slate-100",
    },
  ];

  const incidents = [
    {
      label: "Total Outage",
      value: `${totalDowntime} min`,
      description: "Downtime in the last 24 hours",
      icon: BarChart3,
      valueClass:
        totalDowntime > 0
          ? "text-rose-600 dark:text-rose-400"
          : "text-slate-800 dark:text-slate-100",
    },
    {
      label: "Active Downtime",
      value: currentDowntime > 0 ? `${currentDowntime} min` : "Nominal",
      description:
        currentDowntime > 0 ? "Current outage duration" : "No active downtime",
      icon: Clock,
      valueClass:
        currentDowntime > 0
          ? "text-rose-600 dark:text-rose-400"
          : "text-slate-800 dark:text-slate-100",
    },
    {
      label: "Last Incident",
      value:
        lastIncident == null
          ? "N/A"
          : Number(lastIncident) === 0
            ? "Just now"
            : `${lastIncident} min ago`,
      description: "Time since last recorded outage",
      icon: History,
      valueClass: "text-slate-800 dark:text-slate-100",
    },
  ];

  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <History size={16} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              24-Hour Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Router health and availability
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <Clock size={12} />
          Rolling window
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-5 p-3 sm:p-4">
        {/* Performance metrics */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-700 sm:p-3.5"
              >
                <div className="mb-2 flex min-w-0 items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Icon size={14} className="shrink-0" />
                  <p className="truncate text-[11px] font-medium sm:text-xs">
                    {metric.label}
                  </p>
                </div>

                <p
                  className={`truncate text-xl font-semibold tracking-tight sm:text-2xl ${metric.valueClass}`}
                >
                  {metric.value}
                  {metric.unit && (
                    <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {metric.unit}
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Outage analytics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={15}
              className={
                totalDowntime > 0 || currentDowntime > 0
                  ? "shrink-0 text-rose-500"
                  : "shrink-0 text-slate-400 dark:text-slate-500"
              }
            />
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Outage analytics
            </h3>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {incidents.map((incident) => {
              const Icon = incident.icon;

              return (
                <div
                  key={incident.label}
                  className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 sm:p-3.5"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 ${
                      incident.label === "Active Downtime" &&
                      currentDowntime > 0
                        ? "text-rose-600 dark:text-rose-400"
                        : incident.label === "Total Outage" &&
                            totalDowntime > 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {incident.label}
                    </p>

                    <p
                      className={`mt-1 break-words text-sm font-semibold ${incident.valueClass}`}
                    >
                      {incident.value}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-slate-500">
                      {incident.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats24hCard;
