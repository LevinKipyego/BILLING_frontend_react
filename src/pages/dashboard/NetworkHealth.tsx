// src/pages/NetworkHealth.tsx
import { useEffect, useState, useRef,useMemo } from "react";
import { 
  SignalIcon, 
  CpuChipIcon, 
  ExclamationCircleIcon, 
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

//import StatCard from "../../components/cards/StatCard";
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
      // OPTIMIZATION: Don't use Promise.all if one is significantly slower.
      // Fetch them independently so the UI can populate partially.
      
      getNetworkStats().then(statsData => {
        if (isMounted) {
          setStats(statsData);
          // If stats are critical for the layout, hide loader now
          setLoading(false); 
        }
      });

      getRouters().then(routersData => {
        if (isMounted) {
          setRouters(routersData.results || []);
          // Ensure loading is off even if stats failed
          setLoading(false); 
        }
      });

    } catch (e) {
      console.error("❌ Critical Load Failed:", e);
      if (isMounted) {
        setError("Telemetry link interrupted.");
        setLoading(false);
      }
    }
  };

  const connectWS = () => {
    const token = localStorage.getItem("access_token");
    if (!token || !isMounted) return;

    // Use the explicit IP if localhost is causing issues, 
    // but window.location.hostname is usually best.
    const host = window.location.hostname; 
    const wsUrl = `ws://${host}:8000/ws/routers/?token=${token}`;
    
    socket = new WebSocket(wsUrl);

    socket.onopen = () => console.log("🔌 Connected to Network Stream");

    socket.onmessage = (event) => {
      if (!isMounted) return;
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "router_update") {
          setRouters(prev => {
            // OPTIMIZATION: Check if data exists before mapping
            if (prev.length === 0) return prev; 
            return prev.map(r => r.id === message.data.router_id ? { ...r, ...message.data } : r);
          });
        }
        
        if (message.type === "network_stats_update") {
          setStats(message.data);
        }
      } catch (err) {
        console.error("📩 WS Parsing Error:", err);
      }
    };

    socket.onerror = (e) => {
      console.error("❌ WS Socket Error:", e);
      // If WS fails, we don't necessarily want to break the whole UI
    };

    socket.onclose = () => {
      console.warn("⚠️ Stream Disconnected");
      // Optional: Add a timeout to reconnect here
    };
  };

  loadData();
  connectWS();

  return () => {
    isMounted = false;
    if (socket) {
      socket.close();
      console.log("🔌 Stream Closed");
    }
  };
}, []);

  // Filter Logic
  const filteredRouters = useMemo(() => {
    return routers.filter(r => {
      const matchesSearch = r.router_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.ip?.includes(searchTerm);
      const matchesStatus = statusFilter === "All"
                           
      return matchesSearch && matchesStatus;
    });
  }, [routers, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRouters.length / itemsPerPage);
  const paginatedRouters = filteredRouters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
      <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin mb-4" />
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Establishing Telemetry...</h2>
    </div>
  );

  if (error) return (
    <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-md font-black text-xs uppercase italic flex items-center gap-3">
      <ExclamationCircleIcon className="w-5 h-5" />
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-2 md:p-8 space-y-6 transition-colors duration-500">
      
      {/* 1. SMART HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Network Command</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Global Infrastructure Live</p>
          </div>
        </div>

        {/* SEARCH & FILTER GROUP */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search ID or IP..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/10 rounded-md text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="flex items-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/10 rounded-md overflow-hidden shadow-sm">
            <div className="px-3 py-2 border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-gray-900">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select 
              className="bg-transparent text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 px-3 outline-none cursor-pointer"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Nodes', val: stats?.total, icon: CpuChipIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Operational', val: stats?.online, icon: CheckBadgeIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'High Load', val: stats?.warning, icon: SignalIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Down', val: stats?.offline, icon: ExclamationCircleIcon, color: 'text-rose-500', bg: 'bg-rose-500/10' }
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-md border border-slate-100 dark:border-white/5 shadow-sm">
            <div className={`${card.bg} w-8 h-8 rounded flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.label}</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white italic">{card.val || 0}</p>
          </div>
        ))}
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        
        {/* ROUTER LIST WITH PAGINATION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-md border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Router Infrastructure</h3>
               <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                 {filteredRouters.length} Total
               </span>
            </div>
            
            {/* Using your custom RouterTable component but ensuring it handles the list */}
            <RouterTable routers={paginatedRouters} />

            {/* PAGINATION FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase">Page {currentPage} of {totalPages || 1}</p>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-1.5 rounded border border-slate-200 dark:border-white/10 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-slate-600 dark:text-white" />
                </button>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-1.5 rounded border border-slate-200 dark:border-white/10 disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronRightIcon className="w-4 h-4 text-slate-600 dark:text-white" />
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