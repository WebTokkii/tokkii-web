/**
 * Resuelve URLs de recursos locales y remotos de forma infalible.
 */
export function resolveAssetUrl(path?: string | null): string {
  if (!path) return '/logo.png';
  const trimmed = path.trim();

  if (
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('data:') || 
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `/${cleanPath}`;
}

export default resolveAssetUrl;
