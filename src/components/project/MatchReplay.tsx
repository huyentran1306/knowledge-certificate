import { useEffect, useMemo, useRef, useState } from "react";
import type { Replay, ReplayItem } from "../../data/projects/mtm";
import { Icon } from "../Icon";
import { ConfettiBurst, reducedMotion, useInView } from "./fx";

/** Khoảng integrate → gate → push → nộp ở cuối mỗi item (ước lượng; state của kit 2.9.1 chỉ lưu giờ nộp). */
const SHIP = 0.4;
/** Grader trả kết quả sau khi nộp (ước lượng để hiển thị). */
const GRADE = 0.5;
/** Phút trận trên mỗi giây thật ở tốc độ 1×. */
const BASE_RATE = 40 / 60;

const TYPE_COLOR: Record<ReplayItem["type"], string> = {
  PI: "#F59E0B",
  BUG: "#F43F5E",
  CR: "#A855F7",
  TASK: "#3B82F6",
};

const clock = (m: number) => {
  const s = Math.max(0, Math.round(m * 60));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
const pct = (m: number, total: number) =>
  `${(Math.min(Math.max(m, 0), total) / total) * 100}%`;
const num = (m: number) =>
  m.toLocaleString("vi-VN", { maximumFractionDigits: 1 });

type Ev = {
  at: number;
  kind: "info" | "warn" | "ok" | "bad" | "dim";
  tag: string;
  text: string;
};

function buildEvents(r: Replay): Ev[] {
  const ev: Ev[] = [];
  const waves = new Map<number, ReplayItem[]>();
  for (const it of r.items)
    waves.set(it.seen, [...(waves.get(it.seen) ?? []), it]);
  for (const [at, list] of waves) {
    ev.push({
      at,
      kind: "info",
      tag: "DISCOVERED",
      text: list
        .map((i) => `${i.id}${i.deadline ? ` (hạn ${num(i.deadline)}′)` : ""}`)
        .join(" · "),
    });
  }
  for (const it of r.items) {
    ev.push({
      at: it.disp,
      kind: "dim",
      tag: "spawn",
      text: `${it.id.toLowerCase().replace("-", "")} · worktree riêng · effort ${it.effort}`,
    });
    ev.push({
      at: it.sub - SHIP,
      kind: "dim",
      tag: "ship",
      text: `${it.id} → integrate → gate ${it.gate} GREEN → push`,
    });
    ev.push({
      at: it.sub,
      kind: "info",
      tag: "SUBMITTED",
      text: `${it.id} · receipt ✓`,
    });
    ev.push({
      at: it.sub + GRADE,
      kind: it.got === it.max ? "ok" : "warn",
      tag: "GRADED",
      text: `${it.id} ${it.got}/${it.max}${it.loss ? ` — ${it.loss}` : ""}`,
    });
  }
  for (const n of r.notes)
    ev.push({ at: n.at, kind: n.kind, tag: "!!", text: n.text });
  return ev.sort((a, b) => a.at - b.at);
}

export function MatchReplay({ replay }: { replay: Replay }) {
  const total = replay.minutes;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, 0.45);
  const autoplayed = useRef(false);
  // Tự phát một lần khi khung trận lọt vào màn hình.
  useEffect(() => {
    if (inView && !autoplayed.current && !reducedMotion()) {
      autoplayed.current = true;
      if (t === 0) setPlaying(true);
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  const events = useMemo(() => buildEvents(replay), [replay]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const next = prev + dt * BASE_RATE * speed;
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, total]);

  const shown = events.filter((e) => e.at <= t);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown.length]);

  const done = replay.items.filter((i) => i.sub <= t);
  const graded = replay.items.filter((i) => i.sub + GRADE <= t);
  const working = replay.items.filter((i) => i.disp <= t && i.sub > t);
  const waiting = replay.items.filter((i) => i.seen <= t && i.disp > t);
  const score = graded.reduce((s, i) => s + i.got, 0);
  const maxSoFar = graded.reduce((s, i) => s + i.max, 0);
  const waves = [...new Set(replay.items.map((i) => i.seen))].sort(
    (a, b) => a - b,
  );
  const finished = t >= total;
  const lastSub = Math.max(...replay.items.map((i) => i.sub));
  const lost = replay.items.filter((i) => i.got < i.max);
  const selItem = replay.items.find((i) => i.id === sel);

  const toggle = () => {
    if (finished) {
      setT(0);
      setPlaying(true);
    } else setPlaying((p) => !p);
  };

  return (
    <div className={`rp ${playing ? "is-playing" : ""}`} ref={rootRef}>
      <div className="rp-hud">
        <div className="rp-clock">
          <span className={`rp-live ${playing ? "on" : ""}`}>
            {finished
              ? "FINISHED"
              : playing
                ? "LIVE"
                : t > 0
                  ? "PAUSED"
                  : "READY"}
          </span>
          <b className="mono">{clock(t)}</b>
          <small className="mono">/ {clock(total)}</small>
        </div>
        <div className="rp-kpis">
          <div>
            <b className="mono rp-bump" key={score}>
              {score}
            </b>
            <span>điểm đã chấm{maxSoFar ? ` / ${maxSoFar}` : ""}</span>
          </div>
          <div>
            <b className="mono rp-bump" key={done.length}>
              {done.length}/{replay.items.length}
            </b>
            <span>item đã nộp</span>
          </div>
          <div>
            <b className="mono">{working.length}</b>
            <span>worker đang chạy</span>
          </div>
          <div>
            <b className="mono">{waiting.length}</b>
            <span>đề chờ giao</span>
          </div>
        </div>
        <div className="rp-ctrl">
          <button
            type="button"
            className="rp-play"
            onClick={toggle}
            aria-label={playing ? "Tạm dừng" : "Phát"}
          >
            <Icon
              name={playing ? "pause" : finished ? "refresh" : "play"}
              size={20}
              fill={!finished}
            />
          </button>
          <div className="rp-speed" role="group" aria-label="Tốc độ">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                type="button"
                className={speed === s ? "on" : ""}
                onClick={() => setSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <input
        type="range"
        className="rp-scrub"
        min={0}
        max={total}
        step={0.1}
        value={t}
        onChange={(e) => {
          setPlaying(false);
          setT(Number(e.target.value));
        }}
        aria-label="Tua thời gian trận"
        style={{ "--p": pct(t, total) } as React.CSSProperties}
      />

      <div className="rp-grid">
        <div className="rp-board">
          <div className="rp-axis">
            <span className="rp-axis-label">Item</span>
            <div className="rp-axis-track">
              {[0, 10, 20, 30, 40].map((m) => (
                <span key={m} style={{ left: pct(m, total) }}>
                  {m}′
                </span>
              ))}
              {waves.map((w) => (
                <i
                  key={w}
                  className="rp-wave"
                  style={{ left: pct(w, total) }}
                  title={`Đợt đề phút ${num(w)}`}
                />
              ))}
            </div>
          </div>

          {replay.items.map((it) => {
            const visible = it.seen <= t;
            const color = TYPE_COLOR[it.type];
            const isDone = it.sub <= t;
            const isGraded = it.sub + GRADE <= t;
            return (
              <button
                key={it.id}
                type="button"
                className={`rp-row ${visible ? "" : "hidden"} ${sel === it.id ? "sel" : ""}`}
                onClick={() => setSel(sel === it.id ? null : it.id)}
                style={{ "--tc": color } as React.CSSProperties}
                disabled={!visible}
              >
                <span className="rp-id">
                  <i className="rp-type">{it.type}</i>
                  <b className="mono">{it.id}</b>
                </span>
                <span className="rp-track">
                  <span className="rp-now" style={{ left: pct(t, total) }} />
                  {it.deadline && (
                    <span
                      className="rp-dl"
                      style={{ left: pct(it.deadline, total) }}
                      title={`Deadline phút ${num(it.deadline)}`}
                    />
                  )}
                  {visible && (
                    <>
                      <span
                        className="rp-seg wait"
                        style={{
                          left: pct(it.seen, total),
                          width: `calc(${pct(Math.min(t, it.disp), total)} - ${pct(it.seen, total)})`,
                        }}
                      />
                      {t > it.disp && (
                        <span
                          className={`rp-seg work ${t < it.sub - SHIP ? "live" : ""}`}
                          style={{
                            left: pct(it.disp, total),
                            width: `calc(${pct(Math.min(t, it.sub - SHIP), total)} - ${pct(it.disp, total)})`,
                          }}
                        />
                      )}
                      {t > it.sub - SHIP && (
                        <span
                          className="rp-seg ship"
                          style={{
                            left: pct(it.sub - SHIP, total),
                            width: `calc(${pct(Math.min(t, it.sub), total)} - ${pct(it.sub - SHIP, total)})`,
                          }}
                        />
                      )}
                      {isDone && (
                        <span
                          className={`rp-pin ${isGraded ? (it.got === it.max ? "ok" : "warn") : ""}`}
                          style={{ left: pct(it.sub, total) }}
                        >
                          {isGraded ? (
                            it.got
                          ) : (
                            <Icon name="check" size={12} stroke={3} />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </span>
                <span className="rp-pts mono">
                  {isGraded ? `${it.got}/${it.max}` : `${it.max}đ`}
                </span>
              </button>
            );
          })}

          <div className="rp-legend">
            <span>
              <i className="lg wait" /> Đề mở, chờ giao
            </span>
            <span>
              <i className="lg work" /> Worker làm (worktree)
            </span>
            <span>
              <i className="lg ship" /> Ship: gate → push → nộp (ước lượng)
            </span>
            <span>
              <i className="lg dl" /> Deadline
            </span>
            <span>
              <i className="lg wave" /> Đợt đề mới
            </span>
          </div>
        </div>

        <div className="rp-side">
          <div className="rp-log">
            <div className="term-bar">
              <i /> <i /> <i /> <span>progress · {replay.matchId}</span>
            </div>
            <div className="rp-log-body" ref={logRef} aria-live="polite">
              {shown.length === 0 && (
                <div className="rp-line dim">
                  Bấm ▶ để phát lại trận từ phút 0.
                </div>
              )}
              {shown.map((e, i) => (
                <div
                  key={i}
                  className={`rp-line ${e.kind} ${t - e.at < 0.8 ? "new" : ""}`}
                >
                  <span className="rp-t mono">{clock(e.at)}</span>
                  <span className="rp-tag mono">{e.tag}</span>
                  <span>{e.text}</span>
                </div>
              ))}
            </div>
          </div>

          {selItem ? (
            <div
              className="rp-detail lv-in"
              key={selItem.id}
              style={
                { "--tc": TYPE_COLOR[selItem.type] } as React.CSSProperties
              }
            >
              <div className="row-between">
                <b className="h">{selItem.id}</b>
                <span className="rp-type">{selItem.type}</span>
              </div>
              <dl>
                <dt>Đề mở</dt>
                <dd>phút {num(selItem.seen)}</dd>
                <dt>Giao worker sau</dt>
                <dd>{Math.round((selItem.disp - selItem.seen) * 60)} giây</dd>
                <dt>Làm tới lúc nộp</dt>
                <dd>{num(selItem.sub - selItem.disp)} phút</dd>
                {selItem.deadline && (
                  <>
                    <dt>Deadline</dt>
                    <dd>
                      phút {num(selItem.deadline)} (dư{" "}
                      {num(selItem.deadline - selItem.sub)}′)
                    </dd>
                  </>
                )}
                <dt>Gate</dt>
                <dd>
                  {
                    {
                      full: "cả bộ test + typecheck",
                      item: "test của item + typecheck",
                      schema: "chỉ schema đáp án",
                    }[selItem.gate]
                  }
                </dd>
                <dt>Effort</dt>
                <dd>{selItem.effort}</dd>
                <dt>Điểm</dt>
                <dd>
                  {selItem.got}/{selItem.max}
                </dd>
              </dl>
              {selItem.loss && (
                <p className="rp-loss">
                  <Icon name="warn" size={16} /> {selItem.loss}
                </p>
              )}
            </div>
          ) : (
            <div className="rp-hint">
              <Icon name="bulb" size={18} />
              <span>
                Bấm vào một dòng item để xem nó được giao sau bao lâu, làm trong
                bao lâu và vì sao mất điểm.
              </span>
            </div>
          )}
        </div>
      </div>

      {finished && (
        <div className="rp-summary lv-in">
          <ConfettiBurst />
          <div>
            <div className="rp-big h">
              {replay.score}
              <small>/1000</small>
            </div>
            <div className="muted-sm">{replay.rank}</div>
          </div>
          <ul>
            <li>
              <Icon name="check" size={16} stroke={2.6} /> {replay.items.length}
              /{replay.items.length} item nộp, nộp bài cuối ở phút{" "}
              {num(lastSub)}
            </li>
            <li>
              <Icon name="check" size={16} stroke={2.6} /> Mọi item được giao
              trong ≤{" "}
              {Math.max(
                ...replay.items.map((i) => Math.round((i.disp - i.seen) * 60)),
              )}{" "}
              giây sau khi đề mở
            </li>
            <li>
              <Icon name="warn" size={16} stroke={2.2} /> Mất{" "}
              {1000 - replay.score} điểm ở:{" "}
              {lost.map((i) => `${i.id} −${i.max - i.got}`).join(", ")}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
