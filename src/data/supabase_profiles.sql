-- 1. Create a public profiles table optimized for Twitch authentication
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create public user_quiz_completions table to track daily completed quizzes
CREATE TABLE IF NOT EXISTS public.user_quiz_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_type VARCHAR(50) NOT NULL, -- 'overwatch', 'games', 'flags'
    completed_date DATE DEFAULT CURRENT_DATE NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, quiz_type, completed_date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for Profiles table
CREATE POLICY "Permitir lectura publica de perfiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Permitir actualizar propio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for quiz completions table
CREATE POLICY "Permitir lectura propia de quiz completados"
ON public.user_quiz_completions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Permitir insercion propia de quiz completados"
ON public.user_quiz_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Create trigger function to register profiles with Twitch metadata on signup
CREATE OR REPLACE FUNCTION public.handle_new_twitch_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, avatar_url, points)
    VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'preferred_username',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1)
        ),
        new.raw_user_meta_data->>'avatar_url',
        0
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_twitch_user();

-- ============================================================
-- ADDITIONS FOR STREAKS & MONTHLY LEADERBOARD SYSTEM
-- ============================================================

-- 1. Add streak tracking to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_streak_date DATE;

-- 2. Create monthly leaderboards table to store historical snapshots
CREATE TABLE IF NOT EXISTS public.monthly_leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_month VARCHAR(7) UNIQUE NOT NULL, -- e.g. '2026-07'
    leaderboard_data JSONB NOT NULL, -- Array of top 10 users: [{username, avatar_url, points}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for monthly leaderboards
ALTER TABLE public.monthly_leaderboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de historial mensual" 
ON public.monthly_leaderboards FOR SELECT 
USING (true);

-- 3. Create database function to archive leaderboard and reset points for the new month
CREATE OR REPLACE FUNCTION public.rotate_monthly_leaderboard(target_year_month TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    leaderboard_exists BOOLEAN;
    top_users JSONB;
BEGIN
    -- Check if the leaderboard snapshot for this month already exists
    SELECT EXISTS(SELECT 1 FROM public.monthly_leaderboards WHERE year_month = target_year_month) INTO leaderboard_exists;
    
    IF leaderboard_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Get top 10 users by points
    SELECT json_agg(u) INTO top_users FROM (
        SELECT username, avatar_url, points 
        FROM public.profiles 
        ORDER BY points DESC 
        LIMIT 10
    ) u;
    
    -- Insert the snapshot
    INSERT INTO public.monthly_leaderboards (year_month, leaderboard_data)
    VALUES (target_year_month, COALESCE(top_users, '[]'::jsonb));
    
    -- Reset all user points to 0 for the new month
    UPDATE public.profiles SET points = 0;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

