"use client";

import { useState } from "react";
import {
  CreditCard, RefreshCw, TrendingUp, XCircle,
  CheckCircle, AlertTriangle, Calendar, Users, ChevronUp,
} from "lucide-react";
import { useSuscripcion, PLAN_INFO, STATUS_INFO } from "@/hooks/dashboard/suscripcion/useSuscripcion";
import { showToast } from "nextjs-toast-notify";

// ─── PLAN CARD ────────────────────────────────────────────────────────────────

function PlanCard({ planKey, currentPlan, onSelect }) {
  const p = PLAN_INFO[planKey];
  const isCurrent = planKey === currentPlan;
  const isUpgrade = ["plus", "pro", "max"].indexOf(planKey) > ["plus", "pro", "max"].indexOf(currentPlan);

  return (
    <button
      onClick={() => !isCurrent && onSelect(planKey)}
      disabled={isCurrent}
      className={`flex-1 rounded-xl border p-5 text-left transition-all ${
        isCurrent
          ? "border-primary bg-primary/5 cursor-default"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.badge}`}>
          {p.label}
        </span>
        {isCurrent && <CheckCircle size={16} className="text-primary" />}
        {isUpgrade && !isCurrent && <ChevronUp size={16} className="text-success-fg" />}
      </div>
      <p className="text-2xl font-bold text-foreground">
        ${p.price}
        <span className="text-sm font-normal text-muted-fg">/mes</span>
      </p>
      <p className="text-xs text-muted-fg mt-1">Hasta {p.maxEmployees} empleados</p>
      {isCurrent && <p className="text-xs text-primary font-medium mt-2">Plan actual</p>}
    </button>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-fg hover:text-foreground">
            <XCircle size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

const PAYMENT_OPTIONS = [
  { value: "tarjeta_credito", label: "Tarjeta de crédito"    },
  { value: "tarjeta_debito",  label: "Tarjeta de débito"     },
  { value: "pse",             label: "PSE"                   },
  { value: "transferencia",   label: "Transferencia bancaria" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Suscripcion() {
  const {
    info, history, loading, error, actionLoading,
    handleRenew, handleUpgrade, handleCancel,
  } = useSuscripcion();

  const [modal, setModal]             = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const planInfo   = PLAN_INFO[info?.plan]   ?? {};
  const statusInfo = STATUS_INFO[info?.status] ?? {};

  async function submitRenew() {
    const plan = selectedPlan ?? info?.plan;
    const result = await handleRenew(plan, paymentMethod || info?.paymentMethod);
    if (result.ok) {
      showToast.success("Suscripción renovada correctamente", { position: "top-right", duration: 3000 });
      setModal(null);
    } else {
      showToast.error(result.error ?? "Error al renovar", { position: "top-right", duration: 3000 });
    }
  }

  async function submitUpgrade() {
    if (!selectedPlan) return;
    const result = await handleUpgrade(selectedPlan, paymentMethod || info?.paymentMethod);
    if (result.ok) {
      showToast.success("Plan actualizado correctamente", { position: "top-right", duration: 3000 });
      setModal(null);
    } else {
      showToast.error(result.error ?? "Error al actualizar el plan", { position: "top-right", duration: 3000 });
    }
  }

  async function submitCancel() {
    const result = await handleCancel();
    if (result.ok) {
      showToast.success("Suscripción cancelada", { position: "top-right", duration: 3000 });
      setModal(null);
    } else {
      showToast.error(result.error ?? "Error al cancelar", { position: "top-right", duration: 3000 });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-danger-fg text-sm bg-danger-bg border border-danger-fg/20 rounded-lg px-4 py-3">
          {error}
        </p>
      </div>
    );
  }

  const usagePct = info ? Math.min(100, Math.round((info.currentEmployees / info.maxEmployees) * 100)) : 0;
  const isActive = info?.status === "active";

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-8 py-6 bg-card border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Suscripción</h1>
          <p className="text-muted-fg text-sm mt-0.5">Gestiona tu plan y método de pago</p>
        </div>

        <div className="flex-1 px-8 py-6 flex flex-col gap-6 overflow-y-auto">

          {/* Plan actual */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-fg">Plan actual</p>
                  <p className="font-bold text-foreground text-lg">{planInfo.label ?? info?.plan}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badge ?? "bg-muted text-muted-fg"}`}>
                {statusInfo.label ?? info?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div>
                <p className="text-xs text-muted-fg mb-1">Precio mensual</p>
                <p className="font-semibold text-foreground">${planInfo.price ?? info?.price}/mes</p>
              </div>
              <div>
                <p className="text-xs text-muted-fg mb-1">Próximo vencimiento</p>
                <p className="font-semibold text-foreground">
                  {info?.endDate ? new Date(info.endDate).toLocaleDateString("es-CO") : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-fg mb-1">Días restantes</p>
                <p className={`font-semibold ${(info?.daysRemaining ?? 0) < 30 ? "text-warning-fg" : "text-foreground"}`}>
                  {info?.daysRemaining ?? "—"} días
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-fg mb-1">Método de pago</p>
                <p className="font-semibold text-foreground text-sm">{info?.paymentMethod ?? "—"}</p>
              </div>
            </div>

            {/* Employee usage */}
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-muted-fg" />
                <p className="text-sm text-muted-fg">Empleados</p>
              </div>
              <p className="text-sm font-medium text-foreground">
                {info?.currentEmployees} / {info?.maxEmployees}
              </p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${usagePct >= 90 ? "bg-danger-fg" : usagePct >= 70 ? "bg-warning-fg" : "bg-primary"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="text-xs text-muted-fg mt-1">
              {Math.max(0, (info?.maxEmployees ?? 0) - (info?.currentEmployees ?? 0))} espacios disponibles
            </p>
          </div>

          {/* Acciones */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Acciones</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => !isActive && setModal("renew")}
                disabled={isActive}
                title={isActive ? "Solo disponible cuando la suscripción está cancelada o vencida" : ""}
                className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} />
                Renovar suscripción
              </button>
              <button
                onClick={() => info?.plan !== "max" && isActive && (setSelectedPlan(null), setModal("upgrade"))}
                disabled={info?.plan === "max" || !isActive}
                title={info?.plan === "max" ? "Ya tienes el plan máximo" : !isActive ? "Activa tu suscripción primero" : ""}
                className="flex items-center gap-2 bg-success-bg text-success-fg border border-success-fg/30 font-semibold px-4 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <TrendingUp size={16} />
                Mejorar plan
              </button>
              <button
                onClick={() => isActive && setModal("cancel")}
                disabled={!isActive}
                title={!isActive ? "La suscripción ya está cancelada o vencida" : ""}
                className="flex items-center gap-2 bg-danger-bg text-danger-fg border border-danger-fg/30 font-semibold px-4 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <XCircle size={16} />
                Cancelar suscripción
              </button>
            </div>
          </div>

          {/* Historial */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-muted-fg" />
              <h2 className="font-semibold text-foreground">Historial de suscripciones</h2>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-fg text-center py-6">Sin historial de suscripciones.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Plan", "Estado", "Inicio", "Fin", "Monto", "Pago"].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-muted-fg pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((sub, i) => {
                      const planKey = (sub.plan ?? sub.planName ?? "").toLowerCase();
                      const statusKey = (sub.status ?? sub.state ?? "").toLowerCase();
                      const pi = PLAN_INFO[planKey];
                      const si = STATUS_INFO[statusKey];
                      const startDate = sub.startDate ?? sub.start ?? sub.createdAt;
                      const endDate   = sub.endDate   ?? sub.end   ?? sub.expiresAt;
                      const amount    = sub.amount ?? sub.monthlyPrice ?? sub.price ?? sub.total;
                      const currency  = sub.currency ?? "USD";
                      const payment   = sub.paymentMethod ?? sub.payment ?? "—";
                      return (
                        <tr key={sub.id ?? i} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pi?.badge ?? "bg-muted text-muted-fg"}`}>
                              {pi?.label ?? planKey ?? "—"}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${si?.badge ?? "bg-muted text-muted-fg"}`}>
                              {si?.label ?? statusKey ?? "—"}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-muted-fg">
                            {startDate ? new Date(startDate).toLocaleDateString("es-CO") : "—"}
                          </td>
                          <td className="py-3 pr-4 text-muted-fg">
                            {endDate ? new Date(endDate).toLocaleDateString("es-CO") : "—"}
                          </td>
                          <td className="py-3 pr-4 text-foreground font-medium">
                            {amount != null ? `$${amount} ${currency}` : "—"}
                          </td>
                          <td className="py-3 text-muted-fg text-xs">{payment}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Renovar */}
      {modal === "renew" && (
        <Modal title="Renovar suscripción" onClose={() => setModal(null)}>
          <p className="text-sm text-muted-fg mb-4">
            Selecciona el plan para renovar y confirma el método de pago.
          </p>
          <div className="flex gap-3 mb-4">
            {Object.keys(PLAN_INFO).map((k) => (
              <PlanCard
                key={k}
                planKey={k}
                currentPlan={selectedPlan ?? info?.plan}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>
          <label className="block text-sm font-medium text-foreground mb-1">Método de pago</label>
          <select
            value={paymentMethod || info?.paymentMethod || ""}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          >
            <option value="" disabled>Selecciona un método</option>
            {PAYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button
              onClick={() => setModal(null)}
              className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={submitRenew}
              disabled={actionLoading}
              className="flex-1 bg-primary text-primary-fg rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {actionLoading ? "Procesando…" : "Confirmar renovación"}
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: Mejorar plan */}
      {modal === "upgrade" && (
        <Modal title="Mejorar plan" onClose={() => setModal(null)}>
          <p className="text-sm text-muted-fg mb-4">
            Elige el nuevo plan al que deseas migrar.
          </p>
          <div className="flex gap-3 mb-4">
            {Object.keys(PLAN_INFO)
              .filter((k) => ["plus", "pro", "max"].indexOf(k) > ["plus", "pro", "max"].indexOf(info?.plan ?? "plus"))
              .map((k) => (
                <PlanCard
                  key={k}
                  planKey={k}
                  currentPlan={selectedPlan}
                  onSelect={setSelectedPlan}
                />
              ))}
          </div>
          <label className="block text-sm font-medium text-foreground mb-1">Método de pago</label>
          <select
            value={paymentMethod || info?.paymentMethod || ""}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          >
            <option value="" disabled>Selecciona un método</option>
            {PAYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button
              onClick={() => setModal(null)}
              className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={submitUpgrade}
              disabled={actionLoading || !selectedPlan}
              className="flex-1 bg-primary text-primary-fg rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {actionLoading ? "Procesando…" : "Confirmar mejora"}
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: Cancelar */}
      {modal === "cancel" && (
        <Modal title="Cancelar suscripción" onClose={() => setModal(null)}>
          <div className="flex items-start gap-3 bg-warning-bg border border-warning-fg/30 rounded-lg p-4 mb-4">
            <AlertTriangle size={18} className="text-warning-fg shrink-0 mt-0.5" />
            <p className="text-sm text-warning-fg">
              Al cancelar, tu suscripción permanecerá activa hasta el{" "}
              <strong>{info?.endDate ? new Date(info.endDate).toLocaleDateString("es-CO") : "fin del período"}</strong>.
              No se realizarán más cobros.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModal(null)}
              className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Mantener plan
            </button>
            <button
              onClick={submitCancel}
              disabled={actionLoading}
              className="flex-1 bg-danger-bg text-danger-fg border border-danger-fg/30 rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {actionLoading ? "Procesando…" : "Sí, cancelar"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
