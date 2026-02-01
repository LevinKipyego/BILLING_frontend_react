import { 
  TicketIcon, 
  CpuChipIcon, 
  UsersIcon, 
  BanknotesIcon,
 
  HeartIcon,
  CircleStackIcon,
  SignalIcon
} from "@heroicons/react/24/outline";
import { 
   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

// Mock Data for Charts
const dataUsage = [
  { name: 'Mon', usage: 400 }, { name: 'Tue', usage: 700 },
  { name: 'Wed', usage: 600 }, { name: 'Thu', usage: 800 },
  { name: 'Fri', usage: 500 }, { name: 'Sat', usage: 900 },
  { name: 'Sun', usage: 1100 },
];

const planDistribution = [
  { name: '1HR Basic', value: 400 },
  { name: '24HR Unlimited', value: 300 },
  { name: 'Weekly Pro', value: 200 },
  { name: 'Monthly Gold', value: 100 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function DashboardHome() {
  return (
    <div className="space-y-8 pb-10 animate-fadeIn">
      {/* 1. Fancy Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500">Real-time performance and network analytics.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-gray-400 uppercase">Last Sync</p>
          <p className="text-sm font-medium text-gray-700">Just now</p>
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Active Plans" value="12" icon={TicketIcon} color="text-blue-600" bg="bg-blue-50" trend="+2 new" />
        <StatCard title="MikroTik Nodes" value="3" icon={CpuChipIcon} color="text-purple-600" bg="bg-purple-50" trend="All Stable" />
        <StatCard title="Connected Users" value="1,248" icon={UsersIcon} color="text-emerald-600" bg="bg-emerald-50" trend="+12% vs last week" />
        <StatCard title="Daily Revenue" value="KES 8,400" icon={BanknotesIcon} color="text-amber-600" bg="bg-amber-50" trend="Target: 10k" />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Graph: Data Usage */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <CircleStackIcon className="w-5 h-5 text-blue-500" />
              Total Data Consumption (GB)
            </h3>
            <select className="text-xs border-none bg-gray-50 rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataUsage}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="usage" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Plan Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <SignalIcon className="w-5 h-5 text-amber-500" />
            Plan Popularity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {planDistribution.map((item, i) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-gray-500">{item.name}</span>
                </span>
                <span className="font-bold text-gray-700">{item.value} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Hardware Health Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <HeartIcon className="w-5 h-5 text-red-500" />
            MikroTik Health Monitor
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
          <HealthMetric label="CPU Usage" value="14%" status="Healthy" />
          <HealthMetric label="RAM Free" value="1.2 GB" status="Healthy" />
          <HealthMetric label="Uptime" value="12d 4h 22m" status="Stable" />
        </div>
      </div>
    </div>
  );
}

// Utility Components
const StatCard = ({ title, value, icon: Icon, color, bg, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
        {trend}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const HealthMetric = ({ label, value, status }: any) => (
  <div className="p-6 flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-bold text-emerald-500">{status}</span>
      <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
        <div className="w-3/4 h-full bg-emerald-500 rounded-full"></div>
      </div>
    </div>
  </div>
);