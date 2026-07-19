import React from "react";

const STYLE_ID = "tk-field-styles";
const CSS = `
.tk-field{display:flex;flex-direction:column;gap:.4rem;font-family:var(--font-body)}
.tk-field__label{font-size:.875rem;font-weight:600;color:var(--text-strong)}
.tk-field__req{color:var(--danger);margin-left:.15rem}
.tk-field__opt{font-weight:400;color:var(--text-muted);margin-left:.35rem}
.tk-field__hint{font-size:.8125rem;color:var(--text-muted);margin:0}
.tk-field__error{font-size:.8125rem;color:var(--danger);margin:0;display:flex;align-items:center;gap:.3rem}
.tk-input,.tk-textarea,.tk-select{font-family:var(--font-body);font-size:.95rem;color:var(--text-strong);background:var(--surface-card);border:1.5px solid var(--slate-300);border-radius:var(--radius-md);padding:.65rem .8rem;width:100%;box-sizing:border-box;transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)}
.tk-input::placeholder,.tk-textarea::placeholder{color:var(--text-faint)}
.tk-input:hover,.tk-textarea:hover,.tk-select:hover{border-color:var(--slate-400)}
.tk-input:focus,.tk-textarea:focus,.tk-select:focus{outline:none;border-color:var(--gold-500);box-shadow:0 0 0 3px rgba(227,168,56,.28)}
.tk-textarea{min-height:7rem;resize:vertical;line-height:1.5}
.tk-field--invalid .tk-input,.tk-field--invalid .tk-textarea,.tk-field--invalid .tk-select{border-color:var(--danger)}
.tk-field--invalid .tk-input:focus,.tk-field--invalid .tk-textarea:focus,.tk-field--invalid .tk-select:focus{box-shadow:0 0 0 3px rgba(179,63,50,.22)}
.tk-select-wrap{position:relative}
.tk-select-wrap svg{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);width:1.1rem;height:1.1rem;color:var(--text-muted);pointer-events:none}
.tk-select{appearance:none;padding-right:2.2rem}
`;

export function useFieldStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

let _idc = 0;
export function useFieldId(explicit) {
  const [id] = React.useState(() => explicit || `tk-f-${++_idc}`);
  return explicit || id;
}

export function FieldError() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
