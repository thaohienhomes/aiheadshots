// src/lib/polar.ts

import { Polar } from '@polar-sh/sdk';
import { supabase } from './supabaseClient';
import type { Profile } from '../types/supabase';

// Initialize Polar client
const polar = new Polar({
  accessToken: import.meta.env.VITE_POLAR_CLIENT_SECRET!,
  server: import.meta.env.VITE_POLAR_API_URL || 'https://api.polar.sh',
});

export type SubscriptionTier = 'free' | 'one_time' | 'pro' | 'enterprise';

export interface PricingPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    generations: number | 'unlimited';
    styles: number | 'unlimited';
    downloads: number | 'unlimited';
  };
}

// Pricing plans configuration
export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '5 AI headshots per month',
      'Basic styles',
      'Standard quality',
      'Email support'
    ],
    limits: {
      generations: 5,
      styles: 3,
      downloads: 5
    }
  },
  one_time: {
    id: 'one_time',
    name: 'One-Time Pack',
    tier: 'one_time',
    price: 19,
    currency: 'USD',
    interval: 'month', // Not used for one-time
    features: [
      '100 AI headshots',
      'Multiple styles',
      'High quality',
      'No subscription',
      'Commercial license',
      'Email support'
    ],
    limits: {
      generations: 100,
      styles: 'unlimited',
      downloads: 100
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      '100 AI headshots per month',
      'All premium styles',
      'High quality (4K)',
      'Priority support',
      'Commercial license'
    ],
    limits: {
      generations: 100,
      styles: 'unlimited',
      downloads: 100
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited AI headshots',
      'Custom styles',
      'Ultra quality (8K)',
      'Dedicated support',
      'API access',
      'White-label options'
    ],
    limits: {
      generations: 'unlimited',
      styles: 'unlimited',
      downloads: 'unlimited'
    }
  }
};

export async function createCheckoutSession(
  userId: string,
  plan: 'one_time' | 'pro' | 'enterprise',
  successUrl?: string,
  cancelUrl?: string
): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  try {
    console.log('Creating Polar checkout session for:', { userId, plan });

    // Get user profile for email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    const pricingPlan = PRICING_PLANS[plan];
    
    // Create checkout session with Polar
    const checkoutSession = await polar.checkouts.create({
      productPriceId: pricingPlan.id, // This should be the actual Polar product price ID
      successUrl: successUrl || `${window.location.origin}/dashboard?upgrade=success`,
      cancelUrl: cancelUrl || `${window.location.origin}/dashboard?upgrade=cancelled`,
      customerEmail: profile.email,
      metadata: {
        userId,
        plan,
        tier: pricingPlan.tier
      }
    });

    return {
      success: true,
      checkoutUrl: checkoutSession.url
    };
  } catch (error) {
    console.error('Polar checkout creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    };
  }
}

export async function createOneTimePackCheckout(
  userId: string,
  successUrl?: string,
  cancelUrl?: string
): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  try {
    console.log('Creating one-time pack checkout for user:', userId);

    // Get user profile for email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    // Create checkout session with Polar for one-time pack
    const checkoutSession = await polar.checkouts.create({
      productPriceId: 'polar_one_time_pack_id', // Configure this in Polar dashboard
      successUrl: successUrl || `${window.location.origin}/dashboard?purchase=success`,
      cancelUrl: cancelUrl || `${window.location.origin}/pricing?purchase=cancelled`,
      customerEmail: profile.email,
      metadata: {
        userId,
        plan: 'one_time',
        tier: 'one_time',
        credits: '100'
      }
    });

    return {
      success: true,
      checkoutUrl: checkoutSession.url
    };
  } catch (error) {
    console.error('One-time pack checkout creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create one-time pack checkout'
    };
  }
}

