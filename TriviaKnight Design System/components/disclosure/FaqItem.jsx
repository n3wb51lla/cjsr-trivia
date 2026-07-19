import React from "react";

const STYLE_ID = "tk-faq-styles";
const CSS = `
.tk-faq{border-bottom:1px solid var(--surface-line)}
.tk-faq__btn{width:100%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:1rem;text-align:left;padding:1.15rem 0;font-family:var(--font-display);font-weight:700;font-size:1.0625rem;color:var(--text-strong);letter-spacing:-.01em}
.tk-faq__btn:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-faq__icon{flex:none;width:1.5rem;height:1.5rem;border-radius:var(--radius-pill);border:1.5px solid var(--slate-300);display:inline-flex;align-items:center;justify-content:center;color:var(--accent-strong);transition:transform var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out)}
.tk-faq__icon svg{width:.9rem;height:.9rem}
.tk-faq[data-open=true] .tk-faq__icon{transform:rotate(45deg);background:var(--gold-200);border-color:var(--gold-400)}
.tk-faq__panel{overflow:hidden;transition:height var(--dur-base) var(--ease-out)}
.tk-faq__inner{padding:0 0 1.15rem;font-family:var(--font-body);font-size:.95rem;line-height:1.6;color:var(--text-body);max-width:60ch}
`;

function useFaqStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

let _fc = 0;
/** Single accessible FAQ accordion row. Controlled or self-managed. */
export function FaqItem({ question, children, defaultOpen = false, open, onToggle, className = "", ...rest }) {
  useFaqStyles();
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = open != null ? open : internal;
  const [id] = React.useState(() => `tk-faq-${++_fc}`);
  const panelRef = React.useRef(null);
  const [h, setH] = React.useState(isOpen ? "auto" : 0);
  React.useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    setH(isOpen ? node.scrollHeight : 0);
  }, [isOpen, children]);
  const toggle = () => {
    if (open == null) setInternal((v) => !v);
    onToggle && onToggle(!isOpen);
  };
  return (
    <div className={["tk-faq", className].filter(Boolean).join(" ")} data-open={isOpen} {...rest}>
      <button type="button" className="tk-faq__btn" aria-expanded={isOpen} aria-controls={`${id}-p`} id={`${id}-b`} onClick={toggle}>
        <span>{question}</span>
        <span className="tk-faq__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className="tk-faq__panel"
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        style={{ height: h === "auto" ? "auto" : `${h}px` }}
        hidden={!isOpen && h === 0}
      >
        <div className="tk-faq__inner" ref={panelRef}>{children}</div>
      </div>
    </div>
  );
}
