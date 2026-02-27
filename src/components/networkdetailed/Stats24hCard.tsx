import { 
  BarChart3, 
  Clock, 
  //ThermometerHigh, 
  Activity, 
  AlertTriangle,
  History,
  TrendingUp 
} from "lucide-react";
import type { Stats24h } from "../../types/networkdetailed";

interface Props {
  stats: Stats24h;
}

const Stats24hCard = ({ stats }: Props) => {
  // Helper to determine reliability color
  const getReliabilityColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-emerald-500";
    if (uptime >= 95) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50">
        <h2 className="text-slate-700 font-bold flex items-center gap-2">
          <History size={18} className="text-blue-600" />
          24h Performance Summary
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
          Rolling Window
        </span>
      </div>

      <div className="p-5">
        {/* Top Row: Averages & Reliability */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium mb-1">Uptime Score</p>
            <p className={`text-2xl font-bold ${getReliabilityColor(stats.uptime_percent)}`}>
              {stats.uptime_percent}%
            </p>
          </div>
          <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
              <TrendingUp size={12} /> Avg CPU
            </p>
            <p className="text-2xl font-bold text-slate-700">{stats.avg_cpu}%</p>
          </div>
          <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
              <Activity size={12} /> Avg Latency
            </p>
            <p className="text-2xl font-bold text-slate-700">{stats.avg_latency}<span className="text-sm font-normal text-slate-400 ml-1">ms</span></p>
          </div>
          <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
               Max Temp
            </p>
            <p className="text-2xl font-bold text-slate-700">{stats.max_temperature ?? "N/A"}°</p>
          </div>
        </div>

        {/* Bottom Section: Downtime Analysis */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
            <AlertTriangle size={14} className="text-rose-500" /> 
            Downtime Incident Report
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Total 24h Down */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-rose-600 shadow-sm">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-rose-900">Total Outage</p>
                  <p className="text-sm text-rose-700">{stats.total_down_minutes_24h} minutes</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-slate-600 shadow-sm">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Current Down</p>
                  <p className="text-sm text-slate-700">
                    {stats.current_down_minutes > 0 ? `${stats.current_down_minutes} min` : "None (Stable)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Last Incident */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-slate-600 shadow-sm">
                  <History size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Last Incident</p>
                  <p className="text-sm text-slate-700">{stats.last_down_minutes} min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats24hCard;