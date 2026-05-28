import { Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { uplink_history } from '../../types/networkdetailed';

// Custom Industrial Tooltip for Aggregated Load
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 shadow-2xl rounded-lg backdrop-blur-md bg-opacity-95 ring-1 ring-white/10">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 border-b border-slate-800 pb-2">
          T-INDEX: {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <div className="flex items-center justify-between gap-8">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AGG_LOAD</span>
          <span className="text-sm font-black text-white italic">
            {payload[0].value.toFixed(2)} <span className="text-[9px]">Mb/s</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const AggregatedLoadGraph = ({ data }: { data: uplink_history[] }) => {
  const latestValue = data.length > 0 ? data[data.length - 1].total_mbps : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 w-full mt-6 transition-all duration-300">
      
      {/* Header with Icon and Context */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner">
            <Zap size={22} fill="currentColor" className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic">Total Aggregated Load</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Live_Uplink_Telemetry</p>
            </div>
          </div>
        </div>
        
        {/* Latest Value Badge */}
        <div className="bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-slate-700 px-5 py-2 rounded-lg text-right">
           <span className="text-[9px] block text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">Current_Throughput</span>
           <span className="text-2xl font-black italic text-blue-600 dark:text-blue-400 leading-tight">
             {latestValue.toFixed(2)} <small className="text-[10px] font-black uppercase not-italic ml-1">Mb/s</small>
           </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} syncId="uplinkSync" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotalBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
                strokeDasharray="4 4" 
                vertical={false} 
                stroke="currentColor" 
                className="text-slate-200 dark:text-slate-700 opacity-30" 
            />
            
            <XAxis 
              dataKey="timestamp" // Specifically using 'time' from uplink_history
              tick={{ fontSize: 9, fontWeight: 900 }} 
              className="text-slate-400 dark:text-slate-500"
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              minTickGap={60}
              dy={10}
            />
            
            <YAxis 
              tick={{ fontSize: 9, fontWeight: 900 }} 
              className="text-slate-400 dark:text-slate-500"
              axisLine={false} 
              tickLine={false} 
              unit="M"
              dx={-5}
            />
            
            <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="total_mbps" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorTotalBlue)" 
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: '#3b82f6', fill: '#fff' }}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Visual Footer */}
      <div className="mt-4 flex justify-between items-center border-t border-slate-50 dark:border-slate-700/50 pt-4">
        <div className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] italic">
          Aggregated_Node_Load // Sync_Status: Active
        </div>
      </div>
    </div>
  );
};

export default AggregatedLoadGraph;