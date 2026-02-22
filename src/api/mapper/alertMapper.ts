import type { Alert } from "../../types/network";

export interface BackendAlert {
  id: string;
  identity_name: string;
  latest_cpu: number;
  latest_temperature: number;
  latest_status:string;
}

export function mapBackendAlerts(
  backendAlerts: BackendAlert[]
): Alert[] {
  return backendAlerts.map((a) => ({
    routerId: a.id,
    routerName: a.identity_name,
    cpu: a.latest_cpu,
    temperature: a.latest_temperature,
    status:a.latest_status,
    severity:
      a.latest_status === "down" ? "critical" : (a.latest_cpu >= 90 || a.latest_temperature >= 80 ? "critical" : "warning"),
      
  }));
}
