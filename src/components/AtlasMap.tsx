import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CERTS } from '../data';
import type { CertId } from '../data/types';

const W = 1200;
const H = 660;
const HX = W / 2;
const HY = H / 2;
const ANGLES = [-90, -18, 54, 126, 198];
const rad = (d: number) => (d * Math.PI) / 180;

/** Bản đồ tổng: bạn ở giữa → 5 chứng chỉ → chủ đề chính của từng chứng chỉ. */
export function AtlasMap() {
  const [hover, setHover] = useState<CertId | null>(null);
  const nav = useNavigate();

  const nodes = CERTS.map((c, i) => {
    const a = ANGLES[i % ANGLES.length];
    const x = HX + 330 * Math.cos(rad(a));
    const y = HY + 190 * Math.sin(rad(a));
    const leaves = c.tags.slice(0, 3).map((t, j) => {
      const la = a + (j - 1) * 17;
      const w = Math.round(t.length * 7.4 + 30);
      return { t, x: HX + 520 * Math.cos(rad(la)), y: HY + 288 * Math.sin(rad(la)), w };
    });
    return { c, x, y, leaves, delay: i * 0.12 };
  });

  const cls = (id: CertId) => (hover && hover !== id ? 'atlas-dim' : '');
  const open = (id: CertId) => nav(`/cert/${id}/map`);

  return (
    <div className="atlas-scroll">
      <svg className="atlas" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Bản đồ tổng 5 chứng chỉ">
        <circle className="atlas-orbit" cx={HX} cy={HY} r={250} fill="none" stroke="#DCE1EC" strokeDasharray="4 8" />

        {nodes.map(({ c, x, y, leaves, delay }) => (
          <g key={`l-${c.id}`} className={cls(c.id)}>
            <path
              className="draw-path"
              pathLength={1}
              d={`M ${HX} ${HY} Q ${HX + (x - HX) * 0.55} ${HY + (y - HY) * 0.1} ${x} ${y}`}
              fill="none"
              stroke={c.theme.color}
              strokeWidth={3}
              strokeLinecap="round"
              style={{ animationDelay: `${0.2 + delay}s` }}
            />
            {leaves.map((l, j) => (
              <path
                key={j}
                className="draw-path"
                pathLength={1}
                d={`M ${x} ${y} L ${l.x} ${l.y}`}
                fill="none"
                stroke={c.theme.color}
                strokeOpacity={0.35}
                strokeWidth={2}
                style={{ animationDelay: `${0.8 + delay}s` }}
              />
            ))}
          </g>
        ))}

        {nodes.map(({ c, leaves, delay }) =>
          leaves.map((l, j) => (
            <g key={`leaf-${c.id}-${j}`} className={`pop ${cls(c.id)}`} style={{ animationDelay: `${1 + delay + j * 0.05}s` }}>
              <rect x={l.x - l.w / 2} y={l.y - 16} width={l.w} height={32} rx={16} fill="#fff" stroke={c.theme.color} strokeOpacity={0.35} />
              <text x={l.x} y={l.y + 4.5} textAnchor="middle" fontSize={13} fontFamily="Inter, sans-serif" fill="#2A3245">
                {l.t}
              </text>
            </g>
          )),
        )}

        {nodes.map(({ c, x, y, delay }) => (
          <g
            key={`n-${c.id}`}
            className={`pop atlas-node ${cls(c.id)}`}
            style={{ animationDelay: `${0.5 + delay}s` }}
            role="link"
            tabIndex={0}
            aria-label={`${c.title} — mở bản đồ tư duy`}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(c.id)}
            onBlur={() => setHover(null)}
            onClick={() => open(c.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(c.id))}
          >
            <rect x={x - 120} y={y - 30} width={240} height={60} rx={18} fill={c.theme.tint} stroke={c.theme.color} strokeWidth={2} />
            <path
              transform={`translate(${x - 108} ${y - 17}) scale(0.26)`}
              d="M60 4 L112 34 L112 98 L60 128 L8 98 L8 34 Z"
              fill={c.theme.color}
            />
            <text x={x - 92.4} y={y + 4} textAnchor="middle" fontSize={c.mono.length > 2 ? 9 : 11} fontWeight={700} fill="#fff" fontFamily="Space Grotesk, sans-serif">
              {c.mono}
            </text>
            <text x={x - 68} y={y - 3} fontSize={14} fontWeight={600} fill={c.theme.ink} fontFamily="Space Grotesk, Inter, sans-serif">
              {c.short}
            </text>
            <text x={x - 68} y={y + 14} fontSize={11} fill="#5B6478" fontFamily="Inter, sans-serif">
              {c.level === 'GitHub' ? 'GitHub' : c.level} · mở bản đồ →
            </text>
          </g>
        ))}

        <g className="pop" style={{ animationDelay: '0s' }}>
          <circle className="atlas-pulse" cx={HX} cy={HY} r={74} fill="#3047E0" opacity={0.15} />
          <circle cx={HX} cy={HY} r={70} fill="#0B1220" />
          <text x={HX} y={HY - 4} textAnchor="middle" fontSize={17} fontWeight={700} fill="#fff" fontFamily="Space Grotesk, sans-serif">
            Kiến thức
          </text>
          <text x={HX} y={HY + 18} textAnchor="middle" fontSize={13} fill="#AEB6CC" fontFamily="Inter, sans-serif">
            {CERTS.length} chứng chỉ
          </text>
        </g>
      </svg>
    </div>
  );
}
