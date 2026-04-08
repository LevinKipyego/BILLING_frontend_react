import { 
  TicketIcon, 
  CpuChipIcon, 
  UsersIcon, 
  BanknotesIcon,
  HeartIcon,
  CircleStackIcon,
  SignalIcon,
  ArrowPathIcon,
  ArrowUpRightIcon
} from "@heroicons/react/24/outline";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

// Mock Data for Charts
const dataUsage = [
  { name: 'MON', usage: 400 }, { name: 'TUE', usage: 700 },
  { name: 'WED', usage: 600 }, { name: 'THU', usage: 800 },
  { name: 'FRI', usage: 500 }, { name: 'SAT', usage: 900 },
  { name: 'SUN', usage: 1100 },
];

const planDistribution = [
  { name: '1HR BASIC', value: 400 },
  { name: '24HR UNLIMITED', value: 300 },
  { name: 'WEEKLY PRO', value: 200 },
  { name: 'MONTHLY GOLD', value: 100 },
];

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706'];

export default function DashboardHome() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* 1. Industrial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2 italic">
            <CircleStackIcon className="w-8 h-8 text-blue-600" />
            System Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Global network performance and revenue telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Telemetry Sync</p>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 italic flex items-center justify-end gap-1">
                    <ArrowPathIcon className="w-3 h-3 animate-spin" /> LIVE_STATUS
                </p>
            </div>
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Active Plans" value="12" icon={TicketIcon} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" trend="+2 NEW" />
        <StatCard title="MikroTik Nodes" value="03" icon={CpuChipIcon} color="text-purple-600" bg="bg-purple-50 dark:bg-purple-900/20" trend="OPTIMAL" />
        <StatCard title="Active Users" value="1,248" icon={UsersIcon} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" trend="+12.5%" />
        <StatCard title="Daily Revenue" value="8.4K" icon={BanknotesIcon} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" trend="KES" />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Analytics: Data Usage */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <SignalIcon className="w-5 h-5 text-blue-600" />
              Traffic Throughput (GB)
            </h3>
            <div className="bg-slate-50 dark:bg-gray-900 px-3 py-1 rounded text-[10px] font-black text-slate-500 uppercase tracking-tighter italic">
              ISO_WEEK_STATS
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataUsage}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" strokeOpacity={0.1} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#64748B'}} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#64748B'}} 
                />
                <Tooltip 
                    contentStyle={{backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold'}}
                    itemStyle={{color: '#3B82F6'}}
                />
                <Area type="monotone" dataKey="usage" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution: Plan Popularity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700">
          <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] mb-8 italic">
            Plan Market Share
          </h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {planDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                <p className="text-xl font-black text-slate-900 dark:text-white italic leading-none">1.2K</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {planDistribution.map((item, i) => (
              <div key={item.name} className="flex justify-between items-center group">
                <span className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight group-hover:text-blue-500 transition-colors">{item.name}</span>
                </span>
                <span className="text-[11px] font-black text-slate-800 dark:text-white italic">{item.value} UNITS</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Hardware Health Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 italic">
            <HeartIcon className="w-5 h-5 text-rose-500" />
            Infrastructure Vitals
          </h3>
          <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded uppercase tracking-widest animate-pulse">
            System_Nominal
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-50 dark:divide-slate-700">
          <HealthMetric label="CPU Overhead" value="14.2%" status="SECURE" progress={14} />
          <HealthMetric label="RAM Capacity" value="1.2 GB" status="OPTIMAL" progress={80} />
          <HealthMetric label="System Uptime" value="12D 04H" status="STABLE" progress={100} />
        </div>
      </div>
    </div>
  );
}

// Utility Components
const StatCard = ({ title, value, icon: Icon, color, bg, trend }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 hover:border-blue-500/50 transition-all group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-xl ${bg} transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded italic">
          {trend}
        </span>
        <ArrowUpRightIcon className="w-3 h-3 text-slate-300 mt-2" />
      </div>
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{title}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 italic tracking-tighter">{value}</p>
    </div>
  </div>
);

const HealthMetric = ({ label, value, status, progress }: any) => (
  <div className="p-8 group hover:bg-slate-50 dark:hover:bg-gray-900/50 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 italic tracking-tighter">{value}</p>
      </div>
      <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 italic tracking-widest">{status}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
            className="h-full bg-blue-600 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
        ></div>
    </div>
  </div>
);