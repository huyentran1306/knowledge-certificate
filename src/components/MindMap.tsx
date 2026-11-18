import { forwardRef, useRef, useState } from 'react';
import { BRANCH_PALETTE } from '../data';
import type { Cert } from '../data/types';
import { wrap2 } from '../lib/text';

/** Kích thước bản vẽ gốc (đơn vị viewBox). */
export const MAP_W = 1576;
export const MAP_H = 840;
const CX = 788;
const CY = 420;
const BY = [120, 420, 720];
const CENTER = { x: 648, y: 360, w: 280, h: 120 };
const BRANCH = { w: 236, h: 64, left: 320, right: 1020 };
const LEAF = { w: 228, h: 44, left: 64, right: 1284 };

interface Props {
  cert: Cert;
  selected: number;
  onSelect: (i: number) => void;
  zoom: number;
  pan: { x: number; y: number };
  onPan: (p: { x: number; y: number }) => void;
}

/** Bản đồ tư duy vẽ hoàn toàn bằng SVG (nên xuất PNG được). */
export const MindMap = forwardRef<SVGSVGElement, Props>(function MindMap({ cert, selected, onSelect, zoom, pan, onPan }, ref) {
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const vw = MAP_W / zoom;
  const vh = MAP_H / zoom;
  const vx = (MAP_W - vw) / 2 + pan.x;
  const vy = (MAP_H - vh) / 2 + pan.y;

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false };
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const scale = vw / e.currentTarget.clientWidth;
    onPan({ x: d.px - dx * scale, y: d.py - dy * scale });
  };
  const onUp = () => {
    // Giữ cờ "moved" tới sau sự kiện click để không chọn nhầm nhánh khi vừa kéo.
    window.setTimeout(() => (drag.current = null), 0);
    setDragging(false);
  };
  const pick = (i: number) => {
    if (drag.current?.moved) return;
    onSelect(selected === i ? -1 : i);
  };

  const dim = (i: number) => (selected >= 0 && selected !== i ? 'mm-dim' : '');
  const centerLines = wrap2(cert.short, 16);

  return (
    <svg
      ref={ref}
      className={`mindmap${dragging ? ' dragging' : ''}`}
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      role="group"
      aria-label={`Bản đồ tư duy ${cert.title}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <defs>
        <pattern id="mm-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="#D3D9E6" />
        </pattern>
      </defs>
      <rect x={-2000} y={-2000} width={MAP_W + 4000} height={MAP_H + 4000} fill="#F6F7FB" />
      <rect x={-2000} y={-2000} width={MAP_W + 4000} height={MAP_H + 4000} fill="url(#mm-dots)" />
      <circle className="spin-svg" cx={CX} cy={CY} r={260} fill="none" stroke="#CDD3E2" strokeWidth={1.5} strokeDasharray="6 8" />
      <circle className="spin-svg rev" cx={CX} cy={CY} r={430} fill="none" stroke="#E1E5EF" strokeWidth={1.5} strokeDasharray="6 8" />

      {/* Đường nối: tâm → nhánh → ý con */}
      {cert.mindmap.map((b, i) => {
        const left = i < 3;
        const by = BY[i % 3];
        const pal = BRANCH_PALETTE[i];
        const sx = left ? CENTER.x : CENTER.x + CENTER.w;
        const ex = left ? BRANCH.left + BRANCH.w : BRANCH.right;
        const mx = (sx + ex) / 2;
        const bx = left ? BRANCH.left : BRANCH.right + BRANCH.w;
        const lx = left ? LEAF.left + LEAF.w : LEAF.right;
        const lmx = (bx + lx) / 2;
        return (
          <g key={`ln-${i}`} className={`mm-fade ${dim(i)}`}>
            <path
              className="draw-path"
              pathLength={1}
              d={`M ${sx} ${CY} C ${mx} ${CY} ${mx} ${by} ${ex} ${by}`}
              fill="none"
              stroke={pal.color}
              strokeWidth={3}
              strokeLinecap="round"
              style={{ animationDelay: `${0.25 + (i % 3) * 0.05}s` }}
            />
            {b.leaves.map((_, j) => {
              const ly = by + (j - 1) * 56;
              return (
                <path
                  key={j}
                  className="draw-path"
                  pathLength={1}
                  d={`M ${bx} ${by} C ${lmx} ${by} ${lmx} ${ly} ${lx} ${ly}`}
                  fill="none"
                  stroke={pal.soft}
                  strokeWidth={2}
                  strokeLinecap="round"
                  style={{ animationDelay: `${0.9 + (i % 3) * 0.1 + j * 0.05}s` }}
                />
              );
            })}
          </g>
        );
      })}

      {/* Ý con */}
      {cert.mindmap.map((b, i) => {
        const left = i < 3;
        const by = BY[i % 3];
        const pal = BRANCH_PALETTE[i];
        return b.leaves.map((leaf, j) => {
          const y = by + (j - 1) * 56 - LEAF.h / 2;
          const x = left ? LEAF.left : LEAF.right;
          const lines = wrap2(leaf, 24);
          return (
            <g key={`lf-${i}-${j}`} className={`mm-fade pop ${dim(i)}`} style={{ animationDelay: `${1.1 + (i % 3) * 0.1 + j * 0.05}s` }}>
              <rect x={x} y={y} width={LEAF.w} height={LEAF.h} rx={12} fill="#fff" stroke={pal.soft} strokeWidth={1.5} />
              <circle cx={x + 16} cy={y + LEAF.h / 2} r={4} fill={pal.color} />
              <text x={x + 28} y={y + LEAF.h / 2 + (lines.length > 1 ? -3.5 : 5)} fontSize={lines.length > 1 ? 13.5 : 15} fill="#1F2937" fontFamily="Inter, sans-serif">
                {lines.map((l, k) => (
                  <tspan key={k} x={x + 28} dy={k === 0 ? 0 : 15.5}>
                    {l}
                  </tspan>
                ))}
              </text>
            </g>
          );
        });
      })}

      {/* Nhánh */}
      {cert.mindmap.map((b, i) => {
        const left = i < 3;
        const x = left ? BRANCH.left : BRANCH.right;
        const y = BY[i % 3] - BRANCH.h / 2;
        const pal = BRANCH_PALETTE[i];
        const lines = wrap2(b.title, 16);
        const on = selected === i;
        return (
          <g
            key={`br-${i}`}
            className={`mm-fade mm-branch pop ${dim(i)}${on ? ' sel' : ''}`}
            style={{ animationDelay: `${0.5 + (i % 3) * 0.05}s` }}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`Nhánh ${i + 1}: ${b.title}`}
            onClick={() => pick(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(on ? -1 : i))}
          >
            {on && <rect x={x - 6} y={y - 6} width={BRANCH.w + 12} height={BRANCH.h + 12} rx={22} fill="none" stroke={pal.color} strokeOpacity={0.3} strokeWidth={4} />}
            <rect x={x} y={y} width={BRANCH.w} height={BRANCH.h} rx={18} fill={on ? pal.color : pal.tint} stroke={pal.color} strokeWidth={2} />
            <rect x={x + 14} y={y + 18} width={28} height={28} rx={9} fill={on ? '#fff' : pal.color} />
            <text x={x + 28} y={y + 36.5} textAnchor="middle" fontSize={13} fontFamily="JetBrains Mono, monospace" fill={on ? pal.color : '#fff'}>
              0{i + 1}
            </text>
            <text x={x + 54} y={y + BRANCH.h / 2 + (lines.length > 1 ? -4.5 : 6)} fontSize={lines.length > 1 ? 16 : 18} fontWeight={600} fill={on ? '#fff' : pal.ink} fontFamily="Space Grotesk, Inter, sans-serif">
              {lines.map((l, k) => (
                <tspan key={k} x={x + 54} dy={k === 0 ? 0 : 19}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      {/* Tâm */}
      <g className="mm-core pop" role="button" tabIndex={0} aria-label="Xem toàn bộ" onClick={() => !drag.current?.moved && onSelect(-1)} onKeyDown={(e) => e.key === 'Enter' && onSelect(-1)}>
        <circle className="mm-pulse" cx={CX} cy={CY} r={100} fill="#3047E0" opacity={0.08} />
        <rect x={CENTER.x} y={CENTER.y} width={CENTER.w} height={CENTER.h} rx={28} fill="#0B1220" />
        <path transform={`translate(${CENTER.x + 20} ${CENTER.y + 32}) scale(0.42)`} d="M60 4 L112 34 L112 98 L60 128 L8 98 L8 34 Z" fill={cert.theme.color} />
        <text x={CENTER.x + 45.2} y={CENTER.y + 66} textAnchor="middle" fontSize={cert.mono.length > 2 ? 13 : 15} fontWeight={700} fill="#fff" fontFamily="Space Grotesk, sans-serif">
          {cert.mono}
        </text>
        <text x={CENTER.x + 86} y={CENTER.y + (centerLines.length > 1 ? 50 : 60)} fontSize={20} fontWeight={600} fill="#fff" fontFamily="Space Grotesk, Inter, sans-serif">
          {centerLines.map((l, k) => (
            <tspan key={k} x={CENTER.x + 86} dy={k === 0 ? 0 : 24}>
              {l}
            </tspan>
          ))}
        </text>
        <text x={CENTER.x + 86} y={CENTER.y + (centerLines.length > 1 ? 96 : 84)} fontSize={14} fill="#AEB6CC" fontFamily="Inter, sans-serif">
          {cert.level === 'GitHub' ? 'GitHub' : cert.level} · 6 nhánh
        </text>
      </g>
    </svg>
  );
});

/** Xuất bản đồ ra PNG (độ phân giải gấp đôi). */
export async function exportMindMapPng(svg: SVGSVGElement, filename: string) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`);
  clone.setAttribute('width', String(MAP_W * 2));
  clone.setAttribute('height', String(MAP_H * 2));
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // Bỏ trạng thái mờ / hiệu ứng để ảnh đầy đủ.
  clone.querySelectorAll('.mm-dim').forEach((el) => el.classList.remove('mm-dim'));
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = '.mm-pulse{display:none}';
  clone.insertBefore(style, clone.firstChild);

  const data = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('Không tải được ảnh SVG'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = MAP_W * 2;
    canvas.height = MAP_H * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
