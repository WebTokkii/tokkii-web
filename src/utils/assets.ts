/**
 * Resuelve URLs de recursos locales y remotos (R2, Supabase, CDN).
 */
export function resolveAssetUrl(path?: string | null): string {
  if (!path) return '';
  const trimmed = path.trim();

  // Si ya es una URL absoluta o data-url, retornarla tal cual
  if (
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('data:') || 
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Quitar slash inicial si existe y anteponer el BASE_URL de la app
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  
  return `${prefix}${cleanPath}`;
}

export default resolveAssetUrl;
