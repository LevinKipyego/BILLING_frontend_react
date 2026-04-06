// src/pages/SessionDetail.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeftIcon, 
  CircleStackIcon, 
  CpuChipIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  FingerPrintIcon,
  SignalIcon
} from "@heroicons/react/24/outline"
import { fetchSessionDetail } from "../../api/sessions"
import type { SessionDetailResponse } from "../../types/sessions"

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sessionId = id ? parseInt(id, 10) : null
  
  const [data, setData] = useState<SessionDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("All")
  const itemsPerPage = 6

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await fetchSessionDetail(sessionId!)
        setData(res)
      } catch (err: any) {
        setError(err.message || "Failed to load session")
      } finally {
        setLoading(false)
      }
    }
    load();
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-400">
      <SparklesIcon className="w-8 h-8 animate-spin mb-4 text-blue-500" />
      <p className="font-black text-[10px] tracking-widest uppercase italic">Syncing Data...</p>
    </div>
  )

  if (error || !data) return (
    <div className="m-4 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-md font-bold text-xs uppercase italic">
      {error || "Session Data Corrupted"}
    </div>
  )

  const s = data.current_session;

  // Logic for Filtering Connection Logs
  const filteredHistory = data.history.filter(h => {
    if (statusFilter === "Live") return !h.stop_time;
    if (statusFilter === "Closed") return h.stop_time;
    return true;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-1 md:p-8 space-y-4 md:space-y-6 animate-fadeIn w-full transition-colors duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between border-b border-slate-200 dark:border-white/5 pb-4 px-2 mt-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 md:p-3 hover:bg-white dark:hover:bg-white/10 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white shadow-sm transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{data.user}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`h-2 w-2 rounded-full ${s.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-gray-600'}`}></span>
              <span className="text-[9px] font-Regular text-gray-900 dark:text-gray-400 uppercase tracking-widest">
                {s.is_online ? 'Live Connection' : 'User Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
           <div className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-500/20">
             {s.service}
           </div>
           <div className="px-3 py-1.5 bg-white dark:bg-white/10 text-slate-600 dark:text-white rounded-md text-[9px] font-black tracking-[0.1em] border border-slate-200 dark:border-white/10 shadow-sm">
             {s.mikrotik}
           </div>
        </div>
      </div>

      {/* INTELLIGENCE HUD - Security & Active Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800/50 border border-slate-200 dark:border-white/5 p-4 rounded-md flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-md ${data.intelligence.multi_login ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
               <FingerPrintIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Multi-Login Intelligence</p>
              <h3 className={`text-sm font-black uppercase italic ${data.intelligence.multi_login ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                {data.intelligence.multi_login ? "Multiple IPs Detected" : "Unique Session Lock"}
              </h3>
            </div>
          </div>
          {data.intelligence.multi_login && <ExclamationTriangleIcon className="w-5 h-5 text-red-500 animate-bounce" />}
        </div>

        <div className="bg-white dark:bg-gray-800/50 border border-slate-200 dark:border-white/5 p-4 rounded-md flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-md">
               <SignalIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Active Tunnels</p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase italic">
                {data.intelligence.active_sessions} Session(s) Currently Live
              </h3>
            </div>
          </div>
          <div className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">STABLE</div>
        </div>
      </div>

      {/* TELEMETRY PANEL */}
      <div className="bg-white dark:bg-white/[0.03] rounded-md border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-2">
          <GlobeAltIcon className="w-3.5 h-3.5 text-blue-500" />
          <h2 className="text-[9px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Network Telemetry</h2>
        </div>
        <div className="p-4 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-md shrink-0"><GlobeAltIcon className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase mb-1">IP Address</p>
              <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{s.ip || "0.0.0.0"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-md shrink-0"><ClockIcon className="w-4 h-4 text-emerald-600" /></div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase mb-1">Uptime</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{s.duration_seconds ? Math.floor(s.duration_seconds / 60) + "m" : "0m"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-md shrink-0"><CpuChipIcon className="w-4 h-4 text-indigo-600" /></div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase mb-1">Rate</p>
              <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 italic">{s.estimated_rate_mbps} Mbps</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-md shrink-0 ${data.intelligence.multi_login ? 'bg-red-50 dark:bg-red-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                {data.intelligence.multi_login ? <ExclamationTriangleIcon className="w-4 h-4 text-red-600" /> : <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />}
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 dark:text-gray-500 uppercase mb-1">Status</p>
              <p className={`text-[10px] font-black uppercase tracking-tight ${data.intelligence.multi_login ? 'text-red-600' : 'text-emerald-600'}`}>
                  {data.intelligence.multi_login ? "Risk Alert" : "Verified Safe"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AGGREGATE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Download', val: (data.totals.total_in / 1e9).toFixed(2), icon: ArrowDownTrayIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Total Upload', val: (data.totals.total_out / 1e9).toFixed(2), icon: ArrowUpTrayIcon, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-white/5' },
          { label: 'Network Volume', val: ((data.totals.total_in + data.totals.total_out) / 1e9).toFixed(2), icon: CircleStackIcon, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', special: true }
        ].map((card, i) => (
          <div key={i} className={`${card.special ? 'border-emerald-100 dark:border-emerald-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5'} p-4 md:p-6 rounded-md border flex justify-between items-center shadow-sm relative overflow-hidden transition-transform hover:scale-[1.01]`}>
            <div className="relative z-10">
              <p className={`text-[8px] font-black uppercase mb-1 ${card.special ? 'text-emerald-600' : 'text-slate-400 dark:text-gray-500'}`}>{card.label}</p>
              <p className={`text-2xl md:text-3xl font-black italic ${card.special ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                {card.val} <span className="text-[10px] not-italic opacity-50">GB</span>
              </p>
            </div>
            <div className={`${card.bg} p-3 rounded-md relative z-10`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* HISTORY LOGS WITH FILTER & PAGINATION */}
      <div className="bg-white dark:bg-white/[0.02] rounded-md border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/30 dark:bg-transparent">
          <h2 className="text-[9px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">Connection History Logs</h2>
          
          {/* FANCY FILTER DROPDOWN */}
          <div className="flex items-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
            <div className="px-2.5 py-1.5 border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-gray-800">
              <FunnelIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 px-3 outline-none cursor-pointer min-w-[120px]"
            >
              <option value="All">All Logs</option>
              <option value="Live">Live Now</option>
              <option value="Closed">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[450px] md:min-w-full">
            <thead>
              <tr className="text-[8px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4 border-r border-slate-100 dark:border-white/5">Nas Identity</th>
                <th className="px-6 py-4 border-r border-slate-100 dark:border-white/5">Session Start</th>
                <th className="px-6 py-4 border-r border-slate-100 dark:border-white/5">Status</th>
                <th className="px-6 py-4 text-right">Traffic Vol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {paginatedHistory.length > 0 ? paginatedHistory.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CpuChipIcon className="w-3 h-3 text-indigo-500 opacity-70" />
                      <span className="text-[10px] font-black text-slate-700 dark:text-gray-300 truncate">{h.mikrotik__identity_name || "Core-Node"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-gray-500">
                    <span className="flex items-center gap-1.5 uppercase">
                       <ClockIcon className="w-3 h-3 text-blue-500" />
                       {new Date(h.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {h.stop_time ? (
                      <p className="px-2 py-0.5 rounded-full text-[8px] font-black  text-slate-400">Closed</p>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-500 animate-pulse border border-emerald-500/20">Establishing...</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white italic group-hover:text-blue-500 transition-colors">
                      {((h.in_bytes + h.out_bytes) / 1e9).toFixed(2)}
                    </span>
                    <span className="ml-1 text-[8px] font-black text-slate-400 uppercase">GB</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No logs match the filter</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* LOGS PAGINATION FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-white/10 disabled:opacity-20 hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-white transition-all shadow-sm"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-1.5 rounded border border-slate-200 dark:border-white/10 disabled:opacity-20 hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-white transition-all shadow-sm"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetail;