import { apiFetch } from "./client";
import type { RouterDetailResponse } from "../types/networkdetailed";

/**
 * Fetch router detail by ID
 */
export async function fetchRouterDetail(
  id: string
): Promise<RouterDetailResponse> {
  return apiFetch(`/network/routers/${id}/`)
}