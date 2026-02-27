import { useEffect, useState } from "react";
import StatCard from "../../components/cards/StatCard";
import RouterTable from "../../components/tables/RouterTable";
import AlertsPanel from "../../components/alerts/AlertsPanel";
// Import your new professional components
//import CurrentHealthCard from "../../components/networkdetailed/CurrentHealthCard";
//import Stats24hCard from "../../components/networkdetailed/Stats24hCard";
//import AlertsList from "../../components/networkdetailed/AlertsList";
//import HealthChart from "../../components/networkdetailed/HealthChart";

import type { NetworkStats, Router } from "../../types/network";
import { getRouters, getNetworkStats } from "../../api/network";
import { mapBackendAlerts } from "../../api/mapper/alertMapper";

export default function NetworkHealth() {
  const [routers, setRouters] = useState<Router[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [routersData, statsData] = await Promise.all([
          getRouters(),
          getNetworkStats()
        ]);
        
        if (isMounted) {
          setRouters(routersData.results);
          setStats(statsData);
          setLoading(false);
        }
      } catch (e) {
        console.error("Data fetch failed", e);
        if (isMounted) {
          setError("Failed to connect to monitoring services.");
          setLoading(false);
        }
      }
    };

    loadData();

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://192.168.100.88:8000/ws/routers/?token=${token}`;
    socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "router_update") {
          const updated = message.data;
          setRouters((prev) => prev.map((r) => r.id === updated.router_id ? { ...r, ...updated } : r));
        }
        if (message.type === "network_stats_update") {
          setStats(message.data);
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    return () => {
      isMounted = false;
      if (socket) socket.close();
    };
  }, []);

  if (loading) return <div className="p-10 flex justify-center items-center font-medium animate-pulse">Initializing Network Dashboard...</div>;
  if (error) return <div className="p-6 text-rose-600 bg-rose-50 m-6 rounded-xl border border-rose-200">{error}</div>;
  if (!stats) return null;

  // Assuming stats contains history and current health for the "Main" router or aggregated view
  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Network Command Center</h1>
          <p className="text-slate-500 text-sm">Real-time health telemetry from MikroTik infrastructure</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            LIVE STREAM ACTIVE
          </span>
        </div>
      </div>

      {/* 2. Top-Level Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Nodes" value={stats.total} />
        <StatCard title="Active" value={stats.online} variant="success" />
        <StatCard title="High Load" value={stats.warning} variant="warning" />
        <StatCard title="Critical/Down" value={stats.offline} variant="danger" />
      </div>

      {/* Main */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RouterTable routers={routers} />
              </div>
              <AlertsPanel alerts={mapBackendAlerts(stats.alerts || [])} />
      
            </div>
      </div>
    
  );
}