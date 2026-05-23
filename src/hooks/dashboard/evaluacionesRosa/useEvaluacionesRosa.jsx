"use client";

import { useState, useEffect } from "react";
import { showToast } from "nextjs-toast-notify";
import { mapWizardResponsesToApiBody } from "@/components/dashboard/evaluacionesRosa/utils/rosaMapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        
        // Usar todos los datos completos del servidor
        setWizardData({
          empleado: data.empleado,
          observations: data.observations,
          ...resultado, // Esto trae todos los datos desglosados del servidor
        });
        setView("result");
        showToast.success("Evaluación guardada correctamente", {
          position: "top-right",
          duration: 3000,
        });

        // Abrir el PDF automáticamente después de un pequeño delay
        const publicUrl = resultado.report?.file?.publicUrl;
        if (publicUrl) {
          setTimeout(() => {
            window.open(publicUrl, "_blank");
          }, 800);
        }

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
  const handleVerResultado = async (evaluacion) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Sesión expirada");
        return;
      }

      // Obtener detalles completos de la evaluación incluyendo el reporte
      const res = await fetch(`${API_URL}/evaluations/${evaluacion.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const detalles = await res.json();
        
        // Obtener el reporte asociado
        const reportsRes = await fetch(`${API_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let report = null;
        if (reportsRes.ok) {
          const reports = await reportsRes.json();
          report = reports.find((r) => r.evaluationId === evaluacion.id);
        }

        // Convertir evaluación al formato de resultado usando todos los datos del servidor
        setWizardData({
          empleado: {
            id: evaluacion.employeeId || evaluacion.id,
            firstName: evaluacion.employee?.split(" ")[0] || evaluacion.employee || "",
            lastName: evaluacion.employee?.split(" ").slice(1).join(" ") || "",
            position: evaluacion.position || "",
            area: evaluacion.area || "",
            email: evaluacion.email || "",
          },
          ...detalles, // Usar todos los detalles del servidor
          report: report ? { file: report } : detalles.report,
        });
        setView("result");
      } else {
        setError("No se pudieron cargar los detalles de la evaluación");
      }
    } catch (err) {
      console.error("Error loading evaluation details:", err);
      setError("Error al cargar los detalles");
    }
  };

  /**
   * Descarga la evaluación como PDF
   */
  const handleDownloadPDF = () => {
    try {
      // Buscar publicUrl en diferentes posibles estructuras
      let publicUrl = 
        wizardData?.report?.file?.publicUrl ||
        wizardData?.report?.publicUrl ||
        (Array.isArray(wizardData?.report) && wizardData.report[0]?.publicUrl);

      console.log("Datos de evaluación:", wizardData);
      console.log("URL encontrada:", publicUrl);

      if (!publicUrl) {
        showToast.error("El PDF no está disponible aún", {
          position: "top-right",
          duration: 3000,
        });
        return;
      }

      // Abrir en nueva pestaña para visualizar/descargar
      window.open(publicUrl, "_blank");

      showToast.success("PDF abierto en nueva pestaña", {
        position: "top-right",
        duration: 3000,
      });
    } catch (err) {
      console.error("Error descargando PDF:", err);
      showToast.error("Error al descargar el PDF", {
        position: "top-right",
        duration: 3000,
      });
    }
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
