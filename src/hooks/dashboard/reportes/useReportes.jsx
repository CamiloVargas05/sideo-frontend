"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const TIPO_LABEL = {
  ROSA:      "ROSA",
  RIESGOS:   "Riesgos",
  EMPLEADOS: "Empleados",
  // fallback: devolver tal cual si no está en el mapa
};

const ESTADO_LABEL = {
  ready:      "Listo",
  processing: "Procesando",
  pending:    "Procesando",
  done:       "Listo",
};

function mapReporte(r) {
  const tipo  = TIPO_LABEL[r.type?.toUpperCase()]  ?? r.type  ?? "—";
  const estado = ESTADO_LABEL[r.status?.toLowerCase()] ?? r.status ?? "—";
  return {
    id:      r.id,
    nombre:  r.title ?? r.name ?? `Reporte ${r.id}`,
    tipo,
    fecha:   r.createdAt
               ? new Date(r.createdAt).toLocaleDateString("es-CO")
               : (r.date ?? "—"),
    estado,
    fileUrl: r.fileUrl ?? r.url ?? null,
  };
}

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useReportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => { fetchReportes(); }, []);

  async function fetchReportes() {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data ?? data.reports ?? []);
        setReportes(list.map(mapReporte));
      }
    } catch {
      setError("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetalle(id) {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  return { reportes, loading, error, fetchDetalle };
}