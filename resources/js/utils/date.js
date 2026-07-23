/**
 * Format a date to "DD MMMM YYYY" (e.g., 14 July 2026)
 */
export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-PH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  });
}

/**
 * Format a time to "h:mm A" (12‑hour with AM/PM, e.g., 8:35 AM)
 */
export function formatTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
}

/**
 * Format a date and time to "DD MMMM YYYY h:mm A"
 */
export function formatDateTime(date) {
  if (!date) return '—';
  return `${formatDate(date)} ${formatTime(date)}`;
}
