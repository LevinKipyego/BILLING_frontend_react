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

export interface RouterDetailResponse {
  router: RouterInfo
  current_health: CurrentHealth
  stats_24h: Stats24h
  recent_alerts: AlertItem[]
  health_history: HealthHistoryItem[]
}