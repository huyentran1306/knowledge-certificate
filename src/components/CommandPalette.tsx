import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search, KIND_LABEL, type SearchItem } from '../lib/search';
import { CERT_BY_ID } from '../data';
import { Icon } from './Icon';

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const nav = useNavigate();
  const results = useMemo(() => search(q), [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const go = (it: SearchItem) => {
    onClose();
    nav(it.to, { state: it.scrollTo ? { scrollTo: it.scrollTo } : undefined });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Tìm kiếm" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <Icon name="search" size={20} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Tìm khái niệm, nhánh bản đồ, flashcard… (gõ không dấu cũng được)"
            aria-label="Từ khoá"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `pi-${active}` : undefined}
          />
          <kbd className="mono">Esc</kbd>
        </div>
        <ul className="palette-list" id="palette-list" role="listbox" ref={list}>
          {results.length === 0 && <li className="palette-empty">Không tìm thấy “{q}”.</li>}
          {results.map((it, i) => (
            <li
              key={`${it.kind}-${it.cert}-${it.title}-${i}`}
              id={`pi-${i}`}
              data-i={i}
              role="option"
              aria-selected={i === active}
              className={`palette-item${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(it)}
            >
              <span className="palette-dot" style={{ background: it.color }} />
              <span className="palette-main">
                <span className="palette-title">{it.title}</span>
                <span className="palette-detail">{it.detail}</span>
              </span>
              <span className="palette-meta">
                <span>{KIND_LABEL[it.kind]}</span>
                <span>{CERT_BY_ID[it.cert].short}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="palette-foot">
          <span><kbd className="mono">↑</kbd><kbd className="mono">↓</kbd> chọn</span>
          <span><kbd className="mono">Enter</kbd> mở</span>
        </div>
      </div>
    </div>
  );
}
