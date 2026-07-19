import React from "react";

const STYLE_ID = "tk-usecase-styles";
const CSS = `
.tk-uc{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;display:flex;flex-direction:column;gap:.6rem;text-decoration:none;color:inherit;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)}
a.tk-uc:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-300)}
.tk-uc__icon{width:2.5rem;height:2.5rem;border-radius:var(--radius-md);background:var(--gold-200);color:var(--gold-700);display:inline-flex;align-items:center;justify-content:center}
.tk-uc__icon svg{width:1.35rem;height:1.35rem}
.tk-uc__title{font-family:var(--font-display);font-weight:700;font-size:1.125rem;color:var(--text-strong);margin:0;letter-spacing:-.01em}
.tk-uc__body{font-family:var(--font-body);font-size:.95rem;line-height:1.55;color:var(--text-body);margin:0;flex:1}
.tk-uc__link{font-family:var(--font-body);font-weight:600;font-size:.9rem;display:inline-flex;align-items:center;gap:.35rem;margin-top:.25rem}
.tk-uc__link--live{color:var(--link)}
a.tk-uc:hover .tk-uc__link--live{color:var(--link-hover)}
.tk-uc__link--soon{color:var(--text-muted)}
.tk-uc__link svg{width:1rem;height:1rem}
`;

function useUseCaseStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Audience/use-case card. Links to a guide route when `href` is set; otherwise
 * renders a non-interactive "Guides coming soon" note (no broken links).
 */
export function UseCaseCard({ icon, title, children, href, linkLabel = "Explore guide", className = "", ...rest }) {
  useUseCaseStyles();
  const cls = ["tk-uc", className].filter(Boolean).join(" ");
  const body = (
    <>
      {icon && <span className="tk-uc__icon">{icon}</span>}
      <h3 className="tk-uc__title">{title}</h3>
      <p className="tk-uc__body">{children}</p>
      {href ? (
        <span className="tk-uc__link tk-uc__link--live">
          {linkLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      ) : (
        <span className="tk-uc__link tk-uc__link--soon">Guides coming soon</span>
      )}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <div className={cls} {...rest}>
      {body}
    </div>
  );
}
