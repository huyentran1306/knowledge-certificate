export const DAY = 86_400_000;

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function today(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY);
}

/** dd/mm/yyyy */
export function fmt(d: string | Date): string {
  const x = typeof d === 'string' ? parseDate(d) : d;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(x.getDate())}/${p(x.getMonth() + 1)}/${x.getFullYear()}`;
}

export function daysLeft(expires: string): number {
  return Math.max(0, daysBetween(today(), parseDate(expires)));
}

/** Tổng số ngày hiệu lực của chứng chỉ. */
export function validity(earned: string, expires: string): number {
  return Math.max(1, daysBetween(parseDate(earned), parseDate(expires)));
}

export function agoText(date: string): string {
  const n = daysBetween(parseDate(date), today());
  if (n <= 0) return 'hôm nay';
  if (n === 1) return 'hôm qua';
  if (n < 30) return `${n} ngày trước`;
  if (n < 365) return `${Math.round(n / 30)} tháng trước`;
  return `${Math.round(n / 365)} năm trước`;
}

/** Microsoft mở bài gia hạn 180 ngày trước ngày hết hạn. */
export function renewalOpens(expires: string): Date {
  return new Date(parseDate(expires).getTime() - 180 * DAY);
}
