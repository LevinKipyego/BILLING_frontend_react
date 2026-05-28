import { apiFetch } from "./client";
import type { Plan } from "../types/plan";

export function listPlans(): Promise<Plan[]> {
  return apiFetch("/plans/");
}

export function createPlan(payload: Partial<Plan>): Promise<Plan> {
  return apiFetch("/plans/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePlan(id: number, payload: Partial<Plan>): Promise<Plan> {
  return apiFetch(`/plans/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePlan(id: number): Promise<void> {
  return apiFetch(`/plans/${id}/`, {
    method: "DELETE",
  });
}
