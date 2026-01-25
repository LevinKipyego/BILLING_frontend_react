export interface Plan {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
  rate_limit?: string;
  mikrotik_profile?: string;
}
