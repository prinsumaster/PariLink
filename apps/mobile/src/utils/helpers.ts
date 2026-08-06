// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Utility Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a RFC4122 v4 UUID (client-side, no crypto dependency)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format currency in Indian locale
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to human readable (e.g. "28 Jul 2026, 5:30 PM")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R   = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
