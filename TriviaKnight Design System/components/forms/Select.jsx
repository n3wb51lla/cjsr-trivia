import React from "react";
import { useFieldStyles, useFieldId, FieldError } from "./fieldStyles.js";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Labelled native select. Pass `options` as strings or {value,label} objects. */
export function Select({ label, hint, error, required = false, optional = false, options = [], placeholder, id, className = "", children, ...rest }) {
  useFieldStyles();
  const fid = useFieldId(id);
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  return (
    <div className={["tk-field", error ? "tk-field--invalid" : "", className].filter(Boolean).join(" ")}>
      {label && (
        <label className="tk-field__label" htmlFor={fid}>
          {label}
          {required && <span className="tk-field__req" aria-hidden="true">*</span>}
          {optional && <span className="tk-field__opt">(optional)</span>}
        </label>
      )}
      <div className="tk-select-wrap">
        <select
          id={fid}
          className="tk-select"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errId, hintId].filter(Boolean).join(" ") || undefined}
          defaultValue={placeholder ? "" : undefined}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o, i) => {
            const val = typeof o === "string" ? o : o.value;
            const lbl = typeof o === "string" ? o : o.label;
            return <option key={i} value={val}>{lbl}</option>;
          })}
          {children}
        </select>
        <Chevron />
      </div>
      {hint && !error && <p className="tk-field__hint" id={hintId}>{hint}</p>}
      {error && <p className="tk-field__error" id={errId}><FieldError />{error}</p>}
    </div>
  );
}
