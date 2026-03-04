import { Search } from "lucide-react";

export function SearchInput({ placeholder = "Buscar..." }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
      <input
        type="text"
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-52"
      />
    </div>
  );
}

export default function Navbar({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-fg text-sm mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
