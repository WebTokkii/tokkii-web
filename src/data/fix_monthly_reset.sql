-- ============================================================
-- FIX MONTHLY RESET & RLS POLICIES FOR LEADERBOARD SNAPSHOTS
-- ============================================================

-- 1. Ensure monthly_leaderboards table exists
CREATE TABLE IF NOT EXISTS public.monthly_leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_month VARCHAR(7) UNIQUE NOT NULL, -- e.g. '2026-07'
    leaderboard_data JSONB NOT NULL, -- Array of top 10 users: [{username, avatar_url, points, role}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable RLS and add full policies
ALTER TABLE public.monthly_leaderboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de historial mensual" ON public.monthly_leaderboards;
DROP POLICY IF EXISTS "Permitir insercion publica de historial mensual" ON public.monthly_leaderboards;

CREATE POLICY "Permitir lectura publica de historial mensual" 
ON public.monthly_leaderboards FOR SELECT 
USING (true);

CREATE POLICY "Permitir insercion publica de historial mensual" 
ON public.monthly_leaderboards FOR INSERT 
WITH CHECK (true);

-- 3. Fixed database RPC function to archive leaderboard and reset points.
-- Call this function only on/after day 30 for the current year_month.
-- For shorter months, call it on the last day of the month.
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
        SELECT username, avatar_url, points, role 
        FROM public.profiles 
        ORDER BY points DESC 
        LIMIT 10
    ) u;
    
    -- Insert the snapshot
    INSERT INTO public.monthly_leaderboards (year_month, leaderboard_data)
    VALUES (target_year_month, COALESCE(top_users, '[]'::jsonb));
    
    -- Reset all user points to 0 for the new month (using valid WHERE clause for Postgres safe update)
    UPDATE public.profiles SET points = 0 WHERE id IS NOT NULL;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
