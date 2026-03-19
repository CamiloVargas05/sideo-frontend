"use client";

import { useState, useMemo } from "react";
import { showToast } from "nextjs-toast-notify";
import { Search, Power, X, ChevronDown } from "lucide-react";
import { useEmpresas } from "@/hooks/dashboard/empresas/useEmpresas";
import ConfirmModal from "@/components/ui/confirmModal";

const PLAN_BADGE = {
  Plus: "bg-secondary text-secondary-fg",
  Pro:  "bg-info-bg text-info-fg",
  Max:  "bg-success-bg text-success-fg",
};

const ESTADO_BADGE = {
  Activa:   "bg-success-bg text-success-fg",
  Inactiva: "bg-danger-bg text-danger-fg",
};

const ESTADO_OPTIONS = ["Todos", "Activa", "Inactiva"];

export default function Empresas() {
  const { empresas, loading, error, handleToggleActive } = useEmpresas();

  const [search, setSearch]             = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);
  const [dialog, setDialog]             = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return empresas.filter((e) => {
      const matchSearch = !q || e.nombre.toLowerCase().includes(q) || e.nit.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q);
      const matchEstado = estadoFilter === "Todos" || e.estado === estadoFilter;
      return matchSearch && matchEstado;
    });
  }, [empresas, search, estadoFilter]);

  function confirmarToggle(e) {
    const desactivar = e.isActive;
    setDialog({
      title:        desactivar ? `¿Desactivar ${e.nombre}?` : `¿Activar ${e.nombre}?`,
      message:      desactivar
        ? "La empresa y sus usuarios perderán acceso a la plataforma."
        : "La empresa recuperará acceso a la plataforma.",
      variant:      desactivar ? "warning" : "info",
      confirmLabel: desactivar ? "Desactivar" : "Activar",
      onConfirm:    async () => {
        const res = await handleToggleActive(e.id);
        showToast[res.ok ? "success" : "error"](
          res.ok
            ? (desactivar ? "Empresa desactivada." : "Empresa activada.")
            : "No se pudo actualizar el estado.",
          { position: "top-right", duration: 3000 }
        );
      },
    });
  }

  return (
    <div className="flex flex-col h-full" onClick={() => setShowEstadoMenu(false)}>
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Empresas</h1>
          <p className="text-muted-fg text-sm mt-0.5">Administra las empresas registradas en la plataforma</p>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 flex flex-col gap-4 overflow-y-auto">
        {error && (
          <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              type="text"
              placeholder="Buscar empresa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowEstadoMenu((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors"
            >
              {estadoFilter === "Todos" ? "Filtrar por Estado" : estadoFilter}
              <ChevronDown size={14} className="text-muted-fg" />
            </button>
            {showEstadoMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-40">
                {ESTADO_OPTIONS.map((s) => (
                  <button key={s} onClick={() => { setEstadoFilter(s); setShowEstadoMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-background transition-colors ${estadoFilter === s ? "text-primary font-medium" : "text-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(search || estadoFilter !== "Todos") && (
            <button onClick={() => { setSearch(""); setEstadoFilter("Todos"); }}
              className="text-xs text-muted-fg hover:text-foreground transition-colors flex items-center gap-1">
              <X size={12} /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empresa</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">NIT</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Sector</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empleados</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Plan</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse" style={{ width: j === 0 ? "160px" : "70px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-fg text-sm">
                    {empresas.length === 0 ? "No hay empresas registradas." : "Sin resultados para los filtros aplicados."}
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className={`border-b border-border last:border-0 hover:bg-background transition-colors ${!e.isActive ? "opacity-60" : ""}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{e.nombre}</p>
                      <p className="text-xs text-muted-fg">{e.adminEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-fg">{e.nit}</td>
                    <td className="px-6 py-4 text-muted-fg">{e.sector}</td>
                    <td className="px-6 py-4 text-foreground">{e.empleados.toLocaleString("es-CO")}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PLAN_BADGE[e.plan] ?? "bg-muted text-muted-fg"}`}>
                        {e.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[e.estado]}`}>
                        {e.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => confirmarToggle(e)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                          e.isActive
                            ? "border-border text-muted-fg hover:text-warning-fg hover:border-warning-fg"
                            : "border-border text-muted-fg hover:text-success-fg hover:border-success-fg"
                        }`}
                        title={e.isActive ? "Desactivar empresa" : "Activar empresa"}
                      >
                        <Power size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dialog && <ConfirmModal {...dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}