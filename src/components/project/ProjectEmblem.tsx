/** Huy hiệu dự án: lục giác tối, mạch điện chạy quanh viền, lõi phát sáng. */
export function ProjectEmblem({ mono, size = 96 }: { mono: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 120 132" aria-hidden="true" className="pj-emblem">
      <defs>
        <linearGradient id="pj-em-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1E1046" />
          <stop offset="1" stopColor="#0B1220" />
        </linearGradient>
        <linearGradient id="pj-em-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="pj-em-core">
          <stop offset="0" stopColor="#C4B5FD" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M60 4 L112 34 L112 98 L60 128 L8 98 L8 34 Z" fill="url(#pj-em-fill)" stroke="url(#pj-em-stroke)" strokeWidth={3} />
      <path className="pj-em-run" d="M60 4 L112 34 L112 98 L60 128 L8 98 L8 34 Z" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" pathLength={100} />
      <circle cx="60" cy="58" r="30" fill="url(#pj-em-core)" className="pj-em-core" />
      <g stroke="#A78BFA" strokeOpacity="0.55" strokeWidth={1.6} fill="none">
        <path d="M24 46h14l6 6M96 46H82l-6 6M24 86h14l6-6M96 86H82l-6-6" />
      </g>
      <g fill="#22D3EE">
        <circle cx="24" cy="46" r="2.4" />
        <circle cx="96" cy="46" r="2.4" />
        <circle cx="24" cy="86" r="2.4" />
        <circle cx="96" cy="86" r="2.4" />
      </g>
      <text x="60" y="73" textAnchor="middle" fontFamily="Space Grotesk, Inter, sans-serif" fontSize={mono.length >= 3 ? 26 : 32} fontWeight={700} fill="#fff">
        {mono}
      </text>
      <text x="60" y="100" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize={8.5} letterSpacing="1.5" fill="#A5B4FC">
        AGENT TEAM
      </text>
    </svg>
  );
}
