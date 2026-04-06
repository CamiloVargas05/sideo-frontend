"use client";

import { FileText, Download, ArrowLeft } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import { ROSA_SECTIONS, getRiskLevel } from "../constants/rosaQuestions";

function ScoreCircle({ score, size = 120 }) {
  const level = getRiskLevel(score);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 10) * circ;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={level.ring}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold text-2xl ${level.className}`}>
          {score.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

const RECOMMENDATIONS = {
  chair: [
    "Ajustar la altura del asiento de modo que los pies toquen el piso y las rodillas formen un ángulo de 90°",
    "Usar un cojín de espuma o gel para mayor comodidad del asiento",
    "Verificar que el respaldo proporcione apoyo lumbar adecuado",
    "Considerar una silla ergonómica certificada si no es ajustable",
  ],
  screen: [
    "Colocar la pantalla a una distancia de 50-70 cm del operador",
    "La parte superior de la pantalla debe estar al nivel de los ojos",
    "Eliminar reflejos mediante cortinas o reubicación de la pantalla",
    "Usar un soporte para documentos de referencia al nivel de la pantalla",
    "Utilizar auriculares o sistema de manos libres para llamadas telefónicas",
  ],
  peripherals: [
    "Posicionar el teclado de modo que los codos formen un ángulo de 90°",
    "Mantener el mouse al mismo nivel y cerca del cuerpo",
    "Usar un mouse ergonómico vertical si hay dolor en la muñeca",
    "Colocar un reposamuñecas para el teclado durante descansos",
    "Evitar objetos sobre el teclado que interfieran con la postura",
  ],
};

export default function ResultadoEvaluacion({
  data,
  onBack,
  onDownloadPDF,
}) {
  const { empleado, observations, sectionScores, overallScore, riskLevel } =
    data;
  const nombreCompleto = `${empleado.firstName} ${empleado.lastName}`;
  const fecha = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const necesitaAccion = overallScore >= 5;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Resultado de Evaluación
          </h1>
          <p className="text-muted-fg text-sm mt-0.5">
            {nombreCompleto} • {empleado.position} • {empleado.area} • {fecha}
          </p>
        </div>
        <button
          onClick={onDownloadPDF}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Download size={16} /> Descargar PDF
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Score Summary */}
            <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-6">
              <ScoreCircle score={overallScore} size={140} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {necesitaAccion ? (
                    <div className="p-1 bg-danger-bg/20 rounded">
                      <FileText
                        size={20}
                        className="text-danger-fg"
                      />
                    </div>
                  ) : (
                    <div className="p-1 bg-success-bg/20 rounded">
                      <FileText
                        size={20}
                        className="text-success-fg"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-fg">Nivel de Riesgo</p>
                    <p className={`text-lg font-bold ${riskLevel.className}`}>
                      {riskLevel.label}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-sm mb-4 ${
                    necesitaAccion ? "text-muted-fg" : "text-success-fg"
                  }`}
                >
                  {necesitaAccion
                    ? "Se requiere actuación inmediata. Intervención ergonómica necesaria para el puesto de trabajo."
                    : "Condiciones ergonómicas aceptables. Continuar monitoreando."}
                </p>

                {/* Section scores grid */}
                <div className="grid grid-cols-3 gap-3">
                  {ROSA_SECTIONS.map((section, i) => {
                    const score = sectionScores[i];
                    const level = score !== null ? getRiskLevel(score) : null;
                    return (
                      <div
                        key={section.id}
                        className="flex flex-col items-center gap-1 bg-background border border-border rounded-lg px-3 py-2"
                      >
                        <p className="text-muted-fg text-xs">{section.section}</p>
                        <p
                          className={`text-xl font-bold ${
                            level ? level.className : "text-muted-fg"
                          }`}
                        >
                          {score !== null ? score.toFixed(0) : "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Observations */}
            {observations && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Observaciones
                </h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {observations}
                </p>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                💡 Recomendaciones de Intervención
              </h3>
              <div className="space-y-4">
                {ROSA_SECTIONS.map((section, i) => {
                  const score = sectionScores[i];
                  if (score === null || score < 5) return null;

                  return (
                    <div key={section.id}>
                      <p className="font-medium text-foreground mb-2">
                        {section.section}
                      </p>
                      <ul className="space-y-1 ml-4">
                        {RECOMMENDATIONS[section.id]?.map((rec, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-primary shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action required notice */}
            {necesitaAccion && (
              <div className="bg-warning-bg/10 border border-warning-bg/30 rounded-xl p-6">
                <p className="text-sm text-foreground">
                  <strong>Acción recomendada:</strong> Notificar al área
                  correspondiente para implementar las intervenciones
                  ergonómicas necesarias en el puesto de trabajo del
                  empleado.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-56 shrink-0 space-y-6">
            {/* Info card */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-fg font-semibold mb-3">
                DETALLES
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-fg">Empleado</p>
                  <p className="font-medium text-foreground">
                    {nombreCompleto}
                  </p>
                </div>
                <div>
                  <p className="text-muted-fg">Puesto</p>
                  <p className="font-medium text-foreground">
                    {empleado.position}
                  </p>
                </div>
                <div>
                  <p className="text-muted-fg">Área</p>
                  <p className="font-medium text-foreground">{empleado.area}</p>
                </div>
                <div>
                  <p className="text-muted-fg">Email</p>
                  <p className="font-medium text-foreground text-xs truncate">
                    {empleado.email}
                  </p>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-fg">Fecha</p>
                  <p className="font-medium text-foreground text-xs">{fecha}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-fg font-semibold mb-3">
                ESTADO
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    necesitaAccion ? "bg-danger-fg" : "bg-success-fg"
                  }`}
                />
                <p className="text-sm font-medium text-foreground">
                  {necesitaAccion
                    ? "Requiere acción"
                    : "Aceptable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-card border-t border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <ArrowLeft size={15} /> Volver al listado
        </button>
      </div>
    </div>
  );
}
