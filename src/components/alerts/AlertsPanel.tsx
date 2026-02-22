import type { Alert } from "../../types/network"; 

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-3">Alerts</h3>
        <p className="text-sm text-gray-500">No active alerts 🎉</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="font-semibold mb-3">Alerts</h3>

      <ul className="space-y-2 text-sm">
        {alerts.map((alert, index) => (
          <li
            key={`${alert.routerId}-${index}`}
            className={
              alert.severity === "critical"
                ? "text-red-600"
                : "text-yellow-600"
            }
          >
            <strong>{alert.routerName} </strong>   — CPU {alert.cpu}% · Temp{" "}
            {alert.temperature}°C !!
            <strong> {alert.status === "down" && " (Router is down)"} </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
