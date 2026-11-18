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
import { NotFound } from './NotFound';

const TOC = [
  ['overview', 'Tóm tắt 30 giây'],
  ['demo', 'Demo tương tác'],
  ['domains', 'Nhóm kiến thức'],
  ['concepts', 'Khái niệm cốt lõi'],
  ['code', 'Code mẫu'],
  ['traps', 'Bẫy đề thi'],
  ['takeaways', 'Điều mình rút ra'],
] as const;

export function CertPage() {
  const { id } = useParams();
  const cert = getCert(id);
  const [active, setActive] = useState<string>('overview');

  // Đánh dấu mục đang đọc trong mục lục: mục cuối cùng có đầu đã cuộn qua mốc 140px.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur: string = TOC[0][0];
      for (const [key] of TOC) {
        const el = document.getElementById(key);
        if (el && el.getBoundingClientRect().top < 140) cur = key;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? TOC[TOC.length - 1][0] : cur);
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
  }, [cert?.id]);

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
              <span className="chip-outline">{cert.issuer === 'Microsoft' ? 'Microsoft Certified' : 'GitHub Certification'}</span>
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
                <span className="mono">0{i + 1}</span>
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
