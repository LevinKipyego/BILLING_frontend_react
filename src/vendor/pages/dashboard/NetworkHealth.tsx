import { useEffect, useState, useMemo } from "react";
import { 
  SignalIcon, 
  CpuChipIcon, 
  ExclamationCircleIcon, 
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  
} from "@heroicons/react/24/outline";

import RouterTable from "../../components/tables/RouterTable";
import AlertsPanel from "../../components/alerts/AlertsPanel";
import { getRouters, getNetworkStats } from "../../api/network";
import { mapBackendAlerts } from "../../api/mapper/alertMapper";
import type { NetworkStats, Router } from "../../types/network";

export default function NetworkHealth() {
  const [routers, setRouters] = useState<Router[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let socket: WebSocket | null = null;
    let isMounted = true;

    const loadData = async () => {
      try {
        getNetworkStats().then(statsData => {
          if (isMounted) {
            setStats(statsData);
            setLoading(false); 
          }
        });

        getRouters().then(routersData => {
          if (isMounted) {
            setRouters(routersData.results || []);
            setLoading(false); 
          }
        });
      } catch (e) {
        if (isMounted) {
          setError("Telemetry link interrupted.");
          setLoading(false);
        }
      }
    };

    const connectWS = () => {
      const token = localStorage.getItem("access_token");
      if (!token || !isMounted) return;

      const WS_URL = import.meta.env.VITE_WS_BASE;
      const wsUrl = `${WS_URL}/routers/?token=${token}`;
      
      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === "router_update") {
            setRouters(prev => {
              if (prev.length === 0) return prev; 
              return prev.map(r => r.id === message.data.router_id ? { ...r, ...message.data } : r);
            });
          }
          
          if (message.type === "network_stats_update") {
            setStats(message.data);
          }
        } catch (err) {
          // Parsing error silently ignored
        }
      };
    };

    loadData();
    connectWS();

    return () => {
      isMounted = false;
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Filter Logic
  const filteredRouters = useMemo(() => {
    return routers.filter(r => {
      const matchesSearch = r.router_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.ip?.includes(searchTerm);
      const matchesStatus = statusFilter === "All"; 
      return matchesSearch && matchesStatus;
    });
  }, [routers, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRouters.length / itemsPerPage);
  const paginatedRouters = filteredRouters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[350px] text-slate-400">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-2.5"></div>
      <span className="text-xs sm:text-sm">Establishing Telemetry...</span>
    </div>
  );

  if (error) return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-3">
        <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-200">
      
      {/* 1. SMART HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-gray-700 pb-3.5">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            Network Command
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Global Infrastructure Live
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER GROUP */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ID or IP..." 
              className="w-full sm:w-64 pl-9 pr-3.5 py-1.5 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="flex items-center bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
            <div className="px-2.5 py-1.5 border-r border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select 
              className="bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-200 px-3 py-1.5 outline-none cursor-pointer w-full sm:w-auto"
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Nodes', val: stats?.total, icon: CpuChipIcon, color: 'text-indigo-600 dark:text-indigo-400', border: 'border-slate-200 dark:border-gray-700' },
          { label: 'Operational', val: stats?.online, icon: CheckBadgeIcon, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30 dark:border-gray-700' },
          { label: 'High Load', val: stats?.warning, icon: SignalIcon, color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30 dark:border-gray-700' },
          { label: 'Down', val: stats?.offline, icon: ExclamationCircleIcon, color: 'text-rose-600 dark:text-rose-400', border: 'border-red-500/30 dark:border-gray-700' }
        ].map((card, i) => (
          <div key={i} className={`bg-white dark:bg-gray-900 border ${card.border} rounded-lg p-3.5 sm:p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {card.label}
              </span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-semibold ${card.color}`}>
              {card.val || 0}
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-6">
        
        {/* ROUTER LIST WITH PAGINATION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center">
               <div>
                 <h2 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">Router Infrastructure</h2>
                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Connected network nodes and status</p>
               </div>
               <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                 {filteredRouters.length} Total
               </span>
            </div>
            
            <div className="overflow-x-auto">
              <RouterTable routers={paginatedRouters} />
            </div>

            {/* PAGINATION FOOTER */}
            <div className="px-4 sm:px-5 py-3.5 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page <span className="font-medium text-slate-700 dark:text-slate-200">{currentPage}</span> of {totalPages || 1}
              </p>
              <div className="flex gap-1.5">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                >
                  <ChevronRightIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS PANEL */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AlertsPanel alerts={mapBackendAlerts(stats?.alerts || [])} />
          </div>
        </div>

      </div>
    </div>
  );
}