import { 
  AlertCircle, 
  Bell, 
  Clock, 
  Cpu, 
  Thermometer, 
  ChevronRight,
  Calendar
} from "lucide-react";
import type { AlertItem } from "../../types/networkdetailed";

interface Props {
  alerts: AlertItem[];
}

const AlertsList = ({ alerts }: Props) => {
  // Logic for industrial severity classification
  const getSeverity = (alert: AlertItem) => {
    if (alert.cpu > 90 || alert.temperature > 75) return "critical";
    if (alert.cpu > 70 || alert.temperature > 60) return "warning";
    return "info";
  };

  const severityStyles = {
    critical: "border-l-rose-600 bg-rose-50/20 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400",
    warning: "border-l-amber-500 bg-amber-50/20 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400",
    info: "border-l-blue-600 bg-blue-50/20 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-lg overflow-hidden flex flex-col h-[450px] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-800/50 sticky top-0 z-10">
        <h2 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
          <Bell size={16} className="text-rose-600 animate-pulse" />
          Incident Logs
        </h2>
        <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded italic uppercase tracking-widest">
          {alerts.length} Total_Events
        </span>
      </div>

      {/* Scrollable List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800">
        {alerts.length > 0 ? (
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {alerts.map((a, index) => {
              const severity = getSeverity(a);
              const alertDate = new Date(a.created_at);
              
              return (
                <div 
                  key={index} 
                  className={`group flex items-start gap-4 p-5 border-l-[6px] transition-all hover:bg-slate-50 dark:hover:bg-gray-900/40 ${severityStyles[severity]}`}
                >
                  <div className="mt-1">
                    <AlertCircle size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <span className="font-black text-xs uppercase tracking-tighter italic">
                        {severity} :: {a.status}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black flex items-center gap-1 uppercase italic tracking-tighter">
                          <Calendar size={10} />
                          {alertDate.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black flex items-center gap-1 uppercase italic tracking-tighter">
                          <Clock size={10} />
                          {alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-gray-900/60 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-700 italic uppercase">
                        <Cpu size={12} className="text-slate-400" />
                        CPU: <span className={a.cpu > 80 ? 'text-rose-600 dark:text-rose-400 underline underline-offset-2' : ''}>{a.cpu}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-gray-900/60 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-700 italic uppercase">
                        <Thermometer size={12} className="text-slate-400" />
                        Temp: <span className={a.temperature > 65 ? 'text-rose-600 dark:text-rose-400 underline underline-offset-2' : ''}>{a.temperature}°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-center translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
            <div className="p-4 bg-slate-50 dark:bg-gray-900 rounded-full mb-4">
               <Bell size={32} className="opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">No active incidents detected.</p>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="p-4 bg-slate-50/80 dark:bg-gray-800/80 border-t border-slate-100 dark:border-slate-700 text-center">
        <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-[0.2em] italic">
          Access Historic Logs Archive
        </button>
      </div>
    </div>
  );
};

export default AlertsList;