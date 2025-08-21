// src/hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  createCheckoutSession, 
  getSubscriptionStatus, 
  cancelSubscription,
  getSubscriptionLimits,
  canUserGenerate,
  getRemainingGenerations,
  PRICING_PLANS,
  type SubscriptionTier 
} from '../lib/polar';

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  canUpgrade: boolean;
  limits: {
    generations: number | 'unlimited';
    styles: number | 'unlimited';
    downloads: number | 'unlimited';
  };
}

export function useSubscription() {
  const { user, profile } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    loading: false,
    error: null,
    canUpgrade: true,
    limits: PRICING_PLANS.free.limits
  });

  // Update limits when profile changes
  useEffect(() => {
    if (profile) {
      const limits = getSubscriptionLimits(profile.subscription_tier);
      setState(prev => ({
        ...prev,
        limits,
        canUpgrade: profile.subscription_tier !== 'enterprise'
      }));
    }
  }, [profile]);

  const upgradeToTier = async (tier: 'pro' | 'enterprise') => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return { success: false, error: 'User not authenticated' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await createCheckoutSession(user.id, tier);
      
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
      const errorMessage = error instanceof Error ? error.message : 'Upgrade failed';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  const cancelCurrentSubscription = async () => {
    if (!user || !profile?.subscription_id) {
      setState(prev => ({ ...prev, error: 'No active subscription found' }));
      return { success: false, error: 'No active subscription found' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await cancelSubscription(profile.subscription_id);
      
      setState(prev => ({ ...prev, loading: false }));
      
      if (result.success) {
        // Refresh user data to get updated subscription status
        // This will be handled by the webhook, but we can also refresh manually
        return { success: true };
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error || 'Failed to cancel subscription' 
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Cancellation failed';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  const checkGenerationLimit = (currentGenerations: number): {
    canGenerate: boolean;
    remaining: number | 'unlimited';
    isAtLimit: boolean;
  } => {
    if (!profile) {
      return {
        canGenerate: false,
        remaining: 0,
        isAtLimit: true
      };
    }

    const canGenerate = canUserGenerate(profile.subscription_tier, currentGenerations);
    const remaining = getRemainingGenerations(profile.subscription_tier, currentGenerations);
    const isAtLimit = !canGenerate && remaining !== 'unlimited';

    return {
      canGenerate,
      remaining,
      isAtLimit
    };
  };

  const getUpgradeRecommendation = (currentGenerations: number): {
    shouldUpgrade: boolean;
    recommendedTier: 'pro' | 'enterprise' | null;
    reason: string;
  } => {
    if (!profile || profile.subscription_tier === 'enterprise') {
      return {
        shouldUpgrade: false,
        recommendedTier: null,
        reason: ''
      };
    }

    const { isAtLimit } = checkGenerationLimit(currentGenerations);

    if (profile.subscription_tier === 'free' && isAtLimit) {
      return {
        shouldUpgrade: true,
        recommendedTier: 'pro',
        reason: 'You\'ve reached your free tier limit. Upgrade to Pro for 100 generations per month.'
      };
    }

    if (profile.subscription_tier === 'pro' && currentGenerations > 80) {
      return {
        shouldUpgrade: true,
        recommendedTier: 'enterprise',
        reason: 'You\'re using most of your Pro allowance. Upgrade to Enterprise for unlimited generations.'
      };
    }

    return {
      shouldUpgrade: false,
      recommendedTier: null,
      reason: ''
    };
  };

  const getCurrentPlan = () => {
    if (!profile) return PRICING_PLANS.free;
    return PRICING_PLANS[profile.subscription_tier];
  };

  const getAvailableUpgrades = (): SubscriptionTier[] => {
    if (!profile) return ['pro', 'enterprise'];
    
    switch (profile.subscription_tier) {
      case 'free':
        return ['pro', 'enterprise'];
      case 'pro':
        return ['enterprise'];
      case 'enterprise':
        return [];
      default:
        return ['pro', 'enterprise'];
    }
  };

  return {
    // State
    loading: state.loading,
    error: state.error,
    canUpgrade: state.canUpgrade,
    limits: state.limits,
    
    // Current subscription info
    currentTier: profile?.subscription_tier || 'free',
    currentPlan: getCurrentPlan(),
    hasActiveSubscription: profile?.subscription_id != null,
    
    // Actions
    upgradeToTier,
    cancelCurrentSubscription,
    
    // Utilities
    checkGenerationLimit,
    getUpgradeRecommendation,
    getAvailableUpgrades,
    
    // Plans
    plans: PRICING_PLANS,
  };
}
