
import { HeartIcon } from "@heroicons/react/24/outline";

interface HealthMetricProps {
  label: string;
  value?: string;
  status: string;
  progress: number;
  loading: boolean;
}

function HealthMetric({
  label,
  value,
  status,
  progress,
  loading,
}: HealthMetricProps) {
  return (
    <div
      className="
        p-4 sm:p-5
        transition-colors
      "
    >
      {/* ----------------------------------------- */}
      {/* Metric Header                             */}
      {/* ----------------------------------------- */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p
            className="
              text-[9px] sm:text-[10px]
              font-medium
              text-slate-400 dark:text-slate-500
              uppercase
              tracking-[0.07em]
            "
          >
            {label}
          </p>

          {loading ? (
            <div
              className="
                h-6
                w-24
                bg-slate-100 dark:bg-gray-800
                animate-pulse
                rounded
                mt-1.5
              "
            />
          ) : (
            <p
              className="
                text-xl
                sm:text-2xl
                font-semibold
               
                text-slate-900 dark:text-white
                mt-1
                tracking-tight
              "
            >
              {value ?? "—"}
            </p>
          )}
        </div>

        {!loading && (
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-wide
              text-emerald-600 dark:text-emerald-400
              whitespace-nowrap
            "
          >
            {status}
          </span>
        )}
      </div>

      {/* ----------------------------------------- */}
      {/* Progress                                  */}
      {/* ----------------------------------------- */}
      <div
        className="
          w-full
          h-1.5
          bg-slate-100 dark:bg-gray-800
          rounded-full
          overflow-hidden
        "
      >
        <div
          className="
            h-full
            bg-emerald-500
            transition-all
            duration-700
            rounded-full
          "
          style={{
            width: `${loading ? 0 : Math.min(Math.max(progress, 0), 100)}%`,
          }}
        />
      </div>

      {/* ----------------------------------------- */}
      {/* Progress Metadata                         */}
      {/* ----------------------------------------- */}
      {!loading && (
        <div className="flex justify-between items-center mt-1.5">
          <span
            className="
              text-[9px]
              text-slate-400 dark:text-slate-500
            "
          >
            Health index
          </span>

          <span
            className="
              text-[9px]
              
              text-slate-400 dark:text-slate-500
            "
          >
            {Math.min(Math.max(progress, 0), 100)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface InfrastructureVitalsProps {
  vitals?: {
    cpu_overhead: {
      value: number;
      status: string;
      progress: number;
    };
    ram_capacity: {
      value: string;
      status: string;
      progress: number;
    };
    system_uptime: {
      value: string;
      status: string;
      progress: number;
    };
  };
  loading: boolean;
}

export function InfrastructureVitals({
  vitals,
  loading,
}: InfrastructureVitalsProps) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-lg
        border border-slate-200 dark:border-gray-700
        overflow-hidden
        shadow-sm
        transition-colors
      "
    >
      {/* ----------------------------------------- */}
      {/* Header                                    */}
      {/* ----------------------------------------- */}
      <div
        className="
          p-4 sm:p-5
          border-b
          border-slate-200 dark:border-gray-700
          flex
          flex-col sm:flex-row
          justify-between
          items-start sm:items-center
          gap-2
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex items-center justify-center
              h-7 w-7
              rounded-lg
              bg-rose-50 dark:bg-rose-950/20
              border border-rose-100 dark:border-rose-900/40
            "
          >
            <HeartIcon
              className="
                h-4 w-4
                text-rose-500 dark:text-rose-400
              "
            />
          </div>

          <div>
            <h3
              className="
                text-sm sm:text-base
                font-medium
                text-slate-900 dark:text-white
              "
            >
              Infrastructure Vitals
            </h3>

            <p
              className="
                text-[11px]
                text-slate-500 dark:text-slate-400
                mt-0.5
              "
            >
              Current system resource and availability health.
            </p>
          </div>
        </div>

        {/* System Status */}
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            px-2
            py-1
            rounded
            border
            border-emerald-200 dark:border-emerald-900/50
            bg-emerald-50 dark:bg-emerald-950/30
            text-[9px]
            font-medium
            font-mono
            uppercase
            tracking-wide
            text-emerald-600 dark:text-emerald-400
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
            "
          />

          System Nominal
        </span>
      </div>

      {/* ----------------------------------------- */}
      {/* Metrics                                   */}
      {/* ----------------------------------------- */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          divide-y
          md:divide-y-0
          md:divide-x
          divide-slate-200 dark:divide-gray-700
        "
      >
        {/* CPU */}
        <HealthMetric
          label="CPU Overhead"
          value={
            vitals?.cpu_overhead?.value !== undefined
              ? `${vitals.cpu_overhead.value}%`
              : undefined
          }
          status={
            vitals?.cpu_overhead?.status || "N/A"
          }
          progress={
            vitals?.cpu_overhead?.progress || 0
          }
          loading={loading}
        />

        {/* RAM */}
        <HealthMetric
          label="RAM Capacity"
          value={vitals?.ram_capacity?.value}
          status={
            vitals?.ram_capacity?.status || "N/A"
          }
          progress={
            vitals?.ram_capacity?.progress || 0
          }
          loading={loading}
        />

        {/* Uptime */}
        <HealthMetric
          label="System Uptime"
          value={vitals?.system_uptime?.value}
          status={
            vitals?.system_uptime?.status || "N/A"
          }
          progress={
            vitals?.system_uptime?.progress || 0
          }
          loading={loading}
        />
      </div>
    </div>
  );
}
