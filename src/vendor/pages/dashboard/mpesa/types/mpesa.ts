import type { MpesaConfigPayload } from "../../../../api/mpesa";
import type TransactionModel from "../../../../types/transactions";

export type MpesaEnvironment = "SANDBOX" | "PRODUCTION";

export interface MpesaConfig extends Partial<MpesaConfigPayload> {
  id?: string | number;
  business_shortcode: string;
  initiator_name?: string;
  callback_url?: string;
  environment: MpesaEnvironment;
  is_url_registered?: boolean;
  b2c_security_credential?: string;
}

export interface MpesaConfigFormValues {
  business_shortcode: string;
  initiator_name: string;
  passkey: string;
  consumer_key: string;
  consumer_secret: string;
  b2c_security_credential: string;
  callback_url: string;
  environment: MpesaEnvironment;
  is_url_registered: boolean;
}

export interface StkTestPayload {
  business_shortcode: string;
  phone_number: string;
  amount: string;
  is_sandbox: boolean;
}

export type StkTestResult = Record<string, unknown>;
export type MpesaTransaction = TransactionModel;

export const createEmptyMpesaForm = (): MpesaConfigFormValues => ({
  business_shortcode: "",
  initiator_name: "",
  passkey: "",
  consumer_key: "",
  consumer_secret: "",
  b2c_security_credential: "",
  callback_url: "",
  environment: "SANDBOX",
  is_url_registered: false,
});
