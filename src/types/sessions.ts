// src/types/session.ts

export interface SessionDetailResponse {
  user: string

  current_session: {
    ip: string | null
    mikrotik: string | null
    service: string | null
    start_time: string
    stop_time: string | null
    is_online: boolean
    duration_seconds: number | null
    estimated_rate_mbps: number
  }

  totals: {
    total_in: number
    total_out: number
  }

  intelligence: {
    multi_login: boolean
    active_sessions: number
  }

  history: {
    start_time: string
    stop_time: string | null
    in_bytes: number
    out_bytes: number
    service_type: string
    mikrotik__identity_name: string
  }[]
}


// session list row typee.g. for dashboard table

export interface SessionRow {
  id: number
  username: string
  ip: string | null
  start_time: string
  in_bytes: number
  out_bytes: number
  mikrotik: string | null
  service: string | null
}

export interface SessionDashboardResponse {
  summary: {
    total_active_users: number
    total_in_bytes: number
    total_out_bytes: number
  }
  active_sessions: SessionRow[]
}