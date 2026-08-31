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
  ResponsiveContainer,
} from "recharts";
import { SignalIcon } from "@heroicons/react/24/outline";
import { formatBytes, getOptimalByteUnit } from "../utils/formatters";

interface TrafficItem {
  name: string;
  usage: number; // Raw bytes from backend
  peak_bytes?: number;  // Optional peak/rate byte data
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

    const rawUsages = data.map((d) => d.usage || 0);
    const { unit, divider } = getOptimalByteUnit(rawUsages);

    // Calculate mean and standard deviation for outlier detection
    const mean = rawUsages.reduce((a, b) => a + b, 0) / rawUsages.length;
    const variance =
      rawUsages.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rawUsages.length;
    const stdDev = Math.sqrt(variance);
    const threshold = mean + 1.5 * stdDev;

    let foundOutliers = false;

    const formatted = data.map((item) => {
      const bytes = item.usage || 0;
      const peak = item.peak_bytes || bytes * 1.25; // fallback peak if omitted
      const isOutlier = bytes > threshold && bytes > 0;

      if (isOutlier) foundOutliers = true;

      return {
        name: item.name,
        rawBytes: bytes,
        usageScaled: Number((bytes / divider).toFixed(2)),
        peakScaled: Number((peak / divider).toFixed(2)),
        outlier: isOutlier ? Number((bytes / divider).toFixed(2)) : null,
      };
    });

    return { chartData: formatted, optimalUnit: unit, hasOutliers: foundOutliers };
  }, [data]);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <SignalIcon className="w-4 h-4 text-blue-600" />
          Traffic Throughput ({optimalUnit}) & Peak Trends
        </h3>
        <div className="flex items-center gap-2">
          {hasOutliers && (
            <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 px-2 py-0.5 rounded text-[10px] font-mono">
              SPIKES DETECTED
            </span>
          )}
          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400">
            RAW_MIKROTIK_BYTES
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        {loading ? (
          <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
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
                tick={{ fontSize: 10, fill: "#64748B" }}
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
                      <div className="bg-slate-900 text-slate-100 border border-slate-700 p-2.5 rounded-md text-xs shadow-lg space-y-1">
                        <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1">
                          Node: {label}
                        </p>
                        <p className="text-blue-400 font-mono">
                          Total Volume: {formatBytes(row.rawBytes)}
                        </p>
                        <p className="text-amber-400 font-mono">
                          Scaled Value: {row.usageScaled} {optimalUnit}
                        </p>
                        {row.outlier && (
                          <p className="text-rose-400 font-semibold text-[10px] uppercase">
                            ⚠️ Anomaly: Volume exceeds normal baseline
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Volume Bar */}
              <Bar
                dataKey="usageScaled"
                fill="#3B82F6"
                opacity={0.4}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              {/* Thin Sharp Peak Line */}
              <Line
                type="monotone"
                dataKey="peakScaled"
                stroke="#2563EB"
                strokeWidth={1.5}
                dot={false}
              />
              {/* Outlier Scatter Markers */}
              <Scatter
                dataKey="outlier"
                fill="#EF4444"
                shape="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}