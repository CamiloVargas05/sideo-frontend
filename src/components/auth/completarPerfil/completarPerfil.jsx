"use client";

import { useState } from "react";
import { useCompletarPerfil } from "@/hooks/auth/completarPerfil/useCompletarPerfil";

export default function CompletarPerfil() {
  const { form, setField, initials, loading, error, handleSubmit, router } = useCompletarPerfil();

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#081736] via-[#123a7c] to-[#2a66bf] dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 px-4 py-10 md:px-8 md:py-12 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(186,220,255,0.24),transparent_34%)] dark:bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.03),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(100,150,255,0.06),transparent_34%)] opacity-85" />
      <div className="pointer-events-none absolute inset-0 dark:opacity-30 opacity-80">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#4b86eb]/35 dark:bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-[#2f5ca7]/45 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-[#7eb1ff]/30 dark:bg-blue-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-4xl bg-card/90 dark:bg-slate-800 shadow-[0_36px_90px_-38px_rgba(6,22,54,0.75)] dark:shadow-[0_36px_90px_-38px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="border-b border-primary/20 dark:border-blue-500/20 bg-linear-to-r from-[#0d2f6a] via-[#1d4d9c] to-[#2e6ec0] dark:from-slate-700 dark:via-slate-700 dark:to-slate-600 px-6 py-7 md:px-10 md:py-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 dark:border-blue-400/40 bg-primary/20 dark:bg-blue-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-50 dark:text-blue-200">
            Primer inicio
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-slate-50 md:text-4xl">Completar perfil</h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100/90 dark:text-slate-300 md:text-base">
                Antes de continuar, necesitamos validar la información del administrador y de la empresa.
              </p>
            </div>
            <div className="w-full max-w-60 rounded-xl border border-blue-200/25 dark:border-slate-600 bg-blue-100/10 dark:bg-slate-700/40 p-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100/95 dark:text-slate-300">Resumen rapido</p>
              <p className="mt-1.5 text-[11px] leading-4 text-blue-50 dark:text-slate-400">Completa 7 campos obligatorios.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/20 dark:bg-slate-600 px-2 py-0.5 text-[10px] font-medium text-blue-50 dark:text-slate-300">Administrador</span>
                <span className="rounded-full bg-white/20 dark:bg-slate-600 px-2 py-0.5 text-[10px] font-medium text-blue-50 dark:text-slate-300">Empresa</span>
                <span className="rounded-full bg-white/20 dark:bg-slate-600 px-2 py-0.5 text-[10px] font-medium text-blue-50 dark:text-slate-300">Seguridad</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 p-6 md:p-10 lg:grid-cols-3" noValidate>
          <section className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-border/70 dark:border-slate-700 bg-white/70 dark:bg-slate-700/50 p-5 shadow-[0_16px_38px_-32px_rgba(15,42,99,0.9)] dark:shadow-[0_16px_38px_-32px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground dark:text-slate-100">Datos personales</h2>
                <span className="rounded-lg bg-primary/10 dark:bg-blue-500/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary dark:text-blue-300">
                  Requerido
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" value={form.firstName} onChange={setField("firstName")} required />
                <Field label="Apellido" value={form.lastName} onChange={setField("lastName")} required />
                <Field label="Teléfono" value={form.phone} onChange={setField("phone")} required />
                <Field label="Cargo" value={form.position} onChange={setField("position")} required />
                <Field
                  label="Nueva contraseña"
                  type="password"
                  value={form.newPassword}
                  onChange={setField("newPassword")}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 dark:border-slate-700 bg-white/70 dark:bg-slate-700/50 p-5 shadow-[0_16px_38px_-32px_rgba(15,42,99,0.9)] dark:shadow-[0_16px_38px_-32px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground dark:text-slate-100">Datos de empresa</h2>
                <span className="rounded-lg bg-info-bg dark:bg-cyan-500/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-info-fg dark:text-cyan-300">
                  Organización
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Dirección"
                  value={form.companyAddress}
                  onChange={setField("companyAddress")}
                  required
                  className="sm:col-span-2"
                />
                <Field label="Sector" value={form.companySector} onChange={setField("companySector")} required />
                <Field
                  label="URL del logo"
                  value={form.logoUrl}
                  onChange={setField("logoUrl")}
                  placeholder="https://empresa.com/logo.jpg"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-danger-fg/20 dark:border-red-500/30 bg-danger-bg dark:bg-red-950/30 px-4 py-3 text-sm text-danger-fg dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="rounded-xl border border-border dark:border-slate-700 bg-card dark:bg-slate-700 px-5 py-2.5 text-sm font-medium text-foreground dark:text-slate-100 transition-colors hover:bg-background dark:hover:bg-slate-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-linear-to-r from-[#163f8f] to-[#2b67c7] dark:from-blue-700 dark:to-blue-600 px-5 py-2.5 text-sm font-semibold text-primary-fg dark:text-blue-100 shadow-[0_16px_30px_-16px_rgba(18,61,138,1)] dark:shadow-[0_16px_30px_-16px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:brightness-110 dark:hover:brightness-125 disabled:translate-y-0 disabled:brightness-90 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Completar y continuar"}
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-border/70 dark:border-slate-700 bg-white/75 dark:bg-slate-700/50 p-5 shadow-[0_16px_38px_-32px_rgba(15,42,99,0.9)] dark:shadow-[0_16px_38px_-32px_rgba(0,0,0,0.4)] backdrop-blur-sm lg:sticky lg:top-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground dark:text-slate-100">Vista previa</h3>
            <p className="mt-1 text-xs text-muted-fg dark:text-slate-400">Así se visualizará tu información en el panel.</p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-blue-600 text-sm font-bold text-primary-fg dark:text-blue-100 shadow-md shadow-primary/25 dark:shadow-blue-600/25">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground dark:text-slate-100 truncate">{`${form.firstName} ${form.lastName}`.trim()}</p>
                <p className="text-muted-fg dark:text-slate-400 text-xs truncate">{form.position || "Cargo pendiente"}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border dark:border-slate-600 bg-card dark:bg-slate-600/30 p-3">
              <p className="text-xs text-muted-fg dark:text-slate-400">Empresa</p>
              <p className="mt-1 text-sm text-foreground dark:text-slate-100">{form.companySector || "Sector pendiente"}</p>
              <p className="mt-1 text-xs text-muted-fg dark:text-slate-400">{form.companyAddress || "Dirección pendiente"}</p>
            </div>
            {form.logoUrl ? (
              <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl border border-border dark:border-slate-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.logoUrl}
                  alt="Logo de la empresa"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-border dark:border-slate-600 text-xs text-muted-fg dark:text-slate-400">
                Sin logo configurado
              </div>
            )}

            <div className="mt-4 rounded-xl border border-[#2b67c7]/20 dark:border-blue-500/30 bg-linear-to-br from-[#e8f1ff] to-[#dbe9ff] dark:from-slate-700/50 dark:to-slate-700/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-blue-300">Tip de seguridad</p>
              <p className="mt-1 text-xs text-muted-fg dark:text-slate-300">
                Usa una contraseña de al menos 8 caracteres con letras, números y símbolos.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required, minLength, className = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-foreground dark:text-slate-300">
        {label}
        {required ? <span className="text-danger-fg dark:text-red-400"> *</span> : null}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`w-full rounded-xl border border-border dark:border-slate-600 bg-white/95 dark:bg-slate-800 px-3 py-2.5 text-sm text-foreground dark:text-slate-100 placeholder:text-muted-fg dark:placeholder:text-slate-500 transition-all hover:border-primary/35 dark:hover:border-blue-500/35 focus:border-primary/70 dark:focus:border-blue-400/70 focus:outline-none focus:ring-4 focus:ring-primary/15 dark:focus:ring-blue-500/15 ${isPasswordField ? "pr-10" : ""}`}
        />
        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg dark:text-slate-500 transition-colors hover:text-foreground dark:hover:text-slate-300"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {isPasswordField ? <p className="text-xs text-muted-fg dark:text-slate-400">Mínimo 8 caracteres.</p> : null}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}
