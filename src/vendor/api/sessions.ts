// src/api/session.ts

import { apiFetch } from "./client" // adjust path if needed
import type { SessionDetailResponse } from "../types/sessions"

export const fetchSessionDetail = async (id: number) => {
  return await apiFetch(`/sessions/${id}/`) as SessionDetailResponse
}


export const fetchSessions = async () => {
  return await apiFetch("/sessions/dashboard/")
}