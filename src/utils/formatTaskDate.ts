const timeFmt: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

const dateFmt: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
};

export function formatTaskDate(timestamp: number, locale = 'es'): string {
  const d = new Date(timestamp);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) {
    return d.toLocaleTimeString(locale, timeFmt);
  }
  return d.toLocaleDateString(locale, dateFmt);
}
