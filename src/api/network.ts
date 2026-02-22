import { apiFetch } from "./client";

export const getRouters = () =>
  apiFetch("/network/routers/");
  

export const getNetworkStats = () =>
  apiFetch("/network/stats/");
