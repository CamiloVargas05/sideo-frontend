import Link from "next/link";
import ThemeToggle from "@/components/dashboard/themeToggle/themeToggle";

/* ─── Iconos SVG inline ──────────────────────────────────────────────────── */

function IconClipboard() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconDocument() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ─── Datos ──────────────────────────────────────────────────────────────── */

const BENEFITS = [
  {
    icon: <IconClipboard />,
    color: "bg-info-bg text-info-fg",
    title: "Evaluación Digital",
    desc: "Digitalice el método ROSA completo con formularios guiados y cálculo automático de puntaje.",
  },
  {
    icon: <IconChart />,
    color: "bg-warning-bg text-warning-fg",
    title: "Dashboard en Tiempo Real",
    desc: "Visualice indicadores de riesgo, áreas críticas y tendencias con gráficos interactivos.",
  },
  {
    icon: <IconDocument />,
    color: "bg-success-bg text-success-fg",
    title: "Reportes para Auditoría",
    desc: "Genere reportes PDF profesionales con firma digital, listos para inspecciones y auditorías.",
  },
  {
    icon: <IconShield />,
    color: "bg-danger-bg text-danger-fg",
    title: "Cumplimiento Normativo",
    desc: "Alineado con la normativa SST vigente, ISO 45001 y estándares internacionales de ergonomía.",
  },
];

const STEPS = [
  {
    num: "1",
    icon: <IconBuilding />,
    title: "Registre su Empresa",
    desc: "Cree su cuenta corporativa, configure áreas de trabajo y agregue a sus colaboradores.",
  },
  {
    num: "2",
    icon: <IconClipboard />,
    title: "Realice Evaluaciones",
    desc: "Aplique el método ROSA paso a paso con formularios digitales y obtenga puntajes automáticos.",
  },
  {
    num: "3",
    icon: <IconDownload />,
    title: "Genere Reportes",
    desc: "Descargue reportes PDF profesionales con niveles de riesgo, recomendaciones y firma del evaluador.",
  },
];

const PLANS = [
  {
    name: "Plus",
    price: "$49",
    period: "/mes",
    desc: "Ideal para pequeñas empresas",
    highlight: false,
    badge: null,
    accent: "from-blue-500 to-blue-700",
    features: [
      "Hasta 10 empleados",
      "Evaluaciones ilimitadas",
      "Reportes PDF básicos",
      "1 usuario evaluador",
    ],
    cta: "Comenzar",
    ctaHref: "/auth/registro",
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mes",
    desc: "Para empresas en crecimiento",
    highlight: true,
    badge: "MÁS POPULAR",
    accent: "from-indigo-500 to-violet-500",
    features: [
      "Hasta 20 empleados",
      "Evaluaciones ilimitadas",
      "Reportes PDF avanzados",
      "5 usuarios evaluadores",
      "Dashboard analítico",
      "Soporte prioritario",
    ],
    cta: "Comenzar Ahora",
    ctaHref: "/auth/registro",
  },
  {
    name: "Max",
    price: "$249",
    period: "/mes",
    desc: "Para grandes organizaciones",
    highlight: false,
    badge: null,
    accent: "from-amber-400 to-orange-500",
    features: [
      "Hasta 50 empleados",
      "Evaluaciones ilimitadas",
      "Reportes personalizados con marca",
      "Usuarios ilimitados",
      "API de integración",
      "Soporte dedicado 24/7",
    ],
    cta: "Contactar Ventas",
    ctaHref: "/auth/registro",
  },
];

const FOOTER_LINKS = {
  Producto: ["Características", "Precios", "Integraciones", "Actualizaciones"],
  Empresa: ["Nosotros", "Blog", "Casos de Éxito", "Contacto"],
  Legal: ["Privacidad", "Términos", "Seguridad"],
};

const CERTIFICATIONS = ["MINSA", "SUNAFIL", "ISO 45001", "OSHA", "OIT"];

