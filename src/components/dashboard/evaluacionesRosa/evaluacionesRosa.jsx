"use client";

import { useState } from "react";
import { showToast } from "nextjs-toast-notify";
import { Plus, Search, ChevronLeft, ArrowRight, Lightbulb } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const evaluaciones = [
  { id: "ROSA-001", empleado: "Ana García",   area: "Contabilidad", fecha: "12/02/2026", nivel: "Medio",    score: 4.2 },
  { id: "ROSA-002", empleado: "Luis Torres",  area: "TI",           fecha: "10/02/2026", nivel: "Bajo",     score: 2.0 },
  { id: "ROSA-003", empleado: "Pedro Ruiz",   area: "Operaciones",  fecha: "08/02/2026", nivel: "Alto",     score: 6.5 },
  { id: "ROSA-004", empleado: "Rosa Mendoza", area: "RRHH",         fecha: "05/02/2026", nivel: "Muy Alto", score: 7.5 },
];

const nivelBadge = {
  Bajo:       "bg-rosa-low text-white",
  Medio:      "bg-rosa-medium text-white",
  Alto:       "bg-rosa-high text-white",
  "Muy Alto": "bg-rosa-very-high text-white",
};

const rosaSteps = [
  {
    section: "Silla", icon: "🪑", stepLabel: "A",
    questions: [
      { text: "Altura del asiento", desc: "¿El asiento está ajustado a la altura correcta? (rodillas a 90°)", options: ["Ajustable", "No ajustable", "Demasiado alto"], scores: [1, 3, 5] },
      { text: "Profundidad del asiento", desc: "¿Hay espacio suficiente entre el borde del asiento y la parte posterior de las rodillas?", options: ["Adecuado", "Muy profundo", "Muy corto"], scores: [1, 3, 4] },
    ],
  },
  {
    section: "Monitor", icon: "🖥️", stepLabel: "B",
    questions: [
      { text: "Altura del monitor", desc: "¿La parte superior del monitor está al nivel de los ojos o ligeramente por debajo?", options: ["Correcto", "Demasiado alto", "Demasiado bajo"], scores: [1, 4, 3] },
      { text: "Distancia del monitor", desc: "¿El monitor está a una distancia apropiada de los ojos? (50-70 cm)", options: ["Correcta", "Muy cerca", "Muy lejos"], scores: [1, 5, 3] },
    ],
  },
  {
    section: "Teclado", icon: "⌨️", stepLabel: "C",
    questions: [
      { text: "Posición del teclado", desc: "¿El teclado permite que los codos estén a 90° y muñecas rectas?", options: ["Correcta", "Muñeca flexionada", "Codos elevados"], scores: [1, 4, 3] },
      { text: "Uso del apoyamuñecas", desc: "¿Se utiliza reposamuñecas durante las pausas de escritura?", options: ["Siempre", "A veces", "Nunca"], scores: [1, 2, 4] },
    ],
  },
  {
    section: "Mouse", icon: "🖱️", stepLabel: "D",
    questions: [
      { text: "Posición del mouse", desc: "¿El mouse está al mismo nivel que el teclado y cerca del cuerpo?", options: ["Correcto", "Alejado", "Muy elevado"], scores: [1, 3, 5] },
      { text: "Agarre del mouse", desc: "¿La muñeca se mantiene recta al usar el mouse?", options: ["Siempre", "A veces", "Nunca"], scores: [1, 3, 5] },
    ],
  },
];

function getLevel(score) {
  if (score <= 2) return { label: "Bajo",     color: "text-rosa-low",       ring: "#22c55e" };
  if (score <= 5) return { label: "Medio",    color: "text-rosa-medium",    ring: "#f59e0b" };
  if (score <= 7) return { label: "Alto",     color: "text-rosa-high",      ring: "#f97316" };
  return              { label: "Muy Alto", color: "text-rosa-very-high", ring: "#dc2626" };
}

