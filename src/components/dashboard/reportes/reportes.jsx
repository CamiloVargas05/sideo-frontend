"use client";

import { useState, useMemo } from "react";
import { showToast } from "nextjs-toast-notify";
import { Download, Search, X } from "lucide-react";
import { useReportes } from "@/hooks/dashboard/reportes/useReportes";

const TIPO_BADGE = {
  ROSA:      "bg-info-bg text-info-fg",
  Riesgos:   "bg-danger-bg text-danger-fg",
  Empleados: "bg-secondary text-secondary-fg",
};

const ESTADO_BADGE = {
  Listo:      "bg-success-bg text-success-fg",
  Procesando: "bg-warning-bg text-warning-fg",
};

export default function Reportes() {
  const { reportes, loading, error } = useReportes();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return !q ? reportes : reportes.filter((r) =>
      r.nombre.toLowerCase().includes(q) || r.tipo.toLowerCase().includes(q)
    );
  }, [reportes, search]);

  function handleDescargar(reporte) {
    if (reporte.fileUrl) {
      window.open(reporte.fileUrl, "_blank");
    } else {
      showToast.info("El archivo aún no está disponible.", { position: "top-right", duration: 3000 });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-fg text-sm mt-0.5">Descarga los reportes de evaluaciones ergonómicas</p>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 flex flex-col gap-4 overflow-y-auto">
        {error && (
          <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              type="text"
              placeholder="Buscar reporte…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>
          {search && (
            <button onClick={() => setSearch("")}
              className="text-xs text-muted-fg hover:text-foreground transition-colors flex items-center gap-1">
              <X size={12} /> Limpiar
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Reporte</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Tipo</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Fecha</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse" style={{ width: j === 0 ? "200px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-fg text-sm">
                    {reportes.length === 0
                      ? "No hay reportes disponibles. Se generarán automáticamente tras completar evaluaciones."
                      : "Sin resultados para la búsqueda."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{r.nombre}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TIPO_BADGE[r.tipo] ?? "bg-muted text-muted-fg"}`}>
                        {r.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-fg">{r.fecha}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[r.estado] ?? "bg-muted text-muted-fg"}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDescargar(r)}
                        disabled={r.estado !== "Listo"}
                        className="text-muted-fg hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={r.estado === "Listo" ? "Descargar" : "Aún no disponible"}
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}