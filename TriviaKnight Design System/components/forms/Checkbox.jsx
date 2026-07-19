import React from "react";
import { useFieldId } from "./fieldStyles.js";

const STYLE_ID = "tk-checkbox-styles";
const CSS = `
.tk-check{display:flex;gap:.6rem;align-items:flex-start;font-family:var(--font-body);cursor:pointer}
.tk-check input{position:absolute;opacity:0;width:1px;height:1px;margin:0}
.tk-check__box{flex:none;width:1.2rem;height:1.2rem;min-height:0;border:1.5px solid var(--slate-400);border-radius:var(--radius-xs);background:var(--surface-card);display:inline-flex;align-items:center;justify-content:center;margin-top:.1rem;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out)}
.tk-check__box svg{width:.85rem;height:.85rem;color:var(--navy-950);opacity:0;transform:scale(.6);transition:opacity var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)}
.tk-check input:checked+.tk-check__box{background:var(--gold-500);border-color:var(--gold-600)}
.tk-check input:checked+.tk-check__box svg{opacity:1;transform:scale(1)}
.tk-check input:focus-visible+.tk-check__box{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-check__label{font-size:.9rem;line-height:1.45;color:var(--text-body)}
.tk-check--invalid .tk-check__box{border-color:var(--danger)}
.tk-check__req{color:var(--danger);margin-left:.15rem}
`;

function useCheckboxStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Custom checkbox with a real underlying input. Use for the consent field. */
export function Checkbox({ label, children, required = false, error, id, className = "", ...rest }) {
  useCheckboxStyles();
  const fid = useFieldId(id);
  return (
    <label className={["tk-check", error ? "tk-check--invalid" : "", className].filter(Boolean).join(" ")} htmlFor={fid}>
      <input type="checkbox" id={fid} required={required} aria-invalid={error ? true : undefined} {...rest} />
      <span className="tk-check__box" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="tk-check__label">
        {label || children}
        {required && <span className="tk-check__req" aria-hidden="true">*</span>}
      </span>
    </label>
  );
}
