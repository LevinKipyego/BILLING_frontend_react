
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Activity, TrendingUp } from "lucide-react";
import type { HealthHistoryItem } from "../../types/networkdetailed";

interface Props {
  history: HealthHistoryItem[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    payload?: HealthHistoryItem;
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

  const cpu = payload[0]?.value;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-gray-800">
      {validTimestamp && (
        <div className="mb-2 border-b border-slate-200 pb-2 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {timestamp.toLocaleDateString(undefined, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>

          <p className="mt-0.5 text-xs font-medium text-slate-700 dark:text-slate-200">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          CPU utilization
        </span>

        <span className="text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
          {cpu}%
        </span>
      </div>
    </div>
  );
};

const HealthChart = ({ history }: Props) => {
  const peakCpu =
    history.length > 0
      ? Math.max(...history.map((item) => item.cpu))
      : 0;

  return (
    <section className="flex h-[340px] min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-gray-800 sm:h-[370px] sm:p-4">
      {/* Header */}
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700">
            <Activity
              size={17}
              strokeWidth={1.8}
              className="text-slate-500 dark:text-slate-400"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              CPU utilization
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Historical resource tracking
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-2 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Peak load
          </p>

          <div className="mt-0.5 flex items-center justify-end gap-1.5">
            <TrendingUp
              size={14}
              className="text-slate-500 dark:text-slate-400"
            />

            <span className="text-base font-semibold tabular-nums text-slate-800 dark:text-slate-100">
              {peakCpu}%
            </span>
          </div>
        </div>
      </header>

      {/* Chart */}
      <div className="min-h-0 min-w-0 flex-1">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={history}
              margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id="healthCpuGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563EB"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563EB"
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
                dataKey="created_at"
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
                domain={[0, 100]}
                width={34}
                tickFormatter={(value) => `${value}%`}
                className="text-slate-500 dark:text-slate-400"
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#2563EB",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#healthCpuGradient)"
                fillOpacity={1}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "#2563EB",
                  fill: "#FFFFFF",
                }}
                animationDuration={700}
                isAnimationActive={history.length < 100}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <Activity
                size={22}
                className="mx-auto mb-2 text-slate-400 dark:text-slate-500"
              />

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No health history available
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Historical CPU readings will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HealthChart;
