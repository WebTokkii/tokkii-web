const R2_BASE = 'https://pub-0bf9a87cec964ff49bfd058873c948c3.r2.dev/public';

/**
 * Resuelve cualquier ruta de imagen hacia la CDN de Cloudflare R2 o URLs completas.
 */
export function resolveAssetUrl(path?: string | null): string {
  if (!path) return '';
  const trimmed = path.trim();
  if (
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('data:') || 
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Quitar slash inicial si existe para componer la URL de R2
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `${R2_BASE}/${cleanPath}`;
}

export default resolveAssetUrl;
