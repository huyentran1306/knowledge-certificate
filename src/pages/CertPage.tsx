import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CERTS, getCert } from '../data';
import { daysLeft, fmt, renewalOpens, validity } from '../lib/date';
import { scrollToId } from '../lib/text';
import { Emblem } from '../components/Emblem';
import { Icon, type IconName } from '../components/Icon';
import { Ring } from '../components/Ring';
import { Reveal } from '../components/Reveal';
import { themeVars } from '../components/CertCard';
import { CodeTabs, ConceptCards, DemoStepper, Domains, Notes } from '../components/CertSections';
import { Blueprint, CompareCards, DecisionFlow, RecallStrip } from '../components/LearnVisuals';
import type { Cert } from '../data/types';
import { NotFound } from './NotFound';
import { getProject } from '../data/projects/mtm';
import { ProjectEmblem } from '../components/project/ProjectEmblem';

/** Mục lục: phần trực quan chỉ hiện khi chứng chỉ có dữ liệu tương ứng. */
const tocFor = (c: Cert | undefined): [string, string][] => {
  if (!c) return [];
  const visual = Boolean(c.blueprint || c.decide || c.compare);
  return [
    ['overview', 'Tóm tắt 30 giây'],
    ...(c.blueprint ? [['blueprint', 'Bức tranh lớn'] as [string, string]] : []),
    ...(c.decide ? [['decide', 'Khi nào dùng gì'] as [string, string]] : []),
    ...(c.compare ? [['compare', 'Đừng nhầm'] as [string, string]] : []),
    ['demo', 'Demo tương tác'],
    ['domains', 'Nhóm kiến thức'],
    ['concepts', 'Khái niệm cốt lõi'],
    ['code', 'Code mẫu'],
    ...(c.compare ? [] : [['traps', 'Bẫy đề thi'] as [string, string]]),
    ...(visual ? [['recall', 'Nhớ trong 5 câu'] as [string, string]] : []),
    ['takeaways', 'Điều mình rút ra'],
  ];
};

