"use client";

import { showToast } from "nextjs-toast-notify";
import { Plus, Search, ChevronDown } from "lucide-react";

const summaryStats = [
  { label: "Total Empleados",      value: "847",  valueColor: "text-foreground" },
  { label: "Riesgo Bajo",          value: "412",  valueColor: "text-rosa-low" },
  { label: "Riesgo Medio",         value: "289",  valueColor: "text-rosa-medium" },
  { label: "Riesgo Alto/Muy Alto", value: "146",  valueColor: "text-rosa-very-high" },
];

const empleados = [
  { nombre: "Juan Pérez García",  area: "Contabilidad", puesto: "Analista Contable",    riesgo: "Bajo",     score: 2.1, ultimaEval: "15/02/2026" },
  { nombre: "Laura Sánchez M.",   area: "TI",           puesto: "Desarrolladora Senior", riesgo: "Medio",    score: 4.5, ultimaEval: "10/02/2026" },
  { nombre: "Pedro Castillo R.",  area: "Operaciones",  puesto: "Supervisor de Planta",  riesgo: "Muy Alto", score: 7.8, ultimaEval: "08/01/2026" },
  { nombre: "Carmen Flores V.",   area: "RRHH",         puesto: "Jefa de Selección",     riesgo: "Alto",     score: 6.2, ultimaEval: "22/01/2026" },
];

const riesgoBadge = {
  Bajo:       "bg-rosa-low/15 text-rosa-low",
  Medio:      "bg-rosa-medium/15 text-rosa-medium",
  Alto:       "bg-rosa-high/15 text-rosa-high",
  "Muy Alto": "bg-rosa-very-high/15 text-rosa-very-high",
};

function Avatar({ nombre }) {
  const initials = nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
      <span className="text-secondary-fg text-xs font-semibold">{initials}</span>
    </div>
  );
}

export default function Empleados({ onNavigate }) {
  const handleNuevo = () =>
    showToast.info("Formulario de nuevo empleado.", { position: "top-right", transition: "bounceIn", duration: 3000 });

  const handleEvaluar = (nombre) =>
    showToast.info(`Iniciando evaluación para ${nombre}.`, { position: "top-right", transition: "bounceIn", duration: 3000 });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Empleados</h1>
          <p className="text-muted-fg text-sm mt-0.5">Administra los empleados y monitorea su nivel de riesgo ergonómico</p>
        </div>
        <button
          onClick={handleNuevo}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nuevo Empleado
        </button>
      </div>

      <div className="flex-1 px-8 py-5 flex flex-col gap-4">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl px-5 py-4">
              <p className="text-muted-fg text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors">
            Filtrar por Área <ChevronDown size={14} className="text-muted-fg" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors">
            Nivel de Riesgo <ChevronDown size={14} className="text-muted-fg" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empleado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Área</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Puesto</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Riesgo ROSA</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Última Eval.</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar nombre={e.nombre} />
                      <span className="font-medium text-foreground">{e.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-fg">{e.area}</td>
                  <td className="px-6 py-3 text-foreground">{e.puesto}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${riesgoBadge[e.riesgo]}`}>
                      {e.riesgo} ({e.score})
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-fg">{e.ultimaEval}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEvaluar(e.nombre)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors"
                        title="Ver / Evaluar"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => showToast.info(`Editando ${e.nombre}`, { position: "top-right", transition: "bounceIn", duration: 3000 })}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors"
                        title="Editar"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-border flex items-center justify-between">
            <span className="text-muted-fg text-xs">Mostrando 4 de 847 empleados</span>
            <div className="flex items-center gap-4">
              <button className="text-sm text-foreground font-medium hover:text-primary transition-colors">Previous</button>
              <button className="text-sm text-foreground font-medium hover:text-primary transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
