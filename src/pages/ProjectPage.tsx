import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCert } from '../data';
import { getProject } from '../data/projects/mtm';
import { Icon, type IconName } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { themeVars } from '../components/CertCard';
import { Blueprint } from '../components/LearnVisuals';
import { MatchReplay } from '../components/project/MatchReplay';
import { DecisionLab, TimeboxCalc } from '../components/project/DecisionLab';
import { ProjectEmblem } from '../components/project/ProjectEmblem';
import { AgentNetwork, CountStat, Ticker, useCardFx, useInView, reducedMotion } from '../components/project/fx';
import { scrollToId } from '../lib/text';
import { NotFound } from './NotFound';

const NAV: [string, string][] = [
  ['rules', 'Thể lệ'],
  ['solution', 'Giải pháp'],
  ['replay', 'Giả lập trận'],
  ['detail', 'Agent quyết định thế nào'],
  ['journey', 'Hành trình'],
  ['lessons', 'Bài học'],
];

const TICKER: [string, string][] = [
  ['wait_for_update', 'đợt đề mới · DISCOVERED ×3'],
  ['dispatch_ready', '→ spawn 3 worker · mỗi item một worktree'],
  ['gate', 'BUG-02 · test của item + typecheck · GREEN'],
  ['ship', 'integrate → push fast-forward → submit_work'],
  ['SUBMITTED', 'PI-01 · receipt ✓'],
  ['AUTO_SHIP', 'cutoff deadline · helper tự nộp bài đã commit'],
];

/** 7 bước vòng đời tự sáng lần lượt khi đang trong khung nhìn. */
function Pipeline({ steps }: { steps: { icon: IconName; title: string; body: string; tool: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, 0.35, false);
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (!seen || reducedMotion()) return;
    const id = window.setInterval(() => setOn((x) => (x + 1) % steps.length), 1700);
    return () => window.clearInterval(id);
  }, [seen, steps.length]);
  return (
    <div ref={ref} className="pj-pipe stagger">
      {steps.map((s, i) => (
        <div key={s.title} className={`pj-pipe-step fx-card fx-tilt ${i === on ? 'on' : i < on ? 'past' : ''}`} onMouseEnter={() => setOn(i)}>
          <span className="pj-pipe-ico">
            <Icon name={s.icon} size={20} />
          </span>
          <b>{i + 1}. {s.title}</b>
          <p className="muted small">{s.body}</p>
          <code className="mono">{s.tool}</code>
        </div>
      ))}
    </div>
  );
}

/** Timeline: đường dọc tự vẽ theo cuộn trang, từng mốc sáng lên khi qua. */
function Journey({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = [...el.querySelectorAll('li')];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.4 },
    );
    items.forEach((li) => io.observe(li));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / r.height));
      el.style.setProperty('--fill', String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <ol ref={ref} className="pj-tl">
      {children}
    </ol>
  );
}

const OWN: [IconName, string, string][] = [
  ['tool', 'Helper sở hữu', 'Đăng nhập portal, Game API, credential trong RAM, planner, dispatch, worktree, gate, ship, autopilot, mọi event ORCHESTRATOR_* / DISCOVERED / SUBMITTED.'],
  ['brain', 'Agent sở hữu', 'Đọc đề, code, test, evidence, submit.json, commit; quyết định khi có mâu thuẫn và báo PREPARATION_STATUS, BACKLOG_TESTS.'],
  ['shield', 'Không bao giờ', 'Credential trong file/log/prompt; force-push; sửa exam-info.json, env-require/, challenge/; khởi chạy CLI agent khác; chạm vào máy khi trận đang chạy.'],
];

