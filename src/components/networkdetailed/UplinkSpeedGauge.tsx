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
import { Zap, Activity } from 'lucide-react';

const UplinkSpeedGauge = ({ uplink }: any) => {
  if (!uplink) return null;

  const speed = uplink.rx_rate + uplink.tx_rate;
  const capacity = uplink.capacity_mbps || 1000;
  const usagePercent = (speed / capacity) * 100;

  return (
    <div className="bg-slate-150 text-slate-700 p-6 rounded-2xl shadow-xl border border-slate-200">
      {/* Header with Stats */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Zap size={16} fill="currentColor" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Uplink Rates</h2>
          </div>
          <div className="text-3xl font-mono font-black">
            <span>{speed.toFixed(2)} </span>
            <span className="text-sm text-slate-500 ml-1 italic">Mbps</span>
            
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-700">{capacity} BASE-T</span> 
          <span className="text-[10px] text-slate-500 block"></span>
          
        </div>
      </div>

      {/* The Gauge: Horizontal Orientation */}
      <div className="py-2">
        <GaugeComponent
          type="semicircle" // You can also use "radial" but semicircle fits better in narrow cards
          arc={{
            width: 0.2,
            padding: 0.02,
            cornerRadius: 1,
            subArcs: [
              { limit: 30, color: '#10b981', showTick: true }, // Emerald
              { limit: 60, color: '#f59e0b', showTick: true }, // Amber
              { limit: 100, color: '#ef4444', showTick: true }, // Red
            ]
          }}
          pointer={{
            type: "blob",
            color: "#3b82f6",
            length: 0.8,
            width: 15,
          }}
          value={usagePercent}
          labels={{
            valueLabel: { hide: true }, // We already show the value in the header
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

      {/* Footer Breakdown */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 font-bold uppercase">Download (RX)</span>
          <span className="text-sm font-semibold text-blue-400">{uplink.rx_rate.toFixed(2)} Mbps</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-4">
          <span className="text-[9px] text-slate-500 font-bold uppercase">Upload (TX)</span>
          <span className="text-sm font-semibold text-emerald-400">{uplink.tx_rate.toFixed(2)} Mbps</span>
        </div>
      </div>
    </div>
  );
};

export default UplinkSpeedGauge;