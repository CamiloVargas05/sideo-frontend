"use client";

import { Plus, ArrowUpRight } from "lucide-react";
import { useHome } from "@/hooks/dashboard/home/useHome";

export default function Home({ onNavigate }) {
  const { stats, rosaDistribution, recentEvals, loading, error } = useHome();

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
        {error && (
          <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-muted-fg text-sm">{s.label}</p>
                <s.icon size={18} className="text-muted-fg" />
              </div>
              {loading ? (
                <div className="h-9 w-20 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <p className={`text-3xl font-bold ${s.valueColor}`}>{s.value}</p>
                  {s.trend && (
                    <p className="text-success-fg text-xs font-medium mt-1 flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      {s.trend}
                    </p>
                  )}
                  {s.sub && <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>}
                </>
              )}
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
            {loading ? (
              <div className="h-44 flex items-end gap-6 px-2">
                {[85, 65, 42, 25].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full rounded-t-lg bg-muted animate-pulse" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-end gap-6 h-44 px-2">
                {rosaDistribution.map((r) => (
                  <div key={r.label} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-muted-fg text-xs font-medium">{r.count}</span>
                    <div
                      className={`w-full rounded-t-lg ${r.color} transition-all`}
                      style={{ height: `${r.pct}%`, minHeight: r.count > 0 ? "8px" : "0" }}
                    />
                    <span className="text-muted-fg text-xs">{r.label}</span>
                  </div>
                ))}
              </div>
            )}
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
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : recentEvals.length === 0 ? (
              <p className="text-muted-fg text-sm text-center py-8">Sin evaluaciones recientes</p>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}