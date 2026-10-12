
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import type { uplink_history } from "../../types/networkdetailed";

interface Props {
  data: uplink_history[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number | string;
  }>;
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const timestamp = label ? new Date(label) : null;
  const validTimestamp =
    timestamp && !Number.isNaN(timestamp.getTime());

  const getValue = (key: string) => {
    const entry = payload.find((item) => item.dataKey === key);
    return Number(entry?.value ?? 0);
  };

  return (
    <div className="min-w-[175px] rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-gray-800">
      {validTimestamp && (
        <p className="mb-2 border-b border-slate-200 pb-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {timestamp.toLocaleDateString(undefined, {
            month: "short",
            day: "2-digit",
          })}{" "}
          ·{" "}
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowDownLeft
              size={14}
              className="text-blue-500"
            />
            RX rate
          </span>

          <span className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {getValue("rx_rate").toFixed(2)}
            <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              Mb/s
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpRight
              size={14}
              className="text-emerald-500"
            />
            TX rate
          </span>

          <span className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
            {getValue("tx_rate").toFixed(2)}
            <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              Mb/s
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

const ThroughputGraph = ({ data }: Props) => {
  return (
    <section className="mt-3 w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700">
            <Activity
              size={18}
              strokeWidth={1.8}
              className="text-slate-500 dark:text-slate-400"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Traffic distribution
            </h3>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Uplink RX and TX throughput
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5 dark:border-slate-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              RX
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5 dark:border-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              TX
            </span>
          </div>
        </div>
      </header>

      {/* Chart */}
      <div className="h-[220px] min-h-0 min-w-0 sm:h-[260px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              syncId="uplinkSync"
              margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id="throughputRxGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="throughputTxGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#10b981"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="#10b981"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                opacity={0.65}
              />

              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 400 }}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                minTickGap={35}
                className="text-slate-500 dark:text-slate-400"
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 400 }}
                tickMargin={6}
                width={48}
                tickFormatter={(value) => `${value}M`}
                className="text-slate-500 dark:text-slate-400"
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#64748b",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="rx_rate"
                name="RX rate"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#throughputRxGradient)"
                fillOpacity={1}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "#3b82f6",
                  fill: "#FFFFFF",
                }}
                animationDuration={700}
                isAnimationActive={data.length < 100}
              />

              <Area
                type="monotone"
                dataKey="tx_rate"
                name="TX rate"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#throughputTxGradient)"
                fillOpacity={1}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "#10b981",
                  fill: "#FFFFFF",
                }}
                animationDuration={700}
                isAnimationActive={data.length < 100}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <div className="px-4 text-center">
              <Activity
                size={22}
                className="mx-auto mb-2 text-slate-400 dark:text-slate-500"
              />

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No throughput data available
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                RX and TX readings will appear when available.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Uplink traffic telemetry
        </span>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          RX / TX synchronized
        </span>
      </footer>
    </section>
  );
};

export default ThroughputGraph;
