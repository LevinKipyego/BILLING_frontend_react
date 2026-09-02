import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SignalIcon } from "@heroicons/react/24/outline";
import { formatBytes, getOptimalByteUnit } from "../utils/formatters";

export interface TrafficItem {
  name: string;
  throughput: number; // Raw combined bytes
  tx: number;         // Raw upload bytes
  rx: number;         // Raw download bytes
}

interface ChartProps {
  data: TrafficItem[];
  loading: boolean;
}

export function TrafficThroughputChart({ data, loading }: ChartProps) {
  const { chartData, optimalUnit, hasOutliers } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], optimalUnit: "GB", hasOutliers: false };
    }

    // Collect all throughput values to calculate scale divider and outlier threshold
    const rawThroughputs = data.map((d) => d.throughput || 0);
    const { unit, divider } = getOptimalByteUnit(rawThroughputs);

    // Calculate mean and standard deviation for spike/anomaly detection
    const mean =
      rawThroughputs.reduce((a, b) => a + b, 0) / (rawThroughputs.length || 1);
    const variance =
      rawThroughputs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      (rawThroughputs.length || 1);
    const stdDev = Math.sqrt(variance);
    const threshold = mean + 1.5 * stdDev;

    let foundOutliers = false;

    const formatted = data.map((item) => {
      const tx = item.tx || 0;
      const rx = item.rx || 0;
      const total = item.throughput || tx + rx;

      const isOutlier = total > threshold && total > 0;
      if (isOutlier) foundOutliers = true;

      return {
        name: item.name,
        // Raw byte representations for tooltip formatting
        rawTx: tx,
        rawRx: rx,
        rawThroughput: total,
        // Scaled values for multi-layer Recharts plotting
        txScaled: Number((tx / divider).toFixed(2)),
        rxScaled: Number((rx / divider).toFixed(2)),
        throughputScaled: Number((total / divider).toFixed(2)),
        outlier: isOutlier ? Number((total / divider).toFixed(2)) : null,
      };
    });

    return {
      chartData: formatted,
      optimalUnit: unit,
      hasOutliers: foundOutliers,
    };
  }, [data]);

  return (
    <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <SignalIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Traffic Throughput ({optimalUnit})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              TX / RX breakdown & net throughput trend
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {hasOutliers && (
            <span className="rounded border border-rose-200 bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
              TRAFFIC SPIKES DETECTED
            </span>
          )}
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
            RADACCT_MIRROR
          </span>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="h-72 w-full">
        {loading ? (
          <div className="h-full w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/50" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="2 2"
                vertical={false}
                stroke="#334155"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748B" }}
                unit={` ${optimalUnit}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="space-y-1.5 rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-sm dark:bg-slate-950/95">
                        <p className="border-b border-slate-800 pb-1 font-semibold text-slate-300">
                          Day: {label}
                        </p>
                        <div className="space-y-1 text-slate-200">
                          <p className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-amber-400">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                              TX (Upload):
                            </span>
                            <span className="font-mono font-medium">
                              {formatBytes(row.rawTx)}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-indigo-400">
                              <span className="h-2 w-2 rounded-full bg-indigo-500" />
                              RX (Download):
                            </span>
                            <span className="font-mono font-medium">
                              {formatBytes(row.rawRx)}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4 border-t border-slate-800 pt-1 font-semibold">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Total Throughput:
                            </span>
                            <span className="font-mono text-emerald-300">
                              {formatBytes(row.rawThroughput)}
                            </span>
                          </p>
                        </div>
                        {row.outlier && (
                          <p className="pt-1 text-[10px] font-semibold uppercase text-rose-400">
                            ⚠️ Anomaly: Exceeds standard daily baseline
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
                formatter={(value) => (
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {value}
                  </span>
                )}
              />

              {/* TX Bar (Upload) - Amber */}
              <Bar
                name="TX (Upload)"
                dataKey="txScaled"
                stackId="traffic"
                fill="#F59E0B"
                radius={[0, 0, 0, 0]}
                barSize={24}
              />

              {/* RX Bar (Download) - Indigo */}
              <Bar
                name="RX (Download)"
                dataKey="rxScaled"
                stackId="traffic"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />

              {/* Total Net Throughput Line Trend - Emerald */}
              <Line
                name="Net Throughput"
                type="monotone"
                dataKey="throughputScaled"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />

              {/* Anomaly / Spike Scatter Markers - Rose */}
              <Scatter
                name="Spike Anomaly"
                dataKey="outlier"
                fill="#F43F5E"
                shape="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}