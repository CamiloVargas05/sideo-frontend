"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";

/* ── Ícono: ojo abierto ── */
function IconEyeOpen() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

/* ── Ícono: ojo cerrado ── */
function IconEyeOff() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

/* ── Panel izquierdo: marca y estadísticas ── */
function BrandPanel() {
  const stats = [
    { value: "200+", label: "Empresas" },
    { value: "15K+", label: "Evaluaciones" },
    { value: "99.9%", label: "Disponibilidad" },
  ];

  const features = [
    "Evaluaciones ergonómicas ROSA ",
    "Reportes PDF automáticos",
    "Cumplimiento normativa SST vigente",
    "Gestión multiempresa centralizada",
  ];

  return (
    <div className="hidden lg:flex lg:w-[46%] bg-linear-to-br from-[#0f2147] via-[#1e3a8a] to-[#1d4ed8] flex-col justify-between p-12 relative overflow-hidden">
      {/* Decorativos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none" />
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 top-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">SIDEO</span>
      </div>

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Gestione la salud<br />ocupacional con<br />
            <span className="text-blue-300">precisión y confianza.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Plataforma integral de evaluación de riesgos ergonómicos para empresas comprometidas con el bienestar laboral.
          </p>
        </div>

        {/* Características */}
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

      {/* Estadísticas */}
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

/* ── Componente principal ── */
export default function Login() {
  const router = useRouter();
  const { apiUrl } = useApi();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data?.message)
          ? data.message[0]
          : (data?.message ?? "Credenciales inválidas. Intente nuevamente.");
        setError(msg);
        return;
      }

      // Persistir sesión
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir según estado del perfil
      if (!data.user?.profileCompleted) {
        router.push("/auth/completar-perfil");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("No se pudo conectar con el servidor. Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-background">

      <BrandPanel />

      {/* ── Panel derecho: formulario ── */}
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

        <div className="w-full max-w-105 flex flex-col gap-7">

          {/* Encabezado */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">SIDEO</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h1>
            <p className="text-muted-fg text-sm">Ingrese sus credenciales para acceder a la plataforma.</p>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

              {/* Campo: Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground tracking-wide uppercase" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Ingrese su correo"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                </div>
              </div>

              {/* Campo: Contraseña */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground tracking-wide uppercase" htmlFor="password">
                    Contraseña
                  </label>
                  <Link href="/auth/olvide-contrasena" className="text-xs text-primary hover:underline font-medium">
                    ¿Olvidó su contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border rounded-xl pl-10 pr-11 py-3 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-fg hover:text-foreground transition-colors"
                    aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPwd ? <IconEyeOff /> : <IconEyeOpen />}
                  </button>
                </div>
              </div>

              {/* Recordar sesión */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-fg">Mantener sesión iniciada</span>
              </label>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 bg-danger-bg text-danger-fg text-sm px-4 py-3 rounded-xl border border-danger-fg/20"
                >
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Botón enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-fg font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>

            </form>
          </div>

          {/* Pie */}
          <p className="text-center text-sm text-muted-fg">
            ¿No tiene cuenta?{" "}
            <Link href="/auth/registro" className="text-primary font-semibold hover:underline">
              Registre su empresa
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
