import HealthBadge from "../badges/HealthBadge";
import type { Router, RouterStatus } from "../../types/network";

interface RouterRowProps {
  router: Router;
}

export default function RouterRow({ router }: RouterRowProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div className="font-medium">{router.router_name}</div>
        <div className="text-xs text-gray-500">{router.ip}</div>
      </td>
      <td>
        <HealthBadge status={router.status as RouterStatus} />
      </td>
      <td>{router.cpu}%</td>
      <td>{router.memory}%</td>
      <td>{router.temperature}°C</td>
      <td>{router.latency === 0 ? "-" : `${router.latency} ms`}</td>
      <td>{router.pppoe_sessions}</td>
      <td className="text-right pr-3">
        <button className="text-blue-600 hover:underline text-xs">
          View
        </button>
      </td>
    </tr>
  );
}
