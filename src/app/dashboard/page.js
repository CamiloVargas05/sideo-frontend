"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Home from "@/components/dashboard/home/home";
import Empresas from "@/components/dashboard/empresas/empresas";
import Evaluadores from "@/components/dashboard/evaluadores/evaluadores";
import Empleados from "@/components/dashboard/empleados/empleados";
import EvaluacionesRosa from "@/components/dashboard/evaluacionesRosa/evaluacionesRosa";
import Reportes from "@/components/dashboard/reportes/reportes";
import Configuracion from "@/components/dashboard/configuracion/configuracion";
import Suscripcion from "@/components/dashboard/suscripcion/suscripcion";

const views = {
  dashboard:           Home,
  empresas:            Empresas,
  evaluadores:         Evaluadores,
  empleados:           Empleados,
  "evaluaciones-rosa": EvaluacionesRosa,
  reportes:            Reportes,
  suscripcion:         Suscripcion,
  configuracion:       Configuracion,
};

export default function DashboardPage() {
  const [section, setSection] = useState("dashboard");
  const View = views[section] ?? Home;

  return (
    <div className="flex h-full">
      <Sidebar activeSection={section} onNavigate={setSection} />
      <main className="flex-1 overflow-y-auto">
        <View onNavigate={setSection} />
      </main>
    </div>
  );
}
