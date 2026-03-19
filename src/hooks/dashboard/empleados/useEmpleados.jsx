"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const RISK_LABEL = {
  low:       "Bajo",
  medium:    "Medio",
  high:      "Alto",
  very_high: "Muy Alto",
};

function mapEmpleado(e) {
  return {
    id:             e.id,
    nombre:         `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
    area:           e.area        ?? "—",
    puesto:         e.position    ?? "—",
    riesgo:         RISK_LABEL[e.riskLevel] ?? null,
    riskKey:        e.riskLevel   ?? null,
    score:          e.lastScore   ?? null,
    ultimaEval:     e.lastEvaluationDate
                      ? new Date(e.lastEvaluationDate).toLocaleDateString("es-CO")
                      : null,
    isActive:       e.active      ?? e.isActive ?? true,
    // campos crudos para edición
    firstName:      e.firstName   ?? "",
    lastName:       e.lastName    ?? "",
    documentType:   e.documentType   ?? "",
    documentNumber: e.documentNumber ?? "",
    position:       e.position    ?? "",
    email:          e.email       ?? "",
    phone:          e.phone       ?? "",
    hireDate:       e.hireDate    ?? "",
  };
}

function mapSummaryStats(s = {}) {
  const dist = s.riskDistribution ?? {};
  return [
    { label: "Total Empleados",      value: String(s.total ?? 0),                                   valueColor: "text-foreground" },
    { label: "Riesgo Bajo",          value: String(dist.low    ?? 0),                                valueColor: "text-rosa-low" },
    { label: "Riesgo Medio",         value: String(dist.medium ?? 0),                                valueColor: "text-rosa-medium" },
    { label: "Riesgo Alto/Muy Alto", value: String((dist.high ?? 0) + (dist.very_high ?? 0)),        valueColor: "text-rosa-very-high" },
  ];
}

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

function getRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (user.role ?? "").toLowerCase();
  } catch { return ""; }
}

export function useEmpleados() {
  const [empleados, setEmpleados]       = useState([]);
  const [summaryStats, setSummaryStats] = useState(mapSummaryStats());
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  const isEvaluator = getRole() === "evaluator";

  useEffect(() => { fetchEmpleados(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchEmpleados() {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      if (isEvaluator) {
        // Evaluador: lista reducida — stats se derivan del conteo de la lista
        const res = await fetch(`${API_URL}/employees/for-evaluation`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data ?? data.employees ?? []);
          const mapped = list.map(mapEmpleado);
          setEmpleados(mapped);
          // Derivar total de la lista (stats no disponible para evaluador)
          setSummaryStats(mapSummaryStats({ total: data.total ?? list.length }));
        }
      } else {
        // Admin: lista completa + stats
        const [listRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/employees`,       { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/employees/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (listRes.ok) {
          const data = await listRes.json();
          const list = Array.isArray(data) ? data : (data.data ?? data.employees ?? []);
          setEmpleados(list.map(mapEmpleado));
          // Si stats falla, al menos mostrar el total de la lista
          setSummaryStats(mapSummaryStats({ total: data.total ?? list.length }));
        }
        if (statsRes.ok) {
          const s = await statsRes.json();
          // Acepta total, totalEmployees o totalCount como campo principal
          setSummaryStats(mapSummaryStats({
            ...s,
            total: s.total ?? s.totalEmployees ?? s.totalCount ?? s.count ?? 0,
          }));
        }
      }
    } catch {
      setError("No se pudieron cargar los empleados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCrear(formData) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchEmpleados();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleActualizar(id, formData) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchEmpleados();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleDesactivar(id) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/employees/${id}/deactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchEmpleados();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleReactivar(id) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/employees/${id}/reactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchEmpleados();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleEliminar(id) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchEmpleados();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  return {
    empleados, summaryStats, loading, error,
    isEvaluator,
    handleCrear, handleActualizar, handleDesactivar, handleReactivar, handleEliminar,
  };
}
