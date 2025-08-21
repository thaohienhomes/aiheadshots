# Polar Payments Integration Setup Guide

This guide explains how to set up Polar for payments and subscription management in the AI Headshot Platform.

## Overview

The Polar integration provides:
- **Subscription Management**: Free, Pro, and Enterprise tiers
- **Secure Payments**: Handled entirely by Polar
- **Webhook Sync**: Automatic subscription status updates
- **Access Control**: Generation limits based on subscription tier

## 1. Polar Account Setup

### Create Polar Account
1. Sign up at [Polar.sh](https://polar.sh)
2. Create a new organization
3. Set up your products and pricing

### Configure Products
Create three products in Polar dashboard:

**Free Plan** (for reference only):
- Name: "Free Plan"
- Price: $0
- Features: 5 generations/month

**Pro Plan**:
- Name: "Pro Plan" 
- Price: $29/month
- Features: 100 generations/month, premium styles, 4K quality

**Enterprise Plan**:
- Name: "Enterprise Plan"
- Price: $99/month  
- Features: Unlimited generations, custom styles, API access

### Get API Credentials
1. Go to Settings → API Keys
2. Copy your Client ID and Client Secret
3. Note your webhook signing secret

## 2. Environment Variables

Add to your `.env` file:

```bash
# Polar Configuration
VITE_POLAR_CLIENT_ID=your_polar_client_id
VITE_POLAR_CLIENT_SECRET=your_polar_client_secret
VITE_POLAR_API_URL=https://api.polar.sh
VITE_POLAR_WEBHOOK_SECRET=your_webhook_secret
```

## 3. Supabase Schema Update

Add subscription_id column to profiles table:

```sql
-- Add subscription_id column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id 
ON public.profiles(subscription_id);

-- Update existing users to have free tier
UPDATE public.profiles 
SET subscription_tier = 'free' 
WHERE subscription_tier IS NULL;
```

## 4. Webhook Setup

### Deploy Webhook Endpoint

**Option 1: Vercel**
Create `/api/polar-webhook.js`:

```javascript
import { polarWebhookHandler } from '../src/api/polar-webhook';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['polar-signature'];
    const rawBody = JSON.stringify(req.body);
    
    const result = await polarWebhookHandler(req.body, signature, rawBody);
    
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

**Option 2: Netlify Functions**
Create `/.netlify/functions/polar-webhook.js`:

```javascript
import { polarWebhookHandler } from '../../src/api/polar-webhook';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const signature = event.headers['polar-signature'];
  const payload = JSON.parse(event.body);
  
  const result = await polarWebhookHandler(payload, signature, event.body);
  
  return {
    statusCode: result.success ? 200 : 400,
    body: JSON.stringify(result),
  };
};
```

### Configure Webhook in Polar

1. Go to Polar Dashboard → Webhooks
2. Add webhook URL: `https://your-app.vercel.app/api/polar-webhook`
3. Select events:
   - `subscription.created`
   - `subscription.updated` 
   - `subscription.cancelled`
   - `subscription.ended`
   - `payment.succeeded`
   - `payment.failed`
4. Set webhook secret

## 5. Frontend Integration

### Pricing Section
The PricingSection component now integrates with Polar:

```typescript
import { useSubscription } from '../hooks/useSubscription';

const { upgradeToTier, currentTier } = useSubscription();

// Upgrade button handler
const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
  await upgradeToTier(tier); // Redirects to Polar checkout
};
```

### Dashboard Integration
The Dashboard shows subscription status and upgrade CTAs:

```typescript
// Shows current plan badge
<Badge className="bg-purple-500/10 text-purple-400">
  <Crown className="w-3 h-3 mr-1" />
  {currentTier.toUpperCase()} Plan
</Badge>

// Upgrade CTA for free users
{currentTier === 'free' && (
  <Button onClick={() => upgradeToTier('pro')}>
    Upgrade to Pro
  </Button>
)}
```

## 6. Access Control Implementation

### Generation Limits
```typescript
import { useSubscription } from '../hooks/useSubscription';

const { checkGenerationLimit } = useSubscription();

// Before starting generation
const { canGenerate, remaining } = checkGenerationLimit(currentGenerations);

if (!canGenerate) {
  // Show upgrade prompt
  return <UpgradePrompt />;
}
```

### Subscription Tiers & Limits

**Free Tier**:
- 5 generations per month
- 3 basic styles
- Standard quality
- Email support

**Pro Tier** ($29/month):
- 100 generations per month
- All premium styles  
- High quality (4K)
- Priority support
- Commercial license

**Enterprise Tier** ($99/month):
- Unlimited generations
- Custom styles
- Ultra quality (8K)
- Dedicated support
- API access
- White-label options

## 7. Testing

### Test Webhook Locally
1. Use ngrok to expose local server:
   ```bash
   ngrok http 3000
   ```

2. Set ngrok URL as webhook in Polar dashboard

3. Test subscription flow:
   - Create test subscription
   - Verify webhook receives events
   - Check Supabase profile updates

### Test Payment Flow
1. Use Polar test mode
2. Create test checkout session
3. Complete test payment
4. Verify subscription activation

## 8. Production Deployment

### Security Checklist
- ✅ Webhook signature verification enabled
- ✅ HTTPS endpoints only
- ✅ Environment variables secured
- ✅ Rate limiting on webhook endpoints
- ✅ Error logging and monitoring

### Monitoring
- Set up alerts for failed webhooks
- Monitor subscription metrics
- Track conversion rates
- Log payment failures

## 9. Customer Support

### Billing Management
Users can manage their subscriptions through:
1. Polar customer portal (link in dashboard)
2. Direct cancellation via dashboard
3. Support email for complex issues

### Common Issues
- **Payment Failed**: Retry payment or update payment method
- **Webhook Delays**: Webhooks may take up to 5 minutes
- **Subscription Not Updated**: Check webhook logs and retry

## 10. Advanced Features

### Custom Pricing
For enterprise customers, you can create custom pricing:

```typescript
// Custom checkout session
const result = await createCheckoutSession(userId, 'enterprise', {
  customPrice: 149, // Custom price
  features: ['Custom feature 1', 'Custom feature 2']
});
```

### Usage Analytics
Track subscription metrics:

```typescript
// Get subscription analytics
const analytics = await getSubscriptionAnalytics();
console.log('MRR:', analytics.monthlyRecurringRevenue);
console.log('Churn Rate:', analytics.churnRate);
```

This completes the Polar integration setup. The system now supports full subscription management with secure payments and automatic access control.
