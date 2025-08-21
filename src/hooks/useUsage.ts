// src/hooks/useUsage.ts

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  getCurrentUsage, 
  checkAndIncrementUsage,
  formatUsageMessage,
  shouldShowUpgradePrompt,
  getRecommendedUpgrade
} from '../lib/usage';
import type { UsageCheck, SubscriptionTier } from '../types/limits';

interface UsageState {
  usage: UsageCheck | null;
  loading: boolean;
  error: string | null;
}

export function useUsage() {
  const { user, profile } = useAuth();
  const [state, setState] = useState<UsageState>({
    usage: null,
    loading: false,
    error: null,
  });

  const tier: SubscriptionTier = profile?.subscription_tier || 'free';

  // Fetch current usage when user or tier changes
  useEffect(() => {
    if (user && profile) {
      fetchCurrentUsage();
    }
  }, [user, profile?.subscription_tier]);

  const fetchCurrentUsage = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const usage = await getCurrentUsage(user.id, tier);
      setState(prev => ({
        ...prev,
        usage,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching usage:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch usage',
      }));
    }
  };

  const checkCanGenerate = async (): Promise<{
    canGenerate: boolean;
    usage: UsageCheck;
    message: string;
  }> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const usage = await getCurrentUsage(user.id, tier);
      
      setState(prev => ({
        ...prev,
        usage,
        loading: false,
      }));

      return {
        canGenerate: usage.allowed,
        usage,
        message: formatUsageMessage(usage),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check usage';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      throw new Error(errorMessage);
    }
  };

  const consumeGeneration = async (): Promise<{
    success: boolean;
    usage: UsageCheck;
    message: string;
  }> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const usage = await checkAndIncrementUsage(user.id, tier);
      
      setState(prev => ({
        ...prev,
        usage,
        loading: false,
      }));

      return {
        success: usage.allowed,
        usage,
        message: formatUsageMessage(usage),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to consume generation';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return {
        success: false,
        usage: state.usage || {
          allowed: false,
          remaining: 0,
          used: 0,
          limit: 0,
          tier,
        },
        message: errorMessage,
      };
    }
  };

  const refreshUsage = () => {
    fetchCurrentUsage();
  };

  const getUsageStats = () => {
    if (!state.usage) {
      return {
        used: 0,
        remaining: 0,
        limit: 0,
        percentage: 0,
        message: 'Loading usage...',
        showUpgrade: false,
        recommendedTier: null,
      };
    }

    const { used, remaining, limit } = state.usage;
    const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;

    return {
      used,
      remaining,
      limit,
      percentage,
      message: formatUsageMessage(state.usage),
      showUpgrade: shouldShowUpgradePrompt(state.usage),
      recommendedTier: getRecommendedUpgrade(tier),
    };
  };

  const getUsageColor = (): string => {
    if (!state.usage) return 'text-slate-400';
    
    const { remaining, limit } = state.usage;
    const percentage = limit > 0 ? (remaining / limit) * 100 : 100;
    
    if (percentage === 0) return 'text-red-400';
    if (percentage <= 20) return 'text-orange-400';
    if (percentage <= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressColor = (): string => {
    if (!state.usage) return 'bg-slate-600';
    
    const { remaining, limit } = state.usage;
    const percentage = limit > 0 ? (remaining / limit) * 100 : 100;
    
    if (percentage === 0) return 'bg-red-500';
    if (percentage <= 20) return 'bg-orange-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return {
    // State
    usage: state.usage,
    loading: state.loading,
    error: state.error,
    
    // Current tier info
    tier,
    
    // Actions
    checkCanGenerate,
    consumeGeneration,
    refreshUsage,
    
    // Computed values
    stats: getUsageStats(),
    usageColor: getUsageColor(),
    progressColor: getProgressColor(),
    
    // Utilities
    canGenerate: state.usage?.allowed ?? false,
    isAtLimit: state.usage?.remaining === 0,
    shouldUpgrade: state.usage ? shouldShowUpgradePrompt(state.usage) : false,
  };
}
