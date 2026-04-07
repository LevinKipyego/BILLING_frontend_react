// src/types/network.ts
export type RouterStatus = "healthy" | "warning" | "down";
import type { BackendAlert } from "../api/mapper/alertMapper";
export interface Router {
  
  id: number;
  ip: string;
  router_name: string;
  vendor: string;
  cpu: number;
  memory: number;
  temperature: number;
  latency: number;
  pppoe_sessions: number;
  status: string;
  created_at: string;
}


export interface NetworkStats {
  total: number;
  online: number;
  warning: number;
  offline: number;
  avg_cpu: number;
  avg_latency: number;
  status:string;
  alerts: BackendAlert[];


}

export type AlertSeverity = "warning" | "critical";

export interface Alert {
  routerId: string;
  routerName: string;
  cpu: number;
  temperature: number;
  severity: AlertSeverity;
  status:string;
}

