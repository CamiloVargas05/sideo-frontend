"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── DATOS DE DEMOSTRACIÓN ────────────────────────────────────────────────────
// Cambiar a false para volver a conectar con el backend real
const MOCK_MODE = false;

const MOCK_SUPER_DATA = {
  stats: {
    activeCompanies:  12,
    totalEmployees:   187,
    totalEvaluations: 431,
    expiringSoon:     3,
  },
  byPlan: [
    { plan: "plus", count: 6 },
    { plan: "pro",  count: 4 },
    { plan: "max",  count: 2 },
  ],
  byStatus: [
    { status: "active",    count: 10 },
    { status: "cancelled", count: 1  },
    { status: "expired",   count: 1  },
  ],
  alerts: [
    { company: "Ingeniería Global SAS",   message: "Suscripción vence en 5 días"  },
    { company: "Textiles del Norte Ltda", message: "Suscripción vence en 12 días" },
    { company: "Soluciones Logísticas SA",message: "Suscripción vence en 28 días" },
  ],
  companies: [
    { id: 1, name: "Soluciones Técnicas SAS",    plan: "pro",  status: "active",    employeeCount: 10, subscriptionEndDate: "2025-12-15T00:00:00.000Z" },
    { id: 2, name: "Ingeniería Global SAS",       plan: "max",  status: "active",    employeeCount: 48, subscriptionEndDate: "2025-04-26T00:00:00.000Z" },
    { id: 3, name: "Textiles del Norte Ltda",     plan: "plus", status: "active",    employeeCount: 9,  subscriptionEndDate: "2025-05-03T00:00:00.000Z" },
    { id: 4, name: "Servicios Ambientales Corp",  plan: "pro",  status: "active",    employeeCount: 17, subscriptionEndDate: "2025-09-20T00:00:00.000Z" },
    { id: 5, name: "Construcciones Andinas SAS",  plan: "plus", status: "cancelled", employeeCount: 6,  subscriptionEndDate: "2025-03-31T00:00:00.000Z" },
    { id: 6, name: "Soluciones Logísticas SA",    plan: "pro",  status: "active",    employeeCount: 19, subscriptionEndDate: "2025-05-19T00:00:00.000Z" },
  ],
};

const MOCK_ADMIN_DATA = {
  company: {
    name: "Soluciones Técnicas SAS",
    plan: "pro",
    planStatus: "active",
    sector: "Tecnología",
    city: "Bogotá",
    subscriptionEndDate: "2025-12-15T00:00:00.000Z",
    daysRemaining: 238,
    maxEmployees: 20,
    logoUrl: null,
  },
  employees: {
    total: 10,
    active: 9,
    inactive: 1,
    neverEvaluated: 2,
    byArea: [
      { area: "Desarrollo",     count: 4 },
      { area: "Administración", count: 2 },
      { area: "Diseño",         count: 2 },
      { area: "Soporte",        count: 2 },
    ],
  },
  evaluations: {
    thisMonth: 7,
    total: 23,
    averageScore: 4.2,
    byRisk: [
      { risk: "low",       count: 3 },
      { risk: "medium",    count: 2 },
      { risk: "high",      count: 2 },
      { risk: "very_high", count: 1 },
    ],
    recentEvaluations: [
      { employeeName: "Carlos Mendoza",  area: "Desarrollo",     riskLevel: "medium"    },
      { employeeName: "Laura Gómez",     area: "Diseño",         riskLevel: "low"       },
      { employeeName: "Andrés Ruiz",     area: "Soporte",        riskLevel: "high"      },
      { employeeName: "María Torres",    area: "Administración", riskLevel: "low"       },
      { employeeName: "Felipe Castro",   area: "Desarrollo",     riskLevel: "very_high" },
    ],
  },
  team: {
    activeEvaluators: 2,
    evaluators: [
      { id: 1, name: "Diana Herrera",  active: true,  lastLogin: new Date(Date.now() - 15 * 60000).toISOString()      },
      { id: 2, name: "Juan Ospina",    active: true,  lastLogin: new Date(Date.now() - 2 * 3600000).toISOString()     },
      { id: 3, name: "Valentina Ríos", active: false, lastLogin: new Date(Date.now() - 5 * 86400000).toISOString()    },
    ],
  },
};
// ─────────────────────────────────────────────────────────────────────────────

