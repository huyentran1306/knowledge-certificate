import { useEffect, useState } from 'react';
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
    <div style={themeVars(cert)} className="pj">
      <section className="pj-hero">
        <div className="pj-hero-grid-bg" aria-hidden="true" />
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
            <h1 className="h pj-title rv d1">{p.title}</h1>
            <p className="pj-lead rv d2">{p.tagline}</p>
            <p className="pj-role rv d2">
              <Icon name="user" size={16} /> {p.role}
            </p>
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
            <div className="float-a">
              <ProjectEmblem mono={p.mono} size={150} />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="pj-stats">
            {p.stats.map(([n, l]) => (
              <div key={l}>
                <b className="h">{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="pj-nav" aria-label="Mục của dự án">
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
          <div className="pj-rules">
            {p.rules.cards.map((c) => (
              <div key={c.type} className={`pj-rule t-${c.type}`}>
                <span className="pj-rule-type mono">{c.type}</span>
                <h3 className="h">{c.name}</h3>
                <p className="muted small">{c.body}</p>
                <span className="pj-rule-mvs">{c.mvs}</span>
              </div>
            ))}
          </div>
          <div className="pj-facts">
            {p.rules.facts.map(([icon, title, body]) => (
              <div key={title} className="pj-fact">
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
          <div className="grid-3">
            {OWN.map(([icon, title, body]) => (
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

          <div className="pj-pipe">
            {p.lifecycle.map((s, i) => (
              <div key={s.title} className="pj-pipe-step" style={{ animationDelay: `${i * 90}ms` }}>
                <span className="pj-pipe-ico">
                  <Icon name={s.icon} size={20} />
                </span>
                <b>{i + 1}. {s.title}</b>
                <p className="muted small">{s.body}</p>
                <code className="mono">{s.tool}</code>
              </div>
            ))}
          </div>

          <div className="pj-two">
            <div className="card stack-10">
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
            <div className="card stack-10">
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
          <ol className="pj-tl">
            {p.milestones.map((m) => (
              <li key={m.ver}>
                <div className="pj-tl-ver">
                  <b className="mono">{m.ver}</b>
                  <span>{m.date}</span>
                </div>
                <div className="pj-tl-card">
                  <span className="pj-tl-match mono">{m.match}</span>
                  <p><b>Vấn đề:</b> {m.problem}</p>
                  <p><b>Sửa:</b> {m.fix}</p>
                  <span className="pj-tl-metric mono">{m.metric}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="card stack-10">
            <div className="toc-label">KẾT QUẢ TẬP LUYỆN</div>
            <div className="pj-results">
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
          <div className="pj-lessons">
            {p.lessons.map((l, i) => (
              <div key={l.title} className="card pj-lesson">
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
