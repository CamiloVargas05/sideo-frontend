"use client";

import { useState, useMemo } from "react";
import { showToast } from "nextjs-toast-notify";
import { Plus, Search, Pencil, X, ChevronDown } from "lucide-react";
import { useEmpleados } from "@/hooks/dashboard/empleados/useEmpleados";
import ConfirmModal from "@/components/ui/confirmModal";

/* ─── constantes ─────────────────────────────────────────── */
const RISK_BADGE = {
  Bajo:       "bg-rosa-low/15 text-rosa-low",
  Medio:      "bg-rosa-medium/15 text-rosa-medium",
  Alto:       "bg-rosa-high/15 text-rosa-high",
  "Muy Alto": "bg-rosa-very-high/15 text-rosa-very-high",
};
const RISK_OPTIONS = ["Todos", "Bajo", "Medio", "Alto", "Muy Alto"];
const PAGE_SIZE = 10;
const EMPTY_FORM = {
  firstName: "", lastName: "", documentType: "", documentNumber: "",
  position: "", area: "", email: "", phone: "", hireDate: "",
};

/* ─── helpers ────────────────────────────────────────────── */
function Avatar({ nombre }) {
  const initials = nombre.split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
      <span className="text-secondary-fg text-xs font-semibold">{initials}</span>
    </div>
  );
}

