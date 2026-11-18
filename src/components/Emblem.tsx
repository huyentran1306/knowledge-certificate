import type { Cert } from '../data/types';

/** Huy hiệu lục giác riêng của Cert Atlas (không dùng lại huy hiệu gốc). */
export function Emblem({ cert, size = 58, className }: { cert: Cert; size?: number; className?: string }) {
  const fs = cert.mono.length >= 3 ? 30 : 34;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 120 132" aria-hidden="true" className={className}>
      <path d="M60 4 L112 34 L112 98 L60 128 L8 98 L8 34 Z" fill={cert.theme.color} />
      <path d="M60 22 L96 43 L96 89 L60 110 L24 89 L24 43 Z" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} />
      <text x="60" y={fs === 30 ? 76 : 78} textAnchor="middle" fontFamily="Space Grotesk, Inter, sans-serif" fontSize={fs} fontWeight={700} fill="#fff">
        {cert.mono}
      </text>
    </svg>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" fill="#3047E0" />
      <path d="M20 10 L28 14.5 L28 25.5 L20 30 L12 25.5 L12 14.5 Z" fill="none" stroke="#fff" strokeWidth={2.4} />
      <circle cx="20" cy="20" r="3" fill="#fff" />
    </svg>
  );
}
