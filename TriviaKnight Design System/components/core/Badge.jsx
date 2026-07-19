import React from "react";

const STYLE_ID = "tk-badge-styles";
const CSS = `
.tk-badge{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.1em;font-size:.6875rem;font-weight:600;line-height:1;display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:var(--radius-pill);border:1px solid transparent}
.tk-badge svg{width:.85rem;height:.85rem}
.tk-badge--gold{background:var(--gold-300);color:var(--navy-950)}
.tk-badge--navy{background:var(--navy-900);color:#fff}
.tk-badge--outline{background:transparent;border-color:var(--slate-300);color:var(--text-body)}
.tk-badge--outline.tk-on-dark{border-color:rgba(255,255,255,.28);color:var(--text-on-dark-muted)}
.tk-badge--success{background:var(--success-soft);color:var(--success)}
.tk-badge--soft{background:var(--gold-200);color:var(--gold-700)}
`;

function useBadgeStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Small uppercase status/label pill. Use for "Most Popular", "Premium", "Pro". */
export function Badge({ children, tone = "gold", onDark = false, icon, className = "", ...rest }) {
  useBadgeStyles();
  const cls = ["tk-badge", `tk-badge--${tone}`, onDark ? "tk-on-dark" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} {...rest}>
      {icon}
      {children}
    </span>
  );
}
