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
  // Industrial color logic
  const getStatusColor = (status: string) => 
    status.toLowerCase() === 'online' ? 'bg-emerald-500' : 'bg-rose-600';
  
  const getMetricColor = (val: number) => {
    if (val > 80) return 'text-rose-600 dark:text-rose-400';
    if (val > 60) return 'text-amber-500';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-lg overflow-hidden transition-all">
      {/* Header with Status Indicator */}
      <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-800/50">
        <h2 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
          <Activity size={16} className="text-blue-600" />
          Hardware Vitals
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${getStatusColor(health.status)}`}></span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 italic">
            {health.status}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CPU Usage */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu size={14} /> CPU Load
            </span>
            <span className={`text-sm font-black italic ${getMetricColor(health.cpu)}`}>{health.cpu}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-gray-900 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${health.cpu > 80 ? 'bg-rose-600' : 'bg-blue-600'}`} 
              style={{ width: `${health.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layers size={14} /> Memory
            </span>
            <span className={`text-sm font-black italic ${getMetricColor(health.memory)}`}>{health.memory}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 dark:bg-indigo-600 transition-all duration-700 ease-out" 
              style={{ width: `${health.memory}%` }}
            />
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 gap-4">
            {/* Latency Section */}
            <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-blue-500/50 transition-colors">
               <div className="p-2.5 bg-white dark:bg-gray-800 rounded shadow-sm text-blue-600">
                  <SignalHigh size={18} />
               </div>
               <div>
                 <p className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-black tracking-widest">Latency</p>
                 <p className="text-xl font-black text-slate-800 dark:text-white italic tracking-tighter">
                    {health.latency}<span className="text-[10px] ml-1 font-black text-slate-400 uppercase italic">ms</span>
                 </p>
               </div>
            </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-rose-500/50 transition-colors">
           <div className={`p-2.5 bg-white dark:bg-gray-800 rounded shadow-sm ${health.temperature > 60 ? 'text-rose-600' : 'text-amber-500'}`}>
              <Thermometer size={18} />
           </div>
           <div>
             <p className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-black tracking-widest">Temp</p>
             <p className="text-xl font-black text-slate-800 dark:text-white italic tracking-tighter">
                {health.temperature}<span className="text-[10px] ml-1 font-black text-slate-400 uppercase italic">°C</span>
             </p>
           </div>
        </div>

        {/* PPPoE Sessions */}
        <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-emerald-500/50 transition-colors">
           <div className="p-2.5 bg-white dark:bg-gray-800 rounded shadow-sm text-emerald-600 dark:text-emerald-500">
              <Users size={18} />
           </div>
           <div>
             <p className="text-[9px] uppercase text-slate-400 dark:text-slate-500 font-black tracking-widest">Active PPPoE</p>
             <p className="text-xl font-black text-slate-800 dark:text-white italic tracking-tighter">
                {health.pppoe_sessions}<span className="text-[10px] ml-1 font-black text-slate-400 uppercase italic">Nodes</span>
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CurrentHealthCard;