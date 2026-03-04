//import { redirect } from "next/navigation";

//export default function LandingPage() {
//  redirect("/dashboard");

import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="bg-sidebar px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-accent rounded-lg flex items-center justify-center">
            <span className="text-sidebar-fg font-bold text-lg">S</span>
          </div>
          <div>
            <p className="text-sidebar-fg font-bold text-xl leading-none">SIDEO</p>
            <p className="text-sidebar-fg/70 text-xs">Diagnóstico Ergonómico</p>
          </div>
        </div>
        <Link
          href="/auth/login"
          className="bg-primary-fg text-primary font-semibold px-5 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
        >
          Iniciar Sesión
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">
        <div className="max-w-2xl flex flex-col gap-4">
          <span className="inline-block mx-auto bg-info-bg text-info-fg text-xs font-semibold px-3 py-1 rounded-full w-fit">
            Sistema de Diagnóstico Ergonómico Ocupacional
          </span>
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            Gestiona la ergonomía de tu empresa con{" "}
            <span className="text-primary">SIDEO</span>
          </h1>
          <p className="text-muted-fg text-lg">
            Evalúa, diagnostica y mejora las condiciones ergonómicas de tus
            empleados con la metodología ROSA. Administra empresas, usuarios y
            reportes desde un solo lugar.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="bg-primary text-primary-fg font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Comenzar ahora
          </Link>
          <Link
            href="/auth/registro"
            className="bg-card text-foreground font-semibold px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            Registrarse
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mt-8">
          {[
            {
              icon: "🏢",
              title: "Gestión de Empresas",
              desc: "Administra múltiples empresas y sus suscripciones en un solo panel.",
            },
            {
              icon: "📋",
              title: "Evaluaciones ROSA",
              desc: "Realiza evaluaciones ergonómicas con la metodología ROSA de forma guiada.",
            },
            {
              icon: "📊",
              title: "Reportes y Análisis",
              desc: "Genera reportes detallados con niveles de riesgo y recomendaciones.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-xl p-6 text-left flex flex-col gap-3"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="text-muted-fg text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-fg text-sm border-t border-border">
        © {new Date().getFullYear()} SIDEO — Todos los derechos reservados.
      </footer>
    </div>
  );
}