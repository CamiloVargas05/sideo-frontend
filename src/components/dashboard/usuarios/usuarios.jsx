"use client";

import { useState, useMemo } from "react";
import { showToast } from "nextjs-toast-notify";
import { Plus, Search, Pencil, UserX, UserCheck, KeyRound, X, ChevronDown } from "lucide-react";
import { useUsuarios } from "@/hooks/dashboard/usuarios/useUsuarios";
import ConfirmModal from "@/components/ui/confirmModal";

/* ─── constantes ─────────────────────────────────────────── */
const ROL_BADGE = {
  Administrador: "bg-info-bg text-info-fg",
  Evaluador:     "bg-warning-bg text-warning-fg",
  "Super Admin": "bg-secondary text-secondary-fg",
};
const ESTADO_BADGE = {
  Activo:   "bg-success-bg text-success-fg",
  Inactivo: "bg-border text-muted-fg",
};
const ROL_OPTIONS    = ["Todos", "Administrador", "Evaluador"];
const ESTADO_OPTIONS = ["Todos", "Activo", "Inactivo"];
const PAGE_SIZE      = 10;

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", position: "" };

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
function UsuarioModal({ usuario, onClose, onGuardar }) {
  const isEditing = Boolean(usuario);
  const [form, setForm] = useState(
    isEditing
      ? { firstName: usuario.firstName, lastName: usuario.lastName, email: usuario.email, phone: usuario.phone, position: usuario.position }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || (!isEditing && !form.email.trim())) {
      setFormError("Nombre, apellido" + (!isEditing ? " y correo son obligatorios." : " son obligatorios."));
      return;
    }
    setSaving(true);
    setFormError("");

    const payload = {
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
      // email solo al crear — PATCH /users/:id no lo acepta
      ...(!isEditing && form.email.trim() && { email: form.email.trim() }),
      ...(form.phone.trim()    && { phone:    form.phone.trim() }),
      ...(form.position.trim() && { position: form.position.trim() }),
    };

    const res = await onGuardar(payload);
    setSaving(false);
    if (res.ok) {
      showToast.success(isEditing ? "Usuario actualizado." : "Evaluador creado.", { position: "top-right", duration: 3000 });
      onClose();
    } else {
      setFormError(res.error ?? "Ocurrió un error. Intenta de nuevo.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isEditing ? "Editar Usuario" : "Nuevo Evaluador"}
            </h2>
            {!isEditing && (
              <p className="text-xs text-muted-fg mt-0.5">Se le enviará un correo con sus credenciales de acceso</p>
            )}
          </div>
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Correo electrónico {!isEditing && "*"}
            </label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              disabled={isEditing}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" />
            {isEditing && <p className="text-xs text-muted-fg">El correo no se puede modificar.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Cargo</label>
              <input name="position" value={form.position} onChange={handleChange} placeholder="Evaluador ergonómico"
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
              {saving ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear evaluador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── componente principal ───────────────────────────────── */
export default function Usuarios() {
  const {
    usuarios, loading, error,
    handleCrearEvaluador, handleActualizar,
    handleDesactivar, handleReactivar, handleResetPassword,
  } = useUsuarios();

  const [modal, setModal]             = useState(null);
  const [dialog, setDialog]           = useState(null);
  const [search, setSearch]           = useState("");
  const [rolFilter, setRolFilter]     = useState("Todos");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [showRolMenu, setShowRolMenu]       = useState(false);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);
  const [page, setPage]               = useState(1);

  /* filtrado */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return usuarios.filter((u) => {
      const matchSearch = !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.position.toLowerCase().includes(q);
      const matchRol    = rolFilter === "Todos"    || u.rol    === rolFilter;
      const matchEstado = estadoFilter === "Todos" || u.estado === estadoFilter;
      return matchSearch && matchRol && matchEstado;
    });
  }, [usuarios, search, rolFilter, estadoFilter]);

  /* paginación */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPage() { setPage(1); }

  function confirmarDesactivar(u) {
    setDialog({
      title:        `¿Desactivar a ${u.nombre}?`,
      message:      "Dejará de tener acceso a la plataforma.",
      variant:      "warning",
      confirmLabel: "Desactivar",
      onConfirm:    async () => {
        const res = await handleDesactivar(u.id);
        showToast[res.ok ? "success" : "error"](
          res.ok ? "Usuario desactivado." : (res.error ?? "No se pudo desactivar."),
          { position: "top-right", duration: 4000 }
        );
      },
    });
  }

  function confirmarReactivar(u) {
    setDialog({
      title:        `¿Activar a ${u.nombre}?`,
      message:      "Recuperará acceso a la plataforma.",
      variant:      "info",
      confirmLabel: "Activar",
      onConfirm:    async () => {
        const res = await handleReactivar(u.id);
        showToast[res.ok ? "success" : "error"](
          res.ok ? "Usuario reactivado." : (res.error ?? "No se pudo reactivar."),
          { position: "top-right", duration: 4000 }
        );
      },
    });
  }

  function confirmarResetPassword(u) {
    setDialog({
      title:        `¿Restablecer contraseña de ${u.nombre}?`,
      message:      "Se le enviará un correo con instrucciones para crear una nueva contraseña.",
      variant:      "info",
      confirmLabel: "Enviar correo",
      onConfirm:    async () => {
        const res = await handleResetPassword(u.id);
        showToast[res.ok ? "success" : "error"](
          res.ok ? "Correo enviado correctamente." : "No se pudo enviar el correo.",
          { position: "top-right", duration: 3000 }
        );
      },
    });
  }

  return (
    <div className="flex flex-col h-full" onClick={() => { setShowRolMenu(false); setShowEstadoMenu(false); }}>
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-fg text-sm mt-0.5">Administra los evaluadores y sus accesos a la plataforma</p>
        </div>
        <button
          onClick={() => setModal({ mode: "crear" })}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nuevo Evaluador
        </button>
      </div>

      <div className="flex-1 px-8 py-5 flex flex-col gap-4 overflow-y-auto">
        {error && (
          <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              type="text"
              placeholder="Buscar usuario…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>

          {/* Rol dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowRolMenu((v) => !v); setShowEstadoMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors"
            >
              {rolFilter === "Todos" ? "Filtrar por Rol" : rolFilter}
              <ChevronDown size={14} className="text-muted-fg" />
            </button>
            {showRolMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-40">
                {ROL_OPTIONS.map((r) => (
                  <button key={r} onClick={() => { setRolFilter(r); setShowRolMenu(false); resetPage(); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-background transition-colors ${rolFilter === r ? "text-primary font-medium" : "text-foreground"}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Estado dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowEstadoMenu((v) => !v); setShowRolMenu(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors"
            >
              {estadoFilter === "Todos" ? "Filtrar por Estado" : estadoFilter}
              <ChevronDown size={14} className="text-muted-fg" />
            </button>
            {showEstadoMenu && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-card border border-border rounded-xl shadow-lg py-1 min-w-40">
                {ESTADO_OPTIONS.map((s) => (
                  <button key={s} onClick={() => { setEstadoFilter(s); setShowEstadoMenu(false); resetPage(); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-background transition-colors ${estadoFilter === s ? "text-primary font-medium" : "text-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(search || rolFilter !== "Todos" || estadoFilter !== "Todos") && (
            <button onClick={() => { setSearch(""); setRolFilter("Todos"); setEstadoFilter("Todos"); resetPage(); }}
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
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Usuario</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Correo</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Cargo</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Rol</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse" style={{ width: j === 0 ? "140px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-fg text-sm">
                    {filtered.length === 0 && usuarios.length > 0
                      ? "Sin resultados para los filtros aplicados."
                      : "No hay usuarios registrados."}
                  </td>
                </tr>
              ) : (
                paginated.map((u) => (
                  <tr key={u.id} className={`border-b border-border last:border-0 hover:bg-background transition-colors ${!u.isActive ? "opacity-50" : ""}`}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar nombre={u.nombre} />
                        <span className="font-medium text-foreground">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted-fg">{u.email}</td>
                    <td className="px-6 py-3 text-foreground">{u.position || "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ROL_BADGE[u.rol] ?? "bg-muted text-muted-fg"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_BADGE[u.estado]}`}>
                        {u.estado}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModal({ mode: "editar", usuario: u })}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors"
                          title="Editar"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => confirmarResetPassword(u)}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-warning-fg hover:border-warning-fg transition-colors"
                          title="Restablecer contraseña"
                        >
                          <KeyRound size={12} />
                        </button>
                        {u.isActive ? (
                          <button
                            onClick={() => confirmarDesactivar(u)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-danger-fg hover:border-danger-fg transition-colors"
                            title="Desactivar"
                          >
                            <UserX size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => confirmarReactivar(u)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-success-fg hover:border-success-fg transition-colors"
                            title="Reactivar"
                          >
                            <UserCheck size={12} />
                          </button>
                        )}
                      </div>
                    </td>
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
                : `Mostrando ${paginated.length} de ${filtered.length} usuario${filtered.length !== 1 ? "s" : ""}`}
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
        <UsuarioModal
          usuario={modal.mode === "editar" ? modal.usuario : null}
          onClose={() => setModal(null)}
          onGuardar={(data) =>
            modal.mode === "editar"
              ? handleActualizar(modal.usuario.id, data)
              : handleCrearEvaluador(data)
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