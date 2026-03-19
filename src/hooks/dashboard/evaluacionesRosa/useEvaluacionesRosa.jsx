"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const MOCK_EVALUACIONES = [
  { id: "ROSA-001", empleado: "Ana García",   area: "Contabilidad", fecha: "12/02/2026", nivel: "Medio",    score: 4.2 },
  { id: "ROSA-002", empleado: "Luis Torres",  area: "TI",           fecha: "10/02/2026", nivel: "Bajo",     score: 2.0 },
  { id: "ROSA-003", empleado: "Pedro Ruiz",   area: "Operaciones",  fecha: "08/02/2026", nivel: "Alto",     score: 6.5 },
  { id: "ROSA-004", empleado: "Rosa Mendoza", area: "RRHH",         fecha: "05/02/2026", nivel: "Muy Alto", score: 7.5 },
];

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useEvaluacionesRosa() {
  const [evaluaciones, setEvaluaciones] = useState(MOCK_EVALUACIONES);
  const [view, setView]                 = useState("list"); // "list" | "wizard" | "result"
  const [wizardData, setWizardData]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => { fetchEvaluaciones(); }, []);

  async function fetchEvaluaciones() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/evaluations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // const data = await res.json();
        // setEvaluaciones(data);
      }
    } catch {
      setError("No se pudieron cargar las evaluaciones.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCrearEvaluacion(evaluacionBody) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluacionBody),
      });
      if (res.ok) await fetchEvaluaciones();
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  }

  const handleNueva = () => setView("wizard");

  function handleFinishWizard(data) {
    setWizardData(data);
    setView("result");
    // handleCrearEvaluacion(mapToApiBody(data)); // conectar cuando se tenga el mapeo
  }

  const handleVerResultado = () => setView("result-preview");

  return {
    evaluaciones, view, setView,
    wizardData, loading, error,
    handleNueva, handleFinishWizard, handleVerResultado, handleCrearEvaluacion,
  };
}
