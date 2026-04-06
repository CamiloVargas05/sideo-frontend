/**
 * Mapea las respuestas del wizard al formato esperado por la API
 */

import { ROSA_SECTIONS } from "../constants/rosaQuestions";

export function mapWizardResponsesToApiBody(wizardAnswers, employeeId, observations = "") {
  const body = {
    employeeId,
    observations,
    chair: {},
    screen: {},
    peripherals: {},
  };

  // Iterar sobre todas las secciones y preguntas
  ROSA_SECTIONS.forEach((section) => {
    section.questions.forEach((question) => {
      const answer = wizardAnswers[`${section.id}-${question.id}`];

      if (answer !== undefined) {
        // Obtener el campo de la API
        const field = question.field;
        const sectionKey = section.id;

        if (question.fieldType === "boolean") {
          // Para booleanos, usar directamente el valor mapeado
          body[sectionKey][field] = question.values[answer];
        } else if (question.fieldType === "score") {
          // Para scores, usar directamente el score
          body[sectionKey][field] = question.scores[answer];
        }
      }
    });
  });

  return body;
}

/**
 * Calcula el puntaje de una sección basado en las respuestas
 */
export function calculateSectionScore(section, wizardAnswers) {
  let totalScore = 0;
  let answeredCount = 0;

  section.questions.forEach((question) => {
    const answer = wizardAnswers[`${section.id}-${question.id}`];
    if (answer !== undefined) {
      if (question.fieldType === "score") {
        totalScore += question.scores[answer];
      } else if (question.fieldType === "boolean") {
        // Para booleanos: false = 0, true = 1 en términos de riesgo
        totalScore += question.values[answer] ? 2 : 0;
      }
      answeredCount++;
    }
  });

  if (answeredCount === 0) return null;

  // Normalizar a escala 0-10
  const maxScore = section.questions.length * 5;
  const normalizedScore = Math.min(10, (totalScore / maxScore) * 10);
  return parseFloat(normalizedScore.toFixed(1));
}

/**
 * Calcula el puntaje general de la evaluación
 */
export function calculateOverallScore(sectionScores) {
  const validScores = sectionScores.filter((s) => s !== null);
  if (validScores.length === 0) return 0;
  const average = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  return parseFloat(average.toFixed(1));
}
