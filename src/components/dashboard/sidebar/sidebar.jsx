"use client";

import { useSidebar } from "@/hooks/dashboard/sidebar/useSidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  ClipboardList,
  FileText,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

// roles: which roles can see this item. Empty/absent = all roles.
const navGroups = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", section: "dashboard", icon: LayoutDashboard },
      { label: "Empresas",  section: "empresas",  icon: Building2,      roles: ["super_admin"] },
    ],
  },
  {
    label: "Gestión",
    items: [
      { label: "Usuarios",  section: "usuarios",  icon: Users,      roles: ["admin", "super_admin"] },
      { label: "Empleados", section: "empleados", icon: UserCheck,  roles: ["admin", "super_admin", "evaluator"] },
    ],
  },
  {
    label: "Evaluación",
    items: [
      { label: "Evaluación ROSA", section: "evaluaciones-rosa", icon: ClipboardList },
      { label: "Reportes",        section: "reportes",          icon: FileText, roles: ["admin", "super_admin"] },
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
  const { role, displayName, displayEmail, initials, handleLogout } = useSidebar();

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
            {(() => {
              const visible = group.items.filter(
                ({ roles }) => !roles || !role || roles.includes(role)
              );
              if (!visible.length) return null;
              return (
                <>
                  <p className="text-sidebar-fg/40 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5">
                    {group.label}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {visible.map(({ label, section, icon: Icon }) => {
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
                </>
              );
            })()}
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
            <span className="text-sidebar-fg text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sidebar-fg text-sm font-medium truncate">{displayName}</p>
            <p className="text-sidebar-fg/50 text-xs truncate">{displayEmail}</p>
          </div>
          <ChevronDown size={14} className="text-sidebar-fg/50 shrink-0" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-2.5 text-sm font-medium text-sidebar-fg/75 hover:text-sidebar-fg hover:bg-white/10 rounded-xl px-3 py-2.5 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
