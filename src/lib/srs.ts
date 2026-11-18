import { DAY } from './date';

/** Lịch ôn đơn giản kiểu Leitner. */
export interface CardRecord {
  /** Số lần “nhớ rồi” liên tiếp. */
  streak: number;
  /** Thời điểm đến hạn ôn (ms). */
  due: number;
}

export type SrsState = Record<string, CardRecord>;

/** “Nhớ rồi” lần 1, 2, 3, 4+ → quay lại sau 3, 7, 21, 45 ngày. */
export const KNOWN_INTERVALS = [3, 7, 21, 45];
/** “Chưa nhớ” → quay lại sau 1 ngày. */
export const AGAIN_INTERVAL = 1;

export const cardKey = (certId: string, index: number) => `${certId}:${index}`;

export function isDue(rec: CardRecord | undefined, now = Date.now()): boolean {
  return !rec || rec.due <= now;
}

export function schedule(rec: CardRecord | undefined, known: boolean, now = Date.now()): CardRecord {
  if (!known) return { streak: 0, due: now + AGAIN_INTERVAL * DAY };
  const streak = (rec?.streak ?? 0) + 1;
  const days = KNOWN_INTERVALS[Math.min(streak, KNOWN_INTERVALS.length) - 1];
  return { streak, due: now + days * DAY };
}
