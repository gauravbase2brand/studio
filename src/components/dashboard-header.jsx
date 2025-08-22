export function DashboardHeader({ title, children }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold font-headline text-foreground sm:text-3xl">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
