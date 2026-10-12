
import GaugeComponent from "react-gauge-component";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  ZapOff,
} from "lucide-react";

interface Props {
  score: number;
}

const NetworkHealthGauge = ({ score }: Props) => {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));

  const getFeedback = (value: number) => {
    if (value >= 80) {
      return {
        label: "Optimal",
        color: "#10b981",
        icon: ShieldCheck,
      };
    }

    if (value >= 50) {
      return {
        label: "Stable",
        color: "#f59e0b",
        icon: Activity,
      };
    }

    if (value >= 30) {
      return {
        label: "Warning",
        color: "#f97316",
        icon: AlertTriangle,
      };
    }

    return {
      label: "Critical",
      color: "#ef4444",
      icon: ZapOff,
    };
  };

  const status = getFeedback(safeScore);
  const StatusIcon = status.icon;

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <Activity size={16} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              Network Health
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Network integrity score
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-1.5 text-xs font-semibold"
          style={{ color: status.color }}
        >
          <StatusIcon size={15} />
          <span>{status.label}</span>
        </div>
      </header>

      {/* Gauge */}
      <div className="flex min-h-[150px] flex-1 items-center justify-center overflow-hidden py-2 sm:min-h-[170px]">
        <div className="w-full max-w-[280px]">
          <GaugeComponent
            type="semicircle"
            value={safeScore}
            minValue={0}
            maxValue={100}
            arc={{
              width: 0.15,
              padding: 0.025,
              cornerRadius: 2,
              subArcs: [
                { limit: 30, color: "#ef4444" },
                { limit: 60, color: "#f59e0b" },
                { limit: 100, color: "#10b981" },
              ],
            }}
            pointer={{
              type: "blob",
              color: "#64748b",
              length: 0.8,
              width: 8,
            }}
            labels={{
              valueLabel: {
                style: {
                  fontSize: "30px",
                  fill: "currentColor",
                  fontWeight: "600",
                  fontFamily: "inherit",
                },
                formatTextValue: (value: number) => `${Math.round(value)}%`,
              },
              tickLabels: {
                hideMinMax: true,
              },
            }}
          />
        </div>
      </div>

      {/* Status summary */}
      <div className="mt-auto border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Health status
            </p>
            <p
              className="mt-0.5 text-lg font-semibold tracking-tight"
              style={{ color: status.color }}
            >
              {status.label}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Score
            </p>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {safeScore}
              <span className="ml-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                /100
              </span>
            </p>
          </div>
        </div>

        {/* Score indicators */}
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((dot) => {
            const active = safeScore >= dot * 20;

            return (
              <div
                key={dot}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  active
                    ? ""
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
                style={{
                  backgroundColor: active ? status.color : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NetworkHealthGauge;
