import { HeartIcon } from "@heroicons/react/24/outline";

interface HealthMetricProps {
  label: string;
  value?: string;
  status: string;
  progress: number;
  loading: boolean;
}

function HealthMetric({ label, value, status, progress, loading }: HealthMetricProps) {
  return (
    <div className="p-4 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mt-1" />
          ) : (
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5 font-sans">
              {value ?? "—"}
            </p>
          )}
        </div>
        <span className="text-[10px] text-blue-600 dark:text-blue-400">{status}</span>
      </div>

      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-700 rounded-full"
          style={{ width: `${loading ? 0 : progress}%` }}
        />
      </div>
    </div>
  );
}

interface InfrastructureVitalsProps {
  vitals?: {
    cpu_overhead: { value: number; status: string; progress: number };
    ram_capacity: { value: string; status: string; progress: number };
    system_uptime: { value: string; status: string; progress: number };
  };
  loading: boolean;
}

export function InfrastructureVitals({ vitals, loading }: InfrastructureVitalsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <HeartIcon className="w-4 h-4 text-rose-500" />
          Infrastructure Vitals
        </h3>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded uppercase">
          System_Nominal
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        <HealthMetric
          label="CPU Overhead"
          value={vitals?.cpu_overhead?.value ? `${vitals.cpu_overhead.value}%` : undefined}
          status={vitals?.cpu_overhead?.status || "N/A"}
          progress={vitals?.cpu_overhead?.progress || 0}
          loading={loading}
        />
        <HealthMetric
          label="RAM Capacity"
          value={vitals?.ram_capacity?.value}
          status={vitals?.ram_capacity?.status || "N/A"}
          progress={vitals?.ram_capacity?.progress || 0}
          loading={loading}
        />
        <HealthMetric
          label="System Uptime"
          value={vitals?.system_uptime?.value}
          status={vitals?.system_uptime?.status || "N/A"}
          progress={vitals?.system_uptime?.progress || 0}
          loading={loading}
        />
      </div>
    </div>
  );
}