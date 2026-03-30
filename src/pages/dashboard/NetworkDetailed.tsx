// src/pages/RouterDetail.tsx
{/* eslint-disable react-hooks/exhaustive-deps 
import CurrentHealthCard from "../../components/networkdetailed/CurrentHealthCard"
import Stats24hCard from "../../components/networkdetailed/Stats24hCard"
import AlertsList from "../../components/networkdetailed/AlertsList"
import HealthChart from "../../components/networkdetailed/HealthChart"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRouterDetail } from "../../api/networkdetailed"
import type { RouterDetailResponse } from "../../types/networkdetailed"

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

  if (loading) return <div className="p-6">Loading router...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return <div className="p-6">Router not found</div>

  return (
    <div className="p-6 space-y-6">

      /* Router Info * /
      <div>
        <h1 className="text-2xl font-bold">
          {data.router.name}
        </h1>
        <p className="text-gray-500">{data.router.ip}</p>
      </div>

      <CurrentHealthCard health={data.current_health} />
      <Stats24hCard stats={data.stats_24h} />
      <AlertsList alerts={data.recent_alerts} />
      <HealthChart history={data.health_history} />
    </div>
  )
}

export default RouterDetail

*/}

// src/pages/RouterDetail.tsx

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

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchRouterDetail } from "../../api/networkdetailed"
import type { RouterDetailResponse } from "../../types/networkdetailed"

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

  if (loading) return <div className="p-6">Loading router...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return <div className="p-6">Router not found</div>
  console.log("Router Detail Data:", data)
  const intelligence = data.interfaces ?? null

  return (

    <div className="p-6 space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold">
          {data.router.name}
        </h1>
        <p className="text-gray-500">{data.router.ip}</p>
      </div>


      {/* EXISTING COMPONENTS */}

      <CurrentHealthCard health={data.current_health} />

      <Stats24hCard stats={data.stats_24h} />

      <AlertsList alerts={data.recent_alerts} />



      {/* NETWORK INTELLIGENCE SECTION */}

      {intelligence && (

        <div className="space-y-6">

          {/* Top Metrics */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <NetworkHealthGauge
              score={intelligence.network_health_score}
            />

            <UplinkSpeedGauge
              uplink={intelligence.uplink}
            />
 
            <NetworkAlertsPanel
              alerts={intelligence.network_alerts}
            />

          </div>


          {/* Idle Ports */}

          <IdlePortsPanel
            ports={intelligence.suspicious_idle_ports}
          />


          {/* Interfaces */}

          <div>

            <h2 className="text-xl font-semibold mb-4">
              Router Interfaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {intelligence.uplink && (
                <InterfaceCard
                  iface={intelligence.uplink}
                  isUplink
                />
              )}

              {intelligence.downlinks.map((iface) => (
                <InterfaceCard
                  key={iface.name}
                  iface={iface}
                />
              ))}

            </div>

           
             
          

            <div>
               <UplinkTrafficGraph
                data={intelligence.uplink_history }
              />
              
              <ThroughputGraph
                data={intelligence.uplink_history}
              />
             
            </div>
           

          </div>

        </div>

      )}



      {/* HEALTH HISTORY CHART */}

      <HealthChart history={data.health_history} />

      
     
    </div>
  )
}

export default RouterDetail