import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CERTS, CERT_BY_ID, LATEST, SKILLS, TOPICS } from '../data';
import { daysBetween, daysLeft, fmt, parseDate } from '../lib/date';
import { useCountUp } from '../lib/hooks';
import { scrollToId } from '../lib/text';
import { Emblem } from '../components/Emblem';
import { Icon } from '../components/Icon';
import { CertCard, FeaturedCertCard } from '../components/CertCard';
import { AtlasMap } from '../components/AtlasMap';
import { Reveal } from '../components/Reveal';

export function HomePage() {
  const first = CERTS[0];
  const span = daysBetween(parseDate(first.earned), parseDate(LATEST.earned));
  const nextRenewal = Math.min(...CERTS.map((c) => daysLeft(c.expires)));
  const experts = CERTS.filter((c) => c.level === 'Expert').length;

  return (
    <>
      <Hero span={span} nextRenewal={nextRenewal} experts={experts} />
      <Collection />
      <Atlas />
      <Journey span={span} />
      <Topics />
      <Cta />
    </>
  );
}

function Hero({ span, nextRenewal, experts }: { span: number; nextRenewal: number; experts: number }) {
  const [p, setP] = useState({ x: 70, y: 30, tx: 0, ty: 0 });
  const cCerts = useCountUp(CERTS.length);
  const cSpan = useCountUp(span);
  const cNext = useCountUp(nextRenewal);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setP({ x: px * 100, y: py * 100, tx: (0.5 - py) * 10, ty: (px - 0.5) * 14 });
  };

  const side = CERTS.filter((c) => c.id !== LATEST.id);
  const left = side[1] ?? side[0];
  const right = side[side.length - 1];
  const skills = [...SKILLS, ...SKILLS];

  return (
    <section className="hero dots" onMouseMove={onMove} onMouseLeave={() => setP((s) => ({ ...s, tx: 0, ty: 0 }))}>
      <div
        className="hero-spot"
        aria-hidden="true"
        style={{ background: `radial-gradient(560px circle at ${p.x}% ${p.y}%, rgba(48,71,224,.10), transparent 65%)` }}
      />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pill rv">
            <span className="pill-dot pulse">
              <Icon name="check" size={12} stroke={3} />
            </span>
            Vừa đạt: {LATEST.title}
          </div>
          <h1 className="h hero-title rv d1">
            Mọi thứ mình học được, <span className="sheen">vẽ thành một bản đồ.</span>
          </h1>
          <p className="hero-lead rv d2">
            Sổ tay sống cho {CERTS.length} chứng chỉ AI &amp; developer: khái niệm cốt lõi, sơ đồ, demo chạy được và những bẫy đề thi — để lúc
            cần là mở ra, nhớ lại ngay.
          </p>
          <div className="row-12 wrap rv d3">
            <Link to="/review" className="btn btn-primary btn-lg">
              Ôn tập 5 phút <Icon name="arrow" size={18} stroke={2.2} className="arrow" />
            </Link>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => scrollToId('atlas')}>
              Xem bản đồ tổng
            </button>
          </div>
          <div className="stats rv d4">
            <div className="stat">
              <div className="h stat-num">{cCerts}</div>
              <div className="stat-label">chứng chỉ · {experts} Expert</div>
            </div>
            <div className="stat">
              <div className="h stat-num">
                {cSpan}
                <small> ngày</small>
              </div>
              <div className="stat-label">từ chứng chỉ đầu đến mới nhất</div>
            </div>
            <div className="stat">
              <div className="h stat-num warn">
                {cNext}
                <small> ngày</small>
              </div>
              <div className="stat-label">tới lượt hết hạn gần nhất</div>
            </div>
          </div>
        </div>

        <div className="hero-vis" aria-hidden="true">
          <div className="orbit-ring big spin-slow">
            <i style={{ background: '#7C3AED', top: -7, left: '50%' }} />
            <i style={{ background: '#0E9384', bottom: 60, left: 18 }} />
          </div>
          <div className="orbit-ring small spin-rev">
            <i style={{ background: '#2563EB', right: -6, top: '50%' }} />
          </div>
          <div className="tilt" style={{ transform: `rotateX(${p.tx}deg) rotateY(${p.ty}deg)` }}>
            <div className="float-b hv hv-left">
              <div className="hv-card" style={{ transform: 'rotate(-8deg) translateZ(40px)' }}>
                <div className="row-12">
                  <Emblem cert={left} size={44} />
                  <div>
                    <div className="hv-level" style={{ color: left.theme.ink }}>{left.level.toUpperCase()}</div>
                    <div className="h hv-name">{left.short}</div>
                  </div>
                </div>
                <div className="hv-code mono" style={{ background: left.theme.tint, color: left.theme.ink }}>
                  {left.concepts[1]?.term ?? left.tags[0]}
                </div>
              </div>
            </div>
            <div className="float-a hv hv-right">
              <div className="hv-card" style={{ transform: 'rotate(6deg) translateZ(70px)' }}>
                <div className="row-12">
                  <Emblem cert={right} size={44} />
                  <div>
                    <div className="hv-level" style={{ color: right.theme.ink }}>{right.level.toUpperCase()}</div>
                    <div className="h hv-name">{right.short}</div>
                  </div>
                </div>
                <div className="tag-row" style={{ marginTop: 14 }}>
                  {right.concepts.slice(0, 3).map((k) => (
                    <span key={k.term} className="tag-sm" style={{ background: right.theme.tint, color: right.theme.ink }}>
                      {k.term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="float-c hv hv-center">
              <div className="hv-card hv-main" style={{ transform: 'translateZ(120px)', borderColor: LATEST.theme.tint }}>
                <div className="row-12">
                  <Emblem cert={LATEST} size={56} />
                  <div>
                    <div className="hv-level" style={{ color: LATEST.theme.ink }}>{LATEST.level.toUpperCase()}</div>
                    <div className="h hv-name lg">{LATEST.short}</div>
                  </div>
                </div>
                <div className="hv-bar" style={{ background: LATEST.theme.tint }}>
                  <div className="draw-x" style={{ background: LATEST.theme.color }} />
                </div>
                <div className="hv-meta">
                  <span>Đạt {fmt(LATEST.earned)}</span>
                  <span>Hết hạn {fmt(LATEST.expires)}</span>
                </div>
              </div>
            </div>
            <div className="float-b hv hv-chip1">
              <div className="mono hv-chip dark">@workspace /explain</div>
            </div>
            <div className="float-a hv hv-chip2">
              <div className="hv-chip blue">RAG · Grounding</div>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee-wrap">
        <div className="marquee">
          {skills.map((s, i) => (
            <span key={i} className="skill">
              <span className="dot" style={{ background: CERT_BY_ID[s.cert].theme.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="h section-title">{title}</h2>
      </div>
      {desc && <p className="section-desc">{desc}</p>}
    </div>
  );
}

function Collection() {
  const others = [...CERTS].filter((c) => c.id !== LATEST.id).reverse();
  return (
    <section id="certs" className="container section">
      <SectionHead
        eyebrow="BỘ SƯU TẬP"
        title={`${CERTS.length} cuốn sổ tay, ${CERTS.length} chặng đường`}
        desc="Vòng tròn là thời gian hiệu lực còn lại — càng đầy càng xa ngày hết hạn. Bấm vào thẻ để mở sổ tay."
      />
      <div className="cert-grid">
        <Reveal className="span-2-wrap">
          <FeaturedCertCard cert={LATEST} />
        </Reveal>
        {others.map((c, i) => (
          <Reveal key={c.id} delay={i * 70}>
            <CertCard cert={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Atlas() {
  return (
    <section id="atlas" className="container section">
      <SectionHead
        eyebrow="BẢN ĐỒ TỔNG"
        title="Toàn bộ kiến thức trên một bản đồ"
        desc="Mỗi nhánh là một chứng chỉ cùng các chủ đề chính. Bấm vào chứng chỉ để mở bản đồ tư duy chi tiết của nó."
      />
      <Reveal className="atlas-card">
        <AtlasMap />
      </Reveal>
    </section>
  );
}

function Journey({ span }: { span: number }) {
  return (
    <section id="journey" className="container section">
      <Reveal className="journey-card">
        <div className="section-head">
          <div>
            <div className="eyebrow">HÀNH TRÌNH</div>
            <h2 className="h section-title sm">
              {fmt(CERTS[0].earned).slice(0, 5)} → {fmt(LATEST.earned)}
            </h2>
          </div>
          <div className="muted">
            Nhịp trung bình: <b>1 chứng chỉ / {Math.round(span / Math.max(1, CERTS.length - 1))} ngày</b>
          </div>
        </div>
        <div className="timeline">
          <div className="tl-track" aria-hidden="true" />
          <div
            className="tl-fill"
            aria-hidden="true"
            style={{ background: `linear-gradient(90deg, ${CERTS.map((c) => c.theme.color).join(',')})` }}
          />
          <ol className="tl-list">
            {CERTS.map((c, i) => {
              const gap = i > 0 ? daysBetween(parseDate(CERTS[i - 1].earned), parseDate(c.earned)) : 0;
              return (
                <li key={c.id}>
                  <Link to={`/cert/${c.id}`} className="tl-node pop" style={{ borderColor: c.theme.color, color: c.theme.color, animationDelay: `${0.5 + i * 0.3}s` }}>
                    <span className="h">{c.mono}</span>
                  </Link>
                  <div className="mono tl-date">{fmt(c.earned)}</div>
                  <div className="h tl-name">{c.short}</div>
                  {i === 0 ? <span className="tl-chip dark">Điểm xuất phát</span> : <span className="tl-chip">+{gap} ngày</span>}
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

function Topics() {
  return (
    <section id="topics" className="container section">
      <SectionHead
        eyebrow="CHỦ ĐỀ XUYÊN SUỐT"
        title="Kiến thức nối các chứng chỉ lại với nhau"
        desc="Mỗi chấm màu là một chứng chỉ có đề cập chủ đề đó."
      />
      <div className="topic-grid">
        {TOPICS.map((t, i) => (
          <Reveal key={t.title} className="topic tile" delay={i * 60}>
            <div className="topic-top">
              <span className="mono muted-sm">0{i + 1}</span>
              <span className="dots-row">
                {t.certs.map((id) => (
                  <Link
                    key={id}
                    to={`/cert/${id}`}
                    className="topic-dot"
                    title={CERT_BY_ID[id].short}
                    aria-label={CERT_BY_ID[id].short}
                    style={{ background: CERT_BY_ID[id].theme.color }}
                  />
                ))}
              </span>
            </div>
            <h3 className="h topic-title">{t.title}</h3>
            <p className="muted small">{t.desc}</p>
            <div className="muted-sm" style={{ marginTop: 'auto' }}>
              Có trong {t.certs.length}/{CERTS.length} chứng chỉ
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="container section-last">
      <Reveal className="cta dots">
        <div className="stack-16" style={{ maxWidth: 560 }}>
          <h2 className="h cta-title">Nhớ lâu hơn với 5 phút mỗi ngày</h2>
          <p className="muted lead-sm">Flashcard và câu hỏi tình huống rút từ chính sổ tay của bạn. Thẻ chưa nhớ sẽ quay lại sớm hơn.</p>
        </div>
        <Link to="/review" className="btn btn-primary btn-lg">
          Bắt đầu ôn tập <Icon name="arrow" size={18} stroke={2.2} className="arrow" />
        </Link>
      </Reveal>
    </section>
  );
}
