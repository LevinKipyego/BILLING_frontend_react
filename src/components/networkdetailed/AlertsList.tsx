import { 
  AlertCircle, 
  Bell, 
  Clock, 
  Cpu, 
  Thermometer, 
  ChevronRight 
} from "lucide-react";
import type { AlertItem } from "../../types/networkdetailed";

interface Props {
  alerts: AlertItem[];
}

const AlertsList = ({ alerts }: Props) => {
  // Helper to determine severity based on values
  const getSeverity = (alert: AlertItem) => {
    if (alert.cpu > 90 || alert.temperature > 75) return "critical";
    if (alert.cpu > 70 || alert.temperature > 60) return "warning";
    return "info";
  };

  const severityStyles = {
    critical: "border-l-rose-500 bg-rose-50/30 text-rose-700 icon-rose-500",
    warning: "border-l-amber-500 bg-amber-50/30 text-amber-700 icon-amber-500",
    info: "border-l-blue-500 bg-blue-50/30 text-blue-700 icon-blue-500",
  };

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50 sticky top-0 z-10">
        <h2 className="text-slate-700 font-bold flex items-center gap-2">
          <Bell size={18} className="text-rose-500" />
          Incident Logs
        </h2>
        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {alerts.length} Total
        </span>
      </div>

      {/* Scrollable List Container */}
      <div className="overflow-y-auto custom-scrollbar">
        {alerts.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {alerts.map((a, index) => {
              const severity = getSeverity(a);
              return (
                <div 
                  key={index} 
                  className={`group flex items-start gap-4 p-4 border-l-4 transition-colors hover:bg-slate-50 ${severityStyles[severity]}`}
                >
                  <div className="mt-1">
                    <AlertCircle size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm uppercase tracking-tight">
                        {severity} Event: {a.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white/50 px-2 py-1 rounded border border-slate-100">
                        <Cpu size={12} className="text-slate-400" />
                        CPU: <span className={a.cpu > 80 ? 'text-rose-600 font-bold' : ''}>{a.cpu}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white/50 px-2 py-1 rounded border border-slate-100">
                        <Thermometer size={12} className="text-slate-400" />
                        Temp: <span className={a.temperature > 65 ? 'text-rose-600 font-bold' : ''}>{a.temperature}°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Bell size={40} className="mb-2 opacity-20" />
            <p className="text-sm">No recent incidents detected</p>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
        <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
          View All Archives
        </button>
      </div>
    </div>
  );
};

export default AlertsList;