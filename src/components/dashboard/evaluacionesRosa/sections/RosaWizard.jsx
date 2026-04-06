"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { ROSA_SECTIONS, getRiskLevel } from "../constants/rosaQuestions";
import {
  calculateSectionScore,
  calculateOverallScore,
} from "../utils/rosaMapper";

function ScoreCircle({ score, size = 100 }) {
  const level = getRiskLevel(score);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 10) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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

export default function RosaWizard({
  empleado,
  onFinish,
  onCancel,
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [observations, setObservations] = useState("");

  const currentSection = ROSA_SECTIONS[step];
  const totalSteps = ROSA_SECTIONS.length;

  const setAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [`${currentSection.id}-${questionId}`]: optionIndex,
    }));
  };

  const getAnswer = (questionId) => {
    return answers[`${currentSection.id}-${questionId}`];
  };

  // Calcular puntajes de secciones
  const sectionScores = ROSA_SECTIONS.map((section) =>
    calculateSectionScore(section, answers)
  );

  const overallScore = calculateOverallScore(sectionScores);
  const riskLevel = getRiskLevel(overallScore);

  // Verificar que todas las preguntas de la sección actual estén contestadas
  const canNext = currentSection.questions.every(
    (q) => getAnswer(q.id) !== undefined
  );

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Aquí finalizamos con los datos
      onFinish({
        empleado,
        observations,
        answers,
        sectionScores,
        overallScore,
        riskLevel,
      });
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onCancel();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex gap-5 h-full">
      {/* Form panel */}
      <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 text-primary font-semibold">
            <span className="text-2xl">{currentSection.icon}</span>
            <div>
              <p className="text-sm text-muted-fg">
                Sección {currentSection.stepLabel}
              </p>
              <p className="text-lg">{currentSection.section}</p>
            </div>
          </div>
          <span className="text-muted-fg text-sm">
            Paso {step + 1} de {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Questions scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {currentSection.questions.map((question) => {
            const answerIndex = getAnswer(question.id);
            return (
              <div key={question.id} className="flex flex-col gap-3">
                <div>
                  <p className="font-medium text-foreground">{question.text}</p>
                  <p className="text-muted-fg text-sm">{question.desc}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => setAnswer(question.id, optionIndex)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all whitespace-nowrap ${
                        answerIndex === optionIndex
                          ? "bg-primary text-primary-fg border-primary"
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {option}
                      {answerIndex === optionIndex && " ✓"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Observations input - solo en última sección */}
          {step === totalSteps - 1 && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <label className="font-medium text-foreground">
                Observaciones (opcional)
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Añade cualquier observación relevante sobre la evaluación..."
                className="p-3 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft size={15} />
            {step === 0 ? "Cancelar" : "Anterior"}
          </button>
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-fg rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step < totalSteps - 1 ? "Siguiente" : "Finalizar"}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Real-time score panel */}
      <div className="w-56 bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shrink-0">
        <p className="font-semibold text-foreground flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Puntaje en Tiempo Real
        </p>

        <div className="flex flex-col items-center gap-3">
          <ScoreCircle score={overallScore || 0} size={110} />
          <div className="text-center">
            <p className="text-xs text-muted-fg mb-1">Nivel de Riesgo</p>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                overallScore === 0
                  ? "bg-border text-muted-fg"
                  : `bg-${riskLevel.label}/15 ${riskLevel.className}`
              }`}
            >
              {overallScore === 0 ? "Evaluando..." : `${riskLevel.label}`}
            </span>
          </div>
        </div>

        {/* Section scores */}
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-fg font-semibold">Secciones</p>
          {ROSA_SECTIONS.map((section, i) => {
            const score = sectionScores[i];
            const level = score !== null ? getRiskLevel(score) : null;
            return (
              <div
                key={section.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-fg">{section.section}</span>
                <span
                  className={`font-semibold ${
                    level ? level.className : "text-muted-fg"
                  }`}
                >
                  {score !== null ? score.toFixed(1) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
