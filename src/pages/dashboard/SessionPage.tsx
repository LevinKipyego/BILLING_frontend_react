// src/pages/SessionsPage.tsx

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchSessions } from "../../api/sessions"
import type { SessionDashboardResponse, SessionRow } from "../../types/sessions"

const SessionsPage = () => {
  const [data, setData] = useState<SessionDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSessions()
        setData(res)
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="p-6">Loading sessions...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return <div className="p-6">No data</div>

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Active Sessions</h1>
        <p className="text-gray-500">
          {data.summary.total_active_users} users online
        </p>
      </div>

      {/* SUMMARY */}
      <div className="flex gap-6 text-sm bg-white p-4 rounded-xl shadow">
        <div>
          <p className="text-gray-500">Download</p>
          <p>{(data.summary.total_in_bytes / 1e9).toFixed(2)} GB</p>
        </div>

        <div>
          <p className="text-gray-500">Upload</p>
          <p>{(data.summary.total_out_bytes / 1e9).toFixed(2)} GB</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">

        <table className="w-full text-sm">

          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="p-3">User</th>
              <th>IP</th>
              <th>Router</th>
              <th>Service</th>
              <th>Usage</th>
              <th>Start Time</th>
            </tr>
          </thead>

          <tbody>
            {data.active_sessions.map((s: SessionRow) => (

              <tr
                key={s.id}
                onClick={() => navigate(`/dashboard/sessions/${s.id}`)}
                className="border-b hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="p-3 font-medium">{s.username}</td>

                <td>{s.ip || "-"}</td>

                <td>{s.mikrotik || "-"}</td>

                <td>
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {s.service || "unknown"}
                  </span>
                </td>

                <td>
                  {((s.in_bytes + s.out_bytes) / 1e9).toFixed(2)} GB
                </td>

                <td>
                  {new Date(s.start_time).toLocaleString()}
                </td>

              </tr>

            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default SessionsPage