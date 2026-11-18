import { useMounted } from '../lib/hooks';

interface Props {
  size: number;
  stroke: number;
  /** 0..1 */
  value: number;
  color: string;
  track?: string;
  label: string;
  children?: React.ReactNode;
}

/** Vòng tròn tiến độ, tự chạy từ 0 khi xuất hiện. */
export function Ring({ size, stroke, value, color, track = '#EEF0F5', label, children }: Props) {
  const mounted = useMounted(200);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          className="ring-bar"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={mounted ? c * (1 - v) : c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && <div className="ring-center">{children}</div>}
    </div>
  );
}
