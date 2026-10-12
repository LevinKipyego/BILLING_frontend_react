
import {
  AlertCircle,
  Bell,
  Clock,
  Cpu,
  Thermometer,
  ChevronRight,
  Calendar,
} from "lucide-react";

import type { AlertItem } from "../../types/networkdetailed";

interface Props {
  alerts: AlertItem[];
}

type Severity = "critical" | "warning" | "info";

const AlertsList = ({ alerts }: Props) => {
  const getSeverity = (alert: AlertItem): Severity => {
    if (alert.cpu > 90 || alert.temperature > 75) return "critical";
    if (alert.cpu > 70 || alert.temperature > 60) return "warning";
    return "info";
  };

  // Severity is communicated through labels and icons.
  // The card background remains the dashboard's original surface.
  const severityStyles: Record<
    Severity,
    { border: string; text: string; icon: string }
  > = {
    critical: {
      border: "border-l-rose-500",
      text: "text-rose-600 dark:text-rose-400",
      icon: "text-rose-500 dark:text-rose-400",
    },
    warning: {
      border: "border-l-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      icon: "text-amber-500 dark:text-amber-400",
    },
    info: {
      border: "border-l-slate-300 dark:border-l-slate-600",
      text: "text-slate-600 dark:text-slate-300",
      icon: "text-slate-400 dark:text-slate-500",
    },
  };

  return (
    <section className="flex h-[400px] min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:h-[420px]">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-3 dark:border-slate-700 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Bell
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-slate-500 dark:text-slate-400"
          />

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Incident logs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Router alerts and resource thresholds
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium tabular-nums text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {alerts.length} events
        </span>
      </header>

      {/* Alert list */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-auto">
        {alerts.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/70">
            {alerts.map((alert, index) => {
              const severity = getSeverity(alert);
              const styles = severityStyles[severity];
              const alertDate = new Date(alert.created_at);

              const validDate = !Number.isNaN(alertDate.getTime());

              return (
                <article
                  key={`${alert.created_at}-${index}`}
                  className={`group flex min-w-0 items-start gap-2.5 border-l-2 px-3 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-gray-900/20 sm:gap-3 sm:px-4 ${styles.border}`}
                >
                  <div className="mt-0.5 shrink-0">
                    <AlertCircle
                      size={17}
                      strokeWidth={1.8}
                      className={styles.icon}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Severity and status */}
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold capitalize ${styles.text}`}
                        >
                          {severity}
                        </span>

                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          ·
                        </span>

                        <span className="break-words text-xs font-medium text-slate-700 dark:text-slate-200">
                          {alert.status}
                        </span>
                      </div>

                      <ChevronRight
                        size={16}
                        className="hidden shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 sm:block dark:text-slate-500"
                      />
                    </div>

                    {/* Date and time */}
                    {validDate && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {alertDate.toLocaleDateString(undefined, {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {alertDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Resource metrics */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5 dark:border-slate-700">
                        <Cpu
                          size={14}
                          className="shrink-0 text-slate-400 dark:text-slate-500"
                        />

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          CPU
                        </span>

                        <span
                          className={`ml-auto text-xs font-semibold tabular-nums ${
                            alert.cpu > 80
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {alert.cpu}%
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5 dark:border-slate-700">
                        <Thermometer
                          size={14}
                          className="shrink-0 text-slate-400 dark:text-slate-500"
                        />

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Temp
                        </span>

                        <span
                          className={`ml-auto text-xs font-semibold tabular-nums ${
                            alert.temperature > 65
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {alert.temperature}°C
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700">
              <Bell
                size={21}
                strokeWidth={1.5}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              No incidents recorded
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              There are no alerts to display.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-3 py-2.5 dark:border-slate-700 sm:px-4">
        <button
          type="button"
          className="flex min-h-8 w-full items-center justify-between gap-2 rounded-md px-1 text-left text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-slate-300 dark:hover:text-white"
        >
          <span>Historic logs archive</span>
          <ChevronRight size={15} />
        </button>
      </footer>
    </section>
  );
};

export default AlertsList;
