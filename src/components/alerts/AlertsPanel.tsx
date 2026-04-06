// src/components/alerts/AlertsPanel.tsx
import { 
  ExclamationTriangleIcon, 
  BellIcon, 
  CheckCircleIcon,
  CpuChipIcon,
  FireIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import type { Alert } from "../../types/network"; 

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/5 rounded-md shadow-xl overflow-hidden transition-all duration-500">
      {/* PANEL HEADER */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-gray-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Alerts</h3>
        </div>
        {alerts.length > 0 && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        )}
      </div>

      <div className="p-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon className="w-10 h-10 text-emerald-500/20 mb-2" />
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">System Clear</p>
            <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase italic">No active anomalies detected</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert, index) => {
              const isCritical = alert.severity === "critical" || alert.status === "down";
              
              return (
                <li
                  key={`${alert.routerId}-${index}`}
                  className={`relative overflow-hidden rounded-md border p-3 transition-all ${
                    isCritical 
                    ? "bg-rose-50/50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20" 
                    : "bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/20"
                  }`}
                >
                  {/* Status Indicator Sidebar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} />

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className={`w-4 h-4 ${isCritical ? 'text-rose-500' : 'text-amber-500'}`} />
                      <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                        {alert.routerName}
                      </span>
                    </div>
                    {alert.status === "down" && (
                      <span className="text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded animate-pulse">
                        OFFLINE
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <CpuChipIcon className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        CPU: <span className={alert.cpu > 85 ? "text-rose-500 font-black" : "text-slate-900 dark:text-slate-200"}>{alert.cpu}%</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FireIcon className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        TEMP: <span className={alert.temperature > 70 ? "text-rose-500 font-black" : "text-slate-900 dark:text-slate-200"}>{alert.temperature}°C</span>
                      </span>
                    </div>
                  </div>

                  {alert.status === "down" && (
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase italic">
                      <NoSymbolIcon className="w-3 h-3" />
                      Link Failure Detected
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* FOOTER HINT */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-gray-900/50 border-t border-slate-100 dark:border-white/5">
        <p className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
          Telemetry synced via WebSocket 
        </p>
      </div>
    </div>
  );
}