/* ─── Score Circle ───────────────────────────────────────────────────────── */
function ScoreCircle({ score, size = 100 }) {
  const level = getLevel(score);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 10) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={level.ring} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold text-2xl ${level.color}`}>{score.toFixed(1)}</span>
      </div>
    </div>
  );
}

/* ─── Wizard ─────────────────────────────────────────────────────────────── */
function Wizard({ onFinish, onCancel }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentStep = rosaSteps[step];
  const totalSteps = rosaSteps.length;

  const setAnswer = (qIdx, optIdx) =>
    setAnswers((prev) => ({ ...prev, [`${step}-${qIdx}`]: optIdx }));

  const getAnswer = (qIdx) => answers[`${step}-${qIdx}`];

  const stepScore = (s) => {
    const qs = rosaSteps[s].questions;
    const answered = qs.map((_q, qi) => answers[`${s}-${qi}`]);
    const valid = answered.filter((a) => a !== undefined);
    if (!valid.length) return null;
    const total = valid.reduce((acc, a, i) => acc + qs[i].scores[a], 0);
    return Math.min(10, (total / qs.length) * 2);
  };

  const sectionScores = rosaSteps.map((_, s) => stepScore(s));
  const validScores   = sectionScores.filter((s) => s !== null);
  const overallScore  = validScores.length ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
  const level         = getLevel(overallScore);

  const canNext = currentStep.questions.every((_, qi) => getAnswer(qi) !== undefined);

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onFinish({ sectionScores, overallScore });
  };

  return (
    <div className="flex gap-5 h-full">
      {/* Form panel */}
      <div className="flex-1 bg-card border border-border rounded-xl flex flex-col">
        {/* Section header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <span className="text-lg">{currentStep.icon}</span>
            Sección {currentStep.stepLabel}: {currentStep.section}
          </div>
          <span className="text-muted-fg text-sm">Paso {step + 1} de {totalSteps}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        {/* Questions */}
        <div className="flex-1 px-6 py-5 flex flex-col gap-6">
          {currentStep.questions.map((q, qi) => (
            <div key={qi} className="flex flex-col gap-2">
              <p className="font-medium text-foreground">{q.text}</p>
              <p className="text-muted-fg text-sm">{q.desc}</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswer(qi, oi)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                      getAnswer(qi) === oi
                        ? "bg-primary text-primary-fg border-primary"
                        : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {opt} {getAnswer(qi) === oi && "✓"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={step === 0 ? onCancel : () => setStep(step - 1)}
            className="px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-background transition-colors"
          >
            {step === 0 ? "Cancelar" : "Anterior"}
          </button>
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-fg rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {step < totalSteps - 1 ? "Siguiente" : "Finalizar"} <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Real-time score panel */}
      <div className="w-56 bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shrink-0">
        <p className="font-semibold text-foreground flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Puntaje en Tiempo Real
        </p>
        <div className="flex flex-col items-center gap-2">
          <ScoreCircle score={overallScore || 0} size={110} />
          <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${
            overallScore === 0 ? "bg-border text-muted-fg" : `bg-${level.label === "Bajo" ? "rosa-low" : level.label === "Medio" ? "rosa-medium" : level.label === "Alto" ? "rosa-high" : "rosa-very-high"}/15 ${level.color}`
          }`}>
            {overallScore === 0 ? "Sin puntaje" : `Nivel ${level.label}`}
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {rosaSteps.map((rs, s) => (
            <div key={s} className="flex items-center justify-between text-sm">
              <span className="text-muted-fg">{rs.section}</span>
              <span className={`font-semibold ${sectionScores[s] !== null ? getLevel(sectionScores[s]).color : "text-muted-fg"}`}>
                {sectionScores[s] !== null ? sectionScores[s].toFixed(1) : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Activity({ size, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

/* ─── Result ─────────────────────────────────────────────────────────────── */
function Result({ data, onBack }) {
  const { sectionScores, overallScore } = data;
  const level = getLevel(overallScore);

  const recommendations = [
    "Reemplazar mouse actual por un mouse ergonómico vertical para reducir tensión en muñeca.",
    "Instalar bandeja extraíble para teclado que permita ángulo neutro de muñecas.",
    "Ajustar altura del monitor al nivel de los ojos usando soporte elevador.",
  ];

  const history = [
    { fecha: "23 Feb 2026", evaluador: "Dr. Méndez", score: overallScore },
    { fecha: "15 Ene 2026", evaluador: "Dra. López",  score: 5.1 },
    { fecha: "10 Nov 2025", evaluador: "Dr. Méndez",  score: 3.2 },
  ];

  return (
    <div className="flex gap-5">
      {/* Main result */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Score summary */}
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-6">
          <ScoreCircle score={overallScore} size={120} />
          <div className="flex flex-col gap-2">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-danger-bg text-danger-fg`}>
              Riesgo {level.label}
            </span>
            <p className="text-foreground text-sm max-w-xs">
              Se requiere actuación inmediata. Intervención ergonómica necesaria para el puesto de trabajo.
            </p>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {rosaSteps.map((rs, s) => {
                const sc = sectionScores[s];
                const lv = sc !== null ? getLevel(sc) : null;
                return (
                  <div key={s} className="flex flex-col items-center gap-1 bg-background border border-border rounded-lg px-3 py-2">
                    <p className="text-muted-fg text-xs">{rs.section}</p>
                    <p className={`text-xl font-bold ${lv ? lv.color : "text-muted-fg"}`}>
                      {sc !== null ? sc.toFixed(0) : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-warning-fg" /> Recomendaciones
          </h3>
          <ul className="flex flex-col gap-2">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="w-2 h-2 rounded-full bg-warning-fg mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* History panel */}
      <div className="w-56 bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shrink-0">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <HelpCircle size={15} className="text-muted-fg" /> Historial
        </h3>
        <ul className="flex flex-col divide-y divide-border">
          {history.map((h, i) => {
            const lv = getLevel(h.score);
            return (
              <li key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{h.fecha}</p>
                  <p className="text-xs text-muted-fg">Evaluador: {h.evaluador}</p>
                </div>
                <span className={`text-sm font-bold ${lv.color}`}>{h.score.toFixed(1)}</span>
              </li>
            );
          })}
        </ul>
        <button
          onClick={onBack}
          className="mt-auto w-full border border-border text-foreground text-sm font-medium py-2 rounded-lg hover:bg-background transition-colors"
        >
          Volver al listado
        </button>
      </div>
    </div>
  );
}

function HelpCircle({ size, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ─── Main List View ─────────────────────────────────────────────────────── */
export default function EvaluacionesRosa() {
  const [view, setView]             = useState("list"); // "list" | "wizard" | "result"
  const [wizardData, setWizardData] = useState(null);

  const handleVerResultado = () => setView("result-preview");
  const handleNueva        = ()   => setView("wizard");

  if (view === "wizard") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 px-8 py-5 bg-card border-b border-border">
          <button onClick={() => setView("list")} className="text-muted-fg hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Nueva Evaluación ROSA</h1>
            <p className="text-muted-fg text-xs">Empleado: Ana García · Área: Contabilidad · Puesto: Analista Contable</p>
          </div>
        </div>
        <div className="flex-1 px-8 py-6">
          <Wizard
            onFinish={(data) => { setWizardData(data); setView("result"); }}
            onCancel={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  if (view === "result" && wizardData) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resultado de Evaluación</h1>
            <p className="text-muted-fg text-sm mt-0.5">Ana García · Contabilidad · {new Date().toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <button
            onClick={() => showToast.success("Generando PDF...", { position: "top-right", transition: "bounceIn", duration: 3000 })}
            className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Generar PDF
          </button>
        </div>
        <div className="flex-1 px-8 py-6">
          <Result data={wizardData} onBack={() => setView("list")} />
        </div>
      </div>
    );
  }

  /* List view */
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evaluaciones ROSA</h1>
          <p className="text-muted-fg text-sm mt-0.5">Evaluaciones ergonómicas con metodología ROSA</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-48" />
          </div>
          <button
            onClick={handleNueva}
            className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Nueva Evaluación
          </button>
        </div>
      </div>

      <div className="flex-1 px-8 py-5">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">ID</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empleado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Área</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Fecha</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Puntuación</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Nivel</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((ev) => (
                <tr key={ev.id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-muted-fg">{ev.id}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{ev.empleado}</td>
                  <td className="px-6 py-3 text-muted-fg">{ev.area}</td>
                  <td className="px-6 py-3 text-muted-fg">{ev.fecha}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className={`h-full ${ev.nivel === "Bajo" ? "bg-rosa-low" : ev.nivel === "Medio" ? "bg-rosa-medium" : ev.nivel === "Alto" ? "bg-rosa-high" : "bg-rosa-very-high"} rounded-full`}
                          style={{ width: `${(ev.score / 10) * 100}%` }} />
                      </div>
                      <span className="text-foreground font-medium">{ev.score}/10</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${nivelBadge[ev.nivel]}`}>
                      {ev.nivel}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleVerResultado(ev)}
                      className="text-primary text-xs font-medium hover:underline"
                    >
                      Ver resultado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
