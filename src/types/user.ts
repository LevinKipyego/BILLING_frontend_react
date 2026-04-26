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
vendor_name: string;
plan_name: string;
session_status?: string; // backend should return this
expires_at?: string; // backend should return this
active?: boolean; // backend should return this
mac?: string; // backend should return this
client_ip?: string; // backend should return this

code_6char?: string; // backend should return this
mikrotik_identity_name?: string; // backend should return this


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