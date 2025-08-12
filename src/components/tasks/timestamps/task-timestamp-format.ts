export function formatTaskDate(date?: string | number | Date): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  const opts = sameYear
    ? { month: 'short', day: '2-digit' }
    : { month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', opts as Intl.DateTimeFormatOptions)
    .format(d)
    .replace(',', '');
}

export function formatTaskTimestamp(date?: string | number | Date): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(d);
  return `${datePart}, ${timePart}`;
}
