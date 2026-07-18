-- Script SQL para la tabla de Reportes de Usuario (user_reports)
-- Ejecutar en el Editor SQL de Supabase

-- 1. Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- 'bug', 'sugerencia', 'cambio'
    description TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb, -- Array de URLs de imágenes en Cloudflare R2
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- 3. Política para permitir a usuarios autenticados insertar sus propios reportes
CREATE POLICY "Users can insert their own reports" 
ON public.user_reports 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 4. Política para permitir a usuarios autenticados leer únicamente sus propios reportes
CREATE POLICY "Users can view their own reports" 
ON public.user_reports 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
