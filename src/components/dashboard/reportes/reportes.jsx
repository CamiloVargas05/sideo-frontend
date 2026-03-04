"use client";

import { showToast } from "nextjs-toast-notify";
import Navbar from "@/components/dashboard/navbar/navbar";
import { Plus, Download, Trash2 } from "lucide-react";

const reportes = [
  { nombre: "Reporte Mensual ROSA — Enero 2025", empresa: "Aceros del Perú SAC",   tipo: "ROSA",      fecha: "01/02/2025", estado: "Listo" },
  { nombre: "Reporte Anual de Riesgos 2024",     empresa: "Minera Andina Corp",    tipo: "Riesgos",   fecha: "15/01/2025", estado: "Listo" },
  { nombre: "Reporte de Empleados Q1 2025",      empresa: "Constructora Lima SAC", tipo: "Empleados", fecha: "03/03/2025", estado: "Procesando" },
];

const tipoBadge = {
  ROSA:      "bg-info-bg text-info-fg",
  Riesgos:   "bg-danger-bg text-danger-fg",
  Empleados: "bg-secondary text-secondary-fg",
};

const estadoBadge = {
  Listo:      "bg-success-bg text-success-fg",
  Procesando: "bg-warning-bg text-warning-fg",
};

export default function Reportes() {
  const handleGenerar = () =>
    showToast.info("Generando nuevo reporte...", { position: "top-right", transition: "bounceIn", duration: 3000 });

  const handleDescargar = (nombre) =>
    showToast.success(`Descargando: ${nombre}`, { position: "top-right", transition: "bounceIn", duration: 3000 });

  const handleEliminar = (nombre) =>
    showToast.warning(`¿Eliminar "${nombre}"? Acción no implementada aún.`, { position: "top-right", transition: "bounceIn", duration: 4000 });

  return (
    <div className="flex flex-col h-full">
      <Navbar
        title="Reportes"
        subtitle="Genera y descarga reportes de evaluaciones y estadísticas"
      >
        <button
          onClick={handleGenerar}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Generar Reporte
        </button>
      </Navbar>

      <div className="flex-1 px-8 py-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Reporte</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empresa</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Tipo</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Fecha</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{r.nombre}</td>
                  <td className="px-6 py-4 text-muted-fg">{r.empresa}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tipoBadge[r.tipo]}`}>
                      {r.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-fg">{r.fecha}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge[r.estado]}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleDescargar(r.nombre)} className="text-muted-fg hover:text-primary transition-colors" title="Descargar">
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleEliminar(r.nombre)} className="text-muted-fg hover:text-destructive transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
