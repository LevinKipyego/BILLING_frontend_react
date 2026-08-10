import { useEffect, useState } from "react";
import { 
  TicketIcon, 
  CpuChipIcon, 
  UsersIcon, 
  BanknotesIcon,
  HeartIcon,
  SignalIcon,
  ArrowUpRightIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { DotIcon } from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { BaseUrl } from "../../../BaseUrl";

// --- Types ---
interface TelemetryData {
  stats: {
    active_plans: { value: number; trend: string };
    mikrotik_nodes: { value: number; status: string };
    active_users: { value: number; trend: string };
    daily_revenue: { value: number; currency: string };
  };
  traffic_throughput: Array<{ name: string; usage: number }>;
  plan_market_share: Array<{ name: string; value: number }>;
  infrastructure_vitals: {
    cpu_overhead: { value: number; status: string; progress: number };
    ram_capacity: { value: string; status: string; progress: number };
    system_uptime: { value: string; status: string; progress: number };
  };
}

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'];

export default function DashboardHome() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${BaseUrl}/api/dashboard/telemetry/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load telemetry data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const totalMarketUnits = data?.plan_market_share?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-4 sm:px-4 md:px-6 space-y-6 animate-fadeIn dark:bg-gray-900  min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            System Intelligence
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            Global network performance and revenue telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTelemetry}
            title="Refresh Telemetry"
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Telemetry Sync</p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1">
              {loading ? "FETCHING..." : "LIVE"}
              <DotIcon className={`w-3 h-3 ${loading ? 'animate-ping' : 'text-emerald-500'}`} /> 
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-3.5 rounded-md border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 text-xs">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchTelemetry} className="underline font-semibold hover:text-rose-900 dark:hover:text-rose-100">
            Retry
          </button>
        </div>
      )}

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="Active Plans" 
          value={data?.stats?.active_plans?.value} 
          icon={TicketIcon} 
          trend={data?.stats?.active_plans?.trend || "0"} 
          loading={loading}
        />
        <StatCard 
          title="MikroTik Nodes" 
          value={data?.stats?.mikrotik_nodes?.value} 
          icon={CpuChipIcon} 
          trend={data?.stats?.mikrotik_nodes?.status || "OFFLINE"} 
          loading={loading}
        />
        <StatCard 
          title="Active Users" 
          value={data?.stats?.active_users?.value?.toLocaleString()} 
          icon={UsersIcon} 
          trend={data?.stats?.active_users?.trend || "0%"} 
          loading={loading}
        />
        <StatCard 
          title="Daily Revenue" 
          value={data?.stats?.daily_revenue?.value ? `${data.stats.daily_revenue.value.toLocaleString()} ${data.stats.daily_revenue.currency}` : undefined} 
          icon={BanknotesIcon} 
          trend={data?.stats?.daily_revenue?.currency || "KES"} 
          loading={loading}
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Analytics: Data Usage */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <SignalIcon className="w-4 h-4 text-blue-600" />
              Traffic Throughput (GB)
            </h3>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400">
              ISO_WEEK_STATS
            </span>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.traffic_throughput || []}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.15} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#64748B'}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#64748B'}} 
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px'}}
                    itemStyle={{color: '#38bdf8'}}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Distribution: Plan Popularity */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Plan Market Share
            </h3>

            <div className="h-52 relative">
              {loading ? (
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-full max-w-[200px] mx-auto" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={data?.plan_market_share || []} 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={4} 
                        dataKey="value"
                      >
                        {(data?.plan_market_share || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">Total</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-0.5">
                      {totalMarketUnits.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              (data?.plan_market_share || []).map((item, i) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[130px] sm:max-w-[180px]">
                      {item.name}
                    </span>
                  </span>
                  <span className="font-sans text-slate-900 dark:text-slate-200">{item.value} USERS</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Hardware Health Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <HeartIcon className="w-4 h-4 text-rose-500" />
            Infrastructure Vitals
          </h3>
          <span className="text-[10px]  text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded uppercase">
            System_Nominal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          <HealthMetric 
            label="CPU Overhead" 
            value={data?.infrastructure_vitals?.cpu_overhead?.value ? `${data.infrastructure_vitals.cpu_overhead.value}%` : undefined} 
            status={data?.infrastructure_vitals?.cpu_overhead?.status || "N/A"} 
            progress={data?.infrastructure_vitals?.cpu_overhead?.progress || 0} 
            loading={loading}
          />
          <HealthMetric 
            label="RAM Capacity" 
            value={data?.infrastructure_vitals?.ram_capacity?.value} 
            status={data?.infrastructure_vitals?.ram_capacity?.status || "N/A"} 
            progress={data?.infrastructure_vitals?.ram_capacity?.progress || 0} 
            loading={loading}
          />
          <HealthMetric 
            label="System Uptime" 
            value={data?.infrastructure_vitals?.system_uptime?.value} 
            status={data?.infrastructure_vitals?.system_uptime?.status || "N/A"} 
            progress={data?.infrastructure_vitals?.system_uptime?.progress || 0} 
            loading={loading}
          />
        </div>
      </div>

    </div>
  );
}

// --- Sub-components with GitHub-Style Minimal Outlines ---

const StatCard = ({ title, value, icon: Icon, trend, loading }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors">
    <div className="flex justify-between items-start">
      <div className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-1.5 py-0.5 rounded">
          {trend}
        </span>
        <ArrowUpRightIcon className="w-3 h-3 text-slate-400" />
      </div>
    </div>
    
    <div className="mt-4">
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
      {loading ? (
        <div className="h-7 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mt-1" />
      ) : (
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight ">
          {value ?? "—"}
        </p>
      )}
    </div>
  </div>
);

const HealthMetric = ({ label, value, status, progress, loading }: any) => (
  <div className="p-4 transition-colors">
    <div className="flex items-center justify-between mb-3">
      <div>
        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        {loading ? (
          <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5 font-sans">{value ?? "—"}</p>
        )}
      </div>
      <span className="text-[10px]  text-blue-600 dark:text-blue-400">{status}</span>
    </div>

    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-600 transition-all duration-700 rounded-full" 
        style={{ width: `${loading ? 0 : progress}%` }}
      />
    </div>
  </div>
);