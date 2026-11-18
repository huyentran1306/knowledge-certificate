import { useCallback, useEffect, useState } from 'react';

/**
 * Toàn bộ dữ liệu cá nhân (ghi chú, lịch ôn, sổ lỗi sai) đi qua module này.
 * Hiện lưu ở localStorage; muốn đồng bộ nhiều máy (ví dụ Cloudflare D1)
 * chỉ cần thay phần đọc/ghi ở đây.
 */
const PREFIX = 'cert-atlas:';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* hết dung lượng hoặc chế độ riêng tư — bỏ qua */
  }
}

export function useStored<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readJSON(key, fallback));

  // Đổi key (ví dụ chuyển chứng chỉ) thì đọc lại.
  useEffect(() => {
    setValue(readJSON(key, fallback));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
        writeJSON(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, set];
}
