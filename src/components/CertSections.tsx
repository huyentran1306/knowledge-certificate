import { useEffect, useRef, useState } from 'react';
import type { Cert, CodeLang } from '../data/types';
import { useStored } from '../lib/storage';
import { Icon } from './Icon';

/* ───────────── Demo tương tác ───────────── */

export function DemoStepper({ cert }: { cert: Cert }) {
  const steps = cert.demo.steps;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1800);
    return () => window.clearInterval(timer.current);
  }, [playing, steps.length]);

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [cert.id]);

  const toggle = () => {
    if (!playing && step >= steps.length - 1) setStep(0);
    setPlaying((p) => !p);
  };
  const go = (i: number) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(steps.length - 1, i)));
  };
  const cur = steps[step];

  return (
    <div className="stack-20">
      <div className="section-head tight">
        <div>
          <div className="eyebrow theme">DEMO TƯƠNG TÁC</div>
          <h2 className="h sec-h">{cert.demo.title}</h2>
        </div>
        <div className="row-8">
          <button type="button" className="icon-btn" onClick={() => go(step - 1)} aria-label="Bước trước">
            <Icon name="chevLeft" size={18} stroke={2.2} />
          </button>
          <button type="button" className="btn btn-dark" onClick={toggle}>
            <Icon name={playing ? 'pause' : 'play'} size={16} fill />
            {playing ? 'Tạm dừng' : 'Chạy demo'}
          </button>
          <button type="button" className="icon-btn" onClick={() => go(step + 1)} aria-label="Bước sau">
            <Icon name="chevRight" size={18} stroke={2.2} />
          </button>
        </div>
      </div>

      <div className="card demo">
        <div className="pipe">
          {steps.map((s, i) => {
            const state = i === step ? 'on' : i < step ? 'done' : '';
            return (
              <div key={s.label} className="pipe-seg">
                {i > 0 && (
                  <div className="conn" aria-hidden="true">
                    <div className="conn-fill" style={{ width: i <= step ? '100%' : '0%' }} />
                  </div>
                )}
                <button type="button" className={`node ${state}`} onClick={() => go(i)} aria-pressed={i === step}>
                  <span className="node-icon">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <span className="node-label">{s.label}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="demo-grid">
          <div className="demo-explain" key={step}>
            <div className="mono theme-ink small">
              BƯỚC {step + 1} / {steps.length}
            </div>
            <h3 className="h demo-title">{cur.title}</h3>
            <p className="demo-body">{cur.body}</p>
            <div className="demo-tip">
              <Icon name="bulb" size={18} className="theme-ink" />
              <span>{cur.tip}</span>
            </div>
          </div>
          <div className="terminal" aria-live="polite">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span className="mono">{cert.demo.trace}</span>
            </div>
            {steps.slice(0, step + 1).map((s, i) => (
              <div key={i} className="logline mono">
                <span className="log-t">00:0{i * 2 + 1}</span>
                <span style={{ color: s.log[1] }}>{s.log[0]}</span>
                <span>{s.log[2]}</span>
              </div>
            ))}
            <span className="caret" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Nhóm kiến thức (accordion) ───────────── */

export function Domains({ cert }: { cert: Cert }) {
  const [open, setOpen] = useState(0);
  useEffect(() => setOpen(0), [cert.id]);
  return (
    <div className="stack-12">
      {cert.domains.map((d, i) => {
        const isOpen = open === i;
        return (
          <div key={d.title} className={`acc${isOpen ? ' open' : ''}`}>
            <button type="button" className="acc-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              <span className="acc-num h">0{i + 1}</span>
              <span className="acc-text">
                <span className="h acc-title">{d.title}</span>
                <span className="acc-sub">{d.sub}</span>
              </span>
              <Icon name="chevDown" size={20} stroke={2.2} className="chev" />
            </button>
            <div className="acc-body-wrap">
              <div className="acc-body">
                <ul className="check-list">
                  {d.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={18} stroke={2.4} className="theme-c" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="remember">
                  <b>Ghi nhớ:</b> {d.remember}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────── Thẻ khái niệm lật ───────────── */

export function ConceptCards({ cert }: { cert: Cert }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  useEffect(() => setFlipped({}), [cert.id]);
  return (
    <div className="grid-3">
      {cert.concepts.map((k, i) => (
        <button
          key={k.term}
          type="button"
          className="flip-wrap"
          onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
          aria-pressed={!!flipped[i]}
          aria-label={`${k.term}: ${flipped[i] ? k.def : 'lật xem định nghĩa'}`}
        >
          <div className={`flip${flipped[i] ? ' on' : ''}`}>
            <div className="face front">
              <span className="mono theme-ink small">{k.tag}</span>
              <span className="h face-term">{k.term}</span>
              <span className="muted-sm row-6">
                <Icon name="refresh" size={14} /> Lật xem định nghĩa
              </span>
            </div>
            <div className="face back">
              <span className="h face-term-sm">{k.term}</span>
              <span className="face-def">{k.def}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ───────────── Code mẫu ───────────── */

type Tok = { t: string; c?: string };

const RULES: Record<CodeLang, [RegExp, string][]> = {
  python: [
    [/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y, 'str'],
    [/#.*/y, 'cmt'],
    [/\b(?:from|import|def|return|with|as|for|in|if|else|class|None|True|False|print|open)\b/y, 'kw'],
    [/\b\d+(?:\.\d+)?\b/y, 'num'],
  ],
  sql: [
    [/N?'(?:[^']|'')*'/y, 'str'],
    [/--.*/y, 'cmt'],
    [/\b(?:CREATE|TABLE|EXTERNAL|MODEL|WITH|SELECT|TOP|FROM|WHERE|ORDER|BY|AS|UPDATE|SET|DECLARE|INT|IDENTITY|PRIMARY|KEY|NVARCHAR|DECIMAL|VECTOR|USE|MAX)\b/y, 'kw'],
    [/\b(?:VECTOR_DISTANCE|AI_GENERATE_EMBEDDINGS)\b/y, 'fn'],
    [/@\w+/y, 'var'],
    [/\b\d+\b/y, 'num'],
  ],
  yaml: [
    [/#.*/y, 'cmt'],
    [/^\s*-?\s*[\w-]+(?=:)/y, 'kw'],
  ],
  markdown: [
    [/^#.*/y, 'kw'],
    [/`[^`]*`/y, 'str'],
  ],
  text: [
    [/\s#\s.*/y, 'cmt'],
    [/[@/#][\w:./-]+/y, 'kw'],
  ],
};

function highlight(line: string, lang: CodeLang): Tok[] {
  const rules = RULES[lang];
  const out: Tok[] = [];
  let buf = '';
  let i = 0;
  while (i < line.length) {
    let matched = false;
    for (const [re, c] of rules) {
      re.lastIndex = i;
      // Quy tắc neo đầu dòng (^) chỉ áp dụng ở vị trí 0.
      if (re.source.startsWith('^') && i !== 0) continue;
      const m = re.exec(line);
      if (m && m.index === i && m[0].length > 0) {
        if (buf) out.push({ t: buf }), (buf = '');
        out.push({ t: m[0], c });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) buf += line[i++];
  }
  if (buf) out.push({ t: buf });
  return out;
}

export function CodeTabs({ cert }: { cert: Cert }) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => setTab(0), [cert.id]);
  const sample = cert.code.samples[tab] ?? cert.code.samples[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sample.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* trình duyệt chặn clipboard */
    }
  };

  return (
    <div className="code-box">
      <div className="code-bar">
        <div role="tablist" aria-label="Đoạn code" className="row-4 wrap">
          {cert.code.samples.map((s, i) => (
            <button key={s.label} type="button" role="tab" aria-selected={i === tab} className={`code-tab${i === tab ? ' on' : ''}`} onClick={() => setTab(i)}>
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="code-copy" onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={15} />
          {copied ? 'Đã chép' : 'Chép code'}
        </button>
      </div>
      <pre className="code-pre" key={`${cert.id}-${tab}`}>
        {sample.code.split('\n').map((line, i) => (
          <div key={i} className="code-line">
            <span className="ln">{i + 1}</span>
            <code>
              {line === '' ? ' ' : highlight(line, sample.lang).map((t, j) => (t.c ? <span key={j} className={`tk-${t.c}`}>{t.t}</span> : t.t))}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}

/* ───────────── Ghi chú cá nhân ───────────── */

export function Notes({ cert }: { cert: Cert }) {
  const [note, setNote] = useStored<string>(`notes:${cert.id}`, '');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const t = useRef<number | undefined>(undefined);

  const onChange = (v: string) => {
    setNote(v);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setSavedAt(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })), 400);
  };

  return (
    <div className="card note-card">
      <Icon name="quote" size={32} fill className="quote-ico" />
      <label htmlFor={`note-${cert.id}`} className="sr-only">
        Điều mình rút ra
      </label>
      <textarea
        id={`note-${cert.id}`}
        className="h note-area"
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Viết 2–3 câu: điều bạn thấy giá trị nhất sau kỳ thi này, và lần tới bạn sẽ áp dụng nó vào dự án nào."
        rows={5}
      />
      <div className="muted-sm row-6">
        <Icon name="edit" size={14} />
        {savedAt ? `Đã lưu lúc ${savedAt} trên trình duyệt này` : 'Tự lưu trên trình duyệt này khi bạn gõ'}
      </div>
    </div>
  );
}
