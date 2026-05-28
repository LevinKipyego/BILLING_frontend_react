export interface RouterInfo {
  id: number
  name: string
  ip: string
}

export interface CurrentHealth {
  status: "healthy" | "warning" | "down"
  cpu: number
  memory: number
  latency: number
  temperature: number
  pppoe_sessions: number
}

export interface Stats24h {
  avg_cpu: number
  avg_latency: number
  max_temperature: number | null
  uptime_percent: number
  current_down_minutes: number
  last_down_minutes: number
  total_down_minutes_24h: number
}

export interface AlertItem {
  status: "warning" | "down"
  cpu: number
  temperature: number
  created_at: string
}              
export interface HealthHistoryItem {
  created_at: string
  cpu: number
  memory: number
  latency: number
  temperature: number
}

export interface uplink_history {   
  timestamp: string
  rx_rate: number
  tx_rate: number
  total_mbps: number
  total_bytes: number
}

export interface RouterDetailResponse {
  router: RouterInfo
  current_health: CurrentHealth
  stats_24h: Stats24h
  recent_alerts: AlertItem[]
  health_history: HealthHistoryItem[]

  interfaces: RouterIntelligence
  
  
}


export type RiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical"

export interface InterfaceData {

  name: string,
  rx_rate: number
  tx_rate: number             
  trend_slope: number
  predicted_30min: number
  saturation_rx: boolean
  saturation_tx: boolean
  absolute_saturation: boolean
  burst_rx: boolean,
  burst_tx: boolean

  packet_drop_alert: boolean
  congestion_predicted: boolean
  alerts: string[]
  anomaly_score: number
  risk_level: RiskLevel
  capacity_mbps?: number
  throughput_24h_gb?: number

}

export interface RouterIntelligence {
  uplink: InterfaceData | null
  downlinks: InterfaceData[]
  uplink_detected_as: string[]
  any_port_down: boolean
  suspicious_idle_ports: string[]
  network_health_score: number
  network_alerts: string[]
  uplink_history: uplink_history[]
}
