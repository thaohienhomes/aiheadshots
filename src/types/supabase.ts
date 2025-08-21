// src/types/supabase.ts

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'one_time' | 'pro' | 'enterprise';
  subscription_id?: string;
  credits: number;
  created_at: string;
};

export type Upload = {
  id: string;
  user_id: string;
  file_url: string;
  status: 'pending' | 'processing' | 'failed' | 'completed';
  created_at: string;
};

export type Generation = {
  id: string;
  upload_id: string;
  model: string;
  style?: string;
  personal_info?: {
    age?: number;
    ethnicity?: string;
    preferences?: string[];
  };
  result_url?: string;
  status: 'queued' | 'processing' | 'failed' | 'completed';
  created_at: string;
  completed_at?: string;
};

export type UsageLimit = {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  generations_used: number;
  created_at: string;
};

export type CreditsTransaction = {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus';
  credits_change: number;
  credits_balance: number;
  description?: string;
  metadata?: any;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      uploads: {
        Row: Upload;
        Insert: Omit<Upload, 'id' | 'created_at'>;
        Update: Partial<Omit<Upload, 'id'>>;
      };
      generations: {
        Row: Generation;
        Insert: Omit<Generation, 'id' | 'created_at' | 'completed_at'>;
        Update: Partial<Omit<Generation, 'id'>>;
      };
      usage_limits: {
        Row: UsageLimit;
        Insert: Omit<UsageLimit, 'id' | 'created_at'>;
        Update: Partial<Omit<UsageLimit, 'id'>>;
      };
      credits_transactions: {
        Row: CreditsTransaction;
        Insert: Omit<CreditsTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<CreditsTransaction, 'id'>>;
      };
    };
  };
};
