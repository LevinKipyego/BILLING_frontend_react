import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import type { HealthHistoryItem } from "../../types/networkdetailed";

interface Props {
  history: HealthHistoryItem[];
}

// Industrial Tooltip - Pure Dark for contrast in both modes
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const timestamp = new Date(label);
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 shadow-2xl rounded-lg backdrop-blur-md bg-opacity-95 ring-1 ring-white/10">
        <div className="flex flex-col gap-1 border-b border-slate-800 pb-2 mb-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {timestamp.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
            </p>
            <p className="text-xs font-black text-blue-400 italic">
              T-INDEX: {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
        </div>
        <div className="flex items-center justify-between gap-8">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">CPU_LOAD</span>
          <span className="text-lg font-black text-blue-500 italic leading-none">
            {payload[0].value}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const HealthChart = ({ history }: Props) => {
  const peakCpu = history.length > 0 ? Math.max(...history.map(h => h.cpu)) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-lg p-6 h-[400px] flex flex-col transition-all duration-300">
      
      {/* Header with Technical Summary */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
            <Activity size={16} className="text-blue-600 animate-pulse" />
            CPU Utilization Telemetry
          </h2>
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 italic">
            Historical_Resource_Tracking // 24H_CYCLE
          </p>
        </div>
        
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Peak_Load</p>
            <div className="flex items-center justify-end gap-1.5 mt-1">
                <TrendingUp size={14} className="text-rose-600" />
                <p className="text-xl font-black text-rose-600 italic leading-none">
                  {peakCpu}<span className="text-[10px] ml-0.5">%</span>
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            {/* Grid Lines - Opacity adjusted for Dark Mode */}
            <CartesianGrid 
                strokeDasharray="4 4" 
                vertical={false} 
                stroke="currentColor" 
                className="text-slate-200 dark:text-slate-700 opacity-50" 
            />
            
            <XAxis 
              dataKey="created_at" 
              axisLine={false}
              tickLine={false}
              // tick uses currentColor to inherit from the className
              tick={{ fontSize: 10, fontWeight: 900 }}
              className="text-slate-400 dark:text-slate-500"
              tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              minTickGap={60}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900 }}
              className="text-slate-400 dark:text-slate-500"
              domain={[0, 100]}
              dx={-5}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '5 5' }} 
            />
            
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCpu)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthChart;