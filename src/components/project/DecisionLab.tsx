import { useState } from 'react';
import type { Project, Situation } from '../../data/projects/mtm';
import { Icon } from '../Icon';

/* ═══════════════ Phòng thử tình huống: kit thấy gì → làm gì → vì sao ═══════════════ */
export function DecisionLab({ situations }: { situations: Situation[] }) {
  const [id, setId] = useState(situations[0].id);
  const s = situations.find((x) => x.id === id)!;
  return (
    <div className="dl">
      <div className="dl-list" role="tablist" aria-label="Tình huống">
        {situations.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => setId(x.id)}>
            <span className="dl-num mono">{String(i + 1).padStart(2, '0')}</span>
            <Icon name={x.icon} size={18} />
            <span>{x.title}</span>
          </button>
        ))}
      </div>
      <div className="dl-panel" key={s.id} role="tabpanel">
        <div className="dl-signal">
          <span className="dl-k mono">KIT THẤY</span>
          <p>{s.signal}</p>
        </div>
        <div className="dl-k mono">KIT LÀM</div>
        <ol className="dl-steps">
          {s.steps.map((step, i) => (
            <li key={i} style={{ animationDelay: `${120 + i * 220}ms` }}>
              <span className="dl-step-n">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="dl-why" style={{ animationDelay: `${200 + s.steps.length * 220}ms` }}>
          <Icon name="bulb" size={18} />
          <div>
            <b>Vì sao có luật này</b>
            <p>{s.why}</p>
            <span className="dl-src mono">{s.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Máy tính hộp thời gian: agent sẽ chạy item này thế nào ═══════════════ */
const TARGET: Record<string, number> = { PI: 10, BUG: 10, TASK: 8, CR: 14 };

export function TimeboxCalc({ project }: { project: Project }) {
  const [type, setType] = useState<'PI' | 'BUG' | 'TASK' | 'CR'>('CR');
  const [left, setLeft] = useState(12);
  const [hasDeadline, setHasDeadline] = useState(true);
  const margin = Math.min(5, Math.max(1.5, left / 4));
  const stopAt = Math.max(0, left - margin);
  const box = Math.min(TARGET[type], stopAt);
  const wrap = box < 1;
  const answerOnly = type === 'PI' || type === 'TASK';
  const model = type === 'PI' ? 'GPT-6.1 Sol' : 'GPT-6.1 Terra';
  const effort = answerOnly ? (left < 4 ? 'medium' : 'low') : 'medium';
  const gate = answerOnly ? project.gates[0] : project.gates[hasDeadline ? 1 : 2];
  const f = (n: number) => n.toLocaleString('vi-VN', { maximumFractionDigits: 1 });
  const scale = (n: number) => `${(n / Math.max(left, 0.1)) * 100}%`;

  return (
    <div className="tb">
      <div className="tb-inputs">
        <div className="seg" role="group" aria-label="Loại item">
          {(['PI', 'BUG', 'CR', 'TASK'] as const).map((k) => (
            <button key={k} type="button" className={type === k ? 'on' : ''} onClick={() => setType(k)}>
              {k}
            </button>
          ))}
        </div>
        <label className="tb-check">
          <input type="checkbox" checked={hasDeadline} onChange={(e) => setHasDeadline(e.target.checked)} />
          Item có deadline riêng
        </label>
        <label className="tb-slider">
          <span>
            Còn <b className="mono">{f(left)}</b> phút tới {hasDeadline ? 'deadline của item' : 'hết trận'}
          </span>
          <input type="range" min={1} max={40} step={0.5} value={left} onChange={(e) => setLeft(Number(e.target.value))} />
        </label>
      </div>

      <div className="tb-bar" aria-hidden="true">
        <span className="tb-box" style={{ width: scale(box) }}>
          {box >= 1 && <em>làm {f(box)}′</em>}
        </span>
        <span className="tb-stop" style={{ left: scale(stopAt) }} />
        <span className="tb-margin" style={{ left: scale(stopAt), width: scale(margin) }}>
          <em>chừa {f(margin)}′</em>
        </span>
        <span className="tb-end">{hasDeadline ? 'hạn' : 'hết trận'}</span>
      </div>

      <div className="tb-out">
        <div>
          <span className="muted-sm">Hộp thời gian worker</span>
          <b className="h">{wrap ? 'Chốt ngay' : `${f(box)} phút`}</b>
          <small>min(mục tiêu {type} {TARGET[type]}′, hạn − chừa {f(margin)}′)</small>
        </div>
        <div>
          <span className="muted-sm">Model · effort</span>
          <b className="h">{model}</b>
          <small>effort {effort}{answerOnly ? ' (lên medium khi còn < 4′)' : ''}</small>
        </div>
        <div>
          <span className="muted-sm">Gate trước khi nộp</span>
          <b className="h">{gate[1]}</b>
          <small>{gate[2]}</small>
        </div>
      </div>
      {wrap && (
        <p className="tb-wrap">
          <Icon name="warn" size={16} /> view.wrapUp: gửi lệnh dừng — giữ phần đã sửa, ghi giá trị đã kiểm chứng tốt nhất, trạng thái trung thực, commit và READY. Không bao giờ nộp trống khi còn giờ.
        </p>
      )}
    </div>
  );
}
