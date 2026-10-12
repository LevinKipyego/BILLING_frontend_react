
import GaugeComponent from "react-gauge-component";
import {
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

interface Uplink {
  rx_rate: number;
  tx_rate: number;
  capacity_mbps?: number | null;
}

interface Props {
  uplink: Uplink | null | undefined;
}

const UplinkSpeedGauge = ({ uplink }: Props) => {
  if (!uplink) return null;

  const rxRate = Number(uplink.rx_rate) || 0;
  const txRate = Number(uplink.tx_rate) || 0;
  const speed = rxRate + txRate;

  const capacity =
    Number(uplink.capacity_mbps) > 0
      ? Number(uplink.capacity_mbps)
      : 1000;

  const usagePercent = Math.min(
    100,
    Math.max(0, (speed / capacity) * 100)
  );

  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <Zap
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-slate-500 dark:text-slate-400"
            />

            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Link throughput
            </h2>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white sm:text-3xl">
              {speed.toFixed(1)}
            </span>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Mb/s
            </span>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-2 text-right dark:border-slate-700">
          <p className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {capacity.toLocaleString()}
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Mbps capacity
          </p>
        </div>
      </header>

      {/* Capacity gauge */}
      <div className="relative mx-auto my-2 w-full max-w-[300px] min-w-0">
        <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.15,
            padding: 0.025,
            cornerRadius: 2,
            subArcs: [
              { limit: 30, color: "#10b981" },
              { limit: 70, color: "#f59e0b" },
              { limit: 100, color: "#ef4444" },
            ],
          }}
          pointer={{
            type: "blob",
            color: "#64748b",
            length: 0.8,
            width: 8,
          }}
          value={usagePercent}
          minValue={0}
          maxValue={100}
          labels={{
            valueLabel: { hide: true },
            tickLabels: {
              type: "outer",
              ticks: [
                { value: 0 },
                { value: 50 },
                { value: 100 },
              ],
            },
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
          <p className="text-xl font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {usagePercent.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Capacity used
          </p>
        </div>
      </div>

      {/* RX / TX breakdown */}
      <div className="mt-auto grid grid-cols-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="min-w-0 border-r border-slate-200 pr-3 dark:border-slate-700">
          <div className="mb-1.5 flex items-center gap-1.5">
            <ArrowDownCircle
              size={15}
              className="shrink-0 text-blue-500"
            />

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Download
            </span>
          </div>

          <p className="break-words text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100 sm:text-lg">
            {rxRate.toFixed(2)}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mb/s
          </p>
        </div>

        <div className="min-w-0 pl-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <ArrowUpCircle
              size={15}
              className="shrink-0 text-emerald-500"
            />

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Upload
            </span>
          </div>

          <p className="break-words text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100 sm:text-lg">
            {txRate.toFixed(2)}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mb/s
          </p>
        </div>
      </div>
    </section>
  );
};

export default UplinkSpeedGauge;
