import { useEffect, useRef, useState, type RefObject } from 'react';
import { useCountUp } from '../../lib/hooks';

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true khi phần tử lọt vào khung nhìn (mặc định chỉ một lần). */
export function useInView<T extends Element>(ref: RefObject<T | null>, threshold = 0.25, once = true): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          if (once) io.disconnect();
        } else if (!once) setOn(false);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return on;
}

/* ═══════════════ Nền hero: mạng agent có gói tin chạy giữa các nút ═══════════════ */
const PACKET_COLORS = ['#F59E0B', '#F43F5E', '#A855F7', '#3B82F6', '#22D3EE'];

export function AgentNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = reducedMotion();
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    type N = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };
    type P = { a: number; b: number; t: number; speed: number; color: string };
    let nodes: N[] = [];
    let packets: P[] = [];
    const LINK = 150;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(46, Math.max(18, (w * h) / 26000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: i % 9 === 0 ? 3.2 : 1.6 + Math.random() * 1.2,
        hub: i % 9 === 0,
      }));
      packets = [];
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 180 && d > 1) {
            n.x += (dx / d) * 0.35;
            n.y += (dy / d) * 0.35;
          }
        }
      }
      const pairs: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            pairs.push([i, j]);
            ctx.strokeStyle = `rgba(167,139,250,${(1 - d / LINK) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const n = nodes[i];
        const dm = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (dm < 180) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - dm / 180) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.hub ? 'rgba(196,181,253,0.95)' : 'rgba(165,180,252,0.6)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.hub) {
          ctx.strokeStyle = 'rgba(167,139,250,0.35)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      if (!reduced) {
        if (pairs.length && packets.length < 14 && Math.random() < 0.08) {
          const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
          const flip = Math.random() < 0.5;
          packets.push({ a: flip ? a : b, b: flip ? b : a, t: 0, speed: 0.008 + Math.random() * 0.012, color: PACKET_COLORS[Math.floor(Math.random() * PACKET_COLORS.length)] });
        }
        packets = packets.filter((p) => {
          p.t += p.speed;
          const A = nodes[p.a];
          const B = nodes[p.b];
          if (p.t >= 1 || Math.hypot(A.x - B.x, A.y - B.y) > LINK * 1.2) return false;
          const x = A.x + (B.x - A.x) * p.t;
          const y = A.y + (B.y - A.y) * p.t;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          return true;
        });
      }
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    const host = canvas.parentElement!;
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    if (reduced) draw();
    else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  return <canvas ref={ref} className="pj-net" aria-hidden="true" />;
}

/* ═══════════════ Số liệu đếm lên khi hiện ra ═══════════════ */
export function CountStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, 0.4);
  const target = /^\d+$/.test(value) ? Number(value) : null;
  return (
    <div ref={ref} className={`pj-stat ${seen ? 'in' : ''}`} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      <b className="h">{target !== null && seen ? <Counter to={target} /> : value}</b>
      <span>{label}</span>
    </div>
  );
}
function Counter({ to }: { to: number }) {
  return <>{useCountUp(to, 1600)}</>;
}

/* ═══════════════ Dòng log chạy liên tục trong hero ═══════════════ */
export function Ticker({ lines }: { lines: [string, string][] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % lines.length), 2400);
    return () => window.clearInterval(id);
  }, [lines.length]);
  const [tag, text] = lines[i];
  return (
    <div className="pj-ticker mono" aria-hidden="true">
      <span className="pj-ticker-dot" />
      <span key={i} className="pj-ticker-line">
        <b>{tag}</b> {text}
      </span>
    </div>
  );
}

/* ═══════════════ Chữ hiện ra như đang gõ ═══════════════ */
export function Typewriter({ text, speed = 18 }: { text: string; speed?: number }) {
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0));
  useEffect(() => {
    if (reducedMotion()) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = window.setInterval(() => {
      setN((x) => {
        if (x >= text.length) {
          window.clearInterval(id);
          return x;
        }
        return x + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return (
    <>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {n < text.length && <span className="pj-caret" aria-hidden="true" />}
      <span className="sr-only">{text}</span>
    </>
  );
}

/* ═══════════════ Thẻ nghiêng 3D + vệt sáng theo chuột (gắn vào phần tử gốc) ═══════════════ */
export function useCardFx(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    let last: HTMLElement | null = null;
    const reset = (c: HTMLElement) => {
      c.style.removeProperty('--rx');
      c.style.removeProperty('--ry');
    };
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>('.fx-card');
      if (last && last !== card) reset(last);
      last = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      if (card.classList.contains('fx-tilt')) {
        card.style.setProperty('--rx', `${((y / r.height - 0.5) * -7).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${((x / r.width - 0.5) * 7).toFixed(2)}deg`);
      }
    };
    const onLeave = () => {
      if (last) reset(last);
      last = null;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [root]);
}

/* ═══════════════ Pháo giấy một lần ═══════════════ */
const CONFETTI = ['#7C3AED', '#22D3EE', '#F59E0B', '#F43F5E', '#3B82F6', '#22C55E'];
export function ConfettiBurst() {
  if (reducedMotion()) return null;
  return (
    <div className="pj-confetti" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          style={
            {
              '--x': `${(Math.random() - 0.5) * 520}px`,
              '--y': `${-80 - Math.random() * 160}px`,
              '--r': `${Math.random() * 720 - 360}deg`,
              background: CONFETTI[i % CONFETTI.length],
              animationDelay: `${Math.random() * 120}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
