import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

interface Props {
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  children: ReactNode;
  style?: React.CSSProperties;
}

/** Hiện dần khi cuộn tới. */
export function Reveal({ as: Tag = 'div', className = '', id, delay = 0, children, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`} style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}>
      {children}
    </Tag>
  );
}
