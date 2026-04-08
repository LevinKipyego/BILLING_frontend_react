import GaugeComponent from "react-gauge-component";
import { Activity, ShieldCheck, AlertTriangle, ZapOff } from 'lucide-react';

const NetworkHealthGauge = ({ score }: { score: number }) => {
  // Industrial Logic for dynamic content
  const getFeedback = (v: number) => {
    if (v >= 80) return { 
        label: "OPTIMAL", 
        color: "#10b981", 
        bg: "bg-emerald-50 dark:bg-emerald-900/20", 
        icon: <ShieldCheck className="text-emerald-500" />,
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    };
    if (v >= 50) return { 
        label: "STABLE", 
        color: "#f59e0b", 
        bg: "bg-amber-50 dark:bg-amber-900/20", 
        icon: <Activity className="text-amber-500" />,
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]"
    };
    if (v >= 30) return { 
        label: "WARNING", 
        color: "#f97316", 
        bg: "bg-orange-50 dark:bg-orange-900/20", 
        icon: <AlertTriangle className="text-orange-500" />,
        glow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]"
    };
    return { 
        label: "CRITICAL", 
        color: "#ef4444", 
        bg: "bg-red-50 dark:bg-red-900/20", 
        icon: <ZapOff className="text-red-500" />,
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]"
    };
  };

  const status = getFeedback(score);

  return (
    <div className="group relative w-full max-w-[280px] bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-lg p-8 shadow-xl transition-all duration-500">
      
      {/* Header Tag */}
      <div className="flex flex-col items-center mb-6">
        <div className={`p-4 rounded-xl ${status.bg} ${status.glow} mb-4 transition-all duration-500`}>
          {status.icon}
        </div>
        <h2 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Network Integrity</h2>
      </div>

      {/* The Gauge */}
      <div className="flex justify-center py-4 scale-110">
        <GaugeComponent
          type="semicircle"
          value={score}
          arc={{
            width: 0.15,
            padding: 0.05,
            cornerRadius: 2, // Squarer, industrial corners
            subArcs: [
              { limit: 30, color: '#ef4444' }, 
              { limit: 60, color: '#f59e0b' }, 
              { limit: 100, color: '#10b981' }
            ]
          }}
          pointer={{
            type: "blob",
            color: "#64748b", // Slate pointer
            length: 0.8,
            width: 10,
          }}
          labels={{
            valueLabel: {
              style: {
                fontSize: "36px",
                fill: "#1e293b", // Slate-900 for dark mode support
                fontWeight: "900",
                fontFamily: "inherit",
                font:"dark:bg-white"

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
      <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-700 pt-6">
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Telemetry Status</p>
        <p className={`text-2xl font-black italic tracking-tighter transition-colors duration-500`} style={{ color: status.color }}>
          {status.label}
        </p>
        
        {/* LED-Style Micro-Progress Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div 
              key={dot}
              className={`h-1.5 rounded-sm transition-all duration-700 ${
                score / 20 >= dot 
                  ? 'w-6 shadow-[0_0_8px_rgba(currentColor)]' 
                  : 'w-2 bg-slate-100 dark:bg-gray-700'
              }`}
              style={{ 
                backgroundColor: score / 20 >= dot ? status.color : undefined,
                boxShadow: score / 20 >= dot ? `0 0 10px ${status.color}66` : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkHealthGauge;