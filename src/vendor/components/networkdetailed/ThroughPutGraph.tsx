
import { Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { uplink_history } from "../../types/networkdetailed";

interface Props {
  data: uplink_history[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
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

  const value = Number(payload[0]?.value ?? 0);
  const timestamp = label ? new Date(label) : null;
  const validTimestamp =
    timestamp && !Number.isNaN(timestamp.getTime());

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-gray-800">
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

      <div className="flex items-center justify-between gap-5">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Aggregate throughput
        </span>

        <span className="text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
          {value.toFixed(2)}{" "}
          <span className="text-xs font-normal">Mb/s</span>
        </span>
      </div>
    </div>
  );
};

const AggregatedLoadGraph = ({ data }: Props) => {
  const latestValue =
    data.length > 0
      ? Number(data[data.length - 1].total_mbps) || 0
      : 0;

  return (
    <section className="mt-3 w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:p-4">
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700">
            <Zap
              size={18}
              strokeWidth={1.8}
              className="text-slate-500 dark:text-slate-400"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Total aggregated load
            </h3>

            <div className="mt-1 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live uplink telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Latest throughput */}
        <div className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current throughput
          </p>

          <p className="mt-0.5 text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100 sm:text-lg">
            {latestValue.toFixed(2)}{" "}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Mb/s
            </span>
          </p>
        </div>
      </header>

      {/* Chart */}
      <div className="h-[210px] min-h-0 min-w-0 sm:h-[240px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              syncId="uplinkSync"
              margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id="aggregatedLoadGradient"
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
                width={42}
                tickFormatter={(value) => `${value}M`}
                className="text-slate-500 dark:text-slate-400"
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#3b82f6",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="total_mbps"
                name="Aggregate throughput"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#aggregatedLoadGradient)"
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
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <div className="px-4 text-center">
              <Zap
                size={22}
                className="mx-auto mb-2 text-slate-400 dark:text-slate-500"
              />

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No throughput data available
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Traffic readings will appear when available.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Aggregated node load
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Telemetry
        </span>
      </footer>
    </section>
  );
};

export default AggregatedLoadGraph;
