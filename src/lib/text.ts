/** Bỏ dấu tiếng Việt, chữ thường — dùng cho tìm kiếm. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/** Ngắt chuỗi thành tối đa 2 dòng cân bằng khi dài hơn `max` ký tự. */
export function wrap2(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const words = text.split(' ');
  if (words.length < 2) return [text];
  let best: string[] = [text];
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const score = Math.max(a.length, b.length);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: 'smooth' });
}
