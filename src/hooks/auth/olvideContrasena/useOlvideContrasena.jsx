"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export function useOlvideContrasena() {
  const [email, setEmail]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [sent, setSent]                 = useState(false);
  const [error, setError]               = useState("");
  const [showByeAlert, setShowByeAlert] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setShowByeAlert(true);
    setTimeout(() => setShowByeAlert(false), 2800);
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = Array.isArray(data?.message)
          ? data.message[0]
          : (data?.message ?? "No se pudo procesar la solicitud.");
        setError(msg);
        return;
      }
      setSent(true);
    } catch {
      setError("No se pudo conectar con el servidor. Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, loading, sent, setSent, error, setError, showByeAlert, handleSubmit };
}
