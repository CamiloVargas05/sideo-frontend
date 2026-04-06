/**
 * Componente Alert reutilizable
 * Soporta tipos: success, error, info, warning
 */

export function Alert({ type = "info", title, message, icon: CustomIcon, onClose, className = "" }) {
  const styles = {
    success: {
      bg: "bg-success-bg border-success-fg/20",
      title: "text-success-fg",
      text: "text-success-fg/90",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      bg: "bg-danger-bg border-danger-fg/20",
      title: "text-danger-fg",
      text: "text-danger-fg/90",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      ),
    },
    warning: {
      bg: "bg-warning-bg border-warning-fg/20",
      title: "text-warning-fg",
      text: "text-warning-fg/90",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      bg: "bg-info-bg border-info-fg/20",
      title: "text-info-fg",
      text: "text-info-fg/90",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${style.bg} ${className}`}
      role="alert"
    >
      <div className={`mt-0.5 shrink-0 ${style.title}`}>
        {CustomIcon ? <CustomIcon /> : style.icon}
      </div>
      <div className="flex-1">
        {title && <p className={`font-semibold ${style.title}`}>{title}</p>}
        <p className={style.text}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`mt-0.5 shrink-0 hover:opacity-70 transition-opacity ${style.title}`}
          aria-label="Cerrar alerta"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
