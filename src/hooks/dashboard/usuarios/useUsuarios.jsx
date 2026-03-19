"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

const ROL_LABEL = {
  ADMIN:       "Administrador",
  EVALUATOR:   "Evaluador",
  SUPER_ADMIN: "Super Admin",
  // lowercase (según lo que devuelve el backend)
  admin:       "Administrador",
  evaluator:   "Evaluador",
  super_admin: "Super Admin",
};

function mapUsuario(u) {
  return {
    id:        u.id,
    nombre:    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
    firstName: u.firstName ?? "",
    lastName:  u.lastName  ?? "",
    email:     u.email     ?? "",
    phone:     u.phone     ?? "",
    position:  u.position  ?? "",
    rol:       ROL_LABEL[u.role] ?? u.role ?? "—",
    roleKey:   u.role      ?? "",
    isActive:  u.active    ?? u.isActive ?? true,
    estado:    (u.active   ?? u.isActive ?? true) ? "Activo" : "Inactivo",
  };
}

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => { fetchUsuarios(); }, []);

  async function fetchUsuarios() {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data ?? data.users ?? []);
        setUsuarios(list.map(mapUsuario));
      }
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCrearEvaluador(formData) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/users/evaluators`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchUsuarios();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleActualizar(userId, formData) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchUsuarios();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleDesactivar(userId) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/users/${userId}/desactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchUsuarios();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleReactivar(userId) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/users/${userId}/reactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchUsuarios();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    }
  }

  async function handleResetPassword(userId) {
    const token = getToken();
    if (!token) return { ok: false };
    try {
      const res = await fetch(`${API_URL}/users/${userId}/reset-password`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  }

  return {
    usuarios, loading, error,
    handleCrearEvaluador, handleActualizar,
    handleDesactivar, handleReactivar, handleResetPassword,
  };
}