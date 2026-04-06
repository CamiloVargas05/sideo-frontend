"use client";

import { ChevronLeft } from "lucide-react";
import { useEvaluacionesRosa } from "@/hooks/dashboard/evaluacionesRosa/useEvaluacionesRosa";
import ListadoEvaluaciones from "./sections/ListadoEvaluaciones";
import EmpleadosSelector from "./sections/EmpleadosSelector";
import RosaWizard from "./sections/RosaWizard";
import ResultadoEvaluacion from "./sections/ResultadoEvaluacion";

export default function EvaluacionesRosa() {
  const {
    view,
    setView,
    loading,
    error,
    selectedEmpleado,
    wizardData,
    handleNuevaEvaluacion,
    handleSeleccionarEmpleado,
    handleFinishWizard,
    handleVerResultado,
    handleDownloadPDF,
    handleCancelar,
  } = useEvaluacionesRosa();

  /* ─── Vista: Selector de Empleados ─────────────────────────────────── */
  if (view === "selector") {
    return (
      <div className="flex flex-col h-full">
        <EmpleadosSelector
          onSelect={handleSeleccionarEmpleado}
          onCancel={handleCancelar}
        />
      </div>
    );
  }

  /* ─── Vista: Wizard de Evaluación ──────────────────────────────────── */
  if (view === "wizard" && selectedEmpleado) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 py-5 bg-card border-b border-border">
          <button
            onClick={() => setView("selector")}
            className="text-muted-fg hover:text-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Evaluación ROSA
            </h1>
            <p className="text-muted-fg text-xs">
              {selectedEmpleado.firstName} {selectedEmpleado.lastName} •{" "}
              {selectedEmpleado.position} • {selectedEmpleado.area}
            </p>
          </div>
        </div>

        {/* Wizard */}
        <div className="flex-1 px-8 py-6 overflow-hidden">
          <RosaWizard
            empleado={selectedEmpleado}
            onFinish={handleFinishWizard}
            onCancel={handleCancelar}
          />
        </div>
      </div>
    );
  }

  /* ─── Vista: Resultado ─────────────────────────────────────────────── */
  if (view === "result" && wizardData) {
    return (
      <div className="flex flex-col h-full">
        <ResultadoEvaluacion
          data={wizardData}
          onBack={handleCancelar}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    );
  }

  /* ─── Vista: Listado (por defecto) ────────────────────────────────── */
  return (
    <ListadoEvaluaciones
      onNuevaEvaluacion={handleNuevaEvaluacion}
      onVerResultado={handleVerResultado}
    />
  );
}
