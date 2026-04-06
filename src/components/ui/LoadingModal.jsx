/**
 * Componente Modal de Cargando
 * Se muestra durante operaciones asíncronas
 */

export function LoadingModal({ isOpen, message = "Cargando...", title = "Por favor espere" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <svg
            className="w-full h-full animate-spin text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>

        {/* Contenido */}
        <div className="text-center flex flex-col gap-2">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-fg">{message}</p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "70%" }} />
        </div>
      </div>
    </div>
  );
}
