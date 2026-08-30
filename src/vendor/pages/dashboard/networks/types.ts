
export type RouterStatus = 'healthy' | 'down' | 'warning';

export interface RouterData {
  id: string;
  router_name: string;
  OSversion: string;
  Model: string;
  ip: string;
  status: RouterStatus;
  cpu: number;
  temperature: number;
  memory: number;
  latency: number;
  pppoe_sessions: number;
}

export interface RouterApiResponse {
  results: RouterData[];
}