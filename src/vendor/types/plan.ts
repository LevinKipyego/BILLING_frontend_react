export interface Plan {
  id: number;
  is_featured: boolean;
  name: string;
  price: number;
  duration_minutes: number;
  rate_limit?: string;
  mikrotik_profile?: string;
}
