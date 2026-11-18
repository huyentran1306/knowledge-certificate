import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CERTS, CERT_BY_ID, getCert } from '../data';
import type { CertId } from '../data/types';
import { useStored } from '../lib/storage';
import { cardKey, isDue, schedule, AGAIN_INTERVAL, KNOWN_INTERVALS, type SrsState } from '../lib/srs';
import { DAY } from '../lib/date';
import { Icon } from '../components/Icon';

type Filter = CertId | 'all';

interface DeckCard {
  key: string;
  cert: CertId;
  q: string;
  a: string;
}

interface Mistake {
  cert: CertId;
  q: string;
  picked: string;
  correct: string;
  at: number;
}

const ALL_CARDS: DeckCard[] = CERTS.flatMap((c) => c.flashcards.map((f, i) => ({ key: cardKey(c.id, i), cert: c.id, q: f.q, a: f.a })));
const ALL_QUIZ = CERTS.flatMap((c) => c.quiz.map((q) => ({ ...q, cert: c.id })));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ReviewPage() {
  const [params, setParams] = useSearchParams();
  const filter: Filter = getCert(params.get('cert') ?? undefined)?.id ?? 'all';
  const [srs, setSrs] = useStored<SrsState>('srs', {});
  const [mistakes, setMistakes] = useStored<Mistake[]>('mistakes', []);
  const [practiceAll, setPracticeAll] = useState(false);
  const [sessionSeed, setSessionSeed] = useState(0);

  const setFilter = (f: Filter) => {
    setPracticeAll(false);
    setParams(f === 'all' ? {} : { cert: f }, { replace: true });
  };

  // Bộ thẻ của phiên: chốt lúc bắt đầu để thẻ vừa chấm không biến mất giữa chừng.
  const deck = useMemo(() => {
    const pool = ALL_CARDS.filter((c) => filter === 'all' || c.cert === filter);
    const now = Date.now();
    return shuffle(practiceAll ? pool : pool.filter((c) => isDue(srs[c.key], now)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, practiceAll, sessionSeed]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState({ known: 0, again: 0 });
  const deckId = `${filter}-${practiceAll}-${sessionSeed}`;
  const [lastDeck, setLastDeck] = useState(deckId);
  if (lastDeck !== deckId) {
    setLastDeck(deckId);
    setIdx(0);
    setFlipped(false);
    setTally({ known: 0, again: 0 });
  }

  const card = deck[idx];
  const done = idx >= deck.length;

  const mark = (known: boolean) => {
    if (!card) return;
    setSrs((s) => ({ ...s, [card.key]: schedule(s[card.key], known) }));
    setTally((t) => (known ? { ...t, known: t.known + 1 } : { ...t, again: t.again + 1 }));
    setFlipped(false);
    setIdx((i) => i + 1);
  };

  const counts = (id: Filter) => {
    const pool = ALL_CARDS.filter((c) => id === 'all' || c.cert === id);
    const now = Date.now();
    return { total: pool.length, due: pool.filter((c) => isDue(srs[c.key], now)).length };
  };

  const nextDue = useMemo(() => {
    const pool = ALL_CARDS.filter((c) => filter === 'all' || c.cert === filter);
    const times = pool.map((c) => srs[c.key]?.due).filter((t): t is number => !!t && t > Date.now());
    return times.length ? Math.ceil((Math.min(...times) - Date.now()) / DAY) : null;
  }, [filter, srs]);

  const cc = card ? CERT_BY_ID[card.cert] : null;
  const filters: Filter[] = ['all', ...CERTS.map((c) => c.id)];

  return (
    <>
      <section className="dots review-head">
        <div className="container stack-20">
          <div className="row-between wrap">
            <h1 className="h review-title rv">Ôn nhanh hôm nay</h1>
            <div className="row-8">
              <span className="score good">
                <Icon name="check" size={16} stroke={2.4} />
                {tally.known} nhớ
              </span>
              <span className="score again">
                <Icon name="refresh" size={16} stroke={2.4} />
                {tally.again} ôn lại
              </span>
            </div>
          </div>
          <div role="group" aria-label="Lọc theo chứng chỉ" className="row-8 wrap">
            {filters.map((f) => {
              const on = f === filter;
              const meta = f === 'all' ? { short: 'Tất cả', color: '#3047E0' } : { short: CERT_BY_ID[f].short, color: CERT_BY_ID[f].theme.color };
              const n = counts(f);
              return (
                <button key={f} type="button" className={`chip-filter${on ? ' on' : ''}`} aria-pressed={on} onClick={() => setFilter(f)}>
                  <span className="dot" style={{ background: meta.color }} />
                  {meta.short}
                  <span className="mono chip-count" title={`${n.due} thẻ đến hạn / ${n.total} thẻ`}>
                    {n.due}/{n.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container review-body">
        <section aria-label="Flashcard" className="review-main">
          <div className="progress-row">
            <span className="mono small">
              {Math.min(idx + 1, deck.length)} / {deck.length}
              {practiceAll ? ' · ôn tất cả' : ' · thẻ đến hạn'}
            </span>
            <div className="progress">
              <div style={{ width: `${deck.length ? (Math.min(idx, deck.length) / deck.length) * 100 : 100}%` }} />
            </div>
          </div>

          {!done && card && cc ? (
            <>
              <div className="deck">
                <div className="deck-shadow s2" aria-hidden="true" />
                <div className="deck-shadow s1" aria-hidden="true" />
                <button type="button" className="deck-card" onClick={() => setFlipped((f) => !f)} aria-label={flipped ? `Đáp án: ${card.a}` : `Câu hỏi: ${card.q}. Bấm để lật`}>
                  <div className={`card3d${flipped ? ' on' : ''}`} key={card.key}>
                    <div className="face3d front">
                      <div className="row-between">
                        <span className="cert-pill" style={{ background: cc.theme.tint, color: cc.theme.ink }}>
                          <span className="dot" style={{ background: cc.theme.color }} />
                          {cc.short}
                        </span>
                        <span className="mono muted-sm">CÂU HỎI</span>
                      </div>
                      <div className="h deck-q">{card.q}</div>
                      <div className="muted-sm row-6">
                        <Icon name="refresh" size={16} /> Bấm thẻ để xem đáp án
                      </div>
                    </div>
                    <div className="face3d back" style={{ background: cc.theme.color }}>
                      <div className="row-between">
                        <span className="cert-pill on-dark">{cc.short}</span>
                        <span className="mono small" style={{ opacity: 0.85 }}>
                          ĐÁP ÁN
                        </span>
                      </div>
                      <div className="deck-a">{card.a}</div>
                      <div className="small" style={{ opacity: 0.9 }}>
                        {card.q}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div className="deck-actions">
                <button type="button" className="btn btn-again grow" onClick={() => mark(false)}>
                  Chưa nhớ — ôn lại sau
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setFlipped((f) => !f)}>
                  Lật thẻ
                </button>
                <button type="button" className="btn btn-primary grow" onClick={() => mark(true)}>
                  Nhớ rồi
                </button>
              </div>
            </>
          ) : (
            <div className="done-card pop">
              {deck.length > 0 &&
                ['#3047E0', '#D97706', '#0E9384', '#7C3AED', '#2563EB', '#DB2777'].map((c, i) => (
                  <span key={c} className="confetti" aria-hidden="true" style={{ left: `${10 + i * 15}%`, background: c, animationDelay: `${(i * 0.23) % 0.9}s` }} />
                ))}
              <div className="h done-title">{deck.length > 0 ? 'Xong lượt ôn!' : 'Không còn thẻ đến hạn'}</div>
              <p className="muted">
                {deck.length > 0
                  ? `${tally.known} thẻ đã nhớ · ${tally.again} thẻ sẽ quay lại sớm hơn.`
                  : nextDue
                    ? `Thẻ tiếp theo đến hạn sau ${nextDue} ngày. Bạn vẫn có thể ôn lại toàn bộ.`
                    : 'Bạn vẫn có thể ôn lại toàn bộ bộ thẻ.'}
              </p>
              <div className="row-8 wrap" style={{ justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setPracticeAll(true);
                    setSessionSeed((s) => s + 1);
                  }}
                >
                  Ôn tất cả thẻ
                </button>
                <Link to={filter === 'all' ? '/' : `/cert/${filter}`} className="btn btn-ghost">
                  {filter === 'all' ? 'Về trang chủ' : 'Mở sổ tay'}
                </Link>
              </div>
            </div>
          )}
        </section>

        <aside className="review-side">
          <Quiz filter={filter} onWrong={(m) => setMistakes((list) => [m, ...list].slice(0, 30))} />
          <MistakeBook mistakes={mistakes.filter((m) => filter === 'all' || m.cert === filter)} onClear={() => setMistakes((l) => l.filter((m) => filter !== 'all' && m.cert !== filter))} />
          <div className="how">
            <div className="toc-label light">CÁCH HOẠT ĐỘNG</div>
            <p>
              Thẻ “chưa nhớ” quay lại sau {AGAIN_INTERVAL} ngày; “nhớ rồi” giãn dần {KNOWN_INTERVALS.join(' → ')} ngày. Câu quiz trả lời sai được ghi vào
              sổ lỗi sai. Mọi thứ lưu trên trình duyệt này.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Quiz({ filter, onWrong }: { filter: Filter; onWrong: (m: Mistake) => void }) {
  const pool = useMemo(() => shuffle(ALL_QUIZ.filter((q) => filter === 'all' || q.cert === filter)), [filter]);
  const [qi, setQi] = useState(0);
  const [pick, setPick] = useState(-1);
  const [lastFilter, setLastFilter] = useState(filter);
  if (lastFilter !== filter) {
    setLastFilter(filter);
    setQi(0);
    setPick(-1);
  }
  if (!pool.length) return null;

  const q = pool[qi % pool.length];
  const qc = CERT_BY_ID[q.cert];
  const answered = pick >= 0;
  const correct = pick === q.ans;

  const choose = (i: number) => {
    if (answered) return;
    setPick(i);
    if (i !== q.ans) onWrong({ cert: q.cert, q: q.q, picked: q.opts[i], correct: q.opts[q.ans], at: Date.now() });
  };

  return (
    <div className="card quiz">
      <div className="row-between">
        <span className="eyebrow">TÌNH HUỐNG</span>
        <span className="cert-pill" style={{ background: qc.theme.tint, color: qc.theme.ink }}>
          {qc.short}
        </span>
      </div>
      <h2 className="h quiz-q">{q.q}</h2>
      <div role="radiogroup" aria-label="Lựa chọn" className="stack-10">
        {q.opts.map((o, i) => {
          const state = answered && i === q.ans ? 'right' : answered && i === pick ? 'wrong' : '';
          return (
            <button key={o} type="button" role="radio" aria-checked={i === pick} className={`opt ${state}`} onClick={() => choose(i)} disabled={answered && !state}>
              <span className="opt-key mono">{'ABCD'[i]}</span>
              <span className="grow">{o}</span>
              {state === 'right' && <span className="opt-mark">Đúng</span>}
              {state === 'wrong' && <span className="opt-mark">Bạn chọn</span>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`verdict rv ${correct ? 'good' : 'bad'}`}>
          <b>{correct ? 'Chính xác.' : 'Chưa đúng.'}</b> {q.why}
        </div>
      )}
      <button
        type="button"
        className="btn btn-ghost self-end"
        onClick={() => {
          setQi((i) => i + 1);
          setPick(-1);
        }}
      >
        Câu tiếp <Icon name="arrow" size={16} stroke={2.2} />
      </button>
    </div>
  );
}

function MistakeBook({ mistakes, onClear }: { mistakes: Mistake[]; onClear: () => void }) {
  if (!mistakes.length) return null;
  return (
    <div className="card mistakes">
      <div className="row-between">
        <span className="eyebrow">SỔ LỖI SAI · {mistakes.length}</span>
        <button type="button" className="text-btn" onClick={onClear}>
          <Icon name="trash" size={14} /> Xoá
        </button>
      </div>
      <ul className="stack-10">
        {mistakes.slice(0, 5).map((m) => (
          <li key={`${m.at}-${m.q}`} className="mistake">
            <span className="dot" style={{ background: CERT_BY_ID[m.cert].theme.color }} />
            <div>
              <div className="small strong">{m.q}</div>
              <div className="muted-sm">
                Đã chọn: <s>{m.picked}</s> → Đúng: <b>{m.correct}</b>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
