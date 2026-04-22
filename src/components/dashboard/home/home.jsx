"use client";

import {
  Users, ClipboardList, TrendingUp, AlertTriangle,
  Building2, CheckCircle, XCircle, Clock, CreditCard,
  Plus, CalendarClock, Star,
} from "lucide-react";
import {
  useHome,
  PLAN_BADGE, PLAN_LABEL,
  STATUS_BADGE, STATUS_LABEL,
  RISK_COLORS,
} from "@/hooks/dashboard/home/useHome";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Mapea etiquetas en español del backend a claves de RISK_COLORS
const RISK_KEY_MAP = {
  "Bajo":     "low",
  "Medio":    "medium",
  "Alto":     "high",
  "Muy Alto": "very_high",
};

function resolveRiskKey(value) {
  return RISK_KEY_MAP[value] ?? value; // si ya viene en inglés lo deja igual
}

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

function AdminDashboard({ data, onNavigate }) {
  const { company, employees, evaluations, team } = data;

  const totalByRisk = evaluations.byRisk.reduce((s, r) => s + r.count, 0) || 1;

  const statCards = [
    {
      label: "Empleados activos",
      value: employees.active,
      icon: Users,
      sub: `${employees.inactive} inactivos`,
      subColor: "text-muted-fg",
    },
    {
      label: "Evaluaciones este mes",
      value: evaluations.thisMonth,
      icon: ClipboardList,
      sub: `${evaluations.total} en total`,
      subColor: "text-muted-fg",
    },
    {
      label: "Puntuación promedio",
      value: evaluations.averageScore != null ? parseFloat(evaluations.averageScore).toFixed(1) : "—",
      icon: TrendingUp,
      sub: "ROSA",
      subColor: "text-muted-fg",
    },
    {
      label: "Sin evaluar",
      value: employees.neverEvaluated,
      icon: AlertTriangle,
      sub: "requieren atención",
      subColor: employees.neverEvaluated > 0 ? "text-warning-fg" : "text-muted-fg",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-fg text-sm mt-0.5">
            {company.name} · {company.city}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_BADGE[company.plan] ?? "bg-muted text-muted-fg"}`}>
            {PLAN_LABEL[company.plan] ?? company.plan}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[company.planStatus] ?? "bg-muted text-muted-fg"}`}>
            {STATUS_LABEL[company.planStatus] ?? company.planStatus}
          </span>
        </div>
      </div>

      <div className="flex-1 px-8 py-6 flex flex-col gap-6 overflow-y-auto">

        {/* Company info banner */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 size={22} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{company.name}</p>
              <p className="text-sm text-muted-fg">{company.sector} · {company.city}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-fg">Vence en</p>
            <p className="text-lg font-bold text-foreground">{company.daysRemaining} días</p>
            <p className="text-xs text-muted-fg">
              {new Date(company.subscriptionEndDate).toLocaleDateString("es-CO")}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-muted-fg text-sm">{s.label}</p>
                <s.icon size={18} className="text-muted-fg" />
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Risk bar chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-foreground">Distribución de Riesgo ROSA</h2>
              <span className="text-muted-fg text-xs">{evaluations.total} evaluaciones</span>
            </div>

            {/* Horizontal stacked bar */}
            <div className="flex h-6 rounded-full overflow-hidden mb-4">
              {evaluations.byRisk.map((r) => {
                const key = resolveRiskKey(r.riskLevel ?? r.risk);
                const pct = (r.count / totalByRisk) * 100;
                const c = RISK_COLORS[key];
                return pct > 0 ? (
                  <div
                    key={key}
                    className={`${c?.bar} transition-all`}
                    style={{ width: `${pct}%` }}
                    title={`${c?.label ?? r.riskLevel}: ${r.count}`}
                  />
                ) : null;
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              {evaluations.byRisk.map((r) => {
                const key = resolveRiskKey(r.riskLevel ?? r.risk);
                const c = RISK_COLORS[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm ${c?.bar}`} />
                    <span className="text-xs text-muted-fg">{c?.label ?? r.riskLevel}</span>
                    <span className="text-xs font-semibold text-foreground">{r.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Employees by area */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-3">Empleados por área</p>
              <div className="flex flex-col gap-2">
                {employees.byArea.map((a) => {
                  const pct = Math.round((a.count / employees.total) * 100);
                  return (
                    <div key={a.area} className="flex items-center gap-3">
                      <span className="text-xs text-muted-fg w-28 shrink-0">{a.area}</span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-4 text-right">{a.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Evaluadores activos */}
            <div className="bg-card border border-border rounded-xl p-5 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Equipo evaluador</h2>
                <span className="text-xs text-success-fg font-medium">
                  {team.activeEvaluators} activos
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {team.evaluators.map((ev) => (
                  <li key={ev.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${ev.active ? "bg-success-fg" : "bg-muted-fg"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ev.name}</p>
                      <p className="text-xs text-muted-fg">{timeAgo(ev.lastLogin)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evaluaciones del plan */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-1">
                <CreditCard size={16} className="text-muted-fg" />
                <p className="text-sm font-medium text-foreground">Capacidad del plan</p>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {employees.total}
                <span className="text-base font-normal text-muted-fg"> / {company.maxEmployees}</span>
              </p>
              <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${Math.min(100, (employees.total / company.maxEmployees) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-fg mt-1">
                {Math.max(0, company.maxEmployees - employees.total)} espacios disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Recent evaluations table */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Evaluaciones Recientes</h2>
            <button
              onClick={() => onNavigate?.("evaluaciones-rosa")}
              className="text-primary text-xs font-medium hover:underline"
            >
              Ver todas →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-fg pb-3 pr-4">Empleado</th>
                  <th className="text-left text-xs font-medium text-muted-fg pb-3 pr-4">Área</th>
                  <th className="text-left text-xs font-medium text-muted-fg pb-3">Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.recentEvaluations.map((ev, i) => {
                  const c = RISK_COLORS[resolveRiskKey(ev.riskLevel)];
                  return (
                    <tr key={ev.id ?? i} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 font-medium text-foreground">{ev.employeeName ?? ev.employee}</td>
                      <td className="py-3 pr-4 text-muted-fg">{ev.area}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${c?.badge}`}>
                          {c?.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUPER ADMIN DASHBOARD ────────────────────────────────────────────────────

const PLAN_STYLE = {
  plus: {
    accent:    "border-l-4 border-l-plan-plus-fg",
    dot:       "bg-plan-plus-fg",
    badge:     "bg-plan-plus-bg text-plan-plus-fg",
    bar:       "bg-plan-plus-fg",
    icon:      "text-plan-plus-fg",
    capacity:  10,
  },
  pro: {
    accent:    "border-l-4 border-l-plan-pro-fg",
    dot:       "bg-plan-pro-fg",
    badge:     "bg-plan-pro-bg text-plan-pro-fg",
    bar:       "bg-plan-pro-fg",
    icon:      "text-plan-pro-fg",
    capacity:  20,
  },
  max: {
    accent:    "border-l-4 border-l-plan-max-fg",
    dot:       "bg-plan-max-fg",
    badge:     "bg-plan-max-bg text-plan-max-fg",
    bar:       "bg-plan-max-fg",
    icon:      "text-plan-max-fg",
    capacity:  50,
  },
};

function SuperAdminDashboard({ data }) {
  const raw       = data ?? {};
  const overview  = raw.overview  ?? {};
  const companies = Array.isArray(raw.recentCompanies) ? raw.recentCompanies : [];
  const byPlan    = Array.isArray(raw.byPlan)          ? raw.byPlan          : [];
  const byStatus  = Array.isArray(raw.byStatus)        ? raw.byStatus        : [];

  const totalByPlan = byPlan.reduce((s, p) => s + p.count, 0) || 1;

  const summaryCards = [
    { label: "Empresas activas",     value: overview.activeSubscriptions  ?? "—", icon: Building2,    iconBg: "bg-info-bg",    iconColor: "text-info-fg"    },
    { label: "Total empleados",      value: overview.totalEmployees        ?? "—", icon: Users,         iconBg: "bg-success-bg", iconColor: "text-success-fg" },
    { label: "Ingresos mensuales",   value: overview.monthlyRevenue != null ? `$${overview.monthlyRevenue.toLocaleString("es-CO")}` : "—", icon: ClipboardList, iconBg: "bg-plan-pro-bg", iconColor: "text-plan-pro-fg" },
    { label: "Canceladas",           value: overview.cancelledSubscriptions ?? "—", icon: AlertTriangle, iconBg: "bg-warning-bg", iconColor: "text-warning-fg" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 py-6 bg-card border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Panel SuperAdmin</h1>
        <p className="text-muted-fg text-sm mt-0.5">Visión global de todas las empresas</p>
      </div>

      <div className="flex-1 px-8 py-6 flex flex-col gap-6 overflow-y-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center mb-4`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-muted-fg text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {/* Distribución por plan */}
          <div className="flex flex-col gap-4">

            {/* Plan cards */}
            <div className="grid grid-cols-3 gap-3">
              {byPlan.map((p) => {
                const pct  = Math.round((p.count / totalByPlan) * 100);
                const st   = PLAN_STYLE[p.plan];
                const stars = p.plan === "plus" ? 1 : p.plan === "pro" ? 2 : 3;
                return (
                  <div
                    key={p.plan}
                    className={`bg-card border border-border rounded-xl overflow-hidden ${st?.accent ?? ""}`}
                  >
                    <div className="px-5 pt-5 pb-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${st?.badge ?? "bg-muted text-muted-fg"}`}>
                          {PLAN_LABEL[p.plan] ?? p.plan}
                        </span>
                        <span className="flex gap-0.5">
                          {Array.from({ length: stars }).map((_, i) => (
                            <span key={i} className={`text-xs ${st?.icon ?? "text-muted-fg"}`}>★</span>
                          ))}
                        </span>
                      </div>

                      {/* Count */}
                      <p className="text-4xl font-black text-foreground leading-none">{p.count}</p>
                      <p className="text-xs text-muted-fg mt-1">
                        {p.count === 1 ? "empresa" : "empresas"} · {pct}% del total
                      </p>

                      {/* Capacity label */}
                      <p className="text-xs text-muted-fg mt-3">
                        Hasta <span className="font-semibold text-foreground">{st?.capacity ?? "—"}</span> empleados
                      </p>
                    </div>

                    {/* Bottom bar */}
                    <div className="h-1.5 bg-muted w-full">
                      <div
                        className={`h-full ${st?.bar ?? "bg-primary"} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estado de suscripciones */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Estado de suscripciones</h3>
              <div className="flex flex-col gap-3">
                {byStatus.map((s) => {
                  const total = byStatus.reduce((a, b) => a + b.count, 0) || 1;
                  const pct   = Math.round((s.count / total) * 100);
                  const cfg = {
                    active:    { bar: "bg-success-fg", dot: "bg-success-fg",  text: "text-success-fg"  },
                    cancelled: { bar: "bg-warning-fg", dot: "bg-warning-fg",  text: "text-warning-fg"  },
                    expired:   { bar: "bg-danger-fg",  dot: "bg-danger-fg",   text: "text-danger-fg"   },
                  }[s.status] ?? { bar: "bg-primary", dot: "bg-primary", text: "text-foreground" };

                  return (
                    <div key={s.status} className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                      <span className="text-sm text-muted-fg w-24 shrink-0">
                        {STATUS_LABEL[s.status] ?? s.status}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 ${cfg.bar} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-6 text-right ${cfg.text}`}>{s.count}</span>
                      <span className="text-xs text-muted-fg w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Companies table */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Empresas registradas</h2>
          {companies.length === 0 ? (
            <p className="text-muted-fg text-sm text-center py-8">Sin empresas registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Empresa", "Plan", "Estado", "Empleados", "Días restantes"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-fg pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c, i) => (
                    <tr key={c.id ?? i} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 font-medium text-foreground">{c.name}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_BADGE[c.plan] ?? "bg-muted text-muted-fg"}`}>
                          {PLAN_LABEL[c.plan] ?? c.plan}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[c.status] ?? "bg-muted text-muted-fg"}`}>
                          {c.status === "active" && <CheckCircle size={10} />}
                          {c.status === "expired" && <XCircle size={10} />}
                          {c.status === "cancelled" && <Clock size={10} />}
                          {STATUS_LABEL[c.status] ?? c.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-muted-fg">{c.employeeCount ?? "—"}</td>
                      <td className="py-3 text-muted-fg">
                        {c.daysRemaining != null ? `${c.daysRemaining} días` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EVALUADOR DASHBOARD ──────────────────────────────────────────────────────

function EvaluadorDashboard({ data, onNavigate }) {
  const { evaluator, stats, pendingEmployees, recentEvaluations } = data;

  const statCards = [
    { label: "Evaluaciones este mes", value: stats.thisMonth, icon: ClipboardList, iconBg: "bg-info-bg",     iconColor: "text-info-fg"    },
    { label: "Total realizadas",      value: stats.total,     icon: Star,           iconBg: "bg-plan-pro-bg", iconColor: "text-plan-pro-fg"},
    { label: "Pendientes",            value: stats.pending,   icon: CalendarClock,  iconBg: "bg-warning-bg",  iconColor: "text-warning-fg" },
    { label: "Puntuación promedio",   value: stats.avgScore != null ? parseFloat(stats.avgScore).toFixed(1) : "—", icon: TrendingUp, iconBg: "bg-success-bg", iconColor: "text-success-fg" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-fg text-sm mt-0.5">
            Bienvenido, <span className="font-medium text-foreground">{evaluator.name}</span> · {evaluator.position}
          </p>
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
          {statCards.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center mb-4`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-muted-fg text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Empleados pendientes */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} className="text-warning-fg" />
                <h2 className="font-semibold text-foreground">Pendientes de evaluar</h2>
              </div>
              <button
                onClick={() => onNavigate?.("empleados")}
                className="text-primary text-xs font-medium hover:underline"
              >
                Ver todos →
              </button>
            </div>

            {pendingEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle size={32} className="text-success-fg mb-2" />
                <p className="text-sm text-muted-fg">Todos los empleados están al día</p>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {pendingEmployees.map((emp) => (
                  <li key={emp.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-warning-bg flex items-center justify-center shrink-0">
                        <span className="text-warning-fg text-xs font-bold">
                          {emp.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-fg">{emp.area} · {emp.position}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {emp.daysSinceEval === null ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-danger-bg text-danger-fg">
                          Sin evaluar
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-warning-bg text-warning-fg">
                          Hace {emp.daysSinceEval} días
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {pendingEmployees.length > 0 && (
              <button
                onClick={() => onNavigate?.("evaluaciones-rosa")}
                className="mt-4 w-full flex items-center justify-center gap-2 border border-primary text-primary font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors"
              >
                <Plus size={15} />
                Iniciar evaluación
              </button>
            )}
          </div>

          {/* Mis evaluaciones recientes */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Mis evaluaciones recientes</h2>
              <button
                onClick={() => onNavigate?.("evaluaciones-rosa")}
                className="text-primary text-xs font-medium hover:underline"
              >
                Ver todas →
              </button>
            </div>

            {recentEvaluations.length === 0 ? (
              <p className="text-muted-fg text-sm text-center py-8">Sin evaluaciones aún</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {recentEvaluations.map((ev, i) => {
                  const c = RISK_COLORS[ev.riskLevel];
                  return (
                    <li key={i} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{ev.employeeName}</p>
                        <p className="text-xs text-muted-fg">{ev.area} · {ev.date}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-foreground">{ev.score.toFixed(1)}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c?.badge}`}>
                          {c?.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Home({ onNavigate }) {
  const { role, loading, error, superData, adminData, evaluatorData } = useHome();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">
          {error}
        </p>
      </div>
    );
  }

  if (role === "super_admin" && superData) {
    return <SuperAdminDashboard data={superData} />;
  }

  if (role === "evaluator" && evaluatorData) {
    return <EvaluadorDashboard data={evaluatorData} onNavigate={onNavigate} />;
  }

  if (adminData) {
    return <AdminDashboard data={adminData} onNavigate={onNavigate} />;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-fg text-sm">No hay datos disponibles.</p>
    </div>
  );
}
