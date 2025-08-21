-- Supabase Schema Update for One-Time Pack Credits System
-- Run this in your Supabase SQL editor

-- Add credits column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INT DEFAULT 0;

-- Create index for credits lookups
CREATE INDEX IF NOT EXISTS idx_profiles_credits ON public.profiles(credits);

-- Update existing users to have 0 credits by default
UPDATE public.profiles 
SET credits = 0 
WHERE credits IS NULL;

-- Add constraint to ensure credits are never negative
ALTER TABLE public.profiles 
ADD CONSTRAINT check_credits_non_negative 
CHECK (credits >= 0);

-- Create a credits_transactions table for audit trail (optional but recommended)
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

-- Create indexes for credits transactions
CREATE INDEX IF NOT EXISTS idx_credits_transactions_user_id ON public.credits_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_type ON public.credits_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credits_transactions_created_at ON public.credits_transactions(created_at);

-- Enable Row Level Security (RLS) for credits transactions
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credits transactions
CREATE POLICY "Users can view their own credit transactions" ON public.credits_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage credit transactions" ON public.credits_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.credits_transactions TO authenticated;
GRANT ALL ON public.credits_transactions TO service_role;

-- Function to safely decrement credits with transaction logging
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

  -- Check if user exists
  IF current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found';
    RETURN;
  END IF;

  -- Check if user has enough credits
  IF current_credits < p_credits_to_use THEN
    RETURN QUERY SELECT FALSE, current_credits, 'Insufficient credits';
    RETURN;
  END IF;

  -- Calculate new balance
  new_balance := current_credits - p_credits_to_use;

  -- Update credits
  UPDATE public.profiles
  SET credits = new_balance
  WHERE id = p_user_id;

  -- Log transaction
  INSERT INTO public.credits_transactions (
    user_id,
    transaction_type,
    credits_change,
    credits_balance,
    description
  ) VALUES (
    p_user_id,
    'usage',
    -p_credits_to_use,
    new_balance,
    p_description
  );

  RETURN QUERY SELECT TRUE, new_balance, NULL::TEXT;
END;
$$;

-- Function to add credits with transaction logging
CREATE OR REPLACE FUNCTION public.add_user_credits(
  p_user_id UUID,
  p_credits_to_add INT,
  p_description TEXT DEFAULT 'Credits purchase',
  p_metadata JSONB DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, new_balance INT, error_message TEXT)
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

  -- Check if user exists
  IF current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found';
    RETURN;
  END IF;

  -- Calculate new balance
  new_balance := current_credits + p_credits_to_add;

  -- Update credits
  UPDATE public.profiles
  SET credits = new_balance
  WHERE id = p_user_id;

  -- Log transaction
  INSERT INTO public.credits_transactions (
    user_id,
    transaction_type,
    credits_change,
    credits_balance,
    description,
    metadata
  ) VALUES (
    p_user_id,
    'purchase',
    p_credits_to_add,
    new_balance,
    p_description,
    p_metadata
  );

  RETURN QUERY SELECT TRUE, new_balance, NULL::TEXT;
END;
$$;
