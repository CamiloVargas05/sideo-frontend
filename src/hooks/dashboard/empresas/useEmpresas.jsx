"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const PLAN_LABEL = {
  plus: "Plus",
  pro:  "Pro",
  max:  "Max",
};

function mapEmpresa(e) {
  return {
    id:          e.id,
    nombre:      e.companyName ?? e.name ?? "—",
    nit:         e.nit         ?? "—",
    sector:      e.sector      ?? "—",
    city:        e.city        ?? "—",
    empleados:   e.employeeCount ?? e.employees ?? 0,
    plan:        PLAN_LABEL[e.plan?.toLowerCase()] ?? e.plan ?? "—",
    planKey:     e.plan?.toLowerCase() ?? "",
    isActive:    e.active      ?? e.isActive ?? true,
    estado:      (e.active     ?? e.isActive ?? true) ? "Activa" : "Inactiva",
    adminEmail:  e.adminEmail  ?? e.admin?.email ?? "—",
  };
}

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => { fetchEmpresas(); }, []);

  async function fetchEmpresas() {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data ?? data.companies ?? []);
        setEmpresas(list.map(mapEmpresa));
      }
    } catch {
      setError("No se pudieron cargar las empresas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/companies/${id}/toggle-active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchEmpresas();
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  }

  return { empresas, loading, error, handleToggleActive };
}