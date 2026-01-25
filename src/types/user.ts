// ===================== user.ts =====================
export type ServiceType = 'HOTSPOT' | 'PPPOE';


export interface User {
id: number;
full_name?: string;
email?: string;
phone?: string;
address?: string;
location?: string;


username?: string;
service_type: ServiceType;
plan: number;
vendor: number;


pppoe_created?: boolean; // backend should return this
created_at?: string;
}


export interface CreateUserPayload {
full_name?: string;
email?: string;
phone?: string;
address?: string;
location?: string;


service_type: ServiceType;
plan: number;
}