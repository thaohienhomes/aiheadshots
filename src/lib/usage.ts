// src/lib/usage.ts

import { supabase } from './supabaseClient';
import {
  GENERATION_LIMITS,
  TIER_RESET_PERIODS,
  type SubscriptionTier,
  type UsageCheck
} from '../types/limits';
import type { UsageLimit } from '../types/supabase';
import { checkUserCredits, useCreditsForGeneration } from './credits';

function getCurrentPeriod(tier: SubscriptionTier): { start: string; end: string } {
  const now = new Date();
  
  if (TIER_RESET_PERIODS[tier] === 'lifetime') {
    // For lifetime tiers (free, one_time), use a fixed period
    return {
      start: '2024-01-01',
      end: '2099-12-31',
    };
  }
  
  // For monthly tiers (pro, enterprise), use current month
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

function getNextResetDate(tier: SubscriptionTier): string | undefined {
  if (TIER_RESET_PERIODS[tier] === 'lifetime') {
    return undefined; // Never resets
  }
  
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}

export async function getCurrentUsage(
  userId: string,
  tier: SubscriptionTier
): Promise<UsageCheck> {
  // Handle one-time tier with credits system
  if (tier === 'one_time') {
    try {
      const creditsCheck = await checkUserCredits(userId);
      return {
        allowed: creditsCheck.canGenerate,
        remaining: creditsCheck.remaining,
        used: 0, // Not tracked for credits
        limit: creditsCheck.remaining, // Dynamic limit based on credits
        resetDate: undefined, // Credits don't reset
        tier,
      };
    } catch (error) {
      console.error('Error checking credits:', error);
      return {
        allowed: false,
        remaining: 0,
        used: 0,
        limit: 0,
        resetDate: undefined,
        tier,
      };
    }
  }

  // Handle subscription tiers with monthly/lifetime limits
  const { start, end } = getCurrentPeriod(tier);
  const limit = GENERATION_LIMITS[tier];

  try {
    // Fetch current usage record
    const { data: usage } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('period_start', start)
      .eq('period_end', end)
      .single();

    const used = usage?.generations_used || 0;
    const remaining = Math.max(0, limit - used);
    const allowed = remaining > 0;

    return {
      allowed,
      remaining,
      used,
      limit,
      resetDate: getNextResetDate(tier),
      tier,
    };
  } catch (error) {
    console.error('Error fetching usage:', error);

    // Return safe defaults on error
    return {
      allowed: true,
      remaining: limit,
      used: 0,
      limit,
      resetDate: getNextResetDate(tier),
      tier,
    };
  }
}

export async function checkAndIncrementUsage(
  userId: string,
  tier: SubscriptionTier
): Promise<UsageCheck> {
  // Handle one-time tier with credits system
  if (tier === 'one_time') {
    try {
      const usageResult = await useCreditsForGeneration(userId, 'AI headshot generation');

      return {
        allowed: usageResult.success,
        remaining: usageResult.remaining,
        used: 0, // Not tracked for credits
        limit: usageResult.remaining + (usageResult.success ? 1 : 0), // Approximate limit
        resetDate: undefined, // Credits don't reset
        tier,
      };
    } catch (error) {
      console.error('Error using credits:', error);
      return {
        allowed: false,
        remaining: 0,
        used: 0,
        limit: 0,
        resetDate: undefined,
        tier,
      };
    }
  }

  // Handle subscription tiers with monthly/lifetime limits
  const { start, end } = getCurrentPeriod(tier);
  const limit = GENERATION_LIMITS[tier];

  try {
    // Fetch or create usage record
    let { data: usage, error } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('period_start', start)
      .eq('period_end', end)
      .single();

    if (error && error.code === 'PGRST116') {
      // Record doesn't exist, create it
      const { data: newUsage, error: insertError } = await supabase
        .from('usage_limits')
        .insert({
          user_id: userId,
          period_start: start,
          period_end: end,
          generations_used: 0,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }
      
      usage = newUsage;
    } else if (error) {
      throw error;
    }

    if (!usage) {
      throw new Error('Failed to get or create usage record');
    }

    const used = usage.generations_used;

    // Check if limit is already reached
    if (used >= limit) {
      return {
        allowed: false,
        remaining: 0,
        used,
        limit,
        resetDate: getNextResetDate(tier),
        tier,
      };
    }

    // Increment usage
    const { error: updateError } = await supabase
      .from('usage_limits')
      .update({ generations_used: used + 1 })
      .eq('id', usage.id);

    if (updateError) {
      throw updateError;
    }

    const newUsed = used + 1;
    const remaining = Math.max(0, limit - newUsed);

    return {
      allowed: true,
      remaining,
      used: newUsed,
      limit,
      resetDate: getNextResetDate(tier),
      tier,
    };
  } catch (error) {
    console.error('Error checking/incrementing usage:', error);
    throw new Error('Failed to check generation limits');
  }
}

export async function resetUsageForNewPeriod(
  userId: string,
  tier: SubscriptionTier
): Promise<void> {
  // Only reset for monthly tiers
  if (TIER_RESET_PERIODS[tier] === 'lifetime') {
    return;
  }

  const { start, end } = getCurrentPeriod(tier);

  try {
    // Create new usage record for current period
    await supabase
      .from('usage_limits')
      .upsert({
        user_id: userId,
        period_start: start,
        period_end: end,
        generations_used: 0,
      }, {
        onConflict: 'user_id,period_start,period_end'
      });
  } catch (error) {
    console.error('Error resetting usage for new period:', error);
  }
}

export async function getAllUserUsage(userId: string): Promise<UsageLimit[]> {
  try {
    const { data: usage, error } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .order('period_start', { ascending: false });

    if (error) {
      throw error;
    }

    return usage || [];
  } catch (error) {
    console.error('Error fetching all user usage:', error);
    return [];
  }
}

export function formatUsageMessage(usage: UsageCheck): string {
  const { limit, remaining, resetDate } = usage;
  
  if (remaining === 0) {
    if (resetDate) {
      return `You've used all ${limit} generations for this month. Resets on ${new Date(resetDate).toLocaleDateString()}.`;
    } else {
      return `You've used all ${limit} generations. Upgrade to continue.`;
    }
  }
  
  if (resetDate) {
    return `${remaining} of ${limit} generations remaining this month.`;
  } else {
    return `${remaining} of ${limit} generations remaining.`;
  }
}

export function shouldShowUpgradePrompt(usage: UsageCheck): boolean {
  const { remaining, tier } = usage;
  
  // Show upgrade prompt when:
  // 1. No generations remaining
  // 2. Free tier with low remaining generations
  // 3. One-time tier with low remaining generations
  
  if (remaining === 0) {
    return tier !== 'enterprise'; // Enterprise users can't upgrade further
  }
  
  if (tier === 'free' && remaining <= 1) {
    return true;
  }
  
  if (tier === 'one_time' && remaining <= 10) {
    return true;
  }
  
  return false;
}

export function getRecommendedUpgrade(tier: SubscriptionTier): SubscriptionTier | null {
  switch (tier) {
    case 'free':
    case 'one_time':
      return 'pro';
    case 'pro':
      return 'enterprise';
    case 'enterprise':
      return null; // Already at highest tier
    default:
      return 'pro';
  }
}
