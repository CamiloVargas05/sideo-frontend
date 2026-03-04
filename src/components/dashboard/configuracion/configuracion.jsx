"use client";

import { useEffect, useState } from "react";
import { showToast } from "nextjs-toast-notify";
import { Sun, Moon, CheckCircle, RefreshCw } from "lucide-react";

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-4" : ""}`}
      />
    </button>
  );
}

export default function Configuracion() {
  const [isDark, setIsDark] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = (next) => {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleGuardarPerfil = () =>
    showToast.success("Perfil actualizado correctamente.", { position: "top-right", transition: "bounceIn", duration: 3000 });

  const handleCambiarContrasena = () =>
    showToast.success("Contraseña cambiada correctamente.", { position: "top-right", transition: "bounceIn", duration: 3000 });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 bg-card border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-fg text-sm mt-0.5">Gestiona tu perfil, seguridad y preferencias de la plataforma</p>
      </div>

      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="flex gap-6 max-w-5xl">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Profile */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
              {/* User info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-secondary-fg font-semibold text-lg">CM</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Carlos Méndez Rodríguez</p>
                  <p className="text-muted-fg text-sm">Administrador · admin@ergocheck.com</p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Form */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Nombre",   placeholder: "Carlos",          id: "nombre" },
                  { label: "Apellido", placeholder: "Méndez Rodríguez", id: "apellido" },
                  { label: "Teléfono", placeholder: "+51 999 888 777", id: "telefono" },
                  { label: "Cargo",    placeholder: "Jefe de SST",     id: "cargo" },
                ].map((f) => (
                  <div key={f.id} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm text-foreground hover:bg-background transition-colors">
                  + Cancelar
                </button>
                <button
                  onClick={handleGuardarPerfil}
                  className="px-5 py-2 bg-primary text-primary-fg rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="font-semibold text-foreground">Seguridad</h2>
                <p className="text-muted-fg text-sm">Cambia tu contraseña de acceso</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Contraseña Actual",   placeholder: "········", id: "current" },
                  { label: "Nueva Contraseña",     placeholder: "········", id: "new" },
                  { label: "Confirmar Contraseña", placeholder: "········", id: "confirm" },
                ].map((f) => (
                  <div key={f.id} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">{f.label}</label>
                    <input
                      type="password"
                      placeholder={f.placeholder}
                      className="border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCambiarContrasena}
                  className="px-5 py-2 bg-primary text-primary-fg rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-64 flex flex-col gap-5 shrink-0">
            {/* Preferences */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <h2 className="font-semibold text-foreground">Preferencias</h2>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    {isDark ? <Moon size={14} /> : <Sun size={14} />} Modo Oscuro
                  </p>
                  <p className="text-muted-fg text-xs mt-0.5">Cambiar apariencia visual</p>
                </div>
                <ToggleSwitch checked={isDark} onChange={toggleDark} />
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Notificaciones Email</p>
                  <p className="text-muted-fg text-xs mt-0.5">Recibir alertas por correo</p>
                </div>
                <ToggleSwitch checked={emailNotif} onChange={setEmailNotif} />
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Idioma</p>
                  <p className="text-muted-fg text-xs mt-0.5">Idioma de la interfaz</p>
                </div>
                <select className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none">
                  <option>Español</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            {/* Plan */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
              <h2 className="font-semibold text-foreground">Plan Actual</h2>
              <div className="flex items-center justify-between">
                <p className="text-primary font-bold text-lg">Professional</p>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success-fg">Activo</span>
              </div>
              <p className="text-muted-fg text-sm">$99/mes</p>
              <ul className="flex flex-col gap-1.5">
                {["Hasta 500 empleados", "Reportes PDF ilimitados", "Soporte prioritario"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle size={14} className="text-success-fg shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => showToast.info("Redirigiendo a cambio de plan...", { position: "top-right", transition: "bounceIn", duration: 3000 })}
                className="w-full flex items-center justify-center gap-2 border border-border text-foreground text-sm font-medium py-2 rounded-xl hover:bg-background transition-colors"
              >
                <RefreshCw size={14} /> Cambiar Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
