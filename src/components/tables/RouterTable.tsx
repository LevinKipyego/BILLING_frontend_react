import RouterRow from "./RouterRow";
import type { Router } from "../../types/network";

interface RouterTableProps {
  routers: Router[];
}

export default function RouterTable({ routers }: RouterTableProps) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left text-gray-500">
            <th className="p-3">Router</th>
            <th>Status</th>
            <th>CPU</th>
            <th>Memory</th>
            <th>Temp</th>
            <th>Latency</th>
            <th>Sessions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(routers) && routers.length > 0 ? (
    routers.map((router: Router) => (
      <RouterRow key={router.id} router={router} />
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center text-gray-500 py-4">
        No routers found
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}
