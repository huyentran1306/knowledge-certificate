import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Emblem';
import { Icon } from './Icon';
import { scrollToId } from '../lib/text';

export function Header({ onSearch }: { onSearch: () => void }) {
  const loc = useLocation();
  const nav = useNavigate();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  const goSection = (id: string) => {
    if (loc.pathname === '/') scrollToId(id);
    else nav('/', { state: { scrollTo: id } });
  };

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" aria-label="Cert Atlas — trang chủ">
          <Logo />
          <span className="h">Cert Atlas</span>
        </Link>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Tổng quan
          </NavLink>
          <button type="button" className="nav-link" onClick={() => goSection('certs')}>
            Chứng chỉ
          </button>
          <button type="button" className="nav-link" onClick={() => goSection('atlas')}>
            Bản đồ tổng
          </button>
          <NavLink to="/review" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Ôn tập
          </NavLink>
        </nav>
        <button type="button" className="search-btn" onClick={onSearch} aria-label="Tìm kiếm">
          <Icon name="search" size={18} />
          <span className="search-text">Tìm khái niệm, ghi chú…</span>
          <kbd className="mono">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <span>Cert Atlas · sổ tay kiến thức cá nhân</span>
        <span>Ghi chú và lịch ôn được lưu trên trình duyệt này.</span>
      </div>
    </footer>
  );
}
