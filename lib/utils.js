export function extractFileKey(url) {
  try {
    const u = new URL(url);
    return u.pathname.split('/').pop(); // último segmento
  } catch {
    return null;
  }
}
