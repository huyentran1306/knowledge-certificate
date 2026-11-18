import { Link } from 'react-router-dom';
import type { Cert } from '../data/types';
import { agoText, daysLeft, fmt, validity } from '../lib/date';
import { Emblem } from './Emblem';
import { Icon } from './Icon';
import { Ring } from './Ring';

const levelLabel = (c: Cert) => (c.level === 'GitHub' ? 'GITHUB' : c.level.toUpperCase());

export function themeVars(c: Cert): React.CSSProperties {
  return { '--c': c.theme.color, '--tint': c.theme.tint, '--ink-c': c.theme.ink } as React.CSSProperties;
}

export function CertCard({ cert }: { cert: Cert }) {
  const days = daysLeft(cert.expires);
  return (
    <Link to={`/cert/${cert.id}`} className="cert-card lift" style={themeVars(cert)}>
      <div className="cert-card-top">
        <Emblem cert={cert} size={58} />
        <Ring size={68} stroke={5} value={days / validity(cert.earned, cert.expires)} color={cert.theme.color} label={`Còn ${days} ngày hiệu lực`}>
          <span className="ring-num h">{days}</span>
          <span className="ring-unit">ngày</span>
        </Ring>
      </div>
      <div className="stack-8">
        <span className="chip-level">{levelLabel(cert)}</span>
        <h3 className="h cert-card-title">{cert.title}</h3>
      </div>
      <div className="tag-row">
        {cert.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <div className="cert-card-foot">
        <span>Đạt {fmt(cert.earned)}</span>
        <span className="open-link">
          Mở sổ tay <Icon name="arrow" size={14} stroke={2.4} className="arrow" />
        </span>
      </div>
    </Link>
  );
}

export function FeaturedCertCard({ cert }: { cert: Cert }) {
  const days = daysLeft(cert.expires);
  return (
    <div className="glow span-2" style={themeVars(cert)}>
      <div className="glow-inner featured">
        <div className="featured-main">
          <div className="tag-row">
            <span className="chip-level">{levelLabel(cert)}</span>
            <span className="chip-dark">Mới nhất · {agoText(cert.earned)}</span>
          </div>
          <h3 className="h featured-title">{cert.title}</h3>
          <p className="muted lead-sm">{cert.tagline}</p>
          <div className="tag-row">
            {cert.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="featured-foot">
            <div className="muted">
              Đạt <b>{fmt(cert.earned)}</b> · Hết hạn <b>{fmt(cert.expires)}</b>
            </div>
            <div className="row-8">
              <Link to={`/cert/${cert.id}/map`} className="btn btn-ghost">
                <Icon name="map" size={16} /> Bản đồ
              </Link>
              <Link to={`/cert/${cert.id}`} className="btn btn-theme">
                Mở sổ tay <Icon name="arrow" size={16} stroke={2.4} className="arrow" />
              </Link>
            </div>
          </div>
        </div>
        <div className="featured-visual" aria-hidden="true">
          <div className="orbit spin-slow" />
          <Ring size={220} stroke={10} value={days / validity(cert.earned, cert.expires)} color={cert.theme.color} track={cert.theme.tint} label={`Còn ${days} ngày hiệu lực`} />
          <div className="featured-badge float-a">
            <Emblem cert={cert} size={92} />
            <div className="h featured-days">
              {days} <span>ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
