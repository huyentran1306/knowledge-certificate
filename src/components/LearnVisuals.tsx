import { useMemo, useState } from 'react';
import type { Cert, DecideNode } from '../data/types';
import { Icon } from './Icon';

const NODE_W = 168;
const NODE_H = 64;

/* ═══════════════ 1. Bức tranh lớn — sơ đồ kiến trúc tương tác ═══════════════ */
export function Blueprint({ cert }: { cert: Cert }) {
  const bp = cert.blueprint!;
  const [sel, setSel] = useState(bp.nodes[0].id);
  const byId = useMemo(() => Object.fromEntries(bp.nodes.map((n) => [n.id, n])), [bp]);
  const node = byId[sel];
  const linked = new Set(bp.edges.filter(([a, b]) => a === sel || b === sel).flatMap(([a, b]) => [a, b]));

  /** Điểm trên mép hộp chữ nhật theo hướng tới điểm kia — để mũi tên không chui vào trong hộp. */
  const edgePoint = (x: number, y: number, tx: number, ty: number) => {
    const dx = tx - x;
    const dy = ty - y;
    const s = Math.min((NODE_W / 2 + 6) / Math.abs(dx || 1e-6), (NODE_H / 2 + 6) / Math.abs(dy || 1e-6));
    return [x + dx * s, y + dy * s];
  };

  return (
    <div className="bp">
      <div className="bp-canvas">
        <svg viewBox="0 0 1200 450" className="bp-svg" role="img" aria-label={bp.caption}>
          <defs>
            <marker id="bp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="currentColor" />
            </marker>
          </defs>
          {bp.edges.map(([a, b, label, dashed], i) => {
            const A = byId[a];
            const B = byId[b];
            const [x1, y1] = edgePoint(A.x, A.y, B.x, B.y);
            const [x2, y2] = edgePoint(B.x, B.y, A.x, A.y);
            const on = a === sel || b === sel;
            return (
              <g key={i} className={`bp-edge ${on ? 'on' : ''} ${dashed ? 'dashed' : ''}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={dashed ? undefined : 'url(#bp-arrow)'} />
                {!dashed && <line x1={x1} y1={y1} x2={x2} y2={y2} className="bp-flow" />}
                {label && (
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" className="bp-elabel">
                    {label}
                  </text>
                )}
              </g>
            );
          })}
          {bp.nodes.map((n, i) => (
            <g
              key={n.id}
              className={`bp-node ${n.kind === 'side' ? 'side' : ''} ${n.id === sel ? 'sel' : linked.has(n.id) ? 'near' : ''}`}
              transform={`translate(${n.x - NODE_W / 2} ${n.y - NODE_H / 2})`}
              onClick={() => setSel(n.id)}
              tabIndex={0}
              role="button"
              aria-label={n.label}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(n.id)}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <rect width={NODE_W} height={NODE_H} rx={16} />
              <foreignObject x={10} y={0} width={NODE_W - 16} height={NODE_H}>
                <div className="bp-node-inner">
                  <span className="bp-ico">
                    <Icon name={n.icon} size={18} />
                  </span>
                  <span>
                    <b>{n.label}</b>
                    {n.sub && <small>{n.sub}</small>}
                  </span>
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>

      <div key={node.id} className="bp-detail lv-in">
        <div className="row-10">
          <span className="bp-detail-ico">
            <Icon name={node.icon} size={22} />
          </span>
          <div>
            <div className="h bp-detail-title">{node.label}</div>
            {node.sub && <div className="muted-sm">{node.sub}</div>}
          </div>
        </div>
        <p className="bp-what">{node.what}</p>
        <div className="bp-tip">
          <Icon name="bulb" size={18} />
          <span>{node.tip}</span>
        </div>
        <div className="bp-chips">
          {bp.nodes.map((n) => (
            <button key={n.id} type="button" className={n.id === sel ? 'on' : ''} onClick={() => setSel(n.id)}>
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ 2. Khi nào dùng gì — cây quyết định ═══════════════ */
export function DecisionFlow({ cert }: { cert: Cert }) {
  const tree = cert.decide!;
  const [path, setPath] = useState<{ id: string; picked?: string }[]>([{ id: tree.start }]);
  const current = path[path.length - 1];
  const node = tree.nodes[current.id] as DecideNode;

  const choose = (label: string, next: string) =>
    setPath((p) => [...p.slice(0, -1), { ...p[p.length - 1], picked: label }, { id: next }]);
  const backTo = (i: number) => setPath((p) => [...p.slice(0, i), { id: p[i].id }]);
  const reset = () => setPath([{ id: tree.start }]);

  return (
    <div className="df card">
      <div className="df-head">
        <span className="h df-title">{tree.title}</span>
        {path.length > 1 && (
          <button type="button" className="text-btn" onClick={reset}>
            <Icon name="refresh" size={16} /> Làm lại
          </button>
        )}
      </div>

      <ol className="df-trail">
        {path.slice(0, -1).map((p, i) => {
          const n = tree.nodes[p.id];
          return (
            <li key={i}>
              <button type="button" onClick={() => backTo(i)} title="Quay lại bước này">
                <span className="df-q">{'q' in n ? n.q : ''}</span>
                <span className="df-pick">
                  <Icon name="check" size={14} stroke={3} /> {p.picked}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div key={current.id + path.length} className="df-now lv-in">
        {'q' in node ? (
          <>
            <div className="df-step mono">BƯỚC {path.length}</div>
            <div className="h df-question">{node.q}</div>
            <div className="df-opts">
              {node.opts.map(([label, next]) => (
                <button key={label} type="button" className="df-opt" onClick={() => choose(label, next)}>
                  <span>{label}</span>
                  <Icon name="arrow" size={18} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="df-answer">
            <div className="df-step mono">ĐÁP ÁN</div>
            <div className="h df-answer-title">
              <Icon name="sparkle" size={22} /> {node.answer}
            </div>
            <p>{node.why}</p>
            {node.remember && (
              <div className="df-remember">
                <Icon name="bulb" size={18} /> {node.remember}
              </div>
            )}
            <button type="button" className="btn btn-theme" onClick={reset}>
              Thử tình huống khác <Icon name="refresh" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ 3. Đừng nhầm — so sánh A vs B ═══════════════ */
export function CompareCards({ cert }: { cert: Cert }) {
  const list = cert.compare!;
  const [i, setI] = useState(0);
  const c = list[i];
  return (
    <div className="cmp">
      <div className="cmp-tabs" role="tablist">
        {list.map((x, k) => (
          <button key={k} type="button" role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)}>
            {x.a} <span className="cmp-vs">vs</span> {x.b}
          </button>
        ))}
      </div>
      <div key={i} className="cmp-table card lv-in">
        <div className="cmp-row cmp-header">
          <span />
          <span className="cmp-a">{c.a}</span>
          <span className="cmp-b">{c.b}</span>
        </div>
        {c.rows.map(([k, a, b]) => (
          <div key={k} className="cmp-row">
            <span className="cmp-k">{k}</span>
            <span>{a}</span>
            <span>{b}</span>
          </div>
        ))}
        <div className="cmp-rule">
          <Icon name="bolt" size={18} /> {c.rule}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ 4. Nhớ trong 5 câu + kiểm tra nhanh ═══════════════ */
export function RecallStrip({ cert }: { cert: Cert }) {
  const lines = cert.domains.map((d) => [d.title, d.remember] as const);
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className="recall">
      <ol className="recall-list">
        {lines.map(([t, r], k) => (
          <li key={t} className="recall-item" style={{ animationDelay: `${k * 80}ms` }}>
            <span className="recall-num h">{k + 1}</span>
            <span>
              <b>{r}</b>
              <small>{t}</small>
            </span>
          </li>
        ))}
      </ol>
      <div className="recall-quiz">
        <div className="toc-label">KIỂM TRA NHANH</div>
        {cert.quiz.map((q, qi) => (
          <div key={qi} className="rq">
            <p className="rq-q">{q.q}</p>
            <div className="rq-opts">
              {q.opts.map((o, oi) => {
                const p = picked[qi];
                const state = p === undefined ? '' : oi === q.ans ? 'right' : oi === p ? 'wrong' : 'dim';
                return (
                  <button key={oi} type="button" className={`rq-opt ${state}`} disabled={p !== undefined} onClick={() => setPicked((s) => ({ ...s, [qi]: oi }))}>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked[qi] !== undefined && <p className="rq-why">{q.why}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