export function ProjectPage() {
  const { id, slug } = useParams();
  const cert = getCert(id);
  const p = getProject(slug);
  const [active, setActive] = useState('rules');
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useCardFx(rootRef);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur = NAV[0][0];
      for (const [key] of NAV) {
        const el = document.getElementById(key);
        if (el && el.getBoundingClientRect().top < 160) cur = key;
      }
      setActive(cur);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      navRef.current?.style.setProperty('--sp', String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!cert || !p || p.cert !== cert.id) return <NotFound />;

  return (
    <div style={themeVars(cert)} className="pj" ref={rootRef}>
      <section className="pj-hero">
        <div className="pj-hero-grid-bg" aria-hidden="true" />
        <AgentNetwork />
        <div className="pj-aurora" aria-hidden="true" />
        <div className="container pj-hero-grid">
          <div className="stack-20">
            <nav aria-label="Vị trí" className="crumbs pj-crumbs">
              <Link to="/">Tổng quan</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/cert/${cert.id}`}>{cert.short}</Link>
              <span aria-hidden="true">/</span>
              <span>{p.short}</span>
            </nav>
            <div className="tag-row rv">
              <span className="pj-chip">DỰ ÁN THỰC CHIẾN</span>
              <span className="pj-chip ghost">{p.period}</span>
            </div>
            <h1 className="h pj-title rv d1">
              {p.title.split(' ').slice(0, -1).join(' ')} <span className="pj-grad">{p.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="pj-lead rv d2">{p.tagline}</p>
            <p className="pj-role rv d2">
              <Icon name="user" size={16} /> {p.role}
            </p>
            <div className="rv d3">
              <Ticker lines={TICKER} />
            </div>
            <div className="row-12 wrap rv d3">
              <button type="button" className="btn btn-theme" onClick={() => scrollToId('replay')}>
                <Icon name="play" size={16} fill /> Xem phát lại trận
              </button>
              <button type="button" className="btn pj-btn-ghost" onClick={() => scrollToId('detail')}>
                Agent quyết định thế nào <Icon name="arrow" size={16} className="arrow" />
              </button>
            </div>
          </div>
          <div className="pj-hero-vis" aria-hidden="true">
            <div className="pj-orbit" />
            <div className="pj-orbit two" />
            <span className="pj-sat s1">PI</span>
            <span className="pj-sat s2">BUG</span>
            <span className="pj-sat s3">CR</span>
            <span className="pj-sat s4">TASK</span>
            <div className="pj-em-wrap float-a">
              <span className="pj-em-halo" />
              <ProjectEmblem mono={p.mono} size={150} />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="pj-stats">
            {p.stats.map(([n, l], i) => (
              <CountStat key={l} value={n} label={l} delay={i * 110} />
            ))}
          </div>
        </div>
      </section>

      <nav className="pj-nav" aria-label="Mục của dự án" ref={navRef}>
        <span className="pj-progress" aria-hidden="true" />
        <div className="container pj-nav-row">
          {NAV.map(([key, label]) => (
            <button key={key} type="button" className={active === key ? 'on' : ''} onClick={() => scrollToId(key)}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="container pj-body">
        {/* ── Thể lệ ── */}
        <Reveal as="section" id="rules" className="stack-20">
          <div>
            <div className="eyebrow pj-eyebrow">01 · THỂ LỆ</div>
            <h2 className="h sec-h">Một trận đấu trông như thế nào</h2>
            <p className="muted small pj-sub">Bốn loại ticket, mở dần theo đợt trên một ứng dụng thật (Next.js + tRPC + Prisma + PostgreSQL ở các trận tập). Người không được chạm vào máy.</p>
          </div>
          <div className="pj-rules stagger">
            {p.rules.cards.map((c) => (
              <div key={c.type} className={`pj-rule fx-card fx-tilt t-${c.type}`}>
                <span className="pj-rule-type mono">{c.type}</span>
                <h3 className="h">{c.name}</h3>
                <p className="muted small">{c.body}</p>
                <span className="pj-rule-mvs">{c.mvs}</span>
              </div>
            ))}
          </div>
          <div className="pj-facts stagger">
            {p.rules.facts.map(([icon, title, body]) => (
              <div key={title} className="pj-fact fx-card">
                <span className="ov-icon">
                  <Icon name={icon} size={20} />
                </span>
                <div>
                  <b>{title}</b>
                  <p className="muted small">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Giải pháp ── */}
        <Reveal as="section" id="solution" className="stack-20">
          <div className="section-head tight">
            <div>
              <div className="eyebrow pj-eyebrow">02 · GIẢI PHÁP</div>
              <h2 className="h sec-h">Một đội agent, một “bộ não cơ học”</h2>
              <p className="muted small pj-sub">{p.blueprint.caption}. Bấm từng khối để xem nó làm gì.</p>
            </div>
          </div>
          <Blueprint cert={{ ...cert, blueprint: p.blueprint }} />
          <div className="grid-3 stagger">
            {OWN.map(([icon, title, body]) => (
              <div key={title} className="card ov-card fx-card fx-tilt">
                <div className="ov-icon">
                  <Icon name={icon} size={22} />
                </div>
                <h3 className="h ov-title">{title}</h3>
                <p className="muted small">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Giả lập ── */}
        <Reveal as="section" id="replay" className="stack-20">
          <div>
            <div className="eyebrow pj-eyebrow">03 · GIẢ LẬP CHẠY THẬT</div>
            <h2 className="h sec-h">Phát lại trận {p.replay.matchId}</h2>
            <p className="muted small pj-sub">
              Mốc thời gian lấy từ <span className="mono">state.json</span> của kit {p.replay.kit} trong trận tập ngày {p.replay.date}: lúc đề mở, lúc giao worker, lúc nộp và điểm grader. 40 phút được nén còn 60 giây.
            </p>
          </div>
          <MatchReplay replay={p.replay} />
        </Reveal>

        {/* ── Solution detail ── */}
        <Reveal as="section" id="detail" className="stack-20">
          <div>
            <div className="eyebrow pj-eyebrow">04 · SOLUTION DETAIL</div>
            <h2 className="h sec-h">Agent quyết định thế nào</h2>
            <p className="muted small pj-sub">Từ lúc đề hiện tới lúc có receipt, và các luật mà kit dùng để chọn việc, chọn model, chọn cách kiểm thử.</p>
          </div>

          <Pipeline steps={p.lifecycle} />

          <div className="pj-two stagger">
            <div className="card stack-10 fx-card">
              <div className="toc-label">THỨ TỰ ƯU TIÊN KHI CHỌN VIỆC</div>
              <ol className="pj-ladder">
                {p.priority.map((x, i) => (
                  <li key={x.title}>
                    <span className="pj-ladder-n">{i + 1}</span>
                    <div>
                      <b>{x.title}</b>
                      <p className="muted small">{x.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card stack-10 fx-card">
              <div className="toc-label">MODEL ROUTER — HELPER CHỌN KHI GIAO VIỆC</div>
              <div className="pj-table">
                {p.models.map(([lane, model, effort, why]) => (
                  <div key={lane} className="pj-tr">
                    <b>{lane}</b>
                    <span className="pj-model mono">{model}</span>
                    <span className="muted small">{effort}</span>
                    <span className="muted-sm">{why}</span>
                  </div>
                ))}
              </div>
              <p className="muted-sm">Chỉ chọn trong danh sách allowedModels BTC cho phép. Lần chạy toàn Luna chỉ được 216/1000 nên Luna không còn là model ưu tiên.</p>
            </div>
          </div>

          <div className="card stack-10">
            <div className="toc-label">THỬ XEM: WORKER SẼ CHẠY ITEM NÀY RA SAO</div>
            <TimeboxCalc project={p} />
          </div>

          <div className="stack-10">
            <h3 className="h pj-h3">Tình huống trong trận — kit phản ứng thế nào</h3>
            <p className="muted small">Mỗi luật dưới đây sinh ra từ một lần mất điểm thật, và có test tái hiện trong kit.</p>
            <DecisionLab situations={p.situations} />
          </div>
        </Reveal>

        {/* ── Hành trình ── */}
        <Reveal as="section" id="journey" className="stack-20">
          <div>
            <div className="eyebrow pj-eyebrow">05 · HÀNH TRÌNH</div>
            <h2 className="h sec-h">Mỗi trận tập là một bản vá</h2>
            <p className="muted small pj-sub">Vòng lặp: chạy trận → đọc transcript, đo thời gian chờ → viết test tái hiện → sửa → chạy lại.</p>
          </div>
          <Journey>
            {p.milestones.map((m) => (
              <li key={m.ver}>
                <div className="pj-tl-ver">
                  <b className="mono">{m.ver}</b>
                  <span>{m.date}</span>
                </div>
                <div className="pj-tl-card fx-card">
                  <span className="pj-tl-match mono">{m.match}</span>
                  <p><b>Vấn đề:</b> {m.problem}</p>
                  <p><b>Sửa:</b> {m.fix}</p>
                  <span className="pj-tl-metric mono">{m.metric}</span>
                </div>
              </li>
            ))}
          </Journey>
          <div className="card stack-10">
            <div className="toc-label">KẾT QUẢ TẬP LUYỆN</div>
            <div className="pj-results stagger">
              {p.results.map((r) => (
                <div key={r.match} className="pj-res">
                  <b className="h">{r.score}</b>
                  <div>
                    <b>{r.match}</b>
                    <span className="muted-sm"> · kit {r.kit}</span>
                    <p className="muted small">{r.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Bài học ── */}
        <Reveal as="section" id="lessons" className="stack-20">
          <div>
            <div className="eyebrow pj-eyebrow">06 · BÀI HỌC</div>
            <h2 className="h sec-h">Điều mình mang theo sang dự án agent khác</h2>
          </div>
          <div className="pj-lessons stagger">
            {p.lessons.map((l, i) => (
              <div key={l.title} className="card pj-lesson fx-card fx-tilt">
                <span className="pj-lesson-n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h">{l.title}</h3>
                <p className="muted small">{l.body}</p>
              </div>
            ))}
          </div>
          <Link to={`/cert/${cert.id}`} className="pager-link pj-back">
            <Icon name="arrowLeft" size={18} />
            <span>
              <span className="muted-sm">Quay lại chứng chỉ</span>
              <b>{cert.short}</b>
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
