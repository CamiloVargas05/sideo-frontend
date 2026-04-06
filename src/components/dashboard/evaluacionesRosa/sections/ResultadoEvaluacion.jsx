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
          {Math.round(score)}
        </span>
      </div>
    </div>
  );
}

const RECOMMENDATIONS = {
  chair: [
    "Reducir la altura del asiento para evitar que los pies queden sin contacto con el suelo.",
    "Ampliar el espacio libre bajo la mesa para permitir movilidad de piernas.",
    "Reemplazar la silla por una con altura de asiento regulable.",
    "Ajustar la profundidad del asiento para mantener entre 8 cm entre el asiento y la parte posterior de las rodillas.",
    "Reemplazar la silla por una con profundidad de asiento regulable.",
    "Ajustar los reposabrazos para que los codos queden alineados con los hombros.",
    "Reducir la separación entre los reposabrazos.",
    "Instalar reposabrazos con superficie acolchada.",
    "Reemplazar los reposabrazos por unos ajustables.",
    "Ajustar el respaldo para que soporte adecuadamente la zona lumbar (95°-110°).",
    "Bajar la superficie de trabajo para relajar los hombros.",
    "Reemplazar la silla por una con respaldo ajustable.",
  ],
  screen: [
    "Reducir la altura de la pantalla para evitar extensión de cuello.",
    "Reposicionar la pantalla frente al trabajador para evitar rotación cervical.",
    "Instalar un atril o soporte de documentos junto a la pantalla.",
    "Eliminar brillos y reflejos en la pantalla usando filtros o reposicionando la iluminación.",
    "Acercar la pantalla al rango de 45-75 cm del trabajador.",
  ],
  phone: [
    "Acercar el teléfono al puesto de trabajo, a menos de 30 cm del trabajador.",
    "Utilizar auriculares o manos libres para evitar sujetar el teléfono con el cuello.",
    "Instalar función de manos libres en el teléfono.",
  ],
  peripherals: [
    "Reposicionar el mouse para que quede alineado con el hombro y cerca del cuerpo.",
    "Reemplazar el mouse por uno de tamaño adecuado a la mano del trabajador.",
    "Nivelar el mouse y el teclado a la misma altura.",
    "Instalar un reposamuñecas blando para reducir la presión en la muñeca al usar el mouse.",
    "Instalar una bandeja extraíble para teclado que permita mantener las muñecas en posición neutra.",
    "Corregir la posición del teclado para evitar desviación lateral de las muñecas.",
    "Reducir la altura del teclado para que los hombros estén relajados.",
  ],
  workspace: [
    "Reorganizar el espacio de trabajo para eliminar la necesidad de alcanzar objetos por encima de la cabeza.",
    "Reemplazar la superficie de trabajo o teclado por uno ajustable en altura.",
  ],
};

const SECTION_TITLES = {
  chair: "Silla y Área de Asiento",
  screen: "Pantalla",
  phone: "Teléfono",
  peripherals: "Teclado y Mouse",
  workspace: "Espacio de Trabajo",
};

// Mapeo de campos del breakdown a etiquetas en español
const BREAKDOWN_LABELS = {
  seatHeight: "Altura Asiento",
  seatDepth: "Profundidad Asiento",
  armrests: "Reposabrazos",
  backrest: "Respaldo",
  chairTableA: "Puntuación Silla, Tabla A",
  screenWithTime: "Pantalla + Tiempo",
  phoneWithTime: "Teléfono + Tiempo",
  mouseWithTime: "Mouse + Tiempo",
  keyboardWithTime: "Teclado + Tiempo",
  tableB: "Pantalla + Periféricos, Tabla B",
  tableC: "Pantalla y Periféricos, Tabla C",
  tableD: "Espacio de Trabajo, Tabla D",
};

export default function ResultadoEvaluacion({
  data,
  onBack,
  onDownloadPDF,
}) {
  // Extraer datos - soportar tanto formato antiguo como nuevo del servidor
  const empleado = data.empleado || data.employee || {};
  const observations = data.observations || "";
  const overallScore = data.rosaFinal ?? data.overallScore ?? data.score ?? 0;
  const riskLevelLabel = data.riskLevel || "Desconocido";
  
  // Extraer breakdown de detalles desglosados
  // El servidor puede enviar en data.breakdown (nuevo) o data.detail (antiguo)
  const detailData = data.breakdown || data.detail || {};
  
  // Campos que queremos mostrar en orden
  const fieldsToShow = [
    'seatHeight',
    'seatDepth',
    'armrests',
    'backrest',
    'chairTableA',
    'screenWithTime',
    'phoneWithTime',
    'mouseWithTime',
    'keyboardWithTime',
    'tableB',
    'tableC',
    'tableD',
  ];
  
  // Crear lista de componentes desglosados - solo mostrar los campos específicos
  const breakdownItems = fieldsToShow
    .map((key) => ({
      label: BREAKDOWN_LABELS[key] || key,
      value: detailData[key],
    }))
    .filter(({ value }) => value !== undefined && value !== null);

  const nombreCompleto = `${empleado.firstName || ""} ${empleado.lastName || ""}`.trim();
  const fecha = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Determinar si necesita acción basado en el puntaje
  const necesitaAccion = overallScore >= 5;
  
  // Obtener el objeto riskLevel con estilos
  const riskLevel = getRiskLevel(overallScore);

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

                {/* Section scores grid - Mostrar detalles desglosados en tabla */}
                <div className="w-full">
                  {breakdownItems.length > 0 ? (
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-2 border-b border-border bg-background/50">
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-muted-fg">Componente</p>
                        </div>
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-muted-fg">Puntaje</p>
                        </div>
                      </div>
                      {breakdownItems.map((item, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-2 border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                        >
                          <div className="px-4 py-3">
                            <p className="text-sm text-foreground">{item.label}</p>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">{Math.round(item.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-fg">
                      Cargando detalles...
                    </div>
                  )}
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
              <div className="space-y-6">
                {Object.entries(RECOMMENDATIONS).map(([category, recs]) => (
                  <div key={category}>
                    <p className="font-medium text-foreground mb-3">
                      {SECTION_TITLES[category] || category}
                    </p>
                    <ul className="space-y-2 ml-4">
                      {recs.map((rec, j) => (
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
                ))}
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
