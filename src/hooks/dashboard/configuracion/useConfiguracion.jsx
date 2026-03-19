"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export const PLAN_INFO = {
  plus: {
    name: "Plus",
    employeeLimit: 10,
    features: ["Hasta 10 empleados", "Evaluaciones ROSA ilimitadas", "Reportes PDF"],
  },
  pro: {
    name: "Pro",
    employeeLimit: 20,
    features: ["Hasta 20 empleados", "Evaluaciones ROSA ilimitadas", "Reportes PDF", "Soporte prioritario"],
  },
  max: {
    name: "Max",
    employeeLimit: 50,
    features: ["Hasta 50 empleados", "Evaluaciones ROSA ilimitadas", "Reportes PDF ilimitados", "Soporte prioritario"],
  },
};

export const ROLE_LABELS = {
  ADMIN:       "Administrador",
  EVALUATOR:   "Evaluador",
  SUPER_ADMIN: "Super Administrador",
  // lowercase (según lo que devuelve el backend)
  admin:       "Administrador",
  evaluator:   "Evaluador",
  super_admin: "Super Administrador",
};

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
}

export function useConfiguracion() {
  const [user, setUser]           = useState({});
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName:  "",
    phone:     "",
    position:  "",
  });
  const [profileDirty, setProfileDirty] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword:  "",
    newPassword:      "",
    confirmPassword:  "",
  });
  const [passwordError, setPasswordError] = useState("");

  const [isDark, setIsDark] = useState(false);

  const [subscription, setSubscription]         = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [loadingProfile, setLoadingProfile]     = useState(false);
  const [loadingPassword, setLoadingPassword]   = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    // Carga inmediata desde localStorage para no mostrar vacío
    const stored = getStoredUser();
    setUser(stored);
    setProfileForm({
      firstName: stored.firstName ?? "",
      lastName:  stored.lastName  ?? "",
      phone:     stored.phone     ?? "",
      position:  stored.position  ?? "",
    });
    // Luego refresca desde la API para traer phone y position completos
    if (stored.id) fetchUserProfile(stored.id);
    fetchSubscription();
  }, []);

  async function fetchUserProfile(userId) {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const merged = { ...getStoredUser(), ...data };
      localStorage.setItem("user", JSON.stringify(merged));
      setUser(merged);
      setProfileForm({
        firstName: merged.firstName ?? "",
        lastName:  merged.lastName  ?? "",
        phone:     merged.phone     ?? "",
        position:  merged.position  ?? "",
      });
    } catch { /* silently fail — los datos de localStorage siguen mostrándose */ }
  }

  async function fetchSubscription() {
    const token = getToken();
    if (!token) return;
    setLoadingSubscription(true);
    try {
      const res = await fetch(`${API_URL}/subscriptions/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setSubscription(await res.json());
    } catch { /* silently fail */ } finally {
      setLoadingSubscription(false);
    }
  }

  const toggleDark = (next) => {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const setProfileField = (field) => (e) => {
    setProfileDirty(true);
    setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetProfile = () => {
    const stored = getStoredUser();
    setProfileForm({
      firstName: stored.firstName ?? "",
      lastName:  stored.lastName  ?? "",
      phone:     stored.phone     ?? "",
      position:  stored.position  ?? "",
    });
    setProfileDirty(false);
  };

  const setPasswordField = (field) => (e) => {
    setPasswordError("");
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  async function handleGuardarPerfil() {
    const token = getToken();
    if (!token || !user?.id) return { ok: false };
    setLoadingProfile(true);
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName:  profileForm.lastName,
          phone:     profileForm.phone,
          position:  profileForm.position,
        }),
      });
      if (res.ok) {
        const updated = { ...user, ...profileForm };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setProfileDirty(false);
      }
      return { ok: res.ok };
    } catch {
      return { ok: false };
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleCambiarContrasena() {
    setPasswordError("");
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Complete todos los campos.");
      return { ok: false };
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      return { ok: false };
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return { ok: false };
    }
    const token = getToken();
    if (!token) return { ok: false };
    setLoadingPassword(true);
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword:     passwordForm.newPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = Array.isArray(data?.message) ? data.message[0] : (data?.message ?? "Error al cambiar la contraseña.");
        setPasswordError(msg);
      } else {
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
      return { ok: res.ok };
    } catch {
      setPasswordError("No se pudo conectar con el servidor.");
      return { ok: false };
    } finally {
      setLoadingPassword(false);
    }
  }

  const initials = [profileForm.firstName, profileForm.lastName]
    .map((n) => n?.trim()?.charAt(0) ?? "")
    .join("")
    .toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  const roleLabel    = ROLE_LABELS[user?.role] ?? user?.role ?? "Usuario";
  const planInfo     = PLAN_INFO[subscription?.plan] ?? null;
  const subStatus    = subscription?.status ?? null;
  const subExpiresAt = subscription?.expiresAt ?? subscription?.endDate ?? null;

  return {
    user, profileForm, profileDirty,
    passwordForm, passwordError,
    isDark, toggleDark,
    subscription, loadingSubscription, planInfo, subStatus, subExpiresAt,
    loadingProfile, loadingPassword,
    initials, roleLabel,
    setProfileField, resetProfile,
    setPasswordField,
    handleGuardarPerfil, handleCambiarContrasena,
  };
}
