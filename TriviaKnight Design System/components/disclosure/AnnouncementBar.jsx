import React from "react";

const STYLE_ID = "tk-announce-styles";
const CSS = `
.tk-announce{background:var(--navy-950);color:var(--text-on-dark);font-family:var(--font-body);border-bottom:1px solid var(--surface-line-dark)}
.tk-announce__row{max-width:var(--container-max);margin:0 auto;padding:.6rem var(--gutter);display:flex;align-items:center;justify-content:center;gap:.75rem;position:relative}
.tk-announce__mark{color:var(--gold-400);display:inline-flex;flex:none}
.tk-announce__mark svg{width:1.05rem;height:1.05rem}
.tk-announce__text{font-size:.875rem;line-height:1.35;text-align:center}
.tk-announce__text b{color:var(--gold-300);font-weight:600}
.tk-announce__close{position:absolute;right:var(--gutter);top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-on-dark-muted);cursor:pointer;width:32px;height:32px;min-height:0;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-sm)}
.tk-announce__close:hover{color:var(--text-on-dark);background:rgba(255,255,255,.06)}
.tk-announce__close:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:2px}
.tk-announce__close svg{width:1rem;height:1rem}
`;

function useAnnounceStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Dismissible top-of-page announcement bar. Not a limited-time promo style. */
export function AnnouncementBar({ children, dismissible = true, onDismiss, className = "", ...rest }) {
  useAnnounceStyles();
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
    <div className={["tk-announce", className].filter(Boolean).join(" ")} role="region" aria-label="Announcement" {...rest}>
      <div className="tk-announce__row">
        <span className="tk-announce__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z" />
          </svg>
        </span>
        <p className="tk-announce__text">{children}</p>
        {dismissible && (
          <button
            type="button"
            className="tk-announce__close"
            aria-label="Dismiss announcement"
            onClick={() => {
              setOpen(false);
              onDismiss && onDismiss();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
