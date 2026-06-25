"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { PolariaFormInput } from "@/components/shared/PolariaFormField";
import { PolariaFormModal } from "@/components/shared/PolariaFormModal";
import { DomainServiceError } from "@/lib/domain-service-error";
import { generateCodigoCuentaFromNombre, normalizeCodigoCuentaInput } from "@/lib/generate-codigo-cuenta";
import { useAuthStore } from "@/stores/auth.store";
import { createCuentaConfigurator } from "../services/cuentas.service";

interface CuentaCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const INITIAL_FORM = {
  nombre: "",
  codigo: "",
};

export function CuentaCreateModal({
  open,
  onClose,
  onCreated,
}: CuentaCreateModalProps) {
  const idCreador = useAuthStore((state) => state.session?.idUsuario ?? null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [codigoManual, setCodigoManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm(INITIAL_FORM);
    setCodigoManual(false);
    setError(null);
    setIsSubmitting(false);
  }, [open]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [isSubmitting, onClose]);

  const handleNombreChange = (value: string) => {
    setForm((current) => ({
      nombre: value,
      codigo: codigoManual
        ? current.codigo
        : generateCodigoCuentaFromNombre(value),
    }));
  };

  const handleCodigoChange = (value: string) => {
    setCodigoManual(true);
    setForm((current) => ({
      ...current,
      codigo: normalizeCodigoCuentaInput(value),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createCuentaConfigurator({
        nombreComercial: form.nombre,
        codigoCuenta: form.codigo,
        idCreador,
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof DomainServiceError
          ? err.message
          : "No se pudo crear la cuenta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PolariaFormModal
      open={open}
      onClose={handleClose}
      sectionLabel="Nueva cuenta"
      title="Crear cuenta"
      description="Completa los campos para registrar una cuenta."
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      error={error}
      isSubmitting={isSubmitting}
      submitLabel="Crear"
    >
      <PolariaFormInput
        id="cuenta-id-automatico"
        label="ID automático"
        value=""
        placeholder="Se genera al guardar"
        readOnly
        disabled
      />

      <PolariaFormInput
        id="cuenta-nombre"
        label="Nombre"
        value={form.nombre}
        placeholder="Nombre de la cuenta"
        onChange={(event) => handleNombreChange(event.target.value)}
        disabled={isSubmitting}
        autoFocus
      />

      <PolariaFormInput
        id="cuenta-codigo"
        label="Código"
        value={form.codigo}
        placeholder="Código generado"
        onChange={(event) => handleCodigoChange(event.target.value)}
        disabled={isSubmitting}
        hint="Se genera al escribir el nombre (base 36, 5 caracteres); puedes ajustarlo si lo necesitas."
      />
    </PolariaFormModal>
  );
}
