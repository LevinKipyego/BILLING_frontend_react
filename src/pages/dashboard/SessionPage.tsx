// src/pages/SessionsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ComputerDesktopIcon, 
  ClockIcon, 
  SignalIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ArrowsRightLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  FunnelIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";
import { fetchSessions } from "../../api/sessions";
import type { SessionDashboardResponse, SessionRow } from "../../types/sessions";

const SessionsPage = () => {
  const [data, setData] = useState<SessionDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceFilter, setServiceFilter] = useState("All");
  const itemsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSessions();
        setData(res);
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Highlight helper for search matches
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-blue-500/20 text-blue-600 dark:text-blue-400 p-0 rounded-sm">{part}</mark>
      ) : part
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] tracking-widest uppercase">Mapping Routes...</p>
    </div>
  );

  if (error) return (
    <div className="m-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-md font-bold text-xs">
      Error: {error}
    </div>
  );

  // Consolidated Filter Logic
  const filteredSessions = data?.active_sessions.filter(s => {
    // 1. Search Box: Check username, ip, mikrotik name, and service name
    const matchesSearch = 
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.ip && s.ip.includes(searchTerm)) ||
      (s.mikrotik && s.mikrotik.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.service && s.service.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Dropdown Filter: Strict category match
    const matchesService = 
      serviceFilter === "All" || 
      s.service?.toLowerCase() === serviceFilter.toLowerCase();

    return matchesSearch && matchesService;
  }) || [];

  // Pagination Logic
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-1 md:p-8 space-y-3 md:space-y-6 animate-fadeIn pb-24 transition-colors duration-500">
      
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 mt-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Live Sessions</h1>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tight">Active Tunnels Monitoring</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search user, IP, or service..." 
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md text-xs font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all shadow-sm">
  {/* Icon Section with Vertical Separation */}
  <div className="px-2.5 py-2 border-r border-slate-100 dark:border-gray-700/50 bg-slate-50/50 dark:bg-gray-900/20">
    <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
  </div>

  {/* Select Input with Custom Chevron */}
  <div className="relative flex-1">
    <select 
      value={serviceFilter}
      className="w-full bg-transparent appearance-none pl-3 pr-8 py-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 outline-none cursor-pointer"
      onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
    >
      <option value="All" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">• All Services</option>
      <option value="pppoe" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">→ PPPoE</option>
      <option value="hotspot" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">→ Hotspot</option>
    </select>
    
    {/* Custom Chevron notation */}
    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
      <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          { label: 'Users', val: data?.summary.total_active_users, icon: SignalIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Down', val: `${(data?.summary.total_in_bytes! / 1e9).toFixed(2)} GB`, icon: ArrowDownIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Up', val: `${(data?.summary.total_out_bytes! / 1e9).toFixed(2)} GB`, icon: ArrowUpIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-md border border-slate-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
            <div className={`${card.bg} p-2 rounded-md`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{card.label}</p>
              <p className="text-sm md:text-xl font-black text-slate-900 dark:text-white italic">{card.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SESSIONS TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-md border border-slate-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[500px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-900/50 border-b border-slate-100 dark:border-gray-700">
                <th className="px-3 md:px-8 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-r border-slate-200/50 dark:border-white/5">Subscriber</th>
                <th className="px-3 md:px-8 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-r border-slate-200/50 dark:border-white/5">Infrastructure</th>
                <th className="px-3 md:px-8 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-r border-slate-200/50 dark:border-white/5">Usage</th>
                <th className="px-3 md:px-8 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
              {paginatedSessions.length > 0 ? (
                paginatedSessions.map((s: SessionRow) => (
                  <tr
                    key={s.id}
                    onClick={() => navigate(`/dashboard/sessions/${s.id}`)}
                    className="hover:bg-blue-50/50 dark:hover:bg-white/[0.02] cursor-pointer transition-all group"
                  >
                    <td className="px-3 md:px-8 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner shrink-0">
                            <ComputerDesktopIcon className="w-4 h-4" />
                          </div>
                          <div className="max-w-[100px] md:max-w-none">
                            <p className="text-[11px] md:text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">
                              {highlightText(s.username, searchTerm)}
                            </p>
                            <p className="text-[9px] font-bold text-blue-500 flex items-center gap-1 mt-0.5">
                              <GlobeAltIcon className="w-2.5 h-2.5" /> {highlightText(s.ip || "0.0.0.0", searchTerm)}
                            </p>
                          </div>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-slate-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors ml-2 shrink-0" />
                      </div>
                    </td>

                    <td className="px-3 md:px-8 py-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <CpuChipIcon className="w-3 h-3 text-indigo-500" />
                          {highlightText(s.mikrotik || "Core", searchTerm)}
                        </p>
                        <span className="w-fit px-1.5 py-0.5 text-[8px] font-black bg-indigo-500/10 text-indigo-500 rounded uppercase">
                          {highlightText(s.service || "N/A", searchTerm)}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 md:px-8 py-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 font-black uppercase mb-0.5">Vol</span>
                        <span className="text-[11px] md:text-sm font-black text-slate-700 dark:text-slate-300 italic flex items-center gap-1">
                          <ArrowsRightLeftIcon className="w-2.5 h-2.5 text-slate-400" />
                          {((s.in_bytes + s.out_bytes) / 1e9).toFixed(2)} <span className="text-[8px] uppercase font-normal opacity-60">GB</span>
                        </span>
                      </div>
                    </td>

                    <td className="px-3 md:px-8 py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <ClockIcon className="w-2.5 h-2.5 text-blue-500" />
                          {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold mt-0.5">{new Date(s.start_time).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No matching sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-transparent">
          <p className="text-[9px] font-black text-slate-400 uppercase">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 transition-all"
            >
              <ChevronLeftIcon className="w-4 h-4 text-slate-600 dark:text-white" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/10 transition-all"
            >
              <ChevronRightIcon className="w-4 h-4 text-slate-600 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;