import React from "react";
import { Badge } from "../core/Badge.jsx";
import { Button } from "../buttons/Button.jsx";

const STYLE_ID = "tk-pricing-styles";
const CSS = `
.tk-price{position:relative;background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-xl);box-shadow:var(--shadow-sm);padding:1.75rem;display:flex;flex-direction:column;gap:1.1rem}
.tk-price--featured{border:2px solid var(--gold-500);box-shadow:var(--shadow-gold)}
.tk-price__ribbon{position:absolute;top:-.75rem;left:1.75rem}
.tk-price__name{font-family:var(--font-display);font-weight:800;font-size:1.375rem;color:var(--text-strong);margin:0;letter-spacing:-.01em}
.tk-price__desc{font-family:var(--font-body);font-size:.9rem;line-height:1.5;color:var(--text-muted);margin:0}
.tk-price__amount{display:flex;align-items:baseline;gap:.35rem}
.tk-price__num{font-family:var(--font-display);font-weight:800;font-size:2.5rem;color:var(--text-strong);letter-spacing:-.02em;line-height:1}
.tk-price__per{font-family:var(--font-body);font-size:.9rem;color:var(--text-muted)}
.tk-price__sub{font-family:var(--font-mono);font-size:.75rem;color:var(--text-muted);margin:-.5rem 0 0}
.tk-price__list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.55rem;flex:1}
.tk-price__list li{display:flex;gap:.55rem;font-family:var(--font-body);font-size:.9rem;line-height:1.4;color:var(--text-body)}
.tk-price__list li svg{width:1.05rem;height:1.05rem;flex:none;margin-top:.1rem;color:var(--success)}
.tk-price__list li.is-first{font-weight:600;color:var(--text-strong)}
`;

function usePricingStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Pricing plan card. `price`, `period`, and `sublabel` are presentational —
 * the parent decides monthly vs annual and passes the current strings.
 */
export function PricingCard({
  name,
  price,
  period = "/mo",
  sublabel,
  description,
  features = [],
  ctaLabel = "Choose plan",
  ctaHref,
  featured = false,
  badgeLabel = "Most Popular",
  className = "",
  ...rest
}) {
  usePricingStyles();
  const cls = ["tk-price", featured ? "tk-price--featured" : "", className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {featured && (
        <span className="tk-price__ribbon">
          <Badge tone="gold">{badgeLabel}</Badge>
        </span>
      )}
      <div>
        <h3 className="tk-price__name">{name}</h3>
        {description && <p className="tk-price__desc">{description}</p>}
      </div>
      <div>
        <div className="tk-price__amount">
          <span className="tk-price__num">{price}</span>
          <span className="tk-price__per">{period}</span>
        </div>
        {sublabel && <p className="tk-price__sub">{sublabel}</p>}
      </div>
      <Button variant={featured ? "primary" : "secondary"} block href={ctaHref}>
        {ctaLabel}
      </Button>
      <ul className="tk-price__list">
        {features.map((f, i) => (
          <li key={i} className={i === 0 ? "is-first" : ""}>
            <Check />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
