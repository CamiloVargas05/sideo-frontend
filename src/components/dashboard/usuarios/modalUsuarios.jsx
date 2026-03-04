"use client";

import { X } from "lucide-react";

export default function ModalUsuarios({ isOpen, onClose, usuario = null, onSave }) {
  if (!isOpen) return null;

  const isEdit = Boolean(usuario);

  const handleSave = () => {
    onSave?.(isEdit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <button onClick={onClose} className="text-muted-fg hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Nombre completo</label>
            <input
              type="text"
              defaultValue={usuario?.nombre ?? ""}
              placeholder="Dr. Carlos Méndez"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Correo electrónico</label>
            <input
              type="email"
              defaultValue={usuario?.email ?? ""}
              placeholder="correo@empresa.com"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Rol</label>
            <select
              defaultValue={usuario?.rol ?? ""}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Evaluador">Evaluador</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Empresa</label>
            <select
              defaultValue={usuario?.empresa ?? ""}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar empresa</option>
              <option value="Aceros del Perú SAC">Aceros del Perú SAC</option>
              <option value="Minera Andina Corp">Minera Andina Corp</option>
              <option value="Constructora Lima SAC">Constructora Lima SAC</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-border text-foreground font-medium py-2 rounded-lg text-sm hover:bg-background transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-fg font-medium py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            {isEdit ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}
