-- ============================================================
-- FIX DAILY MINIGAME COMPLETIONS
-- ============================================================
-- Enforces one completion per user, minigame, and local date.
-- Also allows the app to create a 0-point attempt at game start
-- and update that same row with the final score when the game ends.

CREATE TABLE IF NOT EXISTS public.user_quiz_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_type VARCHAR(50) NOT NULL,
    completed_date DATE DEFAULT CURRENT_DATE NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, quiz_type, completed_date)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_quiz_completions_daily_unique_idx
ON public.user_quiz_completions (user_id, quiz_type, completed_date);

ALTER TABLE public.user_quiz_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura propia de quiz completados" ON public.user_quiz_completions;
DROP POLICY IF EXISTS "Permitir lectura publica de estadisticas de minijuegos" ON public.user_quiz_completions;
DROP POLICY IF EXISTS "Permitir insercion propia de quiz completados" ON public.user_quiz_completions;
DROP POLICY IF EXISTS "Permitir actualizar propio quiz completado" ON public.user_quiz_completions;

CREATE POLICY "Permitir lectura publica de estadisticas de minijuegos"
ON public.user_quiz_completions FOR SELECT
USING (true);

CREATE POLICY "Permitir insercion propia de quiz completados"
ON public.user_quiz_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir actualizar propio quiz completado"
ON public.user_quiz_completions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
