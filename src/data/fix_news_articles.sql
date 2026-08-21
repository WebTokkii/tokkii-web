-- ============================================================
-- FIX DAILY NEWS ARTICLES
-- ============================================================
-- Adds explicit category support and indexes used by the daily
-- anime/videojuegos news feed.

CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    slug TEXT UNIQUE NOT NULL,
    header_image TEXT,
    content_blocks JSONB DEFAULT '[]'::jsonb,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.news_articles
ADD COLUMN IF NOT EXISTS category TEXT;

UPDATE public.news_articles
SET category = COALESCE(
    category,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(content_blocks, '[]'::jsonb)) block
            WHERE block->>'type' = 'metadata'
              AND upper(block->>'category') = 'ANIME'
        ) THEN 'ANIME'
        ELSE 'VIDEOJUEGOS'
    END
)
WHERE category IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS news_articles_slug_unique_idx
ON public.news_articles (slug);

CREATE INDEX IF NOT EXISTS news_articles_category_published_idx
ON public.news_articles (category, published_at DESC);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de noticias" ON public.news_articles;
DROP POLICY IF EXISTS "Permitir insercion publica de noticias" ON public.news_articles;
DROP POLICY IF EXISTS "Permitir actualizacion publica de noticias" ON public.news_articles;

CREATE POLICY "Permitir lectura publica de noticias"
ON public.news_articles FOR SELECT
USING (true);

CREATE POLICY "Permitir insercion publica de noticias"
ON public.news_articles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir actualizacion publica de noticias"
ON public.news_articles FOR UPDATE
USING (true)
WITH CHECK (true);
