"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  ClipboardList,
  FileText,
  ChevronDown,
  Settings,
} from "lucide-react";

const navGroups = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", section: "dashboard", icon: LayoutDashboard },
      { label: "Empresas",  section: "empresas",  icon: Building2 },
    ],
  },
  {
    label: "Gestión",
    items: [
      { label: "Usuarios",  section: "usuarios",  icon: Users },
      { label: "Empleados", section: "empleados", icon: UserCheck },
    ],
  },
  {
    label: "Evaluación",
    items: [
      { label: "Evaluación ROSA", section: "evaluaciones-rosa", icon: ClipboardList },
      { label: "Reportes",        section: "reportes",          icon: FileText },
    ],
  },
  {
    label: "Sistema",
    items: [
      { label: "Configuración", section: "configuracion", icon: Settings },
    ],
  },
];

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="w-64 bg-sidebar flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-accent rounded-xl flex items-center justify-center shrink-0">
            <span className="text-sidebar-fg font-bold text-lg">S</span>
          </div>
          <div>
            <p className="text-sidebar-fg font-bold text-lg leading-none tracking-wide">SIDEO</p>
            <p className="text-sidebar-fg/50 text-[10px] mt-0.5 leading-tight">
              Sistema de Diagnóstico<br />Ergonómico Ocupacional
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-sidebar-fg/40 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map(({ label, section, icon: Icon }) => {
                const isActive = activeSection === section;
                return (
                  <li key={section}>
                    <button
                      onClick={() => onNavigate(section)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-fg shadow-sm"
                          : "text-sidebar-fg/65 hover:bg-white/10 hover:text-sidebar-fg"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User — click opens Configuración */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <button
          onClick={() => onNavigate("configuracion")}
          className="w-full flex items-center gap-3 hover:bg-white/10 rounded-xl px-1 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center shrink-0">
            <span className="text-sidebar-fg text-xs font-semibold">AU</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sidebar-fg text-sm font-medium truncate">Admin Usuario</p>
            <p className="text-sidebar-fg/50 text-xs truncate">admin@ergocheck.com</p>
          </div>
          <ChevronDown size={14} className="text-sidebar-fg/50 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
