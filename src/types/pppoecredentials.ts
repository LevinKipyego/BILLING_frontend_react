export interface PPPoECredential {
  id: number;

  user: number;
  user_name?: string;

  username: string;

  active: boolean;
  suspended: boolean;

  created_at: string;
  trial_expires_at: string | null;
}


export interface PPPoECredentialCreate {
  user: number;
  username: string;
  password: string;

  active?: boolean;
  suspended?: boolean;
  trial_expires_at?: string | null;
}