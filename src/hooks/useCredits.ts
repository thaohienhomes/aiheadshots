// src/hooks/useCredits.ts

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  checkUserCredits,
  getCurrentCredits,
  getUserCreditHistory,
  getCreditsStats,
  formatCreditsDisplay,
  getCreditsColor,
  shouldPromptCreditsPurchase
} from '../lib/credits';
import { createOneTimePackCheckout } from '../lib/polar';
import type { CreditsTransaction } from '../types/supabase';

interface CreditsState {
  credits: number;
  loading: boolean;
  error: string | null;
  history: CreditsTransaction[];
  stats: {
    totalPurchased: number;
    totalUsed: number;
    currentBalance: number;
    transactionCount: number;
  };
}

export function useCredits() {
  const { user, profile } = useAuth();
  const [state, setState] = useState<CreditsState>({
    credits: 0,
    loading: false,
    error: null,
    history: [],
    stats: {
      totalPurchased: 0,
      totalUsed: 0,
      currentBalance: 0,
      transactionCount: 0,
    },
  });

  const isOneTimeTier = profile?.subscription_tier === 'one_time';

  // Fetch credits data when user changes
  useEffect(() => {
    if (user && isOneTimeTier) {
      fetchCreditsData();
    }
  }, [user, isOneTimeTier]);

  // Update credits from profile when it changes
  useEffect(() => {
    if (profile && isOneTimeTier) {
      setState(prev => ({
        ...prev,
        credits: profile.credits,
      }));
    }
  }, [profile?.credits, isOneTimeTier]);

  const fetchCreditsData = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [credits, history, stats] = await Promise.all([
        getCurrentCredits(user.id),
        getUserCreditHistory(user.id),
        getCreditsStats(user.id),
      ]);

      setState(prev => ({
        ...prev,
        credits,
        history,
        stats,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching credits data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch credits data',
      }));
    }
  };

  const refreshCredits = () => {
    if (user && isOneTimeTier) {
      fetchCreditsData();
    }
  };

  const purchaseCredits = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await createOneTimePackCheckout(user.id);
      
      if (result.success && result.checkoutUrl) {
        // Redirect to Polar checkout
        window.location.href = result.checkoutUrl;
        return { success: true };
      } else {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error || 'Failed to create checkout session' 
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  const checkCanGenerate = async (): Promise<{
    canGenerate: boolean;
    remaining: number;
    message: string;
  }> => {
    if (!user) {
      return {
        canGenerate: false,
        remaining: 0,
        message: 'User not authenticated',
      };
    }

    try {
      const creditsCheck = await checkUserCredits(user.id);
      
      return {
        canGenerate: creditsCheck.canGenerate,
        remaining: creditsCheck.remaining,
        message: formatCreditsDisplay(creditsCheck.remaining),
      };
    } catch (error) {
      return {
        canGenerate: false,
        remaining: 0,
        message: 'Error checking credits',
      };
    }
  };

  const getCreditsDisplay = () => {
    return {
      text: formatCreditsDisplay(state.credits),
      color: getCreditsColor(state.credits),
      shouldPromptPurchase: shouldPromptCreditsPurchase(state.credits),
    };
  };

  const getUsagePercentage = (): number => {
    if (state.stats.totalPurchased === 0) return 0;
    return Math.round((state.stats.totalUsed / state.stats.totalPurchased) * 100);
  };

  const getRecentTransactions = (limit: number = 5): CreditsTransaction[] => {
    return state.history.slice(0, limit);
  };

  const getTotalCreditsEarned = (): number => {
    return state.history
      .filter(t => t.transaction_type === 'purchase' || t.transaction_type === 'bonus')
      .reduce((sum, t) => sum + t.credits_change, 0);
  };

  const getTotalCreditsUsed = (): number => {
    return Math.abs(
      state.history
        .filter(t => t.transaction_type === 'usage')
        .reduce((sum, t) => sum + t.credits_change, 0)
    );
  };

  return {
    // State
    credits: state.credits,
    loading: state.loading,
    error: state.error,
    history: state.history,
    stats: state.stats,
    
    // Computed values
    display: getCreditsDisplay(),
    usagePercentage: getUsagePercentage(),
    recentTransactions: getRecentTransactions(),
    totalEarned: getTotalCreditsEarned(),
    totalUsed: getTotalCreditsUsed(),
    
    // Checks
    hasCredits: state.credits > 0,
    isLowOnCredits: shouldPromptCreditsPurchase(state.credits),
    isOneTimeTier,
    
    // Actions
    refreshCredits,
    purchaseCredits,
    checkCanGenerate,
    
    // Utilities
    formatDisplay: (credits: number) => formatCreditsDisplay(credits),
    getColor: (credits: number) => getCreditsColor(credits),
  };
}
