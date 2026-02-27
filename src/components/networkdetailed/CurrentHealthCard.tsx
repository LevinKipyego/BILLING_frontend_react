import { 
  Cpu, 
  Layers, 
  Activity, 
  Thermometer, 
  Users, 
  SignalHigh 
} from "lucide-react";
import type { CurrentHealth } from "../../types/networkdetailed";

interface Props {
  health: CurrentHealth;
}

const CurrentHealthCard = ({ health }: Props) => {
  // Logic for color differentiation based on health values
  const getStatusColor = (status: string) => 
    status.toLowerCase() === 'online' ? 'bg-emerald-500' : 'bg-rose-500';
  
  const getMetricColor = (val: number) => {
    if (val > 80) return 'text-rose-600';
    if (val > 60) return 'text-amber-500';
    return 'text-emerald-600';
  };

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
      {/* Header with Status Indicator */}
      <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50">
        <h2 className="text-slate-700 font-bold flex items-center gap-2">
          <Activity size={18} className="text-indigo-600" />
          System Health
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
          <span className={`h-2 w-2 rounded-full animate-pulse ${getStatusColor(health.status)}`}></span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
            {health.status}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CPU Usage */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Cpu size={14} /> CPU Load
            </span>
            <span className={`font-bold ${getMetricColor(health.cpu)}`}>{health.cpu}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${health.cpu > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
              style={{ width: `${health.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Layers size={14} /> Memory
            </span>
            <span className={`font-bold ${getMetricColor(health.memory)}`}>{health.memory}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-500" 
              style={{ width: `${health.memory}%` }}
            />
          </div>
        </div>

        {/* Latency Section */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
              <SignalHigh size={20} />
           </div>
           <div>
             <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Latency</p>
             <p className="text-lg font-semibold text-slate-700">{health.latency}<span className="text-xs ml-0.5 font-normal text-slate-400">ms</span></p>
           </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <div className={`p-2 bg-white rounded-lg shadow-sm ${health.temperature > 60 ? 'text-rose-500' : 'text-amber-500'}`}>
              <Thermometer size={20} />
           </div>
           <div>
             <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Temperature</p>
             <p className="text-lg font-semibold text-slate-700">{health.temperature}°C</p>
           </div>
        </div>

        {/* PPPoE Sessions */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
              <Users size={20} />
           </div>
           <div>
             <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Active PPPoE</p>
             <p className="text-lg font-semibold text-slate-700">{health.pppoe_sessions}</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CurrentHealthCard;