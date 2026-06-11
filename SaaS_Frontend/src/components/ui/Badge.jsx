export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-white/10 text-slate-300',
    success: 'bg-brand-500/20 text-brand-300',
    warning: 'bg-amber-500/20 text-amber-300',
    danger: 'bg-red-500/20 text-red-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
