export interface Plan {
  id: number;
  name: string;
  price: number | string;
  duration_minutes: number;
  rate_limit?: string;
  mikrotik_profile?: string;
  mikrotik?: string;
  service_type?: "HOTSPOT" | "PPPOE" | "IPOE";
}

export type TimeUnit = "minutes" | "hours" | "days";
export type TabType = "directory" | "hotspot_html" | "configs";