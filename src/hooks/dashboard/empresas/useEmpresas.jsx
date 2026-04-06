"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const PLAN_LABEL = {
  plus: "Plus",
  pro:  "Pro",
  max:  "Max",
};

function mapEmpresa(e) {
  // Manejo robusto del contador de empleados
  let empleados = 0;
  if (typeof e.employees === "object" && e.employees !== null) {
    empleados = e.employees.total ?? 0;
  } else if (typeof e.employees === "number") {
    empleados = e.employees;
  } else if (typeof e.employeeCount === "number") {
    empleados = e.employeeCount;
  }

  return {
    id:          e.id,
    nombre:      e.name ?? e.companyName ?? "—",
    nit:         e.nit         ?? "—",
    sector:      e.sector      ?? "—",
    city:        e.city        ?? "—",
    empleados:   empleados,
    plan:        PLAN_LABEL[e.subscription?.plan?.toLowerCase()] ?? PLAN_LABEL[e.plan?.toLowerCase()] ?? "—",
    planKey:     e.subscription?.plan?.toLowerCase() ?? e.plan?.toLowerCase() ?? "",
    isActive:    e.active      ?? e.isActive ?? true,
    estado:      (e.active     ?? e.isActive ?? true) ? "Activa" : "Inactiva",
    adminEmail:  e.admin?.email ?? e.adminEmail ?? "—",
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
        // Garantizar que siempre sea un array
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === "object") {
          // Intentar extraer array de propiedades comunes
          list = data.data ?? data.companies ?? data.empresas ?? [];
          // Si aún no es un array pero es un objeto de empresa, envolverlo
          if (!Array.isArray(list) && data.id) {
            list = [data];
          }
        }
        setEmpresas(Array.isArray(list) ? list.map(mapEmpresa) : []);
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