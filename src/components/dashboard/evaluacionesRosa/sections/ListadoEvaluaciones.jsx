"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { getRiskLevel } from "../constants/rosaQuestions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export default function ListadoEvaluaciones({
  onNuevaEvaluacion,
  onVerResultado,
}) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvaluaciones();
  }, []);

  async function fetchEvaluaciones() {
    const token = getToken();
    if (!token) {
      setError("No autorizado");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/evaluations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluaciones(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        setError("Sesión expirada");
      } else {
        setError("Error al cargar evaluaciones");
      }
    } catch (err) {
      console.error("Error fetching evaluations:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  const filteredEvaluaciones = evaluaciones.filter(
    (ev) =>
      ev.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Evaluaciones ROSA
          </h1>
          <p className="text-muted-fg text-sm mt-0.5">
            Evaluaciones ergonómicas con metodología ROSA
          </p>
        </div>
        <button
          onClick={onNuevaEvaluacion}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Nueva Evaluación
        </button>
      </div>

      {/* Search */}
      <div className="px-8 py-4 bg-card border-b border-border">
        <div className="relative max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
          />
          <input
            type="text"
            placeholder="Buscar empleado o área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-fg">Cargando evaluaciones...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-danger-bg border border-danger-bg/50 rounded-lg px-4 py-3 text-sm text-danger-fg">
            {error}
          </div>
        ) : filteredEvaluaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center text-muted-fg">
              <p className="mb-3">No hay evaluaciones aún</p>
              <button
                onClick={onNuevaEvaluacion}
                className="text-primary font-medium hover:underline"
              >
                Crear la primera evaluación
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Empleado
                  </th>
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Área
                  </th>
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Evaluador
                  </th>
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Fecha
                  </th>
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Puntuación
                  </th>
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Nivel
                  </th>
                  <th className="text-left px-6 py-3 text-muted-fg font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvaluaciones.map((ev) => {
                  const level = getRiskLevel(ev.rosaFinal ?? 0);
                  const fecha = new Date(ev.createdAt).toLocaleDateString(
                    "es-CO"
                  );

                  return (
                    <tr
                      key={ev.id}
                      className="border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium text-foreground">
                        {ev.employee}
                      </td>
                      <td className="px-6 py-3 text-muted-fg text-sm">
                        {ev.area}
                      </td>
                      <td className="px-6 py-3 text-muted-fg text-sm">
                        {ev.evaluator || "—"}
                      </td>
                      <td className="px-6 py-3 text-muted-fg text-sm">
                        {fecha}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className={`h-full ${level.bg} rounded-full`}
                              style={{
                                width: `${((ev.rosaFinal ?? 0) / 10) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="font-medium text-foreground min-w-fit">
                            {(ev.rosaFinal ?? 0).toFixed(1)}/10
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${level.bg}`}
                        >
                          {ev.riskLevel || level.label}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => onVerResultado(ev)}
                          className="flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                        >
                          <Eye size={14} /> Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
