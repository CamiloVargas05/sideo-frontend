"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export function useRegistro() {
  const router = useRouter();

  const [step, setStep]     = useState(0);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

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
  }

  function nextStep(e) {
    e.preventDefault();
    setError("");
    setStep((s) => s + 1);
  }

  function prevStep() {
    setError("");
    setStep((s) => s - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.plan || !form.paymentMethod) {
      setError("Seleccione un plan y un método de pago.");
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
      router.push("/auth/login?registered=1");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return { step, form, set, error, loading, nextStep, prevStep, handleSubmit };
}
