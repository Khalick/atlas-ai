-- Atlas Capture: AI Training Questions Schema Update
-- Run this in the Supabase SQL Editor AFTER the initial schema

-- Add accuracy tracking fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_answered INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_answers INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS accuracy NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS is_paused BOOLEAN NOT NULL DEFAULT false;

-- Drop old videos table (no longer needed)
DROP TABLE IF EXISTS public.videos;

-- Questions table for AI training
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    question_text TEXT NOT NULL,
    image_url TEXT,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read questions
CREATE POLICY "Authenticated users can view questions" ON public.questions
    FOR SELECT TO authenticated USING (true);

-- Allow service role to insert questions (for our generation script)
CREATE POLICY "Service role can insert questions" ON public.questions
    FOR INSERT WITH CHECK (true);
