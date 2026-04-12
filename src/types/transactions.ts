
export default interface Transaction {
  id: number;
  transaction_uuid: string;

  client_phone: string;
  username: string;
  mac: string;
  ip: string;
  sessionid: string;

  service_type: string;
  payment_mode: string;

  amount: string; // ⚠️ comes as string from API
  status: string;

  merchant_request_id: string;
  checkout_request_id: string;
  mpesa_receipt: string;

  expires_at: string | null;
  callback_received_at: string | null;
  last_query_time: string | null;

  query_count: number;

  link_login: string;
  code_6char: string;

  mikrotik_identity_name: string;

  created_at: string;
  updated_at: string;

  vendor: string;     // UUID
  plan: number;
  mikrotik: string;  // UUID
}