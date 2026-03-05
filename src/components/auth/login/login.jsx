"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

/* ── Ilustración ergonómica SVG ── */
function ErgonomicIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
      {/* Monitor */}
      <rect x="28" y="28" width="52" height="36" rx="4" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1.5"/>
      <rect x="32" y="32" width="44" height="26" rx="2" fill="#0f2147"/>
      {/* Pantalla: gráfico de barras */}
      <rect x="36" y="50" width="5" height="6" rx="1" fill="#3b82f6" opacity="0.8"/>
      <rect x="43" y="44" width="5" height="12" rx="1" fill="#6366f1" opacity="0.9"/>
      <rect x="50" y="47" width="5" height="9" rx="1" fill="#3b82f6" opacity="0.8"/>
      <rect x="57" y="40" width="5" height="16" rx="1" fill="#818cf8"/>
      <rect x="64" y="46" width="5" height="10" rx="1" fill="#3b82f6" opacity="0.7"/>
      {/* Pie monitor */}
      <rect x="48" y="64" width="12" height="4" rx="1" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1"/>
      <rect x="42" y="68" width="24" height="2" rx="1" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1"/>
      {/* Persona sentada */}
      <circle cx="90" cy="52" r="6" fill="#93c5fd"/>
      {/* Torso */}
      <path d="M84 58 C83 60 82 65 83 70 L97 70 C98 65 97 60 96 58 C94 56 86 56 84 58Z" fill="#2563eb"/>
      {/* Brazo sobre escritorio */}
      <path d="M83 63 L74 66" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M97 63 L97 68" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Piernas */}
      <path d="M85 70 L83 82" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
      <path d="M95 70 L97 82" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
      <path d="M83 82 L78 84" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M97 82 L102 84" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Silla */}
      <rect x="80" y="71" width="20" height="3" rx="1.5" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1"/>
      <rect x="98" y="58" width="2" height="16" rx="1" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="0.8"/>
      {/* Escritorio */}
      <rect x="18" y="84" width="72" height="3" rx="1.5" fill="#1e3a6e" stroke="#3b82f6" strokeWidth="1"/>
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Credenciales inválidas. Intente nuevamente.");
        return;
      }

      // Persistir token según "Recordar sesión"
      if (remember) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch {
      setError("No se pudo conectar con el servidor. Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo (marketing) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-sidebar via-sidebar-accent/90 to-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Fondos decorativos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.07),transparent_60%)] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 top-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/15 border border-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SIDEO</span>
        </div>

        {/* Texto central */}
        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-snug">
            Gestione la salud ocupacional de su empresa con precisión.
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-sm">
            Evalúe riesgos ergonómicos, genere reportes profesionales y cumpla con la normativa SST vigente.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-10 border-t border-white/10 pt-8">
          {[
            { value: "200+", label: "Empresas" },
            { value: "15K+", label: "Evaluaciones" },
            { value: "99.9%", label: "Disponibilidad" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-white font-black text-2xl leading-none">{s.value}</span>
              <span className="text-white/45 text-[10px] tracking-widest uppercase font-semibold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background relative">
        {/* Botón volver */}
        <Link href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-muted-fg hover:text-foreground text-sm font-medium transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver
        </Link>

        <div className="w-full max-w-md flex flex-col gap-8">

          {/* Ilustración + marca */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-secondary/40 border border-border rounded-2xl p-4">
              <ErgonomicIllustration />
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight mt-1">SIDEO</h1>
          </div>

          {/* Encabezado */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-muted-fg text-sm">Ingrese sus credenciales para acceder a la plataforma.</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-secondary/40 text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-secondary/40 text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Recordar + olvidé */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-fg">Recordar sesión</span>
              </label>
              <Link href="/auth/olvide-contrasena" className="text-sm text-primary hover:underline font-medium">
                ¿Olvidó su contraseña?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-danger-bg text-danger-fg text-sm px-4 py-3 rounded-xl border border-danger-fg/20">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-fg font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

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
