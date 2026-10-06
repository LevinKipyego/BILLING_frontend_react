
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
  tx: number; // Raw upload bytes
  rx: number; // Raw download bytes
}

interface ChartProps {
  data: TrafficItem[];
  loading: boolean;
}

export function TrafficThroughputChart({
  data,
  loading,
}: ChartProps) {
  const { chartData, optimalUnit, hasOutliers } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chartData: [],
        optimalUnit: "GB",
        hasOutliers: false,
      };
    }

    const rawThroughputs = data.map(
      (d) => d.throughput || 0
    );

    const { unit, divider } =
      getOptimalByteUnit(rawThroughputs);

    // ---------------------------------------------
    // Anomaly detection
    // ---------------------------------------------
    const mean =
      rawThroughputs.reduce((a, b) => a + b, 0) /
      (rawThroughputs.length || 1);

    const variance =
      rawThroughputs.reduce(
        (sum, value) =>
          sum + Math.pow(value - mean, 2),
        0
      ) / (rawThroughputs.length || 1);

    const stdDev = Math.sqrt(variance);

    const threshold = mean + 1.5 * stdDev;

    let foundOutliers = false;

    const formatted = data.map((item) => {
      const tx = item.tx || 0;
      const rx = item.rx || 0;

      const total =
        item.throughput || tx + rx;

      const isOutlier =
        total > threshold && total > 0;

      if (isOutlier) {
        foundOutliers = true;
      }

      return {
        name: item.name,

        rawTx: tx,
        rawRx: rx,
        rawThroughput: total,

        txScaled: Number(
          (tx / divider).toFixed(2)
        ),

        rxScaled: Number(
          (rx / divider).toFixed(2)
        ),

        throughputScaled: Number(
          (total / divider).toFixed(2)
        ),

        outlier: isOutlier
          ? Number((total / divider).toFixed(2))
          : null,
      };
    });

    return {
      chartData: formatted,
      optimalUnit: unit,
      hasOutliers: foundOutliers,
    };
  }, [data]);

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-lg
        border border-slate-200 dark:border-gray-700
        p-4 sm:p-5
        shadow-sm
        text-xs sm:text-sm
      "
    >
      {/* ----------------------------------------- */}
      {/* Header                                    */}
      {/* ----------------------------------------- */}
      <div
        className="
          flex flex-col sm:flex-row
          justify-between
          items-start sm:items-center
          gap-3
          mb-4
        "
      >
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex items-center justify-center
              h-8 w-8
              rounded-lg
              bg-slate-50 dark:bg-gray-800
              border border-slate-200 dark:border-gray-700
              text-slate-500 dark:text-slate-400
            "
          >
            <SignalIcon className="h-4 w-4" />
          </div>

          <div>
            <h3
              className="
                text-sm sm:text-base
                font-medium
                text-slate-900 dark:text-white
              "
            >
              Traffic Throughput
            </h3>

            <p
              className="
                text-[11px]
                text-slate-500 dark:text-slate-400
                mt-0.5
              "
            >
              TX / RX traffic distribution and throughput trend
            </p>
          </div>
        </div>

        {/* --------------------------------------- */}
        {/* Header Metrics / Indicators             */}
        {/* --------------------------------------- */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="
              inline-flex items-center gap-1.5
              text-[10px]
              font-medium
              text-slate-500 dark:text-slate-400
              font-mono
            "
          >
            <span
              className="
                w-2 h-2
                rounded-full
                bg-amber-500
              "
            />
            TX
          </span>

          <span
            className="
              inline-flex items-center gap-1.5
              text-[10px]
              font-medium
              text-slate-500 dark:text-slate-400
              font-mono
            "
          >
            <span
              className="
                w-2 h-2
                rounded-full
                bg-indigo-500
              "
            />
            RX
          </span>

          <span
            className="
              inline-flex items-center gap-1.5
              text-[10px]
              font-medium
              text-slate-500 dark:text-slate-400
              font-mono
            "
          >
            <span
              className="
                w-2 h-2
                rounded-full
                bg-emerald-500
              "
            />
            TOTAL
          </span>

          {hasOutliers && (
            <span
              className="
                inline-flex items-center
                px-2 py-1
                rounded
                border
                border-red-200 dark:border-red-900/50
                bg-red-50 dark:bg-red-950/30
                text-[9px]
                font-medium
                text-red-600 dark:text-red-400
                uppercase
                tracking-wide
              "
            >
              Traffic spike
            </span>
          )}
        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* Chart                                     */}
      {/* ----------------------------------------- */}
      <div className="h-64 sm:h-72 w-full">
        {loading ? (
          <div
            className="
              h-full w-full
              animate-pulse
              rounded-lg
              bg-slate-100 dark:bg-gray-800
            "
          />
        ) : chartData.length === 0 ? (
          <div
            className="
              h-full
              flex items-center justify-center
              text-xs
              text-slate-400 dark:text-slate-500
              border-t border-slate-100 dark:border-gray-800
            "
          >
            No traffic data available
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <ComposedChart
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              {/* -------------------------------- */}
              {/* Grid                             */}
              {/* -------------------------------- */}
              <CartesianGrid
                strokeDasharray="2 2"
                vertical={false}
                stroke="#94A3B8"
                strokeOpacity={0.15}
              />

              {/* -------------------------------- */}
              {/* X Axis                           */}
              {/* -------------------------------- */}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#94A3B8",
                }}
                dy={6}
              />

              {/* -------------------------------- */}
              {/* Y Axis                           */}
              {/* -------------------------------- */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 9,
                  fill: "#94A3B8",
                }}
                tickFormatter={(value) =>
                  `${value} ${optimalUnit}`
                }
              />

              {/* -------------------------------- */}
              {/* Tooltip                          */}
              {/* -------------------------------- */}
              <Tooltip
                cursor={{
                  fill: "rgba(148, 163, 184, 0.06)",
                }}
                content={({
                  active,
                  payload,
                  label,
                }) => {
                  if (
                    !active ||
                    !payload ||
                    !payload.length
                  ) {
                    return null;
                  }

                  const row =
                    payload[0].payload;

                  return (
                    <div
                      className="
                        min-w-[220px]
                        rounded-lg
                        border
                        border-slate-200 dark:border-gray-700
                        bg-white dark:bg-gray-900
                        p-3
                        shadow-lg
                      "
                    >
                      {/* Tooltip Header */}
                      <div
                        className="
                          pb-2 mb-2
                          border-b
                          border-slate-100 dark:border-gray-800
                        "
                      >
                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-medium
                            text-slate-400 dark:text-slate-500
                          "
                        >
                          Traffic Period
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            font-semibold
                            text-slate-800 dark:text-white
                          "
                        >
                          {label}
                        </p>
                      </div>

                      {/* TX */}
                      <div
                        className="
                          flex items-center
                          justify-between
                          gap-4
                          py-1
                        "
                      >
                        <span
                          className="
                            flex items-center gap-2
                            text-[11px]
                            text-slate-500 dark:text-slate-400
                          "
                        >
                          <span
                            className="
                              w-2 h-2
                              rounded-sm
                              bg-amber-500
                            "
                          />
                          Upload
                        </span>

                        <span
                          className="
                            font-mono
                            text-[11px]
                            font-medium
                            text-slate-800 dark:text-slate-200
                          "
                        >
                          {formatBytes(row.rawTx)}
                        </span>
                      </div>

                      {/* RX */}
                      <div
                        className="
                          flex items-center
                          justify-between
                          gap-4
                          py-1
                        "
                      >
                        <span
                          className="
                            flex items-center gap-2
                            text-[11px]
                            text-slate-500 dark:text-slate-400
                          "
                        >
                          <span
                            className="
                              w-2 h-2
                              rounded-sm
                              bg-indigo-500
                            "
                          />
                          Download
                        </span>

                        <span
                          className="
                            font-mono
                            text-[11px]
                            font-medium
                            text-slate-800 dark:text-slate-200
                          "
                        >
                          {formatBytes(row.rawRx)}
                        </span>
                      </div>

                      {/* Total */}
                      <div
                        className="
                          flex items-center
                          justify-between
                          gap-4
                          mt-1 pt-2
                          border-t
                          border-slate-100 dark:border-gray-800
                        "
                      >
                        <span
                          className="
                            flex items-center gap-2
                            text-[11px]
                            font-medium
                            text-slate-700 dark:text-slate-300
                          "
                        >
                          <span
                            className="
                              w-2 h-2
                              rounded-sm
                              bg-emerald-500
                            "
                          />
                          Total
                        </span>

                        <span
                          className="
                            font-mono
                            text-[11px]
                            font-semibold
                            text-emerald-600 dark:text-emerald-400
                          "
                        >
                          {formatBytes(
                            row.rawThroughput
                          )}
                        </span>
                      </div>

                      {/* Anomaly */}
                      {row.outlier !== null && (
                        <div
                          className="
                            mt-2 pt-2
                            border-t
                            border-slate-100 dark:border-gray-800
                          "
                        >
                          <p
                            className="
                              text-[9px]
                              font-medium
                              uppercase
                              tracking-wide
                              text-red-500 dark:text-red-400
                            "
                          >
                            Traffic anomaly detected
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              text-slate-500 dark:text-slate-400
                            "
                          >
                            Usage exceeds the calculated
                            traffic baseline.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              {/* -------------------------------- */}
              {/* Legend                            */}
              {/* -------------------------------- */}
              <Legend
                verticalAlign="top"
                align="right"
                height={20}
                wrapperStyle={{
                  fontSize: "10px",
                  paddingBottom: "4px",
                }}
                formatter={(value) => (
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "10px",
                      fontWeight: 500,
                    }}
                  >
                    {value}
                  </span>
                )}
              />

              {/* -------------------------------- */}
              {/* TX - Upload                      */}
              {/* -------------------------------- */}
              <Bar
                name="Upload"
                dataKey="txScaled"
                stackId="traffic"
                fill="#F59E0B"
                barSize={18}
                radius={[0, 0, 0, 0]}
              />

              {/* -------------------------------- */}
              {/* RX - Download                    */}
              {/* -------------------------------- */}
              <Bar
                name="Download"
                dataKey="rxScaled"
                stackId="traffic"
                fill="#6366F1"
                barSize={18}
                radius={[3, 3, 0, 0]}
              />

              {/* -------------------------------- */}
              {/* Total Throughput                 */}
              {/* -------------------------------- */}
              <Line
                name="Total"
                type="monotone"
                dataKey="throughputScaled"
                stroke="#10B981"
                strokeWidth={2}
                dot={{
                  r: 2.5,
                  fill: "#10B981",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 4,
                  strokeWidth: 0,
                }}
              />

              {/* -------------------------------- */}
              {/* Anomaly Markers                  */}
              {/* -------------------------------- */}
              <Scatter
                name="Spike"
                dataKey="outlier"
                fill="#EF4444"
                shape="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ----------------------------------------- */}
      {/* Footer / Data Source                      */}
      {/* ----------------------------------------- */}
      {!loading && chartData.length > 0 && (
        <div
          className="
            flex flex-col sm:flex-row
            justify-between
            items-start sm:items-center
            gap-2
            mt-2 pt-3
            border-t
            border-slate-100 dark:border-gray-800
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-wider
              text-slate-400 dark:text-slate-500
            "
          >
            Traffic accounting
          </span>

          <span
            className="
              text-[9px]
              font-mono
              text-slate-400 dark:text-slate-500
            "
          >
            RADACCT_MIRROR · {optimalUnit}
          </span>
        </div>
      )}
    </div>
  );
}
