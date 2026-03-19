"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Activity, HelpCircle, Users } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const RISK_COLORS = {
  low:       { bar: "bg-rosa-low",       badge: "bg-success-bg text-success-fg",  label: "Bajo" },
  medium:    { bar: "bg-rosa-medium",    badge: "bg-warning-bg text-warning-fg",  label: "Medio" },
  high:      { bar: "bg-rosa-high",      badge: "bg-danger-bg text-danger-fg",    label: "Alto" },
  very_high: { bar: "bg-rosa-very-high", badge: "bg-danger-bg text-danger-fg",    label: "Muy Alto" },
};

function buildStats({ totalEvaluations = 0, averageRisk = 0, criticalAreas = 0, activeEmployees = 0 }) {
  const riskLabel = averageRisk <= 2 ? "Nivel Bajo" : averageRisk <= 4 ? "Nivel Medio" : averageRisk <= 6 ? "Nivel Alto" : "Nivel Muy Alto";
  const riskColor = averageRisk <= 2 ? "text-rosa-low" : averageRisk <= 4 ? "text-rosa-medium" : "text-rosa-very-high";

  return [
    {
      label: "Total Evaluaciones",
      value: totalEvaluations.toLocaleString(),
      icon: ClipboardList,
      valueColor: "text-foreground",
    },
    {
      label: "Riesgo Promedio",
      value: averageRisk > 0 ? averageRisk.toFixed(1) : "—",
      sub: averageRisk > 0 ? riskLabel : "Sin datos",
      subColor: riskColor,
      icon: Activity,
      valueColor: riskColor,
    },
    {
      label: "Áreas Críticas",
      value: String(criticalAreas),
      sub: criticalAreas > 0 ? "Requieren atención" : "Sin áreas críticas",
      subColor: criticalAreas > 0 ? "text-rosa-very-high" : "text-muted-fg",
      icon: HelpCircle,
      valueColor: criticalAreas > 0 ? "text-rosa-very-high" : "text-foreground",
    },
    {
      label: "Empleados Activos",
      value: activeEmployees.toLocaleString(),
      icon: Users,
      valueColor: "text-foreground",
    },
  ];
}

function buildDistribution(distribution = {}) {
  const levels = [
    { key: "low",       label: "Bajo" },
    { key: "medium",    label: "Medio" },
    { key: "high",      label: "Alto" },
    { key: "very_high", label: "Muy Alto" },
  ];

  const counts = levels.map((l) => distribution[l.key] ?? 0);
  const max = Math.max(...counts, 1);

  return levels.map((l, i) => ({
    label: l.label,
    count: counts[i],
    color: RISK_COLORS[l.key].bar,
    pct: Math.round((counts[i] / max) * 100),
  }));
}

function buildRecentEvals(evaluations = []) {
  return evaluations.slice(0, 5).map((e) => {
    const key = e.riskLevel ?? "low";
    return {
      nombre: e.employeeName ?? `${e.employee?.firstName ?? ""} ${e.employee?.lastName ?? ""}`.trim(),
      area: e.area ?? e.employee?.area ?? "—",
      nivel: RISK_COLORS[key]?.label ?? key,
      nivelColor: RISK_COLORS[key]?.badge ?? "bg-muted text-muted-fg",
    };
  });
}

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useHome() {
  const [stats, setStats]                     = useState(buildStats({}));
  const [rosaDistribution, setRosaDistribution] = useState(buildDistribution({}));
  const [recentEvals, setRecentEvals]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      const token = getToken();
      if (!token) { setLoading(false); return; }

      try {
        const [dashRes, empRes] = await Promise.all([
          fetch(`${API_URL}/evaluations/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/employees/stats`,        { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        let dashData = {};
        let empData  = {};

        if (dashRes.ok)  dashData = await dashRes.json();
        if (empRes.ok)   empData  = await empRes.json();

        setStats(buildStats({
          totalEvaluations: dashData.totalEvaluations ?? dashData.total ?? 0,
          averageRisk:      dashData.averageRisk      ?? dashData.averageScore ?? 0,
          criticalAreas:    dashData.criticalAreas    ?? dashData.criticalCount ?? 0,
          activeEmployees:  empData.active            ?? empData.total         ?? 0,
        }));

        setRosaDistribution(buildDistribution(
          dashData.riskDistribution ?? dashData.distribution ?? {}
        ));

        setRecentEvals(buildRecentEvals(
          dashData.recentEvaluations ?? dashData.recent ?? []
        ));
      } catch {
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { stats, rosaDistribution, recentEvals, loading, error };
}