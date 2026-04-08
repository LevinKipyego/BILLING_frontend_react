{/*import GaugeComponent from "react-gauge-component";

const UplinkSpeedGauge = ({ uplink }: any) => {

  if (!uplink) return null

  const speed = uplink.rx_rate + uplink.tx_rate
  const capacity = uplink.capacity_mbps || 1000

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold">Uplink Utilization</h2>

      <GaugeComponent
        value={(speed / capacity) * 100}
        labels={{
          valueLabel: {
            formatTextValue: () =>
              `${speed.toFixed(2)} Mbps`
          }
        }}
      />

      <div className="text-sm mt-2">
        RX: {uplink.rx_rate} Mbps  
        TX: {uplink.tx_rate} Mbps
      </div>
    </div>
  )
}

export default UplinkSpeedGauge
*/}
import React from 'react';
import GaugeComponent from "react-gauge-component";
import { Zap, Activity, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const UplinkSpeedGauge = ({ uplink }: any) => {
  if (!uplink) return null;

  const speed = uplink.rx_rate + uplink.tx_rate;
  const capacity = uplink.capacity_mbps || 1000;
  const usagePercent = (speed / capacity) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300">
      
      {/* Header with Technical Stats */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Zap size={16} fill="currentColor" className="animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Link Throughput</h2>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">
              {speed.toFixed(1)}
            </span>
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase italic">Mbps</span>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <span className="bg-slate-900 text-white dark:bg-gray-900 text-[9px] font-black px-2 py-1 rounded italic tracking-widest uppercase">
            {capacity} BASE-T
          </span>
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1 italic">Rated Capacity</span>
        </div>
      </div>

      {/* The Gauge */}
      <div className="py-4 scale-110">
        <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.15,
            padding: 0.03,
            cornerRadius: 2,
            subArcs: [
              { limit: 30, color: '#10b981' }, // Emerald
              { limit: 70, color: '#f59e0b' }, // Amber
              { limit: 100, color: '#ef4444' }, // Red
            ]
          }}
          pointer={{
            type: "blob",
            color: "#64748b",
            length: 0.8,
            width: 10,
          }}
          value={usagePercent}
          labels={{
            valueLabel: { hide: true },
            tickLabels: {
              type: "outer",
              ticks: [
                { value: 0 },
                { value: 50 },
                { value: 100 }
              ]
            }
          }}
        />
      </div>

      {/* Footer Breakdown: Industrial Split */}
      <div className="grid grid-cols-2 gap-0 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-col gap-1 border-r border-slate-100 dark:border-slate-700 pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowDownCircle size={12} className="text-blue-500" />
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Download</span>
          </div>
          <span className="text-lg font-black italic text-blue-600 dark:text-blue-400 leading-none">
            {uplink.rx_rate.toFixed(2)}
            <span className="text-[10px] ml-1 uppercase">Mb/s</span>
          </span>
        </div>

        <div className="flex flex-col gap-1 pl-6">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowUpCircle size={12} className="text-emerald-500" />
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Upload</span>
          </div>
          <span className="text-lg font-black italic text-emerald-600 dark:text-emerald-500 leading-none">
            {uplink.tx_rate.toFixed(2)}
            <span className="text-[10px] ml-1 uppercase">Mb/s</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UplinkSpeedGauge;