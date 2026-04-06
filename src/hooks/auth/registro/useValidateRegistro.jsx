"use client";

/**
 * Hook para validar datos del formulario de registro
 * Centraliza todas las reglas de validación para empresa y administrador
 */

export function useValidateRegistro() {
  /**
   * VALIDACIONES PARA EMPRESA (Step 0)
   */
  const validateCompanyName = (value) => {
    if (!value?.trim()) return "El nombre de la empresa es obligatorio";
    if (value.length < 3) return "El nombre debe tener al menos 3 caracteres";
    if (value.length > 100) return "El nombre no puede exceder 100 caracteres";
    return null;
  };

  const validateNit = (value) => {
    if (!value?.trim()) return "El NIT es obligatorio";
    const cleanNit = value.replace(/[^0-9]/g, "");
    if (!/^\d+$/.test(cleanNit)) return "El NIT solo debe contener números";
    if (cleanNit.length < 8 || cleanNit.length > 10) {
      return "El NIT debe tener entre 8 y 10 dígitos";
    }
    return null;
  };

  const validateSector = (value) => {
    if (!value?.trim()) return "El sector es obligatorio";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
      return "El sector solo debe contener letras";
    }
    return null;
  };

  const validateCity = (value) => {
    if (!value?.trim()) return "La ciudad es obligatoria";
    if (value.length < 3) return "La ciudad debe tener al menos 3 caracteres";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
      return "La ciudad solo debe contener letras";
    }
    return null;
  };

  const validatePhone = (value) => {
    if (!value?.trim()) return "El teléfono es obligatorio";
    const cleanPhone = value.replace(/[^0-9]/g, "");
    if (!/^\d+$/.test(cleanPhone)) return "El teléfono solo debe contener números";
    if (cleanPhone.length !== 10) {
      return "El teléfono debe tener exactamente 10 dígitos";
    }
    return null;
  };

  /**
   * VALIDACIONES PARA ADMINISTRADOR (Step 1)
   */
  const validateAdminFirstName = (value) => {
    if (!value?.trim()) return "El nombre es obligatorio";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
      return "El nombre solo debe contener letras";
    }
    return null;
  };

  const validateAdminLastName = (value) => {
    if (!value?.trim()) return "El apellido es obligatorio";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
      return "El apellido solo debe contener letras";
    }
    return null;
  };

  const validateAdminEmail = (value) => {
    if (!value?.trim()) return "El correo es obligatorio";
    if (!value.includes("@")) return "El correo debe contener @";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "El formato del correo no es válido";
    return null;
  };

  /**
   * VALIDACIONES POR PASO
   */
  const validateStep0 = (form) => {
    const errors = {};
    errors.companyName = validateCompanyName(form.companyName);
    errors.nit = validateNit(form.nit);
    errors.sector = validateSector(form.sector);
    errors.city = validateCity(form.city);
    errors.phone = validatePhone(form.phone);
    return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
  };

  const validateStep1 = (form) => {
    const errors = {};
    errors.adminFirstName = validateAdminFirstName(form.adminFirstName);
    errors.adminLastName = validateAdminLastName(form.adminLastName);
    errors.adminEmail = validateAdminEmail(form.adminEmail);
    return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
  };

  const validateStep2 = (form) => {
    const errors = {};
    if (!form.plan) errors.plan = "Debe seleccionar un plan";
    if (!form.paymentMethod) errors.paymentMethod = "Debe seleccionar un método de pago";
    return errors;
  };

  return {
    // Individual validators
    validateCompanyName,
    validateNit,
    validateSector,
    validateCity,
    validatePhone,
    validateAdminFirstName,
    validateAdminLastName,
    validateAdminEmail,
    // Step validators
    validateStep0,
    validateStep1,
    validateStep2,
  };
}
