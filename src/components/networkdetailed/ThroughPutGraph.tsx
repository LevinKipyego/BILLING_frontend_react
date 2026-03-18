import { Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { uplink_history } from '../../types/networkdetailed';
const ThroughputGraph = ({ data }: { data: uplink_history[] }) => {

  return (
    <div className="bg-white p-6 rounded-[1rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-slate-100 w-full mt-6 transition-all hover:shadow-[0_20px_50px_rgba(59,130,246,0.05)]">
      
      {/* Header with Icon and Context */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-sm">
            <Zap size={22} fill="currentColor" className="opacity-80" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Total Aggregated Load</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Uplink Stream</p>
            </div>
          </div>
        </div>
        
        {/* Latest Value Badge */}
        <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
           <span className="text-[10px] block text-slate-400 font-bold text-right uppercase">Current</span>
           <span className="text-xl font-mono font-black text-blue-600">
             {data[data.length - 1]?.total_mbps.toFixed(2)} <small className="text-xs font-bold uppercase">Mbps</small>
           </span>
        </div>
      </div>

      {/* Smooth Area Chart */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} syncId="uplinkSync" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotalBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="timestamp" 
              tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
              axisLine={false} 
              tickLine={false} 
              minTickGap={40}
            />
            <YAxis 
              tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
              axisLine={false} 
              tickLine={false} 
              unit="M"
            />
            <Tooltip 
              cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ 
                borderRadius: '18px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                padding: '12px'
              }}
              itemStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#1e40af' }}
            />
            <Area 
              type="monotone" // This makes the line smooth/curvy
              dataKey="total_mbps" 
              stroke="#3b82f6" 
              strokeWidth={3} // Thicker line for a "premium" feel
              fillOpacity={1} 
              fill="url(#colorTotalBlue)" 
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#1d4ed8' }}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThroughputGraph;