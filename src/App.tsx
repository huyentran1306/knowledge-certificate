import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { HomePage } from './pages/HomePage';
import { CertPage } from './pages/CertPage';
import { MindmapPage } from './pages/MindmapPage';
import { ReviewPage } from './pages/ReviewPage';
import { NotFound } from './pages/NotFound';
import { scrollToId } from './lib/text';

/** Đổi trang → lên đầu trang, hoặc cuộn tới mục được yêu cầu qua state.scrollTo. */
function ScrollManager() {
  const { pathname, state, key } = useLocation();
  useEffect(() => {
    const target = (state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      const t = window.setTimeout(() => scrollToId(target), 80);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, key, state]);
  return null;
}

export function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Bỏ qua tới nội dung
      </a>
      <ScrollManager />
      <Header onSearch={() => setPaletteOpen(true)} />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cert/:id" element={<CertPage />} />
          <Route path="/cert/:id/map" element={<MindmapPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
