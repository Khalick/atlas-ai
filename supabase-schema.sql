-- Atlas Capture Database Schema
-- Run this in the Supabase SQL Editor

-- Users profile table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT '',
    earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    hours_worked INTEGER NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'PayPal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Videos / Tasks table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    payout NUMERIC(4, 2) NOT NULL,
    segments INTEGER NOT NULL,
    video_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Videos: anyone authenticated can read videos
CREATE POLICY "Authenticated users can view videos" ON public.videos
    FOR SELECT TO authenticated USING (true);

-- Videos: anyone authenticated can insert videos (admin functionality)
CREATE POLICY "Authenticated users can insert videos" ON public.videos
    FOR INSERT TO authenticated WITH CHECK (true);

-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, earnings, tasks_completed, hours_worked)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 0, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone authenticated can upload
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'videos');

-- Storage policy: anyone can view videos (public bucket)
CREATE POLICY "Public can view videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'videos');
