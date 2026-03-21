-- Atlas Capture: Add Profile Extensions

-- Add Payment Address and Tax Info columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS payment_address TEXT,
ADD COLUMN IF NOT EXISTS tax_info TEXT;

-- (Optional) Make sure users can update these fields:
-- The existing RLS UPDATE policy on profiles (using auth.uid() = id) 
-- will automatically allow updating these new columns.
