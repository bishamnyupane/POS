export function Card({ children, className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>{children}</div>
  );
}

export function StatCard({ label, value, icon, trend }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          {trend && <p className="mt-1 text-xs text-brand-400">{trend}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
          {icon}
        </div>
      </div>
    </Card>
  );
}
