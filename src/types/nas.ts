export interface NAS {
  id: number;
  nasname: string;
  shortname?: string;
  type: string;
  ports?: number;
  secret?: string;
  server?: string;
  community?: string;
  description?: string;
}
