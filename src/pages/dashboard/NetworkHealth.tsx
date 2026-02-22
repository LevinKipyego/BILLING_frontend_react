import { useEffect, useState } from "react";
import StatCard from "../../components/cards/StatCard";
import RouterTable from "../../components/tables/RouterTable";
import AlertsPanel from "../../components/alerts/AlertsPanel";
import type { NetworkStats, Router, Alert } from "../../types/network";
import { getRouters, getNetworkStats } from "../../api/network";
import { mapBackendAlerts } from "../../api/mapper/alertMapper";


export default function NetworkHealth() {
  const [routers, setRouters] = useState<Router[]>([]);

  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    setLoading(true);

    try {
      const routersData = await getRouters();
      console.log("Routers OK:", routersData);
      setRouters(routersData.results);
    } catch (e) {
      console.error("Routers failed", e);
    }

    try {
      const statsData = await getNetworkStats();
      console.log("Stats OK:", statsData);
      setStats(statsData);
    } catch (e) {
      console.error("Stats failed", e);
    }

    setLoading(false);
  };

  loadData();
}, []);


  if (loading) {
    return <div className="p-6">Loading network status…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Network Health</h1>
        <p className="text-gray-500">
          Live status of network devices
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Routers" value={stats.total} />
        <StatCard title="Online" value={stats.online} variant="success" />
        <StatCard title="Warning" value={stats.warning} variant="warning" />
        <StatCard title="Offline" value={stats.offline} variant="danger" />
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
