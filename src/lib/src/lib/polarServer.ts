import { Polar } from '@polar-sh/sdk';
import { supabaseServer as supabase } from './supabaseServer';
import type { SubscriptionTier } from '../types/limits';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.POLAR_API_URL || 'https://api.polar.sh',
});

async function updateUserSubscription(
  userId: string,
  tier: SubscriptionTier,
  subscriptionId?: string
) {
  const updateData: Partial<any> = { subscription_tier: tier };
  if (subscriptionId) (updateData as any).subscription_id = subscriptionId;

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function processPolarWebhook(payload: { type: string; data: any }) {
  switch (payload.type) {
    case 'subscription.created':
    case 'subscription.updated': {
      const subscription = payload.data;
      const userId = subscription.metadata?.userId;
      const tier = subscription.metadata?.tier as SubscriptionTier;
      if (!userId || !tier) return { success: false, error: 'Missing metadata' };
      await updateUserSubscription(userId, tier, subscription.id);
      return { success: true };
    }
    case 'subscription.cancelled':
    case 'subscription.ended': {
      const subscription = payload.data;
      const userId = subscription.metadata?.userId;
      if (!userId) return { success: false, error: 'Missing userId' };
      await updateUserSubscription(userId, 'free');
      return { success: true };
    }
    case 'checkout.completed': {
      const checkout = payload.data;
      const userId = checkout.metadata?.userId;
      if (!userId) return { success: false, error: 'Missing userId' };
      // TODO: handle one-time credit purchase if needed
      return { success: true };
    }
    default:
      return { success: false, error: `Unhandled event type: ${payload.type}` };
  }
}
