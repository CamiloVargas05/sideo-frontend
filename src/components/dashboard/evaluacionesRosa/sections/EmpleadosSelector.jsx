"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight} from "lucide-react";
import { showToast } from "nextjs-toast-notify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

function Avatar({ nombre }) {
  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
      <span className="text-secondary-fg text-xs font-semibold">{initials}</span>
    </div>
  );
}

export default function EmpleadosSelector({ onSelect, onCancel }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmpleados();
  }, []);

  async function fetchEmpleados() {
    const token = getToken();
    if (!token) {
      setError("No autorizado");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/employees/for-evaluation`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setEmpleados(Array.isArray(data) ? data : (data.employees ?? []));
      } else if (res.status === 401) {
        setError("Sesión expirada");
      } else {
        setError("Error al cargar empleados");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  const filteredEmpleados = empleados.filter(
    (emp) =>
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Seleccionar Empleado
          </h1>
          <p className="text-muted-fg text-sm mt-0.5">
            Elige un empleado para realizar la evaluación ROSA
          </p>
        </div>
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
            placeholder="Buscar por nombre o email..."
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
              <p className="text-muted-fg">Cargando empleados...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-danger-bg border border-danger-bg/50 rounded-lg px-4 py-3 text-sm text-danger-fg">
            {error}
          </div>
        ) : filteredEmpleados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-fg">
            <p>No hay empleados disponibles para evaluar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEmpleados.map((emp) => (
              <button
                key={emp.id}
                onClick={() => onSelect(emp)}
                className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary hover:bg-background/50 transition-all text-left group"
              >
                <Avatar nombre={`${emp.firstName} ${emp.lastName}`} />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-sm text-muted-fg truncate">
                    {emp.position} • {emp.area}
                  </p>
                  <p className="text-xs text-muted-fg/60">
                    {emp.email}
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  className="text-muted-fg group-hover:text-primary transition-colors shrink-0"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-card border-t border-border">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
