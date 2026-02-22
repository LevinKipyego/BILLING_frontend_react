import type { RouterStatus } from "../../types/network";

interface HealthBadgeProps {
  status: RouterStatus;
}

const styles: Record<RouterStatus, string> = {
  healthy: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  down: "bg-red-100 text-red-700",
};

export default function HealthBadge({ status }: HealthBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}
