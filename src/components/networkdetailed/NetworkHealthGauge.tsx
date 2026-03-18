
import GaugeComponent from "react-gauge-component";
import { Activity, ShieldCheck, AlertTriangle, ZapOff } from 'lucide-react';

const NetworkHealthGauge = ({ score }: { score: number }) => {
  // Logic for dynamic content
  const getFeedback = (v: number) => {
    if (v >= 80) return { label: "Optimal", color: "#10b981", bg: "bg-emerald-50", icon: <ShieldCheck className="text-emerald-500" /> };
    if (v >= 50) return { label: "Stable", color: "#f59e0b", bg: "bg-amber-50", icon: <Activity className="text-amber-500" /> };
    if (v >= 30) return { label: "Warning", color: "#f97316", bg: "bg-orange-50", icon: <AlertTriangle className="text-orange-500" /> };
    return { label: "Critical", color: "#ef4444", bg: "bg-red-50", icon: <ZapOff className="text-red-500" /> };
  };

  const status = getFeedback(score);

  return (
    <div className="group relative w-full max-w-[280px] bg-white border border-slate-100 rounded-[1rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500">
      
      {/* Header Tag */}
      <div className="flex flex-col items-center mb-6">
        <div className={`p-3 rounded-2xl ${status.bg} mb-3 transition-colors duration-500`}>
          {status.icon}
        </div>
        <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">Network Integrity</h2>
      </div>

      {/* The Gauge: Semicircle Orientation rotated vertically-style */}
      <div className="flex justify-center py-4 scale-125">
        <GaugeComponent
          type="semicircle"
          value={score}
          arc={{
            width: 0.12,
            padding: 0.05,
            cornerRadius: 15,
            subArcs: [
              { limit: 30, color: '#ef4444' }, // Red
              { limit: 60, color: '#f59e0b' }, // Amber
              { limit: 100, color: '#10b981' } // Emerald
            ]
          }}
          pointer={{
            type: "blob",
            color: "#334155",
            length: 0.75,
            width: 12,
          }}
          labels={{
            valueLabel: {
              style: {
                fontSize: "32px",
                fill: "#1e293b",
                fontWeight: "800",
                fontFamily: "Inter, sans-serif"
              },
              formatTextValue: v => `${v}%`
            },
            tickLabels: {
              hideMinMax: true
            }
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center border-t border-slate-50 pt-6">
        <p className="text-slate-400 text-xs font-medium">Status Check</p>
        <p className={`text-xl font-black tracking-tight transition-colors duration-500`} style={{ color: status.color }}>
          {status.label}
        </p>
        
        {/* Micro-Progress Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div 
              key={dot}
              className={`h-1 rounded-full transition-all duration-700 ${
                score / 20 >= dot ? 'w-4' : 'w-1 bg-slate-100'
              }`}
              style={{ backgroundColor: score / 20 >= dot ? status.color : undefined }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkHealthGauge;