"use client";

import { ClipboardList, Activity, HelpCircle, Users, Plus, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Total Evaluaciones", value: "1,284", trend: "+12.5% este mes", icon: ClipboardList, valueColor: "text-foreground" },
  { label: "Riesgo Promedio",    value: "4.2",   sub: "Nivel Medio",       subColor: "text-rosa-medium",    icon: Activity,    valueColor: "text-rosa-medium" },
  { label: "Áreas Críticas",     value: "3",     sub: "Requieren atención",subColor: "text-rosa-very-high", icon: HelpCircle,  valueColor: "text-rosa-very-high" },
  { label: "Empleados Activos",  value: "847",   trend: "+5.2% este mes",  icon: Users,       valueColor: "text-foreground" },
];

const rosaDistribution = [
  { label: "Bajo",     count: 412, color: "bg-rosa-low",       pct: 85 },
  { label: "Medio",    count: 289, color: "bg-rosa-medium",    pct: 65 },
  { label: "Alto",     count: 146, color: "bg-rosa-high",      pct: 42 },
  { label: "Muy Alto", count: 47,  color: "bg-rosa-very-high", pct: 25 },
];

const recentEvals = [
  { nombre: "Ana García",  area: "Contabilidad", nivel: "Medio",    nivelColor: "bg-warning-bg text-warning-fg" },
  { nombre: "Luis Torres", area: "TI",           nivel: "Bajo",     nivelColor: "bg-success-bg text-success-fg" },
  { nombre: "María Ruiz",  area: "RRHH",         nivel: "Muy Alto", nivelColor: "bg-danger-bg text-danger-fg" },
];

export default function Home({ onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-fg text-sm mt-0.5">Resumen general de evaluaciones ergonómicas</p>
        </div>
        <button
          onClick={() => onNavigate?.("evaluaciones-rosa")}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nueva Evaluación
        </button>
      </div>

      <div className="flex-1 px-8 py-6 flex flex-col gap-6 overflow-y-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-muted-fg text-sm">{s.label}</p>
                <s.icon size={18} className="text-muted-fg" />
              </div>
              <p className={`text-3xl font-bold ${s.valueColor}`}>{s.value}</p>
              {s.trend && (
                <p className="text-success-fg text-xs font-medium mt-1 flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  {s.trend}
                </p>
              )}
              {s.sub && <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Bar chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-foreground">Distribución de Niveles de Riesgo</h2>
              <span className="text-muted-fg text-xs">Últimos 30 días</span>
            </div>
            <div className="flex items-end gap-6 h-44 px-2">
              {rosaDistribution.map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-muted-fg text-xs font-medium">{r.count}</span>
                  <div
                    className={`w-full rounded-t-lg ${r.color} transition-all`}
                    style={{ height: `${r.pct}%` }}
                  />
                  <span className="text-muted-fg text-xs">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent evaluations */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Evaluaciones Recientes</h2>
              <button
                onClick={() => onNavigate?.("evaluaciones-rosa")}
                className="text-primary text-xs font-medium hover:underline"
              >
                Ver todas →
              </button>
            </div>
            <ul className="flex flex-col divide-y divide-border">
              {recentEvals.map((e, i) => (
                <li key={i} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.nombre}</p>
                    <p className="text-xs text-muted-fg">{e.area}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${e.nivelColor}`}>
                    {e.nivel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
