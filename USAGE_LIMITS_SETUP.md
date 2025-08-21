# Generation Limits Enforcement Setup Guide

This guide explains how to set up and manage generation limits for different subscription tiers in the AI Headshot Platform.

## Overview

The usage limits system provides:
- **Tier-based Limits**: Different generation limits per subscription tier
- **Usage Tracking**: Real-time tracking of generations per user per billing cycle
- **Automatic Enforcement**: Prevents generation when limits are reached
- **Smart Upgrades**: Contextual upgrade prompts based on usage

## 1. Supabase Schema Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- TRACK GENERATION USAGE PER USER
CREATE TABLE IF NOT EXISTS public.usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generations_used INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, period_start, period_end)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON public.usage_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_period ON public.usage_limits(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_period ON public.usage_limits(user_id, period_start, period_end);

-- Enable Row Level Security (RLS)
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own usage" ON public.usage_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.usage_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON public.usage_limits
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.usage_limits TO authenticated;
GRANT ALL ON public.usage_limits TO service_role;
```

## 2. Subscription Tiers & Limits

The system supports four subscription tiers with different limits:

| Tier | Limit | Reset Period | Price | Description |
|------|-------|--------------|-------|-------------|
| **Free** | 3 generations | Lifetime | $0 | Trial tier for new users |
| **One-Time** | 100 generations | Lifetime | $49 | One-time purchase pack |
| **Pro** | 100 generations | Monthly | $29/month | Professional monthly plan |
| **Enterprise** | 1000 generations | Monthly | $99/month | Business monthly plan |

### Limit Configuration

```typescript
// src/types/limits.ts
export const GENERATION_LIMITS: Record<SubscriptionTier, number> = {
  free: 3,           // 3 generations total (lifetime)
  one_time: 100,     // 100 generations (one-time pack)
  pro: 100,          // 100 generations per month
  enterprise: 1000,  // 1000 generations per month
};

export const TIER_RESET_PERIODS: Record<SubscriptionTier, 'lifetime' | 'monthly'> = {
  free: 'lifetime',      // Never resets
  one_time: 'lifetime',  // Never resets
  pro: 'monthly',        // Resets monthly
  enterprise: 'monthly', // Resets monthly
};
```

## 3. Usage Tracking System

### Core Functions

**Check Current Usage:**
```typescript
import { getCurrentUsage } from '../lib/usage';

const usage = await getCurrentUsage(userId, tier);
console.log(`Used: ${usage.used}/${usage.limit}, Remaining: ${usage.remaining}`);
```

**Check and Consume Generation:**
```typescript
import { checkAndIncrementUsage } from '../lib/usage';

const result = await checkAndIncrementUsage(userId, tier);
if (result.allowed) {
  // Proceed with generation
  console.log(`Generation allowed. ${result.remaining} remaining.`);
} else {
  // Show upgrade prompt
  console.log('Generation limit reached. Upgrade required.');
}
```

### Period Management

**Monthly Tiers (Pro/Enterprise):**
- Period: 1st of month to last day of month
- Auto-resets on the 1st of each month
- Usage tracked per calendar month

**Lifetime Tiers (Free/One-Time):**
- Period: Fixed lifetime period (2024-01-01 to 2099-12-31)
- Never resets automatically
- Usage accumulates over entire account lifetime

## 4. Frontend Integration

### Usage Hook

```typescript
import { useUsage } from '../hooks/useUsage';

function MyComponent() {
  const { 
    stats,           // Usage statistics
    canGenerate,     // Boolean: can user generate?
    shouldUpgrade,   // Boolean: should show upgrade prompt?
    checkCanGenerate // Function: check before generation
  } = useUsage();

  const handleGenerate = async () => {
    const { canGenerate, message } = await checkCanGenerate();
    if (!canGenerate) {
      alert(message); // Show limit message
      return;
    }
    // Proceed with generation
  };
}
```

### Dashboard Integration

```typescript
// Usage statistics display
<div className="usage-stats">
  <h3>Generation Usage</h3>
  <p>{stats.used}/{stats.limit} generations used</p>
  <ProgressBar value={stats.percentage} />
  <p>{stats.message}</p>
  
  {shouldUpgrade && (
    <Button onClick={() => upgradeToTier('pro')}>
      Upgrade for More Generations
    </Button>
  )}
</div>
```

## 5. Enforcement Points

### AI Generation Flow

The system enforces limits at the generation creation point:

```typescript
// src/lib/aiOrchestrator.ts
export async function createAIGeneration(params: GenerationParams) {
  // 1. Get user's subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', params.userId)
    .single();

  // 2. Check and increment usage
  const usageResult = await checkAndIncrementUsage(params.userId, profile.subscription_tier);
  
  if (!usageResult.allowed) {
    throw new Error(`Generation limit reached. ${usageResult.remaining} remaining.`);
  }

  // 3. Proceed with AI generation
  // ... rest of generation logic
}
```

### Summary Page

```typescript
// src/components/pages/Summary.tsx
const handleStartProcessing = async () => {
  // Check limits before processing
  const { canGenerate, message } = await checkCanGenerate();
  
  if (!canGenerate) {
    setError(message);
    return;
  }
  
  // Proceed with generation (usage consumed automatically)
  await createAIGeneration(params);
};
```

## 6. User Experience

### Limit Messages

The system provides contextual messages based on usage:

```typescript
// Examples of generated messages:
"3 of 3 generations remaining."
"You've used all 100 generations for this month. Resets on March 1st."
"You've used all 3 generations. Upgrade to continue."
"97 of 100 generations remaining this month."
```

### Upgrade Prompts

Smart upgrade prompts appear when:
- User has 0 generations remaining
- Free tier users have ≤1 generation remaining
- One-time tier users have ≤10 generations remaining

### Progress Indicators

Visual progress bars with color coding:
- **Green**: >50% remaining
- **Yellow**: 20-50% remaining  
- **Orange**: 1-20% remaining
- **Red**: 0% remaining (limit reached)

## 7. Admin & Analytics

### Usage Analytics

```typescript
// Get all usage data for a user
const allUsage = await getAllUserUsage(userId);

// Calculate monthly usage trends
const monthlyUsage = allUsage.filter(u => 
  u.period_start.startsWith('2024-03')
);
```

### Bulk Operations

```sql
-- Reset usage for all users (emergency use only)
UPDATE public.usage_limits 
SET generations_used = 0 
WHERE period_start = '2024-03-01';

-- Get usage statistics
SELECT 
  p.subscription_tier,
  AVG(ul.generations_used) as avg_usage,
  COUNT(*) as user_count
FROM public.usage_limits ul
JOIN public.profiles p ON ul.user_id = p.id
WHERE ul.period_start = '2024-03-01'
GROUP BY p.subscription_tier;
```

## 8. Testing

### Test Scenarios

1. **Free Tier Limit**:
   - Create free user
   - Generate 3 headshots
   - Verify 4th generation is blocked

2. **Monthly Reset**:
   - Pro user at limit
   - Simulate month change
   - Verify usage resets

3. **Upgrade Flow**:
   - Free user at limit
   - Upgrade to Pro
   - Verify new limits apply

### Test Data

```sql
-- Create test usage record
INSERT INTO public.usage_limits (user_id, period_start, period_end, generations_used)
VALUES ('user-uuid', '2024-03-01', '2024-03-31', 95);
```

## 9. Monitoring & Alerts

### Key Metrics

- **Usage Distribution**: Track usage across tiers
- **Limit Hit Rate**: How often users hit limits
- **Conversion Rate**: Limit hits → upgrades
- **Monthly Active Users**: Users generating content

### Alerts

Set up monitoring for:
- High error rates in usage tracking
- Users consistently hitting limits
- Unusual usage patterns
- Database performance issues

## 10. Troubleshooting

### Common Issues

**Usage Not Tracking:**
- Check RLS policies are enabled
- Verify user authentication
- Check database permissions

**Limits Not Enforcing:**
- Verify enforcement points are implemented
- Check subscription tier mapping
- Test with different user tiers

**Performance Issues:**
- Monitor database query performance
- Check index usage
- Consider caching for high-traffic users

This completes the generation limits enforcement system. Users now have clear usage tracking, automatic limit enforcement, and contextual upgrade prompts based on their subscription tier and usage patterns.
