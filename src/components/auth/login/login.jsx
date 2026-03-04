import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-fg font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">SIDEO</h1>
          <p className="text-muted-fg text-sm">Inicia sesión en tu cuenta</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="correo@empresa.com"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Contraseña
              </label>
              <Link
                href="/auth/olvide-contrasena"
                className="text-xs text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-fg font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Iniciar Sesión
          </button>
        </div>

        <p className="text-center text-sm text-muted-fg mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/registro" className="text-primary font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
