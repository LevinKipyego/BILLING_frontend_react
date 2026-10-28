

import {
  apiGet,
  apiPost,
} from "../../../../api/client";

import type {
  DeploymentCreatePayload,
  PreviewDeploymentResponse,
  RouterDiscoveryResponse,
} from "../types/networkDeployment";


/* -------------------------------------------------- */
/* Create Deployment                                  */
/* -------------------------------------------------- */

export function createDeployment<T = unknown>(
  payload: DeploymentCreatePayload,
) {
  return apiPost<T>(
    "/network-deployments/create/",
    payload,
  );
}


/* -------------------------------------------------- */
/* Preview Deployment                                 */
/* -------------------------------------------------- */

export function previewDeployment(
  deploymentId: string,
) {
  return apiPost<PreviewDeploymentResponse>(
    `/network-deployments/${deploymentId}/preview/`,
  );
}

/* -------------------------------------------------- */
/* Apply                                              */
/* -------------------------------------------------- */

export interface ApplyDeploymentResponse {
  status:
    | "success"
    | "error";

  deployment_id: string;

  message?: string;

  operations?: Array<{
    id: string;
    sequence: number;
    resource_type: string;
    router_path: string;
    router_id?: string | null;
    status: string;
  }>;
}


/* -------------------------------------------------- */
/* Apply Deployment                                   */
/* -------------------------------------------------- */

export function applyDeployment(
  deploymentId: string,
) {
  return apiPost<ApplyDeploymentResponse>(
    `/network-deployments/${deploymentId}/apply/`,
  );
}


/* -------------------------------------------------- */
/* Deployment Status                                  */
/* -------------------------------------------------- */

export function getDeploymentStatus<T = unknown>(
  deploymentId: string,
) {
  return apiGet<T>(
    `/network-deployments/${deploymentId}/status/`,
  );
}


/* -------------------------------------------------- */
/* Deployment Logs                                    */
/* -------------------------------------------------- */

export function getDeploymentLogs<T = unknown>(
  deploymentId: string,
) {
  return apiGet<T>(
    `/network-deployments/${deploymentId}/logs/`,
  );
}


/* -------------------------------------------------- */
/* Rollback                                           */
/* -------------------------------------------------- */

export function rollbackDeployment<T = unknown>(
  deploymentId: string,
) {
  return apiPost<T>(
    `/network-deployments/${deploymentId}/rollback/`,
  );
}


/* -------------------------------------------------- */
/* Router Discovery                                   */
/* -------------------------------------------------- */



export function discoverRouter(
  payload: {
    mikrotik_id: string;
  },
) {
  return apiPost<RouterDiscoveryResponse>(
    "/network-deployments/discovery/",
    payload,
  );
}