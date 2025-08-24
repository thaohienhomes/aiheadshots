// src/lib/credits.ts

import { supabase } from './supabaseClient';
import type { CreditsTransaction } from '../types/supabase';

export interface CreditsCheck {
  hasCredits: boolean;
  remaining: number;
  canGenerate: boolean;
}

export interface CreditsUsageResult {
  success: boolean;
  remaining: number;
  error?: string;
}

export interface CreditsPurchaseResult {
  success: boolean;
  newBalance: number;
  error?: string;
}

/**
 * Check if user has enough credits for generation
 */
export async function checkUserCredits(userId: string): Promise<CreditsCheck> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return {
        hasCredits: false,
        remaining: 0,
        canGenerate: false,
      };
    }

    return {
      hasCredits: profile.credits > 0,
      remaining: profile.credits,
      canGenerate: profile.credits > 0,
    };
  } catch (error) {
    console.error('Error checking user credits:', error);
    return {
      hasCredits: false,
      remaining: 0,
      canGenerate: false,
    };
  }
}

/**
 * Use credits for generation (decrements by 1)
 */
export async function useCreditsForGeneration(
  userId: string,
  description: string = 'AI headshot generation'
): Promise<CreditsUsageResult> {
  try {
    // Use the Supabase function for atomic credit decrement
    const { data, error } = await supabase.rpc('decrement_user_credits', {
      p_user_id: userId,
      p_credits_to_use: 1,
      p_description: description,
    });

    if (error) {
      throw error;
    }

    const result = data[0];
    
    if (!result.success) {
      return {
        success: false,
        remaining: result.remaining_credits,
        error: result.error_message,
      };
    }

    return {
      success: true,
      remaining: result.remaining_credits,
    };
  } catch (error) {
    console.error('Error using credits:', error);
    return {
      success: false,
      remaining: 0,
      error: error instanceof Error ? error.message : 'Failed to use credits',
    };
  }
}

/**
 * Add credits to user account (for purchases)
 */
export async function addCreditsToUser(
  userId: string,
  creditsToAdd: number,
  description: string = 'Credits purchase',
  metadata?: any
): Promise<CreditsPurchaseResult> {
  try {
    // Use the Supabase function for atomic credit addition
    const { data, error } = await supabase.rpc('add_user_credits', {
      p_user_id: userId,
      p_credits_to_add: creditsToAdd,
      p_description: description,
      p_metadata: metadata,
    });

    if (error) {
      throw error;
    }

    const result = data[0];
    
    if (!result.success) {
      return {
        success: false,
        newBalance: 0,
        error: result.error_message,
      };
    }

    return {
      success: true,
      newBalance: result.new_balance,
    };
  } catch (error) {
    console.error('Error adding credits:', error);
    return {
      success: false,
      newBalance: 0,
      error: error instanceof Error ? error.message : 'Failed to add credits',
    };
  }
}

/**
 * Get user's credit transaction history
 */
export async function getUserCreditHistory(userId: string): Promise<CreditsTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('credits_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching credit history:', error);
    return [];
  }
}

/**
 * Get current user credits directly from profile
 */
export async function getCurrentCredits(userId: string): Promise<number> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return 0;
    }

    return profile.credits;
  } catch (error) {
    console.error('Error getting current credits:', error);
    return 0;
  }
}

/**
 * Format credits display
 */
export function formatCreditsDisplay(credits: number): string {
  if (credits === 0) {
    return 'No credits remaining';
  }
  
  if (credits === 1) {
    return '1 credit remaining';
  }
  
  return `${credits} credits remaining`;
}

/**
 * Get credits color for UI display
 */
export function getCreditsColor(credits: number): string {
  if (credits === 0) return 'text-red-400';
  if (credits <= 5) return 'text-orange-400';
  if (credits <= 20) return 'text-yellow-400';
  return 'text-green-400';
}

/**
 * Check if user should be prompted to buy more credits
 */
export function shouldPromptCreditsPurchase(credits: number): boolean {
  return credits <= 5; // Prompt when 5 or fewer credits remaining
}

/**
 * Calculate credits needed for multiple generations
 */
export function calculateCreditsNeeded(generations: number): number {
  return generations; // 1 credit per generation
}

/**
 * Validate credits transaction
 */
export function validateCreditsTransaction(
  currentCredits: number,
  creditsToUse: number
): { valid: boolean; error?: string } {
  if (creditsToUse <= 0) {
    return { valid: false, error: 'Credits to use must be positive' };
  }
  
  if (currentCredits < creditsToUse) {
    return { valid: false, error: 'Insufficient credits' };
  }
  
  return { valid: true };
}

/**
 * Get credits statistics for analytics
 */
export async function getCreditsStats(userId: string): Promise<{
  totalPurchased: number;
  totalUsed: number;
  currentBalance: number;
  transactionCount: number;
}> {
  try {
    const [profile, transactions] = await Promise.all([
      supabase.from('profiles').select('credits').eq('id', userId).single(),
      supabase.from('credits_transactions').select('*').eq('user_id', userId),
    ]);

    const currentBalance = profile.data?.credits || 0;
    const allTransactions = transactions.data || [];

    const totalPurchased = allTransactions
      .filter(t => t.transaction_type === 'purchase')
      .reduce((sum, t) => sum + t.credits_change, 0);

    const totalUsed = Math.abs(
      allTransactions
        .filter(t => t.transaction_type === 'usage')
        .reduce((sum, t) => sum + t.credits_change, 0)
    );

    return {
      totalPurchased,
      totalUsed,
      currentBalance,
      transactionCount: allTransactions.length,
    };
  } catch (error) {
    console.error('Error getting credits stats:', error);
    return {
      totalPurchased: 0,
      totalUsed: 0,
      currentBalance: 0,
      transactionCount: 0,
    };
  }
}