/* ─── modal crear / editar ───────────────────────────────── */
function EmpleadoModal({ empleado, onClose, onGuardar }) {
  const isEditing = Boolean(empleado);
  const [form, setForm] = useState(
    isEditing
      ? {
          firstName:      empleado.firstName,
          lastName:       empleado.lastName,
          documentType:   empleado.documentType,
          documentNumber: empleado.documentNumber,
          position:       empleado.position,
          area:           empleado.area === "—" ? "" : empleado.area,
          email:          empleado.email,
          phone:          empleado.phone,
          hireDate:       empleado.hireDate,
        }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhone(e) {
    // solo números y símbolos telefónicos — sin letras
    const val = e.target.value.replace(/[a-zA-Z]/g, "");
    setForm((prev) => ({ ...prev, phone: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.position.trim() || !form.area.trim()) {
      setFormError("Nombre, apellido, puesto y área son obligatorios.");
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError("El correo no tiene un formato válido.");
      return;
    }
    setSaving(true);
    setFormError("");

    const payload = {
      firstName:      form.firstName.trim(),
      lastName:       form.lastName.trim(),
      position:       form.position.trim(),
      area:           form.area.trim(),
      ...(form.documentType.trim()   && { documentType:   form.documentType.trim() }),
      ...(form.documentNumber.trim() && { documentNumber: form.documentNumber.trim() }),
      ...(form.email.trim()          && { email:          form.email.trim() }),
      ...(form.phone.trim()          && { phone:          form.phone.trim() }),
      ...(form.hireDate              && { hireDate:       form.hireDate }),
    };

    const res = await onGuardar(payload);
    setSaving(false);
    if (res.ok) {
      showToast.success(isEditing ? "Empleado actualizado." : "Empleado creado.", { position: "top-right", duration: 3000 });
      onClose();
    } else {
      setFormError(res.error ?? "Ocurrió un error. Intenta de nuevo.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
          </h2>
          <button onClick={onClose} className="text-muted-fg hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Nombre *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Apellido *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Tipo de documento</label>
              <select name="documentType" value={form.documentType} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Seleccionar…</option>
                <option value="CC">CC — Cédula de Ciudadanía</option>
                <option value="CE">CE — Cédula de Extranjería</option>
                <option value="TI">TI — Tarjeta de Identidad</option>
                <option value="PA">PA — Pasaporte</option>
                <option value="RC">RC — Registro Civil</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Número de documento</label>
              <input name="documentNumber" value={form.documentNumber} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Puesto *</label>
              <input name="position" value={form.position} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Área *</label>
              <input name="area" value={form.area} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Correo</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <input name="phone" value={form.phone} onChange={handlePhone}
                placeholder="+57 300 000 0000"
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-sm font-medium text-foreground">Fecha de ingreso</label>
              <input name="hireDate" type="date" value={form.hireDate} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {formError && (
            <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-background transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm bg-primary text-primary-fg font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── componente principal ───────────────────────────────── */
export default function Empleados() {
  const {
    empleados, summaryStats, loading, error, isEvaluator,
    handleCrear, handleActualizar,
  } = useEmpleados();

  const [modal, setModal]         = useState(null);
  const [dialog, setDialog]       = useState(null);
  const [search, setSearch]       = useState("");
  const [areaFilter, setAreaFilter]   = useState("Todas");
  const [riesgoFilter, setRiesgoFilter] = useState("Todos");
  const [showAreaMenu, setShowAreaMenu]   = useState(false);
  const [showRiesgoMenu, setShowRiesgoMenu] = useState(false);
  const [page, setPage]           = useState(1);

  /* áreas únicas de la lista */
  const areas = useMemo(() => {
    const set = new Set(empleados.map((e) => e.area).filter((a) => a !== "—"));
    return ["Todas", ...Array.from(set).sort()];
  }, [empleados]);

  /* filtrado */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return empleados.filter((e) => {
      const matchSearch = !q || e.nombre.toLowerCase().includes(q) || e.area.toLowerCase().includes(q) || e.puesto.toLowerCase().includes(q);
      const matchArea   = areaFilter === "Todas" || e.area === areaFilter;
      const matchRiesgo = riesgoFilter === "Todos" || e.riesgo === riesgoFilter || (!e.riesgo && riesgoFilter === "Sin evaluación");
      return matchSearch && matchArea && matchRiesgo;
    });
  }, [empleados, search, areaFilter, riesgoFilter]);

  /* paginación */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPage() { setPage(1); }


  return (
    <div className="flex flex-col h-full" onClick={() => { setShowAreaMenu(false); setShowRiesgoMenu(false); }}>
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEvaluator ? "Empleados" : "Gestión de Empleados"}
          </h1>
          <p className="text-muted-fg text-sm mt-0.5">
            {isEvaluator
              ? "Empleados disponibles para asignar en evaluaciones"
              : "Administra los empleados y monitorea su nivel de riesgo ergonómico"}
          </p>
        </div>
        {!isEvaluator && (
          <button
            onClick={() => setModal({ mode: "crear" })}
            className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Nuevo Empleado
          </button>
        )}
      </div>

      <div className="flex-1 px-8 py-5 flex flex-col gap-4 overflow-y-auto">
        {error && (
          <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl px-5 py-4">
              <p className="text-muted-fg text-xs mb-1">{s.label}</p>
              {loading
                ? <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                : <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
              }
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              type="text"
              placeholder="Buscar empleado…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>

          {/* Área dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowAreaMenu((v) => !v); setShowRiesgoMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors"
            >
              {areaFilter === "Todas" ? "Filtrar por Área" : areaFilter}
              <ChevronDown size={14} className="text-muted-fg" />
            </button>
            {showAreaMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-40 max-h-56 overflow-y-auto">
                {areas.map((a) => (
                  <button key={a} onClick={() => { setAreaFilter(a); setShowAreaMenu(false); resetPage(); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-background transition-colors ${areaFilter === a ? "text-primary font-medium" : "text-foreground"}`}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Riesgo dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowRiesgoMenu((v) => !v); setShowAreaMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors"
            >
              {riesgoFilter === "Todos" ? "Nivel de Riesgo" : riesgoFilter}
              <ChevronDown size={14} className="text-muted-fg" />
            </button>
            {showRiesgoMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-40">
                {RISK_OPTIONS.map((r) => (
                  <button key={r} onClick={() => { setRiesgoFilter(r); setShowRiesgoMenu(false); resetPage(); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-background transition-colors ${riesgoFilter === r ? "text-primary font-medium" : "text-foreground"}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(search || areaFilter !== "Todas" || riesgoFilter !== "Todos") && (
            <button onClick={() => { setSearch(""); setAreaFilter("Todas"); setRiesgoFilter("Todos"); resetPage(); }}
              className="text-xs text-muted-fg hover:text-foreground transition-colors flex items-center gap-1">
              <X size={12} /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empleado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Área</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Puesto</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Riesgo ROSA</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Última Eval.</th>
                {!isEvaluator && <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: isEvaluator ? 5 : 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse" style={{ width: j === 0 ? "140px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={isEvaluator ? 5 : 6} className="px-6 py-12 text-center text-muted-fg text-sm">
                    {filtered.length === 0 && empleados.length > 0
                      ? "Sin resultados para los filtros aplicados."
                      : "No hay empleados registrados."}
                  </td>
                </tr>
              ) : (
                paginated.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar nombre={e.nombre} />
                        <p className="font-medium text-foreground">{e.nombre}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted-fg">{e.area}</td>
                    <td className="px-6 py-3 text-foreground">{e.puesto}</td>
                    <td className="px-6 py-3">
                      {e.riesgo ? (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${RISK_BADGE[e.riesgo]}`}>
                          {e.riesgo}{e.score ? ` (${e.score})` : ""}
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-fg">
                          Sin evaluación
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-muted-fg">{e.ultimaEval ?? "—"}</td>
                    {!isEvaluator && (
                      <td className="px-6 py-3">
                        <button
                          onClick={() => setModal({ mode: "editar", empleado: e })}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors"
                          title="Editar"
                        >
                          <Pencil size={12} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-border flex items-center justify-between">
            <span className="text-muted-fg text-xs">
              {loading
                ? "Cargando…"
                : `Mostrando ${paginated.length} de ${filtered.length} empleado${filtered.length !== 1 ? "s" : ""}`}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-sm text-foreground font-medium hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-xs text-muted-fg">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-sm text-foreground font-medium hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal crear/editar */}
      {modal && (
        <EmpleadoModal
          empleado={modal.mode === "editar" ? modal.empleado : null}
          onClose={() => setModal(null)}
          onGuardar={(data) =>
            modal.mode === "editar"
              ? handleActualizar(modal.empleado.id, data)
              : handleCrear(data)
          }
        />
      )}

      {/* Modal confirmación */}
      {dialog && (
        <ConfirmModal {...dialog} onClose={() => setDialog(null)} />
      )}
    </div>
  );
}