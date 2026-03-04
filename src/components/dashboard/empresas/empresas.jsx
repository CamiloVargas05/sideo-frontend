"use client";

import { showToast } from "nextjs-toast-notify";
import Navbar, { SearchInput } from "@/components/dashboard/navbar/navbar";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empresas = [
  { nombre: "Aceros del Perú SAC",   ruc: "20512345678", empleados: 245,  suscripcion: "Profesional", estado: "Activa" },
  { nombre: "Minera Andina Corp",    ruc: "20498765432", empleados: 1120, suscripcion: "Empresarial", estado: "Activa" },
  { nombre: "Constructora Lima SAC", ruc: "20376543210", empleados: 87,   suscripcion: "Básico",      estado: "Por vencer" },
];

const suscripcionBadge = {
  Profesional: "bg-success-bg text-success-fg",
  Empresarial: "bg-info-bg text-info-fg",
  Básico:      "bg-warning-bg text-warning-fg",
};

const estadoBadge = {
  Activa:       "bg-success-bg text-success-fg",
  "Por vencer": "bg-warning-bg text-warning-fg",
  Inactiva:     "bg-danger-bg text-danger-fg",
};

export default function Empresas() {
  const handleNueva = () =>
    showToast.info("Abre el formulario de nueva empresa.", { position: "top-right", transition: "bounceIn", duration: 3000 });

  const handleEditar = (nombre) =>
    showToast.info(`Editando: ${nombre}`, { position: "top-right", transition: "bounceIn", duration: 3000 });

  const handleEliminar = (nombre) =>
    showToast.warning(`¿Eliminar ${nombre}? Acción no implementada aún.`, { position: "top-right", transition: "bounceIn", duration: 4000 });

  return (
    <div className="flex flex-col h-full">
      <Navbar
        title="Gestión de Empresas"
        subtitle="Administre las empresas registradas en la plataforma"
      >
        <SearchInput />
        <button
          onClick={handleNueva}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nueva Empresa
        </button>
      </Navbar>

      <div className="flex-1 px-8 py-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empresa</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">RUC</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empleados</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Suscripción</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{e.nombre}</td>
                  <td className="px-6 py-4 text-muted-fg">{e.ruc}</td>
                  <td className="px-6 py-4 text-foreground">{e.empleados.toLocaleString("es-PE")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${suscripcionBadge[e.suscripcion]}`}>
                      {e.suscripcion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge[e.estado]}`}>
                      {e.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEditar(e.nombre)} className="text-muted-fg hover:text-primary transition-colors" title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleEliminar(e.nombre)} className="text-muted-fg hover:text-destructive transition-colors" title="Eliminar">
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
