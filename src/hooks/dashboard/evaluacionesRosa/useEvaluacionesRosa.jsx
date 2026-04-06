"use client";

import { useState, useEffect } from "react";
import { showToast } from "nextjs-toast-notify";
import { mapWizardResponsesToApiBody } from "@/components/dashboard/evaluacionesRosa/utils/rosaMapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useEvaluacionesRosa() {
  // Estados principales
  const [view, setView] = useState("list"); // "list" | "selector" | "wizard" | "result"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Datos de la evaluación en curso
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [wizardData, setWizardData] = useState(null);

  /**
   * Inicia una nueva evaluación
   */
  const handleNuevaEvaluacion = () => {
    setSelectedEmpleado(null);
    setWizardData(null);
    setView("selector");
  };

  /**
   * Selecciona un empleado y abre el wizard
   */
  const handleSeleccionarEmpleado = (empleado) => {
    setSelectedEmpleado(empleado);
    setWizardData(null);
    setView("wizard");
  };

  /**
   * Finaliza el wizard y guarda la evaluación
   */
  async function handleFinishWizard(data) {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("Sesión expirada");
        return false;
      }

      // Mapear datos del wizard al formato de la API
      const apiBody = mapWizardResponsesToApiBody(
        data.answers,
        data.empleado.id,
        data.observations
      );

      // Enviar a la API
      const res = await fetch(`${API_URL}/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiBody),
      });

      if (res.ok) {
        const resultado = await res.json();
        setWizardData({
          ...data,
          id: resultado.id,
        });
        setView("result");
        showToast.success("Evaluación guardada correctamente", {
          position: "top-right",
          duration: 3000,
        });
        return true;
      } else if (res.status === 401) {
        setError("Sesión expirada");
        return false;
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(
          errorData.message ?? "Error al guardar la evaluación"
        );
        showToast.error("Error al guardar la evaluación", {
          position: "top-right",
          duration: 3000,
        });
        return false;
      }
    } catch (err) {
      console.error("Error finishing wizard:", err);
      setError("Error de conexión");
      showToast.error("Error de conexión", {
        position: "top-right",
        duration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Ver detalle de una evaluación existente
   */
  const handleVerResultado = (evaluacion) => {
    // Convertir evaluación de la lista al formato de resultado
    setWizardData({
      empleado: {
        id: evaluacion.employeeId,
        firstName: evaluacion.employeeName?.split(" ")[0] || "",
        lastName: evaluacion.employeeName?.split(" ").slice(1).join(" ") || "",
        position: evaluacion.position,
        area: evaluacion.area,
        email: evaluacion.email,
      },
      id: evaluacion.id,
      overallScore: evaluacion.score || 0,
      observations: evaluacion.observations || "",
    });
    setView("result");
  };

  /**
   * Descarga la evaluación como PDF
   */
  const handleDownloadPDF = () => {
    showToast.success("Descargando PDF...", {
      position: "top-right",
      duration: 2000,
    });
    // TODO: Implementar descarga de PDF
  };

  /**
   * Cancela la evaluación actual
   */
  const handleCancelar = () => {
    setSelectedEmpleado(null);
    setWizardData(null);
    setError("");
    setView("list");
  };

  return {
    // Estado
    view,
    setView,
    loading,
    error,

    // Datos
    selectedEmpleado,
    wizardData,

    // Acciones
    handleNuevaEvaluacion,
    handleSeleccionarEmpleado,
    handleFinishWizard,
    handleVerResultado,
    handleDownloadPDF,
    handleCancelar,
  };
}
