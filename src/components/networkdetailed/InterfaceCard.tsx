import React from 'react';
import { Activity, ArrowDown, ArrowUp, AlertCircle, HardDrive, Cpu } from 'lucide-react';

interface InterfaceProps {
  iface: {
    name: string;
    rx_rate: number;
    tx_rate: number;
    capacity_mbps: number;
    
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    predicted_30min: number;
    alerts: string[];
    status?: 'up' | 'down';
  };
}

const InterfaceNodeCard: React.FC<InterfaceProps> = ({ iface }) => {
  // Calculate hardware utilization percentage
  const totalUsage = iface.rx_rate + iface.tx_rate;
  const usagePercent = Math.min((totalUsage / iface.capacity_mbps) * 100, 100);

  // Industrial Theme Logic
  const getRiskTheme = (level: string) => {
    switch (level) {
      case 'critical': 
        return "border-l-red-600 bg-red-50/10 dark:bg-red-900/10 ring-1 ring-red-500/20 animate-pulse";
      case 'high': 
        return "border-l-orange-500 bg-orange-50/10 dark:bg-orange-900/10";
      case 'medium': 
        return "border-l-amber-500 bg-amber-50/10 dark:bg-amber-900/10";
      default: 
        return "border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10";
    }
  };

  const getBadgeStyles = (level: string) => {
    switch (level) {
      case 'critical': return "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]";
      case 'high': return "bg-orange-500 text-white";
      case 'medium': return "bg-amber-500 text-white";
      default: return "bg-emerald-500 text-white";
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 border-l-4 shadow-xl transition-all hover:scale-[1.02] duration-300 ${getRiskTheme(iface.risk_level)} p-5 bg-white dark:bg-gray-800`}>
      
      {/* Header: Identity & Telemetry Status */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded shadow-inner ${iface.status === 'up' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-gray-900 text-slate-400'}`}>
            <HardDrive size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic flex items-center gap-2">
              {iface.name}
              {iface.status === 'up' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />}
            </h3>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              {iface.status === 'up' ? 'ACTIVE_LINK' : 'DISCONNECTED'} // {iface.capacity_mbps} Mbps
            </p>
          </div>
        </div>
        
        <div className={`text-[8px] px-2.5 py-1 rounded font-black uppercase tracking-widest italic ${getBadgeStyles(iface.risk_level)}`}>
          {iface.risk_level}_RISK
        </div>
      </div>

      {/* Hardware Utilization Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Hardware_Load</span>
          <span className={`text-xs font-black italic ${usagePercent > 85 ? 'text-red-500' : 'text-blue-500'}`}>
            {usagePercent.toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-gray-900 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${usagePercent > 85 ? 'bg-red-500' : 'bg-blue-600'}`}
            style={{ width: `${usagePercent}%`, boxShadow: '0 0 8px rgba(37,99,235,0.3)' }}
          />
        </div>
      </div>

      {/* Throughput Matrix */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 dark:bg-gray-900/50 p-3 rounded border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
            <ArrowDown size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">RX_Rate</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black italic text-slate-900 dark:text-white leading-none">{iface.rx_rate.toFixed(2)}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase italic">Mb/s</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-gray-900/50 p-3 rounded border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 mb-1">
            <ArrowUp size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">TX_Rate</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black italic text-slate-900 dark:text-white leading-none">{iface.tx_rate.toFixed(2)}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase italic">Mb/s</span>
          </div>
        </div>
      </div>

      {/* Analytics Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-purple-500" />
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Forecast (30m)</span>
          </div>
          <span className="text-xs font-black italic text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
            {iface.predicted_30min} Mbps
          </span>
        </div>

        {iface.alerts.length > 0 && (
          <div className="flex items-start gap-2 rounded bg-red-500/10 p-2.5 border border-red-500/20 shadow-inner">
            <AlertCircle size={14} className="shrink-0 text-red-500 animate-pulse" />
            <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-tighter leading-tight italic">
              {iface.alerts.join(" // ")}
            </p>
          </div>
        )}
      </div>

      {/* Architectural Background Decor */}
      <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <Cpu size={100} />
      </div>
    </div>
  );
};

export default InterfaceNodeCard;

{/*import React from 'react';}
import React from 'react';
import { Activity, ArrowDown, ArrowUp, AlertCircle, Cpu } from 'lucide-react';

interface InterfaceProps {
  iface: {
    name: string;
    rx_rate: number;
    tx_rate: number;
    capacity_mbps: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    predicted_30min: number;
    alerts: string[];
    running: boolean;
  };
}

const InterfaceNodeCard: React.FC<InterfaceProps> = ({ iface }) => {
  // Calculate percentage of hardware capacity used
  const totalUsage = iface.rx_rate + iface.tx_rate;
  const usagePercent = Math.min((totalUsage / iface.capacity_mbps) * 100, 100);

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
      {/* Header Area 
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iface.running ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">{iface.name}</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-mono">
              {iface.capacity_mbps}BASE-T
            </p>
          </div>
        </div>
        <div className={`text-[10px] px-2 py-1 rounded-full border font-bold ${getStatusColor(iface.risk_level)}`}>
          {iface.risk_level.toUpperCase()}
        </div>
      </div>

      {/* Main Stats Gauge 
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[11px] mb-1.5 px-1">
            <span className="text-slate-400">HARDWARE LOAD</span>
            <span className="font-mono text-blue-400">{usagePercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${usagePercent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic RX/TX Grid 
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <ArrowDown size={14} />
              <span className="text-[10px] font-bold">RX</span>
            </div>
            <span className="text-xl font-mono font-bold">{iface.rx_rate.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 ml-1">Mb/s</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <ArrowUp size={14} />
              <span className="text-[10px] font-bold">TX</span>
            </div>
            <span className="text-xl font-mono font-bold">{iface.tx_rate.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 ml-1">Mb/s</span>
          </div>
        </div>
      </div>

      {/* Footer: Trend Analysis 
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-slate-500" />
          <span className="text-[11px] text-slate-500">Predicted Load (30m)</span>
        </div>
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
          {iface.predicted_30min} Mbps
        </span>
      </div>

      
      {iface.alerts.length > 0 && (
        <div className="absolute top-0 right-0 p-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <AlertCircle size={16} className="text-red-500 relative z-10" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InterfaceNodeCard;
*/}