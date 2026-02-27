// src/pages/RouterDetail.tsx

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

      {/* Header */}
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