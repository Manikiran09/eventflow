const backendBase = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export function getAssetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${backendBase}${path}`;
}
