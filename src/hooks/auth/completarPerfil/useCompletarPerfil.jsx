"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  phone: "",
  position: "",
  newPassword: "",
  companyAddress: "",
  companySector: "",
  logoUrl: "",
};

export function useCompletarPerfil() {
  const router = useRouter();
  const [form, setForm]       = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const initials = useMemo(() => {
    const f = form.firstName?.trim()?.charAt(0) ?? "";
    const l = form.lastName?.trim()?.charAt(0) ?? "";
    return `${f}${l}`.toUpperCase() || "US";
  }, [form.firstName, form.lastName]);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.phone || !form.position) {
      setError("Complete los datos personales obligatorios.");
      return;
    }

    if (!form.companyAddress || !form.companySector) {
      setError("Complete los datos de empresa obligatorios.");
      return;
    }

    if (!form.newPassword || form.newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");

      if (token) {
        const response = await fetch(`${API_URL}/auth/complete-profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            position: form.position,
            newPassword: form.newPassword,
            companyAddress: form.companyAddress,
            companySector: form.companySector,
            logoUrl: form.logoUrl,
          }),
        });

        if (!response.ok) {
          let apiMessage = "No se pudo completar el perfil. Intente nuevamente.";
          try {
            const payload = await response.json();
            apiMessage = Array.isArray(payload?.message)
              ? payload.message[0]
              : payload?.message ?? apiMessage;
          } catch {
            // Sin cuerpo JSON, se usa el mensaje por defecto.
          }
          throw new Error(apiMessage);
        }
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...storedUser,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        position: form.position,
        companyAddress: form.companyAddress,
        companySector: form.companySector,
        logoUrl: form.logoUrl,
        profileCompleted: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Ocurrió un error al guardar el perfil.");
    } finally {
      setLoading(false);
    }
  }

  return { form, setField, initials, loading, error, handleSubmit, router };
}