export async function getSubscriptionStatus(subscriptionId: string): Promise<{
  success: boolean;
  subscription?: any;
  error?: string;
}> {
  try {
    const subscription = await polar.subscriptions.get({
      id: subscriptionId
    });

    return {
      success: true,
      subscription
    };
  } catch (error) {
    console.error('Polar subscription fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subscription'
    };
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await polar.subscriptions.cancel({
      id: subscriptionId
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Polar subscription cancellation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    };
  }
}

export async function updateUserSubscription(
  userId: string,
  tier: SubscriptionTier,
  subscriptionId?: string
): Promise<{
  success: boolean;
  profile?: Profile;
  error?: string;
}> {
  try {
    const updateData: Partial<Profile> = {
      subscription_tier: tier
    };

    // Add subscription_id if provided
    if (subscriptionId) {
      (updateData as any).subscription_id = subscriptionId;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      profile
    };
  } catch (error) {
    console.error('User subscription update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update subscription'
    };
  }
}

export async function processPolarWebhook(payload: {
  type: string;
  data: any;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('Processing Polar webhook:', payload.type);

    switch (payload.type) {
      case 'subscription.created':
      case 'subscription.updated': {
        const subscription = payload.data;
        const userId = subscription.metadata?.userId;
        const tier = subscription.metadata?.tier as SubscriptionTier;

        if (!userId || !tier) {
          console.warn('Missing userId or tier in subscription metadata');
          return { success: false, error: 'Missing metadata' };
        }

        const result = await updateUserSubscription(
          userId,
          tier,
          subscription.id
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        console.log('Subscription updated successfully:', userId, tier);
        break;
      }

      case 'checkout.completed': {
        // Handle one-time pack purchases
        const checkout = payload.data;
        const userId = checkout.metadata?.userId;
        const productId = checkout.product_id;

        if (!userId) {
          console.warn('Missing userId in checkout metadata');
          return { success: false, error: 'Missing userId' };
        }

        if (productId === 'polar_one_time_pack_id') {
          const creditsToAdd = parseInt(checkout.metadata?.credits || '100');

          // Add credits to user account using Supabase function
          const { data: addResult, error: addError } = await supabase.rpc('add_user_credits', {
            p_user_id: userId,
            p_credits_to_add: creditsToAdd,
            p_description: 'One-time pack purchase',
            p_metadata: {
              checkout_id: checkout.id,
              product_id: productId,
              amount: checkout.amount,
              currency: checkout.currency
            }
          });

          if (addError) {
            throw new Error(`Failed to add credits: ${addError.message}`);
          }

          // Update user's tier to one_time if they're currently free
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', userId)
            .single();

          if (profile?.subscription_tier === 'free') {
            await supabase
              .from('profiles')
              .update({ subscription_tier: 'one_time' })
              .eq('id', userId);
          }

          console.log(`Added ${creditsToAdd} credits to user ${userId} via one-time pack`);
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.ended': {
        const subscription = payload.data;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.warn('Missing userId in subscription metadata');
          return { success: false, error: 'Missing userId' };
        }

        const result = await updateUserSubscription(userId, 'free');

        if (!result.success) {
          throw new Error(result.error);
        }

        console.log('Subscription cancelled, user downgraded to free:', userId);
        break;
      }

      case 'payment.succeeded': {
        // Handle successful payment if needed
        console.log('Payment succeeded:', payload.data.id);
        break;
      }

      case 'payment.failed': {
        // Handle failed payment if needed
        console.log('Payment failed:', payload.data.id);
        break;
      }

      default:
        console.log('Unhandled Polar webhook event:', payload.type);
    }

    return { success: true };
  } catch (error) {
    console.error('Polar webhook processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Webhook processing failed'
    };
  }
}

export function getSubscriptionLimits(tier: SubscriptionTier) {
  return PRICING_PLANS[tier].limits;
}

export function canUserGenerate(
  tier: SubscriptionTier,
  currentGenerations: number
): boolean {
  const limits = getSubscriptionLimits(tier);
  
  if (limits.generations === 'unlimited') {
    return true;
  }
  
  return currentGenerations < limits.generations;
}

export function getRemainingGenerations(
  tier: SubscriptionTier,
  currentGenerations: number
): number | 'unlimited' {
  const limits = getSubscriptionLimits(tier);
  
  if (limits.generations === 'unlimited') {
    return 'unlimited';
  }
  
  return Math.max(0, limits.generations - currentGenerations);
}
