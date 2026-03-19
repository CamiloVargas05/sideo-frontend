"use client";

import { useState } from "react";
import { showToast } from "nextjs-toast-notify";
import { Sun, Moon, CheckCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useConfiguracion } from "@/hooks/dashboard/configuracion/useConfiguracion";

/* ── Toggle switch ── */
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-border"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-4" : ""}`}
      />
    </button>
  );
}

/* ── Input de contraseña con toggle de visibilidad ── */
function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-border rounded-xl px-3 py-2 pr-10 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg hover:text-foreground transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

/* ── Badge de estado de suscripción ── */
function StatusBadge({ status }) {
  const map = {
    active:    { label: "Activo",    cls: "bg-success-bg text-success-fg" },
    inactive:  { label: "Inactivo",  cls: "bg-border text-muted-fg" },
    cancelled: { label: "Cancelado", cls: "bg-danger-bg text-danger-fg" },
  };
  const s = map[status] ?? map.inactive;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

/* ── Skeleton de carga para el plan ── */
function PlanSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-24 bg-border rounded" />
      <div className="h-4 w-16 bg-border rounded" />
      <div className="flex flex-col gap-2 mt-1">
        {[1, 2, 3].map((i) => <div key={i} className="h-3 w-full bg-border rounded" />)}
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export default function Configuracion() {
  const {
    user, profileForm, profileDirty,
    passwordForm, passwordError,
    isDark, toggleDark,
    subscription, loadingSubscription, planInfo, subStatus, subExpiresAt,
    loadingProfile, loadingPassword,
    initials, roleLabel,
    setProfileField, resetProfile,
    setPasswordField,
    handleGuardarPerfil, handleCambiarContrasena,
  } = useConfiguracion();

  const onGuardarPerfil = async () => {
    const result = await handleGuardarPerfil();
    showToast[result.ok ? "success" : "error"](
      result.ok ? "Perfil actualizado correctamente." : "No se pudo actualizar el perfil.",
      { position: "top-right", transition: "bounceIn", duration: 3000 }
    );
  };

  const onCambiarContrasena = async () => {
    const result = await handleCambiarContrasena();
    if (result.ok) {
      showToast.success("Contraseña cambiada correctamente.", {
        position: "top-right", transition: "bounceIn", duration: 3000,
      });
    }
  };

  const fullName = [profileForm.firstName, profileForm.lastName].filter(Boolean).join(" ") || user?.email || "—";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 bg-card border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-fg text-sm mt-0.5">Gestiona tu perfil, seguridad y preferencias de la plataforma</p>
      </div>

      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="flex gap-6 max-w-5xl">

          {/* ── Columna izquierda ── */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* Perfil */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
              {/* Avatar + info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-fg font-bold text-lg">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{fullName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {roleLabel}
                    </span>
                    <span className="text-muted-fg text-sm truncate">{user?.email ?? ""}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Formulario de perfil */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={profileForm.firstName}
                    onChange={setProfileField("firstName")}
                    className="border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Apellido</label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={profileForm.lastName}
                    onChange={setProfileField("lastName")}
                    className="border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={profileForm.phone}
                    onChange={setProfileField("phone")}
                    className="border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Cargo</label>
                  <input
                    type="text"
                    placeholder="Jefe de SST"
                    value={profileForm.position}
                    onChange={setProfileField("position")}
                    className="border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
              </div>

              {/* Email (solo lectura) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted-fg">Correo electrónico</label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="border border-border rounded-xl px-3 py-2 text-sm bg-secondary/30 text-muted-fg cursor-not-allowed"
                />
                <p className="text-xs text-muted-fg">El correo no puede modificarse desde aquí.</p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetProfile}
                  disabled={!profileDirty}
                  className="px-4 py-2 border border-border rounded-xl text-sm text-foreground hover:bg-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onGuardarPerfil}
                  disabled={!profileDirty || loadingProfile}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-fg rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProfile ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Guardando...
                    </>
                  ) : "Guardar Cambios"}
                </button>
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="font-semibold text-foreground">Seguridad</h2>
                <p className="text-muted-fg text-sm">Cambia tu contraseña de acceso</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Contraseña Actual</label>
                  <PasswordInput
                    placeholder="········"
                    value={passwordForm.currentPassword}
                    onChange={setPasswordField("currentPassword")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Nueva Contraseña</label>
                  <PasswordInput
                    placeholder="········"
                    value={passwordForm.newPassword}
                    onChange={setPasswordField("newPassword")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Confirmar Contraseña</label>
                  <PasswordInput
                    placeholder="········"
                    value={passwordForm.confirmPassword}
                    onChange={setPasswordField("confirmPassword")}
                  />
                </div>
              </div>

              {/* Error de contraseña */}
              {passwordError && (
                <div className="flex items-center gap-2 bg-danger-bg text-danger-fg text-sm px-3 py-2 rounded-xl border border-danger-fg/20">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  {passwordError}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-fg">Mínimo 8 caracteres con mayúsculas, minúsculas y números.</p>
                <button
                  type="button"
                  onClick={onCambiarContrasena}
                  disabled={loadingPassword}
                  className="flex items-center gap-2 shrink-0 px-5 py-2 bg-primary text-primary-fg rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPassword ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Cambiando...
                    </>
                  ) : "Cambiar Contraseña"}
                </button>
              </div>
            </div>
          </div>

          {/* ── Columna derecha ── */}
          <div className="w-64 flex flex-col gap-5 shrink-0">

            {/* Preferencias (solo tema) */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <h2 className="font-semibold text-foreground">Preferencias</h2>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    {isDark ? <Moon size={14} /> : <Sun size={14} />}
                    Modo Oscuro
                  </p>
                  <p className="text-muted-fg text-xs mt-0.5">Cambiar apariencia visual</p>
                </div>
                <ToggleSwitch checked={isDark} onChange={toggleDark} />
              </div>
            </div>

            {/* Plan */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <h2 className="font-semibold text-foreground">Plan Actual</h2>

              {loadingSubscription ? (
                <PlanSkeleton />
              ) : planInfo ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-primary font-bold text-lg">{planInfo.name}</p>
                    <StatusBadge status={subStatus ?? "active"} />
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-muted-fg">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-muted-fg shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Hasta {planInfo.employeeLimit} empleados
                    </span>
                    {subExpiresAt && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-muted-fg shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Vence: {new Date(subExpiresAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>

                  <ul className="flex flex-col gap-1.5">
                    {planInfo.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle size={13} className="text-success-fg shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                /* sin suscripción cargada */
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-fg">No se pudo cargar la información del plan.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => showToast.info("Redirigiendo a cambio de plan...", { position: "top-right", transition: "bounceIn", duration: 3000 })}
                className="w-full flex items-center justify-center gap-2 border border-border text-foreground text-sm font-medium py-2 rounded-xl hover:bg-background transition-colors"
              >
                <RefreshCw size={14} /> Cambiar Plan
              </button>
            </div>

            {/* Info de empresa (solo lectura) */}
            {user?.companyName && (
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
                <h2 className="font-semibold text-foreground">Empresa</h2>
                <div className="flex flex-col gap-1.5 text-sm">
                  <p className="font-medium text-foreground truncate">{user.companyName}</p>
                  {user.nit && <p className="text-muted-fg">NIT: {user.nit}</p>}
                  {user.companySector && <p className="text-muted-fg">{user.companySector}</p>}
                  {user.companyAddress && <p className="text-muted-fg text-xs">{user.companyAddress}</p>}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
