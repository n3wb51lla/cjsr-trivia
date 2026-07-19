import React from "react";

const STYLE_ID = "tk-billing-styles";
const CSS = `
.tk-billing{display:inline-flex;align-items:center;gap:.75rem;font-family:var(--font-body)}
.tk-billing__opt{font-size:.9rem;font-weight:600;color:var(--text-muted);transition:color var(--dur-base) var(--ease-out)}
.tk-billing__opt.is-active{color:var(--text-strong)}
.tk-billing.tk-on-dark .tk-billing__opt{color:var(--text-on-dark-muted)}
.tk-billing.tk-on-dark .tk-billing__opt.is-active{color:var(--text-on-dark)}
.tk-billing__track{position:relative;width:52px;height:28px;border-radius:var(--radius-pill);border:1.5px solid var(--slate-300);background:var(--surface-card);cursor:pointer;padding:0;flex:none;min-height:0;transition:border-color var(--dur-base) var(--ease-out)}
.tk-billing.tk-on-dark .tk-billing__track{background:var(--navy-800);border-color:var(--surface-line-dark)}
.tk-billing__track:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-billing__knob{position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:var(--gold-500);transition:transform var(--dur-base) var(--ease-out)}
.tk-billing__track[aria-checked=true] .tk-billing__knob{transform:translateX(24px)}
.tk-billing__save{font-family:var(--font-mono);font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--success);background:var(--success-soft);padding:.25rem .5rem;border-radius:var(--radius-pill)}
`;

function useBillingStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Monthly / annual billing switch. Controlled: pass `value` ("monthly"|"annual")
 * and `onChange`. Uncontrolled fallback keeps internal state.
 */
export function BillingToggle({ value, onChange, saveLabel = "2 months free", onDark = false, className = "", ...rest }) {
  useBillingStyles();
  const [internal, setInternal] = React.useState(value || "monthly");
  const current = value != null ? value : internal;
  const annual = current === "annual";
  const toggle = () => {
    const next = annual ? "monthly" : "annual";
    if (value == null) setInternal(next);
    onChange && onChange(next);
  };
  return (
    <div className={["tk-billing", onDark ? "tk-on-dark" : "", className].filter(Boolean).join(" ")} {...rest}>
      <span className={["tk-billing__opt", !annual ? "is-active" : ""].join(" ")}>Monthly</span>
      <button
        type="button"
        role="switch"
        aria-checked={annual}
        aria-label="Toggle annual billing"
        className="tk-billing__track"
        onClick={toggle}
      >
        <span className="tk-billing__knob" />
      </button>
      <span className={["tk-billing__opt", annual ? "is-active" : ""].join(" ")}>Annual</span>
      {saveLabel && <span className="tk-billing__save">{saveLabel}</span>}
    </div>
  );
}
