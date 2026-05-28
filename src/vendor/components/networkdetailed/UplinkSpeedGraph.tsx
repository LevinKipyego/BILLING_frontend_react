import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowDownLeft, ArrowUpRight, Activity } from 'lucide-react';
import type { uplink_history } from '../../types/networkdetailed';

/**
 * Custom Industrial Tooltip
 * Uses the 'time' field for the T-INDEX display
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 shadow-2xl rounded-lg backdrop-blur-md bg-opacity-95 ring-1 ring-white/10">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 border-b border-slate-800 pb-2">
          T-INDEX: {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
              <ArrowDownLeft size={10}/> RX_RATE
            </span>
            <span className="text-sm font-black text-white italic">
              {payload[0].value.toFixed(2)} <span className="text-[9px]">Mb/s</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight size={10}/> TX_RATE
            </span>
            <span className="text-sm font-black text-white italic">
              {payload[1].value.toFixed(2)} <span className="text-[9px]">Mb/s</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ThroughputGraph = ({ data }: { data: uplink_history[] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 w-full mt-6 transition-all duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 dark:bg-blue-600/20 rounded shadow-inner text-blue-600 dark:text-blue-400">
            <Activity size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic">Traffic Distribution</h3>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 italic">
              Uplink_Telemetry_Stream // RX_TX_SYNC
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-gray-900 rounded border border-slate-100 dark:border-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase italic">Downlink</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-gray-900 rounded border border-slate-100 dark:border-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75" />
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase italic">Uplink</span>
            </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} syncId="uplinkSync" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
                strokeDasharray="4 4" 
                vertical={false} 
                stroke="currentColor" 
                className="text-slate-200 dark:text-slate-700 opacity-30" 
            />
            
            <XAxis 
                dataKey="timestamp" // Using the 'time' property from uplink_history
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 900 }}
                className="text-slate-400 dark:text-slate-500"
                // Formatter to handle the time interval string/ISO from the data
                tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                minTickGap={60}
                dy={10}
            />
            
            <YAxis 
                tick={{ fontSize: 9, fontWeight: 900 }} 
                axisLine={false} 
                tickLine={false} 
                className="text-slate-400 dark:text-slate-500"
                unit="M" 
                dx={-5}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            
            <Area 
                type="monotone" 
                dataKey="rx_rate" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRx)" 
                animationDuration={1500}
            />
            <Area 
                type="monotone" 
                dataKey="tx_rate" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTx)" 
                animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Visual Indicator Footer */}
      <div className="mt-4 flex justify-between items-center border-t border-slate-50 dark:border-slate-700/50 pt-4">
        <div className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] italic">
          Data_Stream_Stable // Active_Monitoring
        </div>
        <div className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">
          Channel_Sync: uplinkSync
        </div>
      </div>
    </div>
  );
};

export default ThroughputGraph;