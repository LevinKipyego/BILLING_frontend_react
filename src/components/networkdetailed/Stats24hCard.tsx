import { 
  BarChart3, 
  Clock, 
  Activity, 
  AlertTriangle,
  History,
  TrendingUp,
  Thermometer
} from "lucide-react";
import type { Stats24h } from "../../types/networkdetailed";

interface Props {
  stats: Stats24h;
}

const Stats24hCard = ({ stats }: Props) => {
  // Helper to determine reliability color based on the industrial palette
  const getReliabilityColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-emerald-500 dark:text-emerald-400";
    if (uptime >= 95) return "text-amber-500";
    return "text-rose-600 dark:text-rose-400";
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-lg overflow-hidden h-full transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-800/50">
        <h2 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
          <History size={16} className="text-blue-600" />
          24H Performance Telemetry
        </h2>
        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-gray-900 border border-slate-100 dark:border-slate-700 px-3 py-1 rounded italic shadow-sm">
          Rolling_Window
        </span>
      </div>

      <div className="p-6">
        {/* Top Row: Averages & Reliability */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border border-slate-50 dark:border-slate-700 rounded-lg bg-slate-50/30 dark:bg-gray-900/30">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Reliability</p>
            <p className={`text-2xl font-black italic tracking-tighter ${getReliabilityColor(stats.uptime_percent)}`}>
              {stats.uptime_percent}%
            </p>
          </div>
          <div className="p-4 border border-slate-50 dark:border-slate-700 rounded-lg bg-slate-50/30 dark:bg-gray-900/30">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
              <TrendingUp size={10} /> AVG_CPU
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tighter">{stats.avg_cpu}%</p>
          </div>
          <div className="p-4 border border-slate-50 dark:border-slate-700 rounded-lg bg-slate-50/30 dark:bg-gray-900/30">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
              <Activity size={10} /> LATENCY
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tighter">
              {stats.avg_latency}<span className="text-[10px] font-black text-slate-400 uppercase ml-1 italic">ms</span>
            </p>
          </div>
          <div className="p-4 border border-slate-50 dark:border-slate-700 rounded-lg bg-slate-50/30 dark:bg-gray-900/30">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
               <Thermometer size={10} /> MAX_TEMP
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white italic tracking-tighter">
              {stats.max_temperature ?? "0"} <span className="text-[10px] font-black text-slate-400 uppercase italic">°C</span>
            </p>
          </div>
        </div>

        {/* Bottom Section: Downtime Analysis */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-50 dark:bg-slate-700" />
            <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <AlertTriangle size={12} className="text-rose-500" /> 
              Outage Analytics
            </h3>
            <div className="h-px flex-1 bg-slate-50 dark:bg-slate-700" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total 24h Down */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100/50 dark:border-rose-900/20 group hover:border-rose-500 transition-colors">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded shadow-sm text-rose-600">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-rose-900 dark:text-rose-400 uppercase tracking-widest">Total Outage</p>
                <p className="text-sm font-black text-rose-700 dark:text-rose-300 italic">{stats.total_down_minutes_24h} MINS</p>
              </div>
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-gray-900/50 border border-slate-100 dark:border-slate-700 group hover:border-blue-500 transition-colors">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded shadow-sm text-blue-600 dark:text-blue-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Down</p>
                <p className="text-sm font-black text-slate-800 dark:text-white italic uppercase tracking-tight">
                  {stats.current_down_minutes > 0 ? `${stats.current_down_minutes} MIN` : "NOMINAL"}
                </p>
              </div>
            </div>

            {/* Last Incident */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-gray-900/50 border border-slate-100 dark:border-slate-700 group hover:border-indigo-500 transition-colors">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded shadow-sm text-indigo-600 dark:text-indigo-400">
                <History size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Last Incident</p>
                <p className="text-sm font-black text-slate-800 dark:text-white italic uppercase tracking-tight">
                  {stats.last_down_minutes} MIN AGO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats24hCard;