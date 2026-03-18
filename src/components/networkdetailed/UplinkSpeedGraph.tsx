
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowDownLeft, ArrowUpRight, Activity } from 'lucide-react';
import type { uplink_history } from '../../types/networkdetailed';


const ThroughputGraph = ({ data }: { data: uplink_history[] }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Traffic Distribution</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">RX vs TX Rates</p>
          </div>
        </div>
        <div className="flex gap-4 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-blue-500"><ArrowDownLeft size={14}/> RX</span>
            <span className="flex items-center gap-1 text-emerald-500"><ArrowUpRight size={14}/> TX</span>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} syncId="uplinkSync">
            <defs>
              <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="timestamp" hide />
            <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} unit="M" />
            <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Area type="monotone" dataKey="rx_rate" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRx)" />
            <Area type="monotone" dataKey="tx_rate" stroke="#10b981" strokeWidth={3} fill="url(#colorTx)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThroughputGraph;