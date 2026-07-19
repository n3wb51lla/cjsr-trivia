import React from "react";
import { Badge } from "../core/Badge.jsx";

const STYLE_ID = "tk-featurecard-styles";
const CSS = `
.tk-feat{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)}
.tk-feat:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-300)}
.tk-feat__icon{width:2.75rem;height:2.75rem;border-radius:var(--radius-md);background:var(--navy-900);color:var(--gold-400);display:inline-flex;align-items:center;justify-content:center}
.tk-feat__icon svg{width:1.4rem;height:1.4rem}
.tk-feat__head{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.tk-feat__title{font-family:var(--font-display);font-weight:700;font-size:1.125rem;color:var(--text-strong);margin:0;letter-spacing:-.01em}
.tk-feat__body{font-family:var(--font-body);font-size:.95rem;line-height:1.55;color:var(--text-body);margin:0}
`;

function useFeatureStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Icon + title + description feature card, with an optional premium/tier badge. */
export function FeatureCard({ icon, title, children, premium = false, badgeLabel = "Premium", className = "", ...rest }) {
  useFeatureStyles();
  return (
    <div className={["tk-feat", className].filter(Boolean).join(" ")} {...rest}>
      <span className="tk-feat__icon">{icon}</span>
      <div className="tk-feat__head">
        <h3 className="tk-feat__title">{title}</h3>
        {premium && <Badge tone="soft">{badgeLabel}</Badge>}
      </div>
      <p className="tk-feat__body">{children}</p>
    </div>
  );
}
