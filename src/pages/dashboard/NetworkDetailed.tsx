// src/pages/dashboard/RouterDetail.tsx
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRouterDetail } from "../../api/networkdetailed"
import type { RouterDetailResponse } from "../../types/networkdetailed"

// Sub-components (Assuming these are also being updated to match the theme)
import CurrentHealthCard from "../../components/networkdetailed/CurrentHealthCard"
import Stats24hCard from "../../components/networkdetailed/Stats24hCard"
import AlertsList from "../../components/networkdetailed/AlertsList"
import HealthChart from "../../components/networkdetailed/HealthChart"
import NetworkHealthGauge from "../../components/networkdetailed/NetworkHealthGauge"
import UplinkSpeedGauge from "../../components/networkdetailed/UplinkSpeedGauge"
import InterfaceCard from "../../components/networkdetailed/InterfaceCard"
import NetworkAlertsPanel from "../../components/networkdetailed/NetworkAlerts"
import ThroughputGraph from "../../components/networkdetailed/ThroughPutGraph"
import UplinkTrafficGraph from "../../components/networkdetailed/UplinkSpeedGraph"
import IdlePortsPanel from "../../components/networkdetailed/IdlePorts"

import { 
  CpuChipIcon, 
  SignalIcon, 
  ShieldCheckIcon, 
  CommandLineIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"

const RouterDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<RouterDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const loadData = async () => {
      try {
        const result = await fetchRouterDetail(id)
        setData(result)
      } catch (err: any) {
        setError(err.message || "Failed to load router")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <ArrowPathIcon className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Establishing Link...</p>
    </div>
  )

  if (error) return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-xl flex items-center gap-4">
        <ExclamationTriangleIcon className="w-8 h-8 text-rose-600" />
        <div>
          <h2 className="text-sm font-black text-rose-900 dark:text-rose-100 uppercase tracking-tighter">Connection Error</h2>
          <p className="text-xs text-rose-700 dark:text-rose-400 font-bold italic">{error}</p>
        </div>
      </div>
    </div>
  )

  if (!data) return <div className="p-6 dark:text-white">Router not found</div>

  const intelligence = data.interfaces ?? null

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn dark:bg-gray-900 min-h-screen transition-colors pb-20">
      
      {/* 1. Technical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              {data.router.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-[10px] font-black text-slate-500 dark:text-slate-400 font-mono tracking-widest">
                ID: {id?.slice(0, 8)}
             </span>
             <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase italic tracking-widest">
                <ShieldCheckIcon className="w-4 h-4" />
                {data.router.ip}
             </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-right hidden sm:block border-r border-slate-100 dark:border-slate-800 pr-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hardware Type</p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase italic">MikroTik RouterOS</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uptime Status</p>
            <p className="text-xs font-black text-emerald-500 uppercase italic">Operational</p>
          </div>
        </div>
      </div>

      {/* 2. Top Tier Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CurrentHealthCard health={data.current_health} />
        <Stats24hCard stats={data.stats_24h} />
        <AlertsList alerts={data.recent_alerts} />
      </div>

      {/* 3. Network Intelligence Section */}
      {intelligence && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-2">
                <SignalIcon className="w-4 h-4 text-blue-600" />
                Live Node Telemetry
             </h2>
             <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NetworkHealthGauge score={intelligence.network_health_score} />
            <UplinkSpeedGauge uplink={intelligence.uplink} />
            <NetworkAlertsPanel alerts={intelligence.network_alerts} />
          </div>

          <IdlePortsPanel ports={intelligence.suspicious_idle_ports} />

          {/* Interface Management */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic flex items-center gap-2">
                  <CommandLineIcon className="w-5 h-5 text-blue-600" />
                  Router Interfaces
               </h2>
               <span className="text-[10px] font-black text-slate-400 uppercase">
                 {intelligence.downlinks.length + (intelligence.uplink ? 1 : 0)} Active Links
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {intelligence.uplink && (
                <InterfaceCard iface={intelligence.uplink} isUplink />
              )}
              {intelligence.downlinks.map((iface) => (
                <InterfaceCard key={iface.name} iface={iface} />
              ))}
            </div>

            {/* Throughput Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Uplink Traffic Distribution</h3>
                <UplinkTrafficGraph data={intelligence.uplink_history} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Aggregated Throughput (Real-Time)</h3>
                <ThroughputGraph data={intelligence.uplink_history} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Footer History Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-gray-800/50">
           <h3 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic">Historical Health Index</h3>
        </div>
        <div className="p-6">
            <HealthChart history={data.health_history} />
        </div>
      </div>
    </div>
  )
}

export default RouterDetail