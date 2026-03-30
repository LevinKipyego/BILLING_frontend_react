// src/pages/SessionDetail.tsx

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchSessionDetail } from "../../api/sessions"
import type { SessionDetailResponse } from "../../types/sessions"

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const sessionId = id ? parseInt(id, 10) : null; // convert to number
  const [data, setData] = useState<SessionDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    load()
  }, [id])

  if (loading) return <div className="p-6">Loading session...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return <div className="p-6">Session not found</div>

  const s = data.current_session

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{data.user}</h1>
        <p className="text-gray-500">
          {s.ip} • {s.mikrotik}
        </p>
      </div>

      {/* STATUS CARD */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Current Session</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Status</p>
            <p className={s.is_online ? "text-green-600" : "text-red-500"}>
              {s.is_online ? "Online" : "Offline"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Service</p>
            <p>{s.service}</p>
          </div>

          <div>
            <p className="text-gray-500">Rate</p>
            <p>{s.estimated_rate_mbps} Mbps</p>
          </div>

          <div>
            <p className="text-gray-500">Start Time</p>
            <p>{new Date(s.start_time).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-gray-500">Duration</p>
            <p>
              {s.duration_seconds
                ? Math.floor(s.duration_seconds / 60) + " min"
                : "-"}
            </p>
          </div>

        </div>
      </div>

      {/* TOTAL USAGE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Total Usage</h2>

        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-500">Download</p>
            <p>{(data.totals.total_in / 1e9).toFixed(2)} GB</p>
          </div>

          <div>
            <p className="text-gray-500">Upload</p>
            <p>{(data.totals.total_out / 1e9).toFixed(2)} GB</p>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Session Intelligence</h2>

        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-500">Active Sessions</p>
            <p>{data.intelligence.active_sessions}</p>
          </div>

          <div>
            <p className="text-gray-500">Multi Login</p>
            <p className={data.intelligence.multi_login ? "text-red-500" : ""}>
              {data.intelligence.multi_login ? "YES ⚠️" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Session History</h2>

        <div className="overflow-auto text-sm">
          <table className="w-full">

            <thead className="text-left text-gray-500">
              <tr>
                <th>Router</th>
                <th>Service</th>
                <th>Start</th>
                <th>Stop</th>
                <th>Usage</th>
              </tr>
            </thead>

            <tbody>
              {data.history.map((h, i) => (
                <tr key={i} className="border-t">

                  <td>{h.mikrotik__identity_name}</td>
                  <td>{h.service_type}</td>

                  <td>{new Date(h.start_time).toLocaleString()}</td>

                  <td>
                    {h.stop_time
                      ? new Date(h.stop_time).toLocaleString()
                      : "Active"}
                  </td>

                  <td>
                    {((h.in_bytes + h.out_bytes) / 1e9).toFixed(2)} GB
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}

export default SessionDetail