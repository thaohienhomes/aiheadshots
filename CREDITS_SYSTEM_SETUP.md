# One-Time Pack Credits System Setup Guide

This guide explains how to set up and manage the one-time pack credits system for the AI Headshot Platform.

## Overview

The credits system provides:
- **One-Time Purchases**: Users can buy credit packs without subscriptions
- **Credit Tracking**: Real-time credit balance and transaction history
- **Atomic Operations**: Thread-safe credit consumption and addition
- **Audit Trail**: Complete transaction logging for all credit operations

## 1. Supabase Schema Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Add credits column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INT DEFAULT 0;

-- Create credits transactions table for audit trail
CREATE TABLE IF NOT EXISTS public.credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
  credits_change INT NOT NULL, -- positive for additions, negative for usage
  credits_balance INT NOT NULL, -- balance after transaction
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create atomic functions for credit operations
CREATE OR REPLACE FUNCTION public.decrement_user_credits(
  p_user_id UUID,
  p_credits_to_use INT DEFAULT 1,
  p_description TEXT DEFAULT 'AI headshot generation'
)
RETURNS TABLE(success BOOLEAN, remaining_credits INT, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits INT;
  new_balance INT;
BEGIN
  -- Get current credits with row lock
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF current_credits < p_credits_to_use THEN
    RETURN QUERY SELECT FALSE, current_credits, 'Insufficient credits';
    RETURN;
  END IF;

  -- Update credits and log transaction
  new_balance := current_credits - p_credits_to_use;
  
  UPDATE public.profiles SET credits = new_balance WHERE id = p_user_id;
  
  INSERT INTO public.credits_transactions (
    user_id, transaction_type, credits_change, credits_balance, description
  ) VALUES (
    p_user_id, 'usage', -p_credits_to_use, new_balance, p_description
  );

  RETURN QUERY SELECT TRUE, new_balance, NULL::TEXT;
END;
$$;
```

## 2. Pricing Configuration

### One-Time Pack Details

| Feature | Value |
|---------|-------|
| **Price** | $19 |
| **Credits** | 100 |
| **Tier** | `one_time` |
| **Reset** | Never (lifetime credits) |

### Polar Product Setup

1. Create product in Polar dashboard:
   - Name: "One-Time Pack"
   - Price: $19
   - Type: One-time purchase
   - Product ID: `polar_one_time_pack_id`

2. Configure metadata fields:
   - `userId`: User ID for credit assignment
   - `credits`: Number of credits to add (100)
   - `plan`: "one_time"

## 3. Frontend Integration

### Credits Hook Usage

```typescript
import { useCredits } from '../hooks/useCredits';

function MyComponent() {
  const { 
    credits,           // Current credit balance
    hasCredits,        // Boolean: has any credits
    isLowOnCredits,    // Boolean: should prompt purchase
    purchaseCredits,   // Function: buy more credits
    checkCanGenerate   // Function: check before generation
  } = useCredits();

  const handleGenerate = async () => {
    const { canGenerate, message } = await checkCanGenerate();
    if (!canGenerate) {
      alert(message); // Show insufficient credits message
      return;
    }
    // Proceed with generation
  };
}
```

### Pricing Section Integration

```typescript
// One-time pack in pricing tiers
{
  id: 'one_time',
  name: 'One-Time Pack',
  price: '$19',
  period: 'one-time',
  description: 'Perfect for occasional use',
  features: [
    '100 AI headshots',
    'Multiple styles',
    'High quality',
    'No subscription',
    'Commercial license'
  ],
  buttonText: 'Buy Now',
  onClick: () => purchaseCredits()
}
```

### Dashboard Integration

```typescript
// Credits display for one-time tier users
{isOneTimeTier && (
  <div className="credits-display">
    <h3>Credits Remaining</h3>
    <p className={creditsDisplay.color}>
      {credits} credits available
    </p>
    
    {isLowOnCredits && (
      <Button onClick={purchaseCredits}>
        Buy More Credits
      </Button>
    )}
  </div>
)}
```

## 4. Usage Enforcement

### AI Generation Flow

```typescript
// src/lib/usage.ts - Credits handling
export async function checkAndIncrementUsage(userId: string, tier: SubscriptionTier) {
  if (tier === 'one_time') {
    // Use credits system
    const usageResult = await useCreditsForGeneration(userId);
    
    return {
      allowed: usageResult.success,
      remaining: usageResult.remaining,
      tier: 'one_time'
    };
  }
  
  // Handle other tiers with monthly limits
  return checkSubscriptionUsage(userId, tier);
}
```

### Credit Consumption

```typescript
// src/lib/credits.ts - Atomic credit usage
export async function useCreditsForGeneration(userId: string) {
  const { data, error } = await supabase.rpc('decrement_user_credits', {
    p_user_id: userId,
    p_credits_to_use: 1,
    p_description: 'AI headshot generation'
  });

  const result = data[0];
  
  return {
    success: result.success,
    remaining: result.remaining_credits,
    error: result.error_message
  };
}
```

## 5. Polar Webhook Integration

### Checkout Completion Handler

```typescript
// src/lib/polar.ts - Webhook processing
case 'checkout.completed': {
  const checkout = payload.data;
  const userId = checkout.metadata?.userId;
  const productId = checkout.product_id;

  if (productId === 'polar_one_time_pack_id') {
    const creditsToAdd = parseInt(checkout.metadata?.credits || '100');
    
    // Add credits using atomic function
    await supabase.rpc('add_user_credits', {
      p_user_id: userId,
      p_credits_to_add: creditsToAdd,
      p_description: 'One-time pack purchase',
      p_metadata: {
        checkout_id: checkout.id,
        product_id: productId,
        amount: checkout.amount
      }
    });

    // Update user tier if currently free
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
  }
  break;
}
```

## 6. User Experience

### Purchase Flow

1. **User clicks "Buy Now"** on one-time pack
2. **Redirect to Polar checkout** with user metadata
3. **User completes payment** on Polar
4. **Webhook processes purchase** and adds credits
5. **User returns to dashboard** with credits available
6. **Generate headshots** using credits

### Credit Messages

```typescript
// Dynamic credit messages
const getCreditsMessage = (credits: number) => {
  if (credits === 0) return 'No credits remaining';
  if (credits === 1) return '1 credit remaining';
  return `${credits} credits remaining`;
};

// Color coding
const getCreditsColor = (credits: number) => {
  if (credits === 0) return 'text-red-400';      // No credits
  if (credits <= 5) return 'text-orange-400';    // Low credits
  if (credits <= 20) return 'text-yellow-400';   // Medium credits
  return 'text-green-400';                       // Plenty of credits
};
```

### Purchase Prompts

Smart prompts appear when:
- User has 0 credits (blocking)
- User has ≤5 credits (warning)
- User attempts generation without credits

## 7. Analytics & Monitoring

### Credit Statistics

```typescript
// Get user credit analytics
const stats = await getCreditsStats(userId);

console.log({
  totalPurchased: stats.totalPurchased,  // Total credits bought
  totalUsed: stats.totalUsed,            // Total credits consumed
  currentBalance: stats.currentBalance,   // Current credits
  transactionCount: stats.transactionCount // Total transactions
});
```

### Transaction History

```sql
-- Get user's credit transaction history
SELECT 
  transaction_type,
  credits_change,
  credits_balance,
  description,
  created_at
FROM public.credits_transactions
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
```

### Business Metrics

```sql
-- Credits revenue analysis
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as purchases,
  SUM(credits_change) as credits_sold,
  AVG(credits_change) as avg_pack_size
FROM public.credits_transactions
WHERE transaction_type = 'purchase'
GROUP BY month
ORDER BY month DESC;
```

## 8. Testing

### Test Scenarios

1. **Credit Purchase**:
   - Create test checkout in Polar
   - Verify webhook adds credits
   - Check transaction logging

2. **Credit Usage**:
   - Generate headshot with credits
   - Verify atomic decrement
   - Check remaining balance

3. **Insufficient Credits**:
   - Attempt generation with 0 credits
   - Verify blocking behavior
   - Check error messages

### Test Data

```sql
-- Add test credits to user
SELECT public.add_user_credits(
  'user-uuid'::UUID,
  50,
  'Test credits',
  '{"test": true}'::JSONB
);

-- Check user's credit balance
SELECT credits FROM public.profiles WHERE id = 'user-uuid';
```

## 9. Security Considerations

### Database Security

- **Row Level Security**: Users can only access their own transactions
- **Atomic Functions**: Thread-safe credit operations
- **Audit Trail**: Complete transaction logging
- **Constraints**: Prevent negative credit balances

### Webhook Security

- **Signature Verification**: Validate Polar webhook signatures
- **Metadata Validation**: Verify user IDs and product IDs
- **Error Handling**: Graceful failure recovery
- **Idempotency**: Handle duplicate webhook events

## 10. Troubleshooting

### Common Issues

**Credits Not Added After Purchase:**
- Check webhook logs for errors
- Verify Polar product ID matches
- Check user metadata in checkout

**Credit Decrement Failures:**
- Check for concurrent access issues
- Verify user has sufficient credits
- Review database function logs

**Performance Issues:**
- Monitor database query performance
- Check for lock contention
- Consider credit caching for high-traffic users

This completes the one-time pack credits system. Users can now purchase credit packs without subscriptions, with full transaction tracking and atomic credit operations.
