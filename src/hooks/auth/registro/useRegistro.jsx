"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useValidateRegistro } from "./useValidateRegistro";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useRegistro() {
  const router = useRouter();
  const { validateStep0, validateStep1, validateStep2 } = useValidateRegistro();

  const [step, setStep]     = useState(0);
  const [error, setError]   = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    nit: "",
    sector: "",
    city: "",
    phone: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    plan: "",
    paymentMethod: "",
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  }

  function nextStep(e) {
    e.preventDefault();
    setError("");
    
    // Validar según el paso actual
    let errors = {};
    if (step === 0) {
      errors = validateStep0(form);
    } else if (step === 1) {
      errors = validateStep1(form);
    } else if (step === 2) {
      errors = validateStep2(form);
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorMsg = Object.values(errors)[0];
      setError(firstErrorMsg);
      return;
    }

    setFieldErrors({});
    setStep((s) => s + 1);
  }

  function prevStep() {
    setError("");
    setFieldErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validar paso 2
    const errors = validateStep2(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorMsg = Object.values(errors)[0];
      setError(firstErrorMsg);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
        setError(msg ?? "Error al registrar. Intente nuevamente.");
        return;
      }
      // Mostrar modal de éxito por 3 segundos, luego redirigir
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/auth/login?registered=1");
      }, 3000);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return { step, form, set, error, fieldErrors, loading, nextStep, prevStep, handleSubmit, showSuccessModal, setShowSuccessModal };
}
