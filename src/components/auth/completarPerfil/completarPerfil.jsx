"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  phone: "",
  position: "",
  newPassword: "",
  companyAddress: "",
  companySector: "",
  logoUrl: "",
};

export default function CompletarPerfil() {
  const router = useRouter();
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initials = useMemo(() => {
    const f = form.firstName?.trim()?.charAt(0) ?? "";
    const l = form.lastName?.trim()?.charAt(0) ?? "";
    return `${f}${l}`.toUpperCase() || "US";
  }, [form.firstName, form.lastName]);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.phone || !form.position) {
      setError("Complete los datos personales obligatorios.");
      return;
    }

    if (!form.companyAddress || !form.companySector) {
      setError("Complete los datos de empresa obligatorios.");
      return;
    }

    if (!form.newPassword || form.newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");

      if (token) {
        const response = await fetch(`${API_URL}/auth/complete-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            position: form.position,
            newPassword: form.newPassword,
            companyAddress: form.companyAddress,
            companySector: form.companySector,
            logoUrl: form.logoUrl,
          }),
        });

        if (!response.ok) {
          let apiMessage = "No se pudo completar el perfil. Intente nuevamente.";
          try {
            const payload = await response.json();
            apiMessage = Array.isArray(payload?.message)
              ? payload.message[0]
              : payload?.message ?? apiMessage;
          } catch {
            // Sin cuerpo JSON, se usa el mensaje por defecto.
          }
          throw new Error(apiMessage);
        }
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...storedUser,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        position: form.position,
        companyAddress: form.companyAddress,
        companySector: form.companySector,
        logoUrl: form.logoUrl,
        profileCompleted: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Ocurrió un error al guardar el perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#081736] via-[#123a7c] to-[#2a66bf] px-4 py-10 md:px-8 md:py-12 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(186,220,255,0.24),transparent_34%)] opacity-85" />
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[#4b86eb]/35 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-[#2f5ca7]/45 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-[#7eb1ff]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-4xl bg-card/90 shadow-[0_36px_90px_-38px_rgba(6,22,54,0.75)] backdrop-blur-md">
        <div className="border-b border-primary/20 bg-linear-to-r from-[#0d2f6a] via-[#1d4d9c] to-[#2e6ec0] px-6 py-7 md:px-10 md:py-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-50">
            Primer inicio
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-4xl">Completar perfil</h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100/90 md:text-base">
                Antes de continuar, necesitamos validar la información del administrador y de la empresa.
              </p>
            </div>
            <div className="w-full max-w-60 rounded-xl border border-blue-200/25 bg-blue-100/10 p-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100/95">Resumen rapido</p>
              <p className="mt-1.5 text-[11px] leading-4 text-blue-50">Completa 7 campos obligatorios.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-blue-50">Administrador</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-blue-50">Empresa</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-blue-50">Seguridad</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 p-6 md:p-10 lg:grid-cols-3" noValidate>
          <section className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_38px_-32px_rgba(15,42,99,0.9)] backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">Datos personales</h2>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
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

            <div className="rounded-2xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_38px_-32px_rgba(15,42,99,0.9)] backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">Datos de empresa</h2>
                <span className="rounded-lg bg-info-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-info-fg">
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
              <div className="rounded-xl border border-danger-fg/20 bg-danger-bg px-4 py-3 text-sm text-danger-fg">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-linear-to-r from-[#163f8f] to-[#2b67c7] px-5 py-2.5 text-sm font-semibold text-primary-fg shadow-[0_16px_30px_-16px_rgba(18,61,138,1)] transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:translate-y-0 disabled:brightness-90 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Completar y continuar"}
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-border/70 bg-white/75 p-5 shadow-[0_16px_38px_-32px_rgba(15,42,99,0.9)] backdrop-blur-sm lg:sticky lg:top-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Vista previa</h3>
            <p className="mt-1 text-xs text-muted-fg">Así se visualizará tu información en el panel.</p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-fg shadow-md shadow-primary/25">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{`${form.firstName} ${form.lastName}`.trim()}</p>
                <p className="text-muted-fg text-xs truncate">{form.position || "Cargo pendiente"}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-fg">Empresa</p>
              <p className="mt-1 text-sm text-foreground">{form.companySector || "Sector pendiente"}</p>
              <p className="mt-1 text-xs text-muted-fg">{form.companyAddress || "Dirección pendiente"}</p>
            </div>
            {form.logoUrl ? (
              <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.logoUrl}
                  alt="Logo de la empresa"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-fg">
                Sin logo configurado
              </div>
            )}

            <div className="mt-4 rounded-xl border border-[#2b67c7]/20 bg-linear-to-br from-[#e8f1ff] to-[#dbe9ff] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Tip de seguridad</p>
              <p className="mt-1 text-xs text-muted-fg">
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
      <label className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-danger-fg"> *</span> : null}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`w-full rounded-xl border border-border bg-white/95 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-fg transition-all hover:border-primary/35 focus:border-primary/70 focus:outline-none focus:ring-4 focus:ring-primary/15 ${isPasswordField ? "pr-10" : ""}`}
        />
        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg transition-colors hover:text-foreground"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : null}
      </div>
      {isPasswordField ? <p className="text-xs text-muted-fg">Mínimo 8 caracteres.</p> : null}
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