/* ─── Componente Principal ───────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-sidebar/95 backdrop-blur-sm border-b border-sidebar-border px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">S</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SIDEO</span>
        </div>

        {/* Nav links — ocultos en móvil */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          {["Inicio", "Beneficios", "Cómo Funciona", "Planes", "Contacto"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-").replace("ó", "o").replace("é", "e")}`}
              className="hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login"
            className="hidden sm:block text-white/80 hover:text-white text-sm font-medium transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/auth/registro"
            className="bg-white text-primary font-semibold px-4 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">
            Registrarse
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section id="inicio" className="relative overflow-hidden bg-linear-to-br from-sidebar via-sidebar-accent/90 to-primary pt-20 pb-0">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.3),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,58,138,0.4),transparent_60%)] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-8">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-success-fg rounded-full animate-pulse" />
              Plataforma SST Certificada
            </span>

            {/* Título */}
            <div className="max-w-4xl flex flex-col gap-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Evaluaciones Ergonómicas{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">
                  ROSA
                </span>{" "}
                con Precisión Digital
              </h1>
              <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Automatiza el método ROSA, calcula niveles de riesgo en tiempo real y
                genera reportes profesionales para auditorías de salud ocupacional.
              </p>
            </div>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/auth/registro"
                className="flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-secondary transition-colors shadow-lg shadow-black/20 text-base">
                Comenzar Ahora <IconArrowRight />
              </Link>
              <Link href="/auth/login"
                className="flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm text-base">
                Iniciar Sesión <IconArrowRight />
              </Link>
            </div>

            {/* Stats de credibilidad */}
            <div className="w-full max-w-2xl flex justify-around border-t border-white/10 pt-8">
              {[
                { value: "200+", label: "Empresas activas" },
                { value: "10,000+", label: "Evaluaciones" },
                { value: "12", label: "Países" },
                { value: "4.9 ★", label: "Valoración" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 px-2">
                  <span className="text-white font-black text-xl sm:text-2xl leading-none">{s.value}</span>
                  <span className="text-white/45 text-[10px] tracking-widest uppercase font-semibold">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Mockup del dashboard */}
            <div className="w-full max-w-5xl mt-4 rounded-t-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 text-left">
              {/* Barra de título del navegador */}
              <div className="bg-[#0d1b2e] px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <span className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <span className="text-white/30 text-xs mx-auto">app.sideo.pe/dashboard</span>
              </div>

              {/* Cuerpo del dashboard */}
              <div className="flex bg-[#f0f4f8] min-h-105">

                {/* ── Sidebar ── */}
                <aside className="hidden sm:flex w-44 bg-[#1a2d5a] flex-col shrink-0">
                  {/* Logo */}
                  <div className="px-4 py-4 flex items-center gap-2 border-b border-white/10">
                    <div className="w-7 h-7 bg-blue-400 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-xs">S</span>
                    </div>
                    <span className="text-white font-bold text-sm">SIDEO</span>
                  </div>

                  {/* Nav */}
                  <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 text-[11px]">
                    <span className="text-white/30 font-bold tracking-widest uppercase text-[9px] px-2 pt-1 pb-1.5">Principal</span>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-500 text-white font-semibold">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
                      Dashboard
                    </div>
                    {[
                      { label: "Empresas", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" },
                      { label: "Usuarios", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14" },
                      { label: "Empleados", icon: "M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white/90">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/></svg>
                        {item.label}
                      </div>
                    ))}

                    <span className="text-white/30 font-bold tracking-widest uppercase text-[9px] px-2 pt-3 pb-1.5">Evaluación</span>
                    {[
                      { label: "Evaluaciones ROSA", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" },
                      { label: "Reportes", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white/90">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/></svg>
                        {item.label}
                      </div>
                    ))}

                    <span className="text-white/30 font-bold tracking-widest uppercase text-[9px] px-2 pt-3 pb-1.5">Sistema</span>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
                      Configuración
                    </div>
                  </nav>

                  {/* Usuario bottom */}
                  <div className="px-3 py-3 border-t border-white/10 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold">CM</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white text-[10px] font-semibold truncate">Dr. Carlos Méndez</p>
                      <p className="text-white/40 text-[9px] truncate">carlos@empresa.com</p>
                    </div>
                  </div>
                </aside>

                {/* ── Main ── */}
                <main className="flex-1 flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-gray-900 font-bold text-sm leading-tight">Dashboard</h2>
                      <p className="text-gray-400 text-[10px]">Resumen general de evaluaciones ergonómicas</p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="hidden md:flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-gray-400 text-[11px]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
                        Search...
                      </div>
                      <button className="flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                        Nueva Evaluación
                      </button>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">

                    {/* Tarjetas métricas */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        { label: "Total Evaluaciones", value: "1,284", sub: "+12.5% este mes", subColor: "text-green-500", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2", valueColor: "text-gray-900" },
                        { label: "Riesgo Promedio", value: "4.2", sub: "Nivel Medio", subColor: "text-orange-400", icon: "M13 10V3L4 14h7v7l9-11h-7z", valueColor: "text-orange-400" },
                        { label: "Áreas Críticas", value: "3", sub: "Requieren atención", subColor: "text-red-500", icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", valueColor: "text-red-500" },
                        { label: "Empleados Activos", value: "847", sub: "+5.2% este mes", subColor: "text-green-500", icon: "M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m6 0v-2a4 4 0 00-3-3.87M9 7a4 4 0 118 0 4 4 0 01-8 0z", valueColor: "text-gray-900" },
                      ].map((m) => (
                        <div key={m.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-[10px] font-medium leading-tight">{m.label}</span>
                            <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={m.icon}/></svg>
                          </div>
                          <span className={`text-xl font-black leading-tight ${m.valueColor}`}>{m.value}</span>
                          <span className={`text-[9px] font-semibold ${m.subColor}`}>{m.sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Gráfico + Recientes */}
                    <div className="flex gap-2.5 flex-1 min-h-0">

                      {/* Gráfico de barras */}
                      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-bold text-[11px]">Distribución de Niveles de Riesgo</span>
                          <span className="text-gray-400 text-[9px]">Últimos 30 días</span>
                        </div>
                        {/* Barras verticales */}
                        <div className="flex-1 flex items-end justify-around gap-2 pt-2 pb-1 min-h-0">
                          {[
                            { label: "Bajo", h: "h-24", color: "bg-green-500" },
                            { label: "Medio", h: "h-16", color: "bg-orange-400" },
                            { label: "Alto", h: "h-12", color: "bg-orange-500" },
                            { label: "Muy Alto", h: "h-8", color: "bg-red-600" },
                          ].map((b) => (
                            <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                              <div className={`w-full ${b.h} ${b.color} rounded-t-md`} />
                              <span className="text-gray-400 text-[8px] text-center leading-tight">{b.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Evaluaciones recientes */}
                      <div className="w-44 bg-white rounded-xl border border-gray-100 shadow-sm p-3 hidden md:flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 font-bold text-[11px]">Evaluaciones Recientes</span>
                          <span className="text-blue-500 text-[9px] font-semibold cursor-pointer">Ver todas →</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {[
                            { name: "Ana García", dept: "Contabilidad", badge: "Medio", badgeColor: "bg-orange-100 text-orange-600" },
                            { name: "Luis Torres", dept: "TI", badge: "Bajo", badgeColor: "bg-green-100 text-green-700" },
                            { name: "María Ruiz", dept: "RRHH", badge: "Muy Alto", badgeColor: "bg-red-100 text-red-600" },
                          ].map((r) => (
                            <div key={r.name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                              <div>
                                <p className="text-gray-800 text-[10px] font-semibold leading-tight">{r.name}</p>
                                <p className="text-gray-400 text-[9px]">{r.dept}</p>
                              </div>
                              <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${r.badgeColor}`}>{r.badge}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </section>

        {/* ── Certificaciones ────────────────────────────────────────────── */}
        <section className="bg-secondary/50 border-b border-border py-9">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-5">
            <p className="text-muted-fg text-[10px] font-black tracking-widest uppercase">
              Certificado y alineado con normativas internacionales
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              {CERTIFICATIONS.map((c) => (
                <span key={c} className="flex items-center gap-2 bg-background border border-border text-foreground font-semibold text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-px transition-all duration-200">
                  <svg className="w-3 h-3 text-success-fg shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {c}
                </span>
              ))}
            </div>
            <p className="text-muted-fg text-xs text-center">
              Más de <span className="font-bold text-foreground">200 organizaciones</span> en Latinoamérica confían en SIDEO para su gestión de SST
            </p>
          </div>
        </section>

        {/* ── Beneficios ─────────────────────────────────────────────────── */}
        <section id="beneficios" className="py-24 px-6 lg:px-12 bg-background">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-14">
            <div className="text-center flex flex-col gap-3 max-w-2xl">
              <span className="text-info-fg text-xs font-bold tracking-widest uppercase">Beneficios</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Todo lo que necesita su equipo de SST
              </h2>
              <p className="text-muted-fg text-base leading-relaxed">
                Simplifique las evaluaciones ergonómicas, reduzca riesgos laborales y
                cumpla con la normativa vigente.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {BENEFITS.map((b, i) => (
                <div key={b.title}
                  className="group bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 hover:shadow-2xl hover:shadow-black/6 hover:-translate-y-2 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                  {/* Número decorativo de fondo */}
                  <span className="absolute -bottom-3 -right-1 text-8xl font-black text-muted-fg/5 leading-none select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${b.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {b.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-foreground">{b.title}</h3>
                    <p className="text-muted-fg text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cómo funciona ──────────────────────────────────────────────── */}
        <section id="como-funciona" className="py-24 px-6 lg:px-12 bg-secondary/30">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-14">
            <div className="text-center flex flex-col gap-3 max-w-2xl">
              <span className="text-info-fg text-xs font-bold tracking-widest uppercase">Cómo Funciona</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Tres pasos para proteger a su equipo
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative">
              {/* Línea conectora (solo desktop) */}
              <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-linear-to-r from-transparent via-border to-transparent" />
              {STEPS.map((s) => (
                <div key={s.title} className="flex flex-col items-center text-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 bg-linear-to-br from-primary to-sidebar-accent rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25 text-white group-hover:scale-105 transition-transform duration-300">
                      {s.icon}
                    </div>
                    <span className="absolute -top-3 -right-3 w-7 h-7 bg-white text-primary border-2 border-primary/20 text-xs font-black rounded-full flex items-center justify-center shadow-md">
                      {s.num}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
                    <p className="text-muted-fg text-sm leading-relaxed max-w-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonios ────────────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-12 bg-background">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-14">
            <div className="text-center flex flex-col gap-3 max-w-2xl">
              <span className="text-info-fg text-xs font-bold tracking-widest uppercase">Testimonios</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-muted-fg text-base">Empresas que ya confían en SIDEO para gestionar su salud ocupacional.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {[
                { name: "Diego Ramírez", role: "Jefe de SST", co: "Minera del Sur S.A.", text: "SIDEO transformó nuestra gestión ergonómica. Reducimos el tiempo de evaluación en un 70% y cumplimos la auditoría SUNAFIL sin observaciones.", av: "DR", color: "bg-blue-500" },
                { name: "Carla Vega", role: "Médico Ocupacional", co: "Clínica San Felipe", text: "Los reportes PDF salen en segundos y el dashboard me permite ver todas las alertas de riesgo en tiempo real. Indispensable para nuestro equipo.", av: "CV", color: "bg-violet-500" },
                { name: "Luis Herrera", role: "Gerente RRHH", co: "Consorcio Norte", text: "Implementamos SIDEO en 3 sedes con 450 empleados. El soporte es excelente y la plataforma muy intuitiva para nuestros evaluadores.", av: "LH", color: "bg-emerald-600" },
              ].map((t) => (
                <div key={t.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1.5 hover:border-primary/20 transition-all duration-300">
                  {/* Estrellas */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{t.av}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm leading-tight">{t.name}</p>
                      <p className="text-muted-fg text-xs">{t.role} · {t.co}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Planes ─────────────────────────────────────────────────────── */}
        <section id="planes" className="py-24 px-6 lg:px-12 bg-secondary/20">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-14">
            <div className="text-center flex flex-col gap-3 max-w-2xl">
              <span className="text-info-fg text-xs font-bold tracking-widest uppercase">Planes</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Elija el plan ideal para su empresa
              </h2>
              <p className="text-muted-fg text-base">Planes flexibles que crecen con su organización.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
              {PLANS.map((plan) => (
                <div key={plan.name}
                  className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300
                    ${plan.highlight
                      ? "bg-[#0f172a] border-2 border-violet-500/60 shadow-2xl shadow-violet-500/25 ring-4 ring-violet-500/10 md:-translate-y-4"
                      : "bg-card border border-border hover:shadow-2xl hover:-translate-y-1.5 hover:border-primary/30"
                    }`}>

                  {/* Barra de acento superior */}
                  <div className={`h-1.5 w-full bg-linear-to-r ${plan.accent}`} />

                  {/* Badge popular */}
                  {plan.badge && (
                    <div className="absolute top-5 right-5">
                      <span className={`inline-flex items-center gap-1.5 bg-linear-to-r ${plan.accent} text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg`}>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-7 flex flex-col gap-6 flex-1">
                    {/* Nombre del plan */}
                    <div className="pt-1">
                      <span className={`inline-block text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-lg bg-linear-to-r ${plan.accent} text-white`}>
                        {plan.name}
                      </span>
                      <p className={`mt-2.5 text-sm leading-relaxed ${plan.highlight ? "text-white/60" : "text-muted-fg"}`}>
                        {plan.desc}
                      </p>
                    </div>

                    {/* Precio */}
                    <div className={`flex items-end gap-1.5 ${plan.highlight ? "text-white" : "text-foreground"}`}>
                      <span className="text-5xl font-black leading-none">{plan.price}</span>
                      <span className={`text-sm mb-1.5 ${plan.highlight ? "text-white/50" : "text-muted-fg"}`}>{plan.period}</span>
                    </div>

                    {/* Divisor */}
                    <div className={`h-px ${plan.highlight ? "bg-white/10" : "bg-border"}`} />

                    {/* Características */}
                    <ul className="flex flex-col gap-3 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-sm ${plan.highlight ? "text-white/80" : "text-foreground"}`}>
                          <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full bg-linear-to-br ${plan.accent} flex items-center justify-center shadow-sm`}>
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Botón CTA */}
                    <Link href={plan.ctaHref}
                      className={`mt-2 block text-center font-bold py-3.5 rounded-xl transition-all duration-200 text-sm
                        ${plan.highlight
                          ? "bg-white text-[#0f172a] hover:bg-white/90 shadow-lg"
                          : `bg-linear-to-r ${plan.accent} text-white hover:opacity-90 shadow-md hover:shadow-lg`
                        }`}>
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Final ──────────────────────────────────────────────────── */}
        <section id="contacto" className="relative py-24 px-6 lg:px-12 bg-linear-to-br from-sidebar via-sidebar-accent/80 to-primary overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Prueba gratuita 14 días · Sin tarjeta de crédito
            </span>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Proteja la salud de<br className="hidden sm:block" /> su equipo hoy
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Únase a más de 200 empresas que ya gestionan sus evaluaciones
                ergonómicas con SIDEO.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
              {[
                { value: "200+", label: "Empresas" },
                { value: "10K+", label: "Evaluaciones" },
                { value: "98%", label: "Satisfacción" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-white font-black text-3xl sm:text-4xl leading-none">{s.value}</span>
                  <span className="text-white/50 text-xs tracking-widest uppercase font-medium">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/auth/registro"
                className="flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-secondary transition-colors shadow-xl shadow-black/25 text-base">
                Comenzar <IconArrowRight />
              </Link>
              <Link href="/auth/login"
                className="flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base">
                Iniciar Sesión <IconArrowRight />
              </Link>
            </div>
            <p className="text-white/35 text-xs">Sin compromiso · Cancele cuando quiera · Soporte incluido</p>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-sidebar text-white/60 border-t border-sidebar-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Marca */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-white font-bold text-lg">SIDEO</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Plataforma líder en evaluaciones ergonómicas ROSA para la gestión de
              salud ocupacional empresarial.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-3">
              <span className="text-white font-semibold text-sm">{group}</span>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-sidebar-border px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs">
            © {new Date().getFullYear()} SIDEO, Todos los derechos reservados.
          </span>
          <span className="text-xs opacity-50">Hecho con ♥ para equipos de SST del equipo CODEMEISTER</span>
        </div>
      </footer>
    </div>
  );
}