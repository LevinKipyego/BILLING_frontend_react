import { Activity, ArrowDown, ArrowUp, AlertCircle, HardDrive } from 'lucide-react'; // Using Lucide for visual cues

const InterfaceCard = ({ iface }: any) => {
  const riskStyles = {
    low: "border-l-green-500 bg-green-50/30",
    medium: "border-l-yellow-500 bg-yellow-50/30",
    high: "border-l-orange-500 bg-orange-50/30",
    critical: "border-l-red-500 bg-red-50/40 animate-pulse"
  };

  const currentStyle = riskStyles[iface.risk_level as keyof typeof riskStyles] || riskStyles.low;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 border-l-4 shadow-sm transition-all hover:shadow-md ${currentStyle} p-4`}>
    
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <HardDrive size={18} className="text-slate-500" />
            {iface.name}
          </h3>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {iface.status == 'up' ? "● Active" : "○ Disconnected"} • {iface.capacity_mbps} Mbps Cap
          </span>
        </div>
        
       
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${iface.risk_level === 'critical' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
          {iface.risk_level} Risk
        </div>
      </div>

      {/* Traffic Grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <ArrowDown size={12} className="text-blue-500" /> DOWNLOAD
          </span>
          <span className="text-sm font-semibold text-slate-700">{iface.rx_rate.toFixed(2)} <small>Mbps</small></span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <ArrowUp size={12} className="text-green-500" /> UPLOAD
          </span>
          <span className="text-sm font-semibold text-slate-700">{iface.tx_rate.toFixed(2)} <small>Mbps</small></span>
        </div>
      </div>

     
      <div className="mt-4 flex items-center justify-between bg-white/50 rounded-lg p-2 border border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Activity size={14} className="text-purple-500" />
          <span>Forecast (30m):</span>
        </div>
        <span className="text-xs font-bold text-purple-700">{iface.predicted_30min} Mbps</span>
      </div>

     
      {iface.alerts.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-md bg-red-50 p-2 text-xs text-red-700 border border-red-100">
          <AlertCircle size={14} className="shrink-0" />
          <p className="leading-tight">{iface.alerts.join(" • ")}</p>
        </div>
      )}
    </div>
  );
};

export default InterfaceCard;

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