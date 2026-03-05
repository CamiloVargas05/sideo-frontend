"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export default function OlvideContrasena() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.message ?? "No se pudo procesar la solicitud.");
        return;
      }
      setSent(true);
    } catch {
      setError("No se pudo conectar con el servidor. Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-sidebar via-sidebar-accent/90 to-primary flex-col justify-between p-12 relative overflow-hidden">
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

        {/* Texto */}
        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-snug">
            Recupere el acceso a su cuenta de forma segura.
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-sm">
            Le enviaremos un correo con las instrucciones para restablecer su contraseña en menos de 2 minutos.
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "Enlace seguro de un solo uso",
              "Expira en 30 minutos",
              "Sin necesidad de contactar soporte",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-white/40 text-xs">¿Necesita ayuda adicional? Contacte a soporte@sideo.app</p>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background relative">

        {/* Botón volver */}
        <Link href="/auth/login"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-muted-fg hover:text-foreground text-sm font-medium transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Link>

        <div className="w-full max-w-md flex flex-col gap-8">

          {!sent ? (
            <>
              {/* Ícono */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-secondary/50 border border-border rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-center flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-foreground">¿Olvidó su contraseña?</h2>
                  <p className="text-muted-fg text-sm">Ingrese su correo y le enviaremos las instrucciones.</p>
                </div>
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

              {/* Form */}
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground" htmlFor="email">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-secondary/40 text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  />
                </div>

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
                  {loading ? "Enviando..." : "Enviar instrucciones"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-fg">
                ¿Recuerda su contraseña?{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </>
          ) : (
            /* ── Estado: correo enviado ── */
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 bg-success-bg border border-success-fg/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-success-fg" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-foreground">Revise su correo</h2>
                <p className="text-muted-fg text-sm leading-relaxed max-w-sm">
                  Enviamos las instrucciones a{" "}
                  <span className="font-semibold text-foreground">{email}</span>.
                  El enlace expira en 30 minutos.
                </p>
              </div>
              <p className="text-muted-fg text-xs">
                ¿No llegó?{" "}
                <button onClick={() => setSent(false)} className="text-primary font-semibold hover:underline">
                  Reenviar
                </button>
              </p>
              <Link href="/auth/login"
                className="flex items-center gap-2 bg-primary text-primary-fg font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-primary/25">
                Volver al inicio de sesión
              </Link>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

