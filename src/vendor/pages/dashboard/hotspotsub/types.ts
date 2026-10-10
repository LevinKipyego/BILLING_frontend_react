import type { HotspotSubscription } from "../../../types/subscriptions";
import type { Plan } from "../../../types/plan";

export interface SubscriptionFormState {
  plan: number | "";
  user: number;
  user_name: string;
  credential_password: string;
  plan_name: string;
  transaction_code: string;
  credential: number;
  start_at: string;
  end_at: string;
  active: boolean;
  created_by_transaction: number | "";
}

export interface SubscriptionFiltersState {
  search: string;
  statusFilter: string;
  sortOrder: "asc" | "desc";
}

export interface SubscriptionFormModalProps {
  open: boolean;
  editingId: number | null;
  form: SubscriptionFormState;
  plans: Plan[];
  saving?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export type SubscriptionRecord = HotspotSubscription;
