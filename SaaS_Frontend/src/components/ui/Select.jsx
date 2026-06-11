import { useEffect, useRef, useState } from "react";

export function Select({ value, onChange, options = [], className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function handleSelect(val) {
    onChange(val);
    setOpen(false);
  }

  const label = options.find((o) => o.value === value)?.label || "";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 text-left outline-none focus:border-brand-500/50"
      >
        <span className="truncate">{label}</span>
      </button>

      {open && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-56 overflow-auto rounded-xl border border-white/10 bg-surface-800 p-2 shadow-lg">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-white/5 ${
                  opt.value === value
                    ? "bg-white/5 text-brand-400 font-semibold"
                    : "text-slate-100"
                } rounded-md`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
