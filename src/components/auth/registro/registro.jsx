"use client";

import Link from "next/link";
import { useRegistro } from "@/hooks/auth/registro/useRegistro";

/* ── Panel izquierdo ── */
function BrandPanel() {
  const features = [
    "Prueba gratuita 14 días",
    "Sin tarjeta de crédito al inicio",
    "Evaluaciones ergonómicas certificadas",
    "Soporte en español incluido",
  ];
  const stats = [
    { value: "200+", label: "Empresas" },
    { value: "15K+", label: "Evaluaciones" },
    { value: "99.9%", label: "Disponibilidad" },
  ];
  return (
    <div className="hidden lg:flex lg:w-[46%] bg-linear-to-br from-[#0f2147] via-[#1e3a8a] to-[#1d4ed8] flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none" />
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 top-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">SIDEO</span>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Empiece a proteger<br />a su equipo en<br />
            <span className="text-blue-300">minutos.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Registre su empresa y comience a realizar evaluaciones ergonómicas certificadas hoy mismo.
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-white/75 text-sm">
              <span className="w-5 h-5 rounded-full bg-blue-400/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-blue-300" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <span className="text-white font-black text-2xl leading-none">{s.value}</span>
            <span className="text-white/45 text-[10px] tracking-widest uppercase font-semibold">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PLANS = [
  {
    id: "plus",
    name: "Plus",
    price: "$49/mes",
    employees: "Hasta 10 empleados",
    accent: "from-blue-500 to-blue-700",
    border: "border-blue-500/40",
    ring: "ring-blue-500/20",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99/mes",
    employees: "Hasta 20 empleados",
    accent: "from-indigo-500 to-violet-500",
    border: "border-violet-500/60",
    ring: "ring-violet-500/20",
    popular: true,
  },
  {
    id: "max",
    name: "Max",
    price: "$249/mes",
    employees: "Hasta 50 empleados",
    accent: "from-amber-400 to-orange-500",
    border: "border-amber-400/40",
    ring: "ring-amber-400/20",
  },
];

const PAYMENT_METHODS = [
  { id: "tarjeta_credito", label: "Tarjeta de crédito" },
  { id: "tarjeta_debito", label: "Tarjeta de débito" },
  { id: "pse", label: "PSE" },
  { id: "transferencia", label: "Transferencia bancaria" },
];

const INPUT_CLS =
  "w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all";

const STEPS = ["Empresa", "Administrador", "Plan"];

export default function Registro() {
  const { step, form, set, error, loading, nextStep, prevStep, handleSubmit } = useRegistro();

  return (
    <div className="min-h-screen flex bg-background">

      <BrandPanel />

      {/* ── Panel derecho ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Botón volver */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-muted-fg hover:text-foreground text-sm font-medium transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>

        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">SIDEO</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
            <p className="text-muted-fg text-sm">Complete los datos para registrar su empresa.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${i < step ? "bg-primary text-primary-fg" : i === step ? "bg-primary text-primary-fg ring-4 ring-primary/20" : "bg-secondary text-muted-fg border border-border"}`}>
                    {i < step
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : i + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${i === step ? "text-foreground" : "text-muted-fg"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 bg-danger-bg text-danger-fg text-sm px-4 py-3 rounded-xl border border-danger-fg/20 mb-5"
              >
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* ── Paso 1: Empresa ── */}
            {step === 0 && (
              <form className="flex flex-col gap-4" onSubmit={nextStep} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Nombre de la empresa *</label>
                    <input required placeholder="Ingrese el nombre de su empresa" value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">NIT *</label>
                    <input required placeholder="Ingrese el NIT" value={form.nit}
                      inputMode="numeric" pattern="[0-9\-]+" title="Solo números y guión (ej: 900123456-1)"
                      onChange={(e) => set("nit", e.target.value.replace(/[^0-9-]/g, ""))} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Sector</label>
                    <input placeholder="Ingrese el sector" value={form.sector}
                      onChange={(e) => set("sector", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Ciudad</label>
                    <input placeholder="Ingrese la ciudad" value={form.city}
                      onChange={(e) => set("city", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Teléfono</label>
                    <input placeholder="Ingrese el teléfono" value={form.phone}
                      type="tel" inputMode="numeric" maxLength={15}
                      onChange={(e) => set("phone", e.target.value.replace(/[^0-9+]/g, ""))} className={INPUT_CLS} />
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-primary text-primary-fg font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-md shadow-primary/20 mt-1">
                  Continuar
                </button>
              </form>
            )}

            {/* ── Paso 2: Administrador ── */}
            {step === 1 && (
              <form className="flex flex-col gap-4" onSubmit={nextStep} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Nombre *</label>
                    <input required placeholder="Ingrese el nombre" value={form.adminFirstName}
                      onChange={(e) => set("adminFirstName", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Apellido *</label>
                    <input required placeholder="Ingrese el apellido" value={form.adminLastName}
                      onChange={(e) => set("adminLastName", e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Correo electrónico *</label>
                    <input required type="email" autoComplete="email" placeholder="Ingrese el correo" value={form.adminEmail}
                      onChange={(e) => set("adminEmail", e.target.value)} className={INPUT_CLS} />
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-info-bg border border-info-fg/20 text-info-fg rounded-xl px-4 py-3 text-xs">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recibirá sus credenciales de acceso en este correo al completar el registro.</span>
                </div>
                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={prevStep}
                    className="flex-1 border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-secondary/50 transition-all text-sm">
                    Atrás
                  </button>
                  <button type="submit"
                    className="flex-1 bg-primary text-primary-fg font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-md shadow-primary/20">
                    Continuar
                  </button>
                </div>
              </form>
            )}

            {/* ── Paso 3: Plan y pago ── */}
            {step === 2 && (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Selección de plan */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Seleccione su plan *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {PLANS.map((p) => (
                      <button key={p.id} type="button" onClick={() => set("plan", p.id)}
                        className={`relative flex flex-col items-center gap-1.5 border-2 rounded-xl px-3 py-3.5 transition-all cursor-pointer
                          ${form.plan === p.id ? `${p.border} ring-4 ${p.ring} bg-secondary/30` : "border-border hover:border-primary/30 bg-secondary/10"}`}>
                        {p.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest uppercase bg-violet-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                            Popular
                          </span>
                        )}
                        <span className={`text-xs font-black bg-linear-to-r ${p.accent} bg-clip-text text-transparent`}>{p.name}</span>
                        <span className="text-foreground font-bold text-sm leading-none">{p.price}</span>
                        <span className="text-muted-fg text-[10px] text-center leading-tight">{p.employees}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Método de pago */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground tracking-wide uppercase">Método de pago *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} type="button" onClick={() => set("paymentMethod", m.id)}
                        className={`border-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left
                          ${form.paymentMethod === m.id ? "border-primary/50 ring-4 ring-primary/10 bg-secondary/30 text-foreground" : "border-border hover:border-primary/30 text-muted-fg bg-secondary/10"}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={prevStep}
                    className="flex-1 border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-secondary/50 transition-all text-sm">
                    Atrás
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-primary text-primary-fg font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Registrando...
                      </>
                    ) : "Crear cuenta"}
                  </button>
                </div>
              </form>
            )}

          </div>

          <p className="text-center text-sm text-muted-fg">
            ¿Ya tiene cuenta?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
