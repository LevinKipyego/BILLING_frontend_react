import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import type { HealthHistoryItem } from "../../types/networkdetailed";

interface Props {
  history: HealthHistoryItem[];
}

// Custom Tooltip for a polished look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
          {new Date(label).toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <p className="text-sm font-bold text-slate-700">
            CPU Usage: <span className="text-indigo-600">{payload[0].value}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const HealthChart = ({ history }: Props) => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 h-96 flex flex-col">
      {/* Header with Stats Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-700 font-bold flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            CPU Utilization Trend
          </h2>
          <p className="text-xs text-slate-400">Real-time resource tracking (24h)</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Peak</p>
            <p className="text-sm font-bold text-rose-500">
              {Math.max(...history.map(h => h.cpu))}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="created_at" 
              hide={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              minTickGap={50}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCpu)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthChart;