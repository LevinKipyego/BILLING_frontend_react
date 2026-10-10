
import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDaysIcon,
 
  SignalIcon,
} from "@heroicons/react/24/outline";
import { formatBytes, getOptimalByteUnit } from "../utils/formatters";

export type TrafficRange = "24h" | "7d" | "30d" | "90d";

export interface TrafficItem {
  name: string;
  throughput: number;
  tx: number;
  rx: number;
}

interface ChartProps {
  data: TrafficItem[];
  loading: boolean;

  /**
   * Period-specific data supplied by the dashboard API.
   * Keys: "24h", "7d", "30d", "90d".
   *
   * The existing `data` prop remains the fallback for "7d".
   */
  dataByRange?: Partial<Record<TrafficRange, TrafficItem[]>>;
}

const PERIODS: { value: TrafficRange; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
];

const TX_COLOR = "#2563EB";
const RX_COLOR = "#93C5FD";
const AREA_COLOR = "#0F766E";

export function TrafficThroughputChart({
  data = [],
  loading,
  dataByRange,
}: ChartProps) {
  const [selectedRange, setSelectedRange] =
    useState<TrafficRange>("7d");

  const activeData = useMemo<TrafficItem[]>(() => {
    if (dataByRange?.[selectedRange] !== undefined) {
      return dataByRange[selectedRange] ?? [];
    }

    // Existing API response represents the seven-day view.
    if (selectedRange === "7d") {
      return data;
    }

    // Do not misrepresent seven-day data as another period.
    return [];
  }, [data, dataByRange, selectedRange]);

  const {
    chartData,
    optimalUnit,
    totalTx,
    totalRx,
    totalTraffic,
  } = useMemo(() => {
    const rawThroughputs = activeData.map(
      (item) =>
        Math.max(
          0,
          Number(item.throughput) ||
            (Number(item.tx) || 0) + (Number(item.rx) || 0)
        )
    );

    const { unit, divider } =
      getOptimalByteUnit(rawThroughputs);

    let txSum = 0;
    let rxSum = 0;

    const formatted = activeData.map((item) => {
      const tx = Math.max(0, Number(item.tx) || 0);
      const rx = Math.max(0, Number(item.rx) || 0);
      const total =
        Number(item.throughput) || tx + rx;

      txSum += tx;
      rxSum += rx;

      return {
        name: item.name,
        rawTx: tx,
        rawRx: rx,
        rawThroughput: Math.max(0, total),
        txScaled: Number((tx / divider).toFixed(2)),
        rxScaled: Number((rx / divider).toFixed(2)),
        throughputScaled: Number(
          (Math.max(0, total) / divider).toFixed(2)
        ),
      };
    });

    return {
      chartData: formatted,
      optimalUnit: unit,
      totalTx: txSum,
      totalRx: rxSum,
      totalTraffic: txSum + rxSum,
    };
  }, [activeData]);

  const isRangeAvailable =
    selectedRange === "7d" ||
    dataByRange?.[selectedRange] !== undefined;

  const periodLabel =
    PERIODS.find((period) => period.value === selectedRange)
      ?.label ?? "7D";

  return (
    <section className="flex h-[320px] min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Compact header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-3 py-3 dark:border-gray-800 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400">
            <SignalIcon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              Traffic Throughput
            </h3>
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
              Upload and download traffic
            </p>
          </div>
        </div>

        {/* Period selector */}
        <div
          role="group"
          aria-label="Traffic time range"
          className="flex shrink-0 items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-gray-700 dark:bg-gray-800"
        >
          {PERIODS.map((period) => {
            const selected = selectedRange === period.value;

            return (
              <button
                key={period.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedRange(period.value)}
                className={`rounded-md px-2 py-1.5 text-[9px] font-bold transition-colors ${
                  selected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-800 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {period.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Summary metrics */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 pb-1 pt-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-blue-600" />
              <span className="text-[9px] text-slate-500 dark:text-slate-400">
                TX
              </span>
            </div>
            <p
              className="mt-0.5 truncate font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-100"
              title={formatBytes(totalTx)}
            >
              {loading ? "—" : formatBytes(totalTx)}
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-blue-300" />
              <span className="text-[9px] text-slate-500 dark:text-slate-400">
                RX
              </span>
            </div>
            <p
              className="mt-0.5 truncate font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-100"
              title={formatBytes(totalRx)}
            >
              {loading ? "—" : formatBytes(totalRx)}
            </p>
          </div>
        </div>

        <div className="min-w-0 text-right">
          <p className="text-[9px] text-slate-500 dark:text-slate-400">
            Combined traffic
          </p>
          <p
            className="mt-0.5 truncate font-mono text-xs font-bold text-teal-700 dark:text-teal-400"
            title={formatBytes(totalTraffic)}
          >
            {loading ? "—" : formatBytes(totalTraffic)}
          </p>
        </div>
      </div>

      {/* Chart area */}
      <div className="min-h-0 flex-1 px-1 pb-1 pt-1">
        {loading ? (
          <div className="h-full animate-pulse rounded-lg bg-slate-100 dark:bg-gray-800" />
        ) : chartData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-slate-400">
              {isRangeAvailable ? (
                <SignalIcon className="h-4 w-4" />
              ) : (
                <CalendarDaysIcon className="h-4 w-4" />
              )}
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {isRangeAvailable
                ? "No traffic data available"
                : `No ${periodLabel} data yet`}
            </p>

            <p className="max-w-[230px] text-[10px] leading-4 text-slate-400 dark:text-slate-500">
              {isRangeAvailable
                ? "Traffic records will appear here when available."
                : "This time range will be available when the backend supplies its traffic history."}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 5,
                right: 7,
                left: -17,
                bottom: 0,
              }}
              barCategoryGap="20%"
              maxBarSize={18}
            >
              <defs>
                <linearGradient
                  id="trafficAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={AREA_COLOR}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={AREA_COLOR}
                    stopOpacity={0.015}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#94A3B8"
                strokeOpacity={0.15}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 9,
                  fill: "#94A3B8",
                }}
                tickMargin={6}
                minTickGap={18}
                interval="preserveStartEnd"
                padding={{ left: 5, right: 5 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={43}
                tick={{
                  fontSize: 9,
                  fill: "#94A3B8",
                }}
                tickFormatter={(value: number) =>
                  `${value} ${optimalUnit}`
                }
              />

              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.07)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const row = payload[0].payload;

                  return (
                    <div className="min-w-[175px] rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                      <p className="mb-2 border-b border-slate-100 pb-2 text-[10px] font-semibold text-slate-800 dark:border-gray-800 dark:text-white">
                        {label}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="h-2 w-2 rounded-sm bg-blue-600" />
                            TX · Upload
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                            {formatBytes(row.rawTx)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="h-2 w-2 rounded-sm bg-blue-300" />
                            RX · Download
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                            {formatBytes(row.rawRx)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2 dark:border-gray-800">
                          <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400">
                            Total
                          </span>
                          <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-400">
                            {formatBytes(row.rawThroughput)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              {/* Soft total-throughput area replaces the prominent line */}
              <Area
                type="monotone"
                dataKey="throughputScaled"
                name="Total traffic"
                stroke={AREA_COLOR}
                strokeWidth={1.5}
                fill="url(#trafficAreaGradient)"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: AREA_COLOR,
                  stroke: "#FFFFFF",
                  strokeWidth: 1.5,
                }}
                isAnimationActive={false}
              />

              {/* TX: blue */}
              <Bar
                dataKey="txScaled"
                name="TX · Upload"
                stackId="traffic"
                fill={TX_COLOR}
                radius={[0, 0, 0, 0]}
                isAnimationActive={false}
              />

              {/* RX: light blue */}
              <Bar
                dataKey="rxScaled"
                name="RX · Download"
                stackId="traffic"
                fill={RX_COLOR}
                radius={[3, 3, 0, 0]}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Compact footer */}
      <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 px-3 py-2 dark:border-gray-800">
        <div className="flex items-center gap-2 text-[9px] text-slate-500 dark:text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          TX
          <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
          RX
          <span className="ml-1 h-1.5 w-3 rounded-sm bg-teal-700" />
          Total trend
        </div>

        <span className="shrink-0 font-mono text-[9px] text-slate-400 dark:text-slate-500">
          {periodLabel} · {optimalUnit}
        </span>
      </footer>
    </section>
  );
}
