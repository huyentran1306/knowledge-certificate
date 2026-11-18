import { useEffect, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true sau `delay` ms — dùng để kích hoạt transition khi vừa mount. */
export function useMounted(delay = 0): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return on;
}

/** Đếm từ 0 lên `target` với easing. */
export function useCountUp(target: number, duration = 1400): number {
  const [v, setV] = useState(() => (reduced() ? target : 0));
  useEffect(() => {
    if (reduced()) {
      setV(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}