export function CertPage() {
  const { id } = useParams();
  const cert = getCert(id);
  const [active, setActive] = useState<string>('overview');
  const TOC = tocFor(cert);

  // Đánh dấu mục đang đọc trong mục lục: mục cuối cùng có đầu đã cuộn qua mốc 140px.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur: string = TOC[0]?.[0] ?? 'overview';
      for (const [key] of TOC) {
        const el = document.getElementById(key);
        if (el && el.getBoundingClientRect().top < 140) cur = key;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? TOC[TOC.length - 1]?.[0] ?? cur : cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [cert?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cert) return <NotFound />;

  const days = daysLeft(cert.expires);
  const idx = CERTS.findIndex((c) => c.id === cert.id);
  const prev = CERTS[(idx - 1 + CERTS.length) % CERTS.length];
  const next = CERTS[(idx + 1) % CERTS.length];
  const isMs = cert.issuer === 'Microsoft';

  const overview: [IconName, string, string][] = [
    ['shield', 'Chứng minh điều gì', cert.overview.proves],
    ['tool', 'Công cụ chính', cert.overview.tools],
    ['bolt', 'Khi nào mở lại', cert.overview.when],
  ];

  return (
    <div style={themeVars(cert)}>
      <section className="cert-hero dots-theme">
        <div className="container cert-hero-grid">
          <div className="stack-20">
            <nav aria-label="Vị trí" className="crumbs">
              <Link to="/">Tổng quan</Link>
              <span aria-hidden="true">/</span>
              <span>{cert.short}</span>
            </nav>
            <div className="tag-row rv">
              <span className="chip-outline theme-ink">{cert.level === 'GitHub' ? 'GITHUB' : cert.level.toUpperCase()}</span>
              <span className="chip-outline">{{ Microsoft: 'Microsoft Certified', GitHub: 'GitHub Certification', Anthropic: 'Anthropic Certification' }[cert.issuer]}</span>
            </div>
            <h1 className="h cert-title rv d1">{cert.title}</h1>
            <p className="cert-lead rv d2">{cert.tagline}</p>
            <div className="meta-row rv d3">
              <div className="meta">
                <Icon name="calendar" size={20} className="theme-ink" />
                <div>
                  <div className="muted-sm">Đạt</div>
                  <b>{fmt(cert.earned)}</b>
                </div>
              </div>
              <div className="meta">
                <Icon name="clock" size={20} className="theme-ink" />
                <div>
                  <div className="muted-sm">Hết hạn</div>
                  <b>{fmt(cert.expires)}</b>
                </div>
              </div>
              {isMs && (
                <div className="meta">
                  <Icon name="refresh" size={20} className="theme-ink" />
                  <div>
                    <div className="muted-sm">Mở gia hạn (180 ngày trước hạn)</div>
                    <b>{fmt(renewalOpens(cert.expires))}</b>
                  </div>
                </div>
              )}
            </div>
            <div className="row-12 wrap rv d4">
              <Link to={`/cert/${cert.id}/map`} className="btn btn-ghost">
                <Icon name="map" size={18} /> Bản đồ tư duy
              </Link>
              <Link to={`/review?cert=${cert.id}`} className="btn btn-theme">
                Ôn tập bộ này <Icon name="arrow" size={16} stroke={2.4} className="arrow" />
              </Link>
            </div>
            {cert.projects?.map((slug) => {
              const p = getProject(slug);
              return p ? (
                <Link key={slug} to={`/cert/${cert.id}/project/${slug}`} className="pj-launch rv d4">
                  <span className="pj-launch-glow" aria-hidden="true" />
                  <span className="pj-launch-em">
                    <ProjectEmblem mono={p.mono} size={64} />
                  </span>
                  <span className="pj-launch-text">
                    <span className="pj-launch-k mono">DỰ ÁN THỰC CHIẾN · CODEX MULTI-AGENT</span>
                    <b className="h">{p.short}</b>
                    <span>Kit Team Orchestrator trên Codex CLI — giải pháp, phát lại trận và cách agent ra quyết định</span>
                  </span>
                  <Icon name="arrow" size={20} stroke={2.4} className="pj-launch-arrow" />
                </Link>
              ) : null;
            })}
          </div>
          <div className="cert-hero-vis" aria-hidden="true">
            <Ring size={280} stroke={12} value={days / validity(cert.earned, cert.expires)} color={cert.theme.color} track={cert.theme.tint} label={`Còn ${days} ngày`} />
            <div className="orbit spin-slow small-orbit" />
            <div className="float-a featured-badge">
              <Emblem cert={cert} size={110} />
              <div className="h featured-days">
                {days} <span>ngày còn lại</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container cert-body">
        <aside className="toc-wrap">
          <div className="toc-label">TRONG SỔ TAY</div>
          <nav className="toc" aria-label="Mục lục">
            {TOC.map(([key, label], i) => (
              <button key={key} type="button" className={active === key ? 'on' : ''} onClick={() => scrollToId(key)}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </button>
            ))}
          </nav>
          <div className="toc-switch">
            <div className="toc-label">CHỨNG CHỈ KHÁC</div>
            {CERTS.filter((c) => c.id !== cert.id).map((c) => (
              <Link key={c.id} to={`/cert/${c.id}`} className="toc-cert">
                <span className="dot" style={{ background: c.theme.color }} />
                {c.short}
              </Link>
            ))}
          </div>
        </aside>

        <div className="cert-content">
          <Reveal as="section" id="overview" className="stack-20">
            <h2 className="h sec-h">Tóm tắt 30 giây</h2>
            <div className="grid-3">
              {overview.map(([icon, title, body]) => (
                <div key={title} className="card ov-card">
                  <div className="ov-icon">
                    <Icon name={icon} size={22} />
                  </div>
                  <h3 className="h ov-title">{title}</h3>
                  <p className="muted small">{body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {cert.blueprint && (
            <Reveal as="section" id="blueprint" className="stack-20">
              <div className="section-head tight">
                <div>
                  <h2 className="h sec-h">Bức tranh lớn</h2>
                  <p className="muted small" style={{ marginTop: 8 }}>{cert.blueprint.caption} — nhớ được hình này là nhớ được khung của cả chứng chỉ.</p>
                </div>
                <span className="muted-sm">Bấm từng khối</span>
              </div>
              <Blueprint cert={cert} />
            </Reveal>
          )}

          {cert.decide && (
            <Reveal as="section" id="decide" className="stack-20">
              <div>
                <h2 className="h sec-h">Khi nào dùng gì</h2>
                <p className="muted small" style={{ marginTop: 8 }}>Đề thi hỏi nhiều nhất kiểu “tình huống này chọn dịch vụ nào”. Đi theo cây để luyện đúng phản xạ đó.</p>
              </div>
              <DecisionFlow cert={cert} />
            </Reveal>
          )}

          {cert.compare && (
            <Reveal as="section" id="compare" className="stack-20">
              <div>
                <h2 className="h sec-h">Đừng nhầm</h2>
                <p className="muted small" style={{ marginTop: 8 }}>Những cặp hay bị đánh tráo trong đề — đặt cạnh nhau là thấy khác ngay.</p>
              </div>
              <CompareCards cert={cert} />
            </Reveal>
          )}

          <Reveal as="section" id="demo">
            <DemoStepper cert={cert} />
          </Reveal>

          <Reveal as="section" id="domains" className="stack-20">
            <div>
              <h2 className="h sec-h">Nhóm kiến thức</h2>
              <p className="muted small" style={{ marginTop: 8 }}>
                Chia theo cách mình ôn — đối chiếu thêm với study guide chính thức.
              </p>
            </div>
            <Domains cert={cert} />
          </Reveal>

          <Reveal as="section" id="concepts" className="stack-20">
            <div className="section-head tight">
              <h2 className="h sec-h">Khái niệm cốt lõi</h2>
              <span className="muted-sm">Bấm thẻ để lật</span>
            </div>
            <ConceptCards cert={cert} />
          </Reveal>

          <Reveal as="section" id="code" className="stack-20">
            <div>
              <h2 className="h sec-h">Code mẫu</h2>
              <p className="muted small" style={{ marginTop: 8 }}>{cert.code.note}</p>
            </div>
            <CodeTabs cert={cert} />
          </Reveal>

          {!cert.compare && (
          <Reveal as="section" id="traps" className="stack-20">
            <h2 className="h sec-h">Bẫy đề thi</h2>
            <div className="grid-3">
              {cert.traps.map((t) => (
                <div key={t.title} className="trap">
                  <div className="row-10">
                    <span className="trap-ico">
                      <Icon name="warn" size={18} stroke={2.2} />
                    </span>
                    <span className="h trap-title">{t.title}</span>
                  </div>
                  <p className="trap-body">{t.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          )}

          {(cert.blueprint || cert.decide || cert.compare) && (
            <Reveal as="section" id="recall" className="stack-20">
              <div>
                <h2 className="h sec-h">Nhớ trong 5 câu</h2>
                <p className="muted small" style={{ marginTop: 8 }}>Đọc lại 5 câu này trước khi thi, rồi tự kiểm tra ngay bên cạnh.</p>
              </div>
              <RecallStrip cert={cert} />
            </Reveal>
          )}

          <Reveal as="section" id="takeaways" className="stack-20">
            <h2 className="h sec-h">Điều mình rút ra</h2>
            <div className="grid-notes">
              <Notes cert={cert} />
              <div className="card stack-10">
                <div className="toc-label">TÀI NGUYÊN</div>
                {cert.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="res-link">
                    {r.label}
                    <Icon name="external" size={16} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <nav className="pager" aria-label="Chứng chỉ khác">
            <Link to={`/cert/${prev.id}`} className="pager-link">
              <Icon name="arrowLeft" size={18} />
              <span>
                <span className="muted-sm">Trước</span>
                <b>{prev.short}</b>
              </span>
            </Link>
            <Link to={`/cert/${next.id}`} className="pager-link right">
              <span>
                <span className="muted-sm">Tiếp theo</span>
                <b>{next.short}</b>
              </span>
              <Icon name="arrow" size={18} />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
