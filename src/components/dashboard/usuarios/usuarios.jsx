"use client";

import { useState } from "react";
import { showToast } from "nextjs-toast-notify";
import { Plus, Pencil, Search, ChevronDown } from "lucide-react";
import ModalUsuarios from "./modalUsuarios";

const usuarios = [
  { nombre: "Carlos Méndez",  email: "carlos@empresa.com",        rol: "Administrador", empresa: "Alicorp Perú SAC",  estado: "Activo" },
  { nombre: "María López",    email: "maria@evaluaciones.pe",     rol: "Evaluador",     empresa: "Alicorp Perú SAC",  estado: "Activo" },
  { nombre: "Roberto Vargas", email: "roberto@minera.pe",         rol: "Empresa",       empresa: "Minera Sur SAC",    estado: "Activo" },
  { nombre: "Ana Torres",     email: "ana.torres@global.pe",      rol: "Evaluador",     empresa: "Global Foods SAC",  estado: "Inactivo" },
];

const rolBadge = {
  Administrador: "bg-info-bg text-info-fg",
  Evaluador:     "bg-warning-bg text-warning-fg",
  Empresa:       "bg-secondary text-secondary-fg",
};

const estadoBadge = {
  Activo:   "bg-success-bg text-success-fg",
  Inactivo: "bg-border text-muted-fg",
};

function Avatar({ nombre }) {
  const initials = nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
      <span className="text-secondary-fg text-xs font-semibold">{initials}</span>
    </div>
  );
}

export default function Usuarios() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openEdit = (u) => { setSelectedUser(u); setModalOpen(true); };
  const openNew  = ()  => { setSelectedUser(null); setModalOpen(true); };

  const handleEliminar = (nombre) =>
    showToast.warning(`¿Eliminar a ${nombre}?`, { position: "top-right", transition: "bounceIn", duration: 4000 });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-fg text-sm mt-0.5">Administra los usuarios y sus roles en la plataforma</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-primary-fg font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      <div className="flex-1 px-8 py-5 flex flex-col gap-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors">
            Filtrar por Rol <ChevronDown size={14} className="text-muted-fg" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground hover:bg-background transition-colors">
            Filtrar por Estado <ChevronDown size={14} className="text-muted-fg" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Usuario</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Email</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Rol</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Empresa</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-muted-fg font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar nombre={u.nombre} />
                      <span className="font-medium text-foreground">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-fg">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${rolBadge[u.rol]}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-foreground">{u.empresa}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBadge[u.estado]}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleEliminar(u.nombre)}
                        className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      >
                        <Plus size={13} className="rotate-45" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-border flex items-center justify-between">
            <span className="text-muted-fg text-xs">Mostrando 4 de 24 usuarios</span>
            <div className="flex items-center gap-4">
              <button className="text-sm text-foreground font-medium hover:text-primary transition-colors">Previous</button>
              <button className="text-sm text-foreground font-medium hover:text-primary transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      <ModalUsuarios
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={selectedUser}
        onSave={(isEdit) =>
          showToast.success(isEdit ? "Usuario actualizado." : "Usuario creado.", {
            position: "top-right", transition: "bounceIn", duration: 3500,
          })
        }
      />
    </div>
  );
}
