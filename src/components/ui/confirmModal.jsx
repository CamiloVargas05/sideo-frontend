"use client";

import { AlertTriangle, Info, X } from "lucide-react";

const VARIANTS = {
  danger: {
    icon:        <AlertTriangle size={22} className="text-danger-fg" />,
    iconBg:      "bg-danger-bg",
    confirmCls:  "bg-danger-fg text-white hover:opacity-90",
  },
  warning: {
    icon:        <AlertTriangle size={22} className="text-warning-fg" />,
    iconBg:      "bg-warning-bg",
    confirmCls:  "bg-warning-fg text-white hover:opacity-90",
  },
  info: {
    icon:        <Info size={22} className="text-primary" />,
    iconBg:      "bg-primary/10",
    confirmCls:  "bg-primary text-primary-fg hover:opacity-90",
  },
};

/**
 * ConfirmModal — reemplaza el confirm() nativo del browser.
 *
 * Uso en el componente padre:
 *   const [dialog, setDialog] = useState(null);
 *
 *   // para abrir:
 *   setDialog({
 *     title:        "¿Desactivar usuario?",
 *     message:      "Dejará de tener acceso a la plataforma.",
 *     variant:      "danger",            // "danger" | "warning" | "info"
 *     confirmLabel: "Desactivar",        // opcional, default "Confirmar"
 *     onConfirm:    () => hacerAlgo(),
 *   });
 *
 *   // en el JSX:
 *   {dialog && <ConfirmModal {...dialog} onClose={() => setDialog(null)} />}
 */
export default function ConfirmModal({
  title,
  message,
  variant = "danger",
  confirmLabel = "Confirmar",
  onConfirm,
  onClose,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.danger;

  async function handleConfirm() {
    onClose();
    await onConfirm?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${v.iconBg}`}>
              {v.icon}
            </div>
            <div>
              <p className="font-semibold text-foreground text-base leading-tight">{title}</p>
              {message && (
                <p className="text-sm text-muted-fg mt-1 leading-snug">{message}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-muted-fg hover:text-foreground transition-colors ml-2 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-background transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-opacity ${v.confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}