export const PLAN_BADGE = {
  plus: "bg-plan-plus-bg text-plan-plus-fg",
  pro:  "bg-plan-pro-bg text-plan-pro-fg",
  max:  "bg-plan-max-bg text-plan-max-fg",
};
export const PLAN_LABEL  = { plus: "Plus", pro: "Pro", max: "Max" };
export const STATUS_BADGE = {
  active:    "bg-success-bg text-success-fg",
  cancelled: "bg-warning-bg text-warning-fg",
  expired:   "bg-danger-bg text-danger-fg",
};
export const STATUS_LABEL = { active: "Activa", cancelled: "Cancelada", expired: "Vencida" };

export const RISK_COLORS = {
  low:       { bar: "bg-rosa-low",       badge: "bg-success-bg text-success-fg",  label: "Bajo"     },
  medium:    { bar: "bg-rosa-medium",    badge: "bg-warning-bg text-warning-fg",  label: "Medio"    },
  high:      { bar: "bg-rosa-high",      badge: "bg-danger-bg text-danger-fg",    label: "Alto"     },
  very_high: { bar: "bg-rosa-very-high", badge: "bg-danger-bg text-danger-fg",    label: "Muy Alto" },
};

const MOCK_EVALUATOR_DATA = {
  evaluator: {
    name: "Diana Herrera",
    position: "Especialista HSEQ",
  },
  stats: {
    thisMonth:   5,
    total:       23,
    pending:     3,
    avgScore:    4.1,
  },
  pendingEmployees: [
    { id: 7,  name: "Diego Morales",   area: "Soporte",        position: "Técnico de Soporte",     daysSinceEval: null  },
    { id: 9,  name: "Nicolás Peña",    area: "Administración", position: "Asistente Administrativo",daysSinceEval: null  },
    { id: 3,  name: "Andrés Ruiz",     area: "Soporte",        position: "Coordinador de Soporte",  daysSinceEval: 38    },
  ],
  recentEvaluations: [
    { employeeName: "Carlos Mendoza",  area: "Desarrollo",     riskLevel: "medium",   score: 4.5, date: "12/04/2025" },
    { employeeName: "Laura Gómez",     area: "Diseño",         riskLevel: "low",      score: 1.8, date: "10/04/2025" },
    { employeeName: "María Torres",    area: "Administración", riskLevel: "low",      score: 2.1, date: "05/04/2025" },
    { employeeName: "Felipe Castro",   area: "Desarrollo",     riskLevel: "very_high",score: 8.3, date: "01/04/2025" },
    { employeeName: "Camila Vargas",   area: "Diseño",         riskLevel: "medium",   score: 3.7, date: "28/03/2025" },
  ],
};

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

function getRole() {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    return (stored.role ?? "").toLowerCase();
  } catch {
    return "";
  }
}

export function useHome() {
  const [role, setRole]                   = useState("");
  const [superData, setSuperData]         = useState(null);
  const [adminData, setAdminData]         = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  useEffect(() => {
    const detectedRole = getRole();
    setRole(detectedRole);

    if (MOCK_MODE) {
      if (detectedRole === "super_admin") setSuperData(MOCK_SUPER_DATA);
      else setAdminData(MOCK_ADMIN_DATA);
      setLoading(false);
      return;
    }

    async function fetchDashboard() {
      const token = getToken();
      if (!token) { setLoading(false); return; }

      try {
        if (detectedRole === "super_admin") {
          const res = await fetch(`${API_URL}/companies/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) setSuperData(await res.json());
          else setError("No se pudo cargar el dashboard.");
        } else {
          const res = await fetch(`${API_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            setAdminData(await res.json());
          } else {
            setError("No se pudo cargar el dashboard.");
          }
        }
      } catch {
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { role, loading, error, superData, adminData };
}
