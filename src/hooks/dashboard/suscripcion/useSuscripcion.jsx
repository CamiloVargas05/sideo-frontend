"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

// ─── DATOS DE DEMOSTRACIÓN ────────────────────────────────────────────────────
const MOCK_MODE = false;

const MOCK_INFO = {
  plan: "pro",
  status: "active",
  startDate: "2025-01-15T00:00:00.000Z",
  endDate: "2025-12-15T00:00:00.000Z",
  daysRemaining: 238,
  maxEmployees: 20,
  currentEmployees: 10,
  price: 99,
  currency: "USD",
  paymentMethod: "Tarjeta terminada en 4242",
  autoRenew: true,
};

const MOCK_HISTORY = [
  {
    id: "SUB-001",
    plan: "pro",
    status: "active",
    startDate: "2025-01-15T00:00:00.000Z",
    endDate: "2025-12-15T00:00:00.000Z",
    amount: 99,
    currency: "USD",
    paymentMethod: "Tarjeta terminada en 4242",
  },
  {
    id: "SUB-000",
    plan: "plus",
    status: "expired",
    startDate: "2024-01-10T00:00:00.000Z",
    endDate: "2025-01-10T00:00:00.000Z",
    amount: 49,
    currency: "USD",
    paymentMethod: "Tarjeta terminada en 4242",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export const PLAN_INFO = {
  plus: { label: "Plus",  price: 49,  maxEmployees: 10, badge: "bg-plan-plus-bg text-plan-plus-fg" },
  pro:  { label: "Pro",   price: 99,  maxEmployees: 20, badge: "bg-plan-pro-bg text-plan-pro-fg"   },
  max:  { label: "Max",   price: 249, maxEmployees: 50, badge: "bg-plan-max-bg text-plan-max-fg"   },
};

export const STATUS_INFO = {
  active:    { label: "Activa",    badge: "bg-success-bg text-success-fg"  },
  cancelled: { label: "Cancelada", badge: "bg-warning-bg text-warning-fg"  },
  expired:   { label: "Vencida",   badge: "bg-danger-bg text-danger-fg"    },
};

function getToken() {
  return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function useSuscripcion() {
  const [info, setInfo]         = useState(null);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (MOCK_MODE) {
      setInfo(MOCK_INFO);
      setHistory(MOCK_HISTORY);
      setLoading(false);
      return;
    }
    fetchInfo();
  }, []);

  async function fetchInfo() {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const [infoRes, histRes] = await Promise.all([
        fetch(`${API_URL}/subscriptions/info`,    { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/subscriptions/history`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (infoRes.ok) setInfo(await infoRes.json());
      else setError("No se pudo cargar la suscripción.");
      if (histRes.ok) {
        const h = await histRes.json();
        const list = Array.isArray(h)
          ? h
          : (h.data ?? h.history ?? h.subscriptions ?? h.items ?? []);
        setHistory(list);
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRenew(plan, paymentMethod) {
    if (MOCK_MODE) {
      setInfo((prev) => ({ ...prev, plan, daysRemaining: 365, status: "active" }));
      return { ok: true };
    }
    const token = getToken();
    if (!token) return { ok: false };
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/subscriptions/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan, paymentMethod }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchInfo();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpgrade(newPlan, paymentMethod) {
    if (MOCK_MODE) {
      setInfo((prev) => ({ ...prev, plan: newPlan, maxEmployees: PLAN_INFO[newPlan]?.maxEmployees ?? prev.maxEmployees }));
      return { ok: true };
    }
    const token = getToken();
    if (!token) return { ok: false };
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/subscriptions/upgrade`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPlan, paymentMethod }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchInfo();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (MOCK_MODE) {
      setInfo((prev) => ({ ...prev, status: "cancelled" }));
      return { ok: true };
    }
    const token = getToken();
    if (!token) return { ok: false };
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/subscriptions/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) await fetchInfo();
      return { ok: res.ok, error: body.message ?? null };
    } catch {
      return { ok: false, error: "Error de conexión." };
    } finally {
      setActionLoading(false);
    }
  }

  return {
    info, history, loading, error, actionLoading,
    handleRenew, handleUpgrade, handleCancel,
  };
}
