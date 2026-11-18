import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom';
import { BRANCH_PALETTE, CERTS, getCert } from '../data';
import { Icon } from '../components/Icon';
import { MindMap, exportMindMapPng } from '../components/MindMap';
import { themeVars } from '../components/CertCard';
import { NotFound } from './NotFound';

const ZOOMS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 1.8];

export function MindmapPage() {
  const { id } = useParams();
  const cert = getCert(id);
  const [params, setParams] = useSearchParams();
  const sel = Number(params.get('branch') ?? -1);
  const selected = Number.isInteger(sel) && sel >= 0 && sel < 6 ? sel : -1;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [exporting, setExporting] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [id]);

  // Ctrl/⌘ + cuộn để phóng to (cuộn thường vẫn cuộn trang).
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom((z) => Math.max(0.5, Math.min(2.2, +(z * (e.deltaY < 0 ? 1.1 : 0.9)).toFixed(3))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  if (!cert) return <NotFound />;

  const select = (i: number) => {
    const p = new URLSearchParams(params);
    if (i < 0) p.delete('branch');
    else p.set('branch', String(i));
    setParams(p, { replace: true });
  };
  const step = (dir: 1 | -1) => {
    const idx = ZOOMS.findIndex((z) => z >= zoom - 0.001);
    const next = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, (idx < 0 ? ZOOMS.length - 1 : idx) + dir))];
    setZoom(next);
  };
  const fit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const doExport = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      await exportMindMapPng(svgRef.current, `ban-do-tu-duy-${cert.id}.png`);
    } finally {
      setExporting(false);
    }
  };

  const b = selected >= 0 ? cert.mindmap[selected] : null;
  const pal = selected >= 0 ? BRANCH_PALETTE[selected] : null;

  return (
    <div style={themeVars(cert)} className="mm-page">
      <div className="container mm-top">
        <div>
          <div className="eyebrow theme">BẢN ĐỒ TƯ DUY · {cert.short.toUpperCase()}</div>
          <h1 className="h mm-title">Cả chứng chỉ trên một trang</h1>
          <p className="muted small">Bấm một nhánh để làm nổi nhánh đó và xem tóm tắt. Kéo để di chuyển, Ctrl/⌘ + cuộn để phóng to.</p>
        </div>
        <nav className="seg" aria-label="Chế độ xem">
          <Link to={`/cert/${cert.id}`}>Sổ tay</Link>
          <span className="on" aria-current="page">Bản đồ tư duy</span>
          <Link to={`/review?cert=${cert.id}`}>Ôn tập</Link>
        </nav>
      </div>

      <div className="container cert-switch" role="group" aria-label="Chọn chứng chỉ">
        {CERTS.map((c) => (
          <NavLink key={c.id} to={`/cert/${c.id}/map`} className={({ isActive }) => `chip-switch${isActive ? ' on' : ''}`}>
            <span className="dot" style={{ background: c.theme.color }} />
            {c.short}
          </NavLink>
        ))}
      </div>

      <div className="container mm-layout">
        <div className="mm-stage" ref={boxRef}>
          <div className="mm-tools">
            <div className="zoom">
              <button type="button" onClick={() => step(-1)} aria-label="Thu nhỏ">
                <Icon name="minus" size={16} stroke={2.4} />
              </button>
              <span className="mono">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => step(1)} aria-label="Phóng to">
                <Icon name="plus" size={16} stroke={2.4} />
              </button>
            </div>
            <button type="button" className="tool-btn" onClick={fit}>
              <Icon name="expand" size={16} /> Vừa khung
            </button>
            <button type="button" className="tool-btn" onClick={() => select(-1)} disabled={selected < 0}>
              Xem toàn bộ
            </button>
            <button type="button" className="tool-btn dark" onClick={doExport} disabled={exporting}>
              <Icon name="download" size={16} /> {exporting ? 'Đang xuất…' : 'Xuất PNG'}
            </button>
          </div>
          <div className="mm-scroll">
            <MindMap key={cert.id} ref={svgRef} cert={cert} selected={selected} onSelect={select} zoom={zoom} pan={pan} onPan={setPan} />
          </div>
        </div>

        <aside className="mm-panel" aria-label="Tóm tắt nhánh">
          <div className="mm-detail" aria-live="polite">
            {b && pal ? (
              <div className="stack-16 rv" key={selected}>
                <div className="row-between">
                  <span className="chip-level" style={{ background: pal.tint, color: pal.ink }}>
                    NHÁNH 0{selected + 1}
                  </span>
                  <button type="button" className="icon-btn" onClick={() => select(-1)} aria-label="Đóng">
                    <Icon name="close" size={16} stroke={2.2} />
                  </button>
                </div>
                <h2 className="h panel-title" style={{ color: pal.ink }}>
                  {b.title}
                </h2>
                <p className="panel-summary">{b.summary}</p>
                <ul className="dot-list">
                  {b.points.map((p) => (
                    <li key={p}>
                      <span className="dot" style={{ background: pal.color }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="remember" style={{ background: pal.tint }}>
                  <b style={{ color: pal.ink }}>Nhớ cho kỳ thi:</b> {b.remember}
                </div>
                <div className="row-between wrap panel-nav">
                  <Link to={`/cert/${cert.id}`} state={{ scrollTo: 'domains' }} className="text-link" style={{ color: pal.ink }}>
                    Mở sổ tay chứng chỉ <Icon name="arrow" size={14} stroke={2.4} />
                  </Link>
                  <div className="row-8">
                    <button type="button" className="btn btn-ghost" onClick={() => select((selected + 5) % 6)}>
                      ← Nhánh trước
                    </button>
                    <button type="button" className="btn btn-dark" onClick={() => select((selected + 1) % 6)}>
                      Nhánh sau →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="stack-16 rv">
                <div className="toc-label" style={{ padding: 0 }}>TỔNG QUAN</div>
                <h2 className="h panel-title">6 nhánh · 18 ý chính</h2>
                <p className="panel-summary">{cert.tagline}</p>
                <p className="muted small">
                  Bên trái là nền móng, bên phải là phần cốt lõi của chứng chỉ. Chọn một nhánh trên bản đồ hoặc trong danh sách để xem tóm tắt.
                </p>
              </div>
            )}
          </div>
          <div className="mm-picks stack-4">
            {cert.mindmap.map((br, i) => (
              <button key={br.title} type="button" className={`pick${selected === i ? ' on' : ''}`} onClick={() => select(selected === i ? -1 : i)} aria-pressed={selected === i}>
                <span className="pick-num mono" style={{ background: BRANCH_PALETTE[i].color }}>
                  0{i + 1}
                </span>
                <span className="pick-text">
                  <b>{br.title}</b>
                  <span className="muted-sm">{br.hint}</span>
                </span>
                <Icon name="chevRight" size={16} stroke={2.2} />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
