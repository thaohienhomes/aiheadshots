// src/types/limits.ts

export type SubscriptionTier = 'free' | 'one_time' | 'pro' | 'enterprise';

export const GENERATION_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,           // 3 generations total (lifetime)
  one_time: 100,     // 100 generations (one-time pack)
  pro: 100,          // 100 generations per month
  enterprise: 1000,  // 1000 generations per month
};

export const TIER_DESCRIPTIONS: Record<SubscriptionTier, string> = {
  free: '3 generations (lifetime)',
  one_time: '100 generations (one-time)',
  pro: '100 generations per month',
  enterprise: '1000 generations per month',
};

export const TIER_RESET_PERIODS: Record<SubscriptionTier, 'lifetime' | 'monthly'> = {
  free: 'lifetime',      // Never resets
  one_time: 'lifetime',  // Never resets
  pro: 'monthly',        // Resets monthly
  enterprise: 'monthly', // Resets monthly
};

export interface UsageLimit {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  generations_used: number;
  created_at: string;
}

export interface UsageCheck {
  allowed: boolean;
  remaining: number;
  used: number;
  limit: number;
  resetDate?: string;
  tier: SubscriptionTier;
}
