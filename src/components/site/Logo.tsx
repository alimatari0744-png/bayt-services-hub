export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-soft">
        <span className="absolute inset-1.5 rounded-lg border-2 border-gold/80 rotate-45" />
        <span className="relative font-display text-lg font-bold text-primary-foreground">ش</span>
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-base font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>مركز الخدمات الشاملة</span>
        <span className={`block text-[11px] ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>كل خدماتك في مكان واحد</span>
      </span>
    </span>
  );
}
