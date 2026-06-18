"use client";

import { ArrowRight, Building2, Loader2, User } from "lucide-react";
import { cn } from "@/lib/cn";

interface LoginStepUserProps {
  identificador: string;
  codigoEmpresa: string;
  showCodigoEmpresa: boolean;
  isLoading: boolean;
  error: string | null;
  onIdentificadorChange: (value: string) => void;
  onCodigoEmpresaChange: (value: string) => void;
  onSubmit: () => void;
}

export function LoginStepUser({
  identificador,
  codigoEmpresa,
  showCodigoEmpresa,
  isLoading,
  error,
  onIdentificadorChange,
  onCodigoEmpresaChange,
  onSubmit,
}: LoginStepUserProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="polaria-card-glow rounded-2xl border border-polaria-t-20 bg-polaria-t-08 p-6 backdrop-blur-xl sm:p-8">
      <p className="mb-6 text-center text-sm text-polaria-w-50">
        {showCodigoEmpresa
          ? "Ingresa el código de tu empresa para continuar"
          : "Ingresa tu nombre de usuario para continuar"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="identificador"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-polaria-teal"
          >
            <User className="h-4 w-4" />
            Usuario
          </label>
          <input
            id="identificador"
            type="text"
            autoComplete="username"
            placeholder="Tu nombre de usuario"
            value={identificador}
            onChange={(e) => onIdentificadorChange(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-xl border border-polaria-w-08 bg-polaria-w-08 px-4 py-3 text-polaria-w placeholder:text-polaria-w-20 outline-none transition focus:border-polaria-t-20 focus:ring-1 focus:ring-polaria-t-20 disabled:opacity-60"
          />
        </div>

        {showCodigoEmpresa && (
          <div>
            <label
              htmlFor="codigoEmpresa"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-polaria-teal"
            >
              <Building2 className="h-4 w-4" />
              Código de empresa
            </label>
            <input
              id="codigoEmpresa"
              type="text"
              autoComplete="organization"
              placeholder="Ej: ACME"
              value={codigoEmpresa}
              onChange={(e) => onCodigoEmpresaChange(e.target.value.toUpperCase())}
              disabled={isLoading}
              className="w-full rounded-xl border border-polaria-w-08 bg-polaria-w-08 px-4 py-3 text-polaria-w placeholder:text-polaria-w-20 outline-none transition focus:border-polaria-t-20 focus:ring-1 focus:ring-polaria-t-20 disabled:opacity-60"
            />
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !identificador.trim()}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-polaria-teal px-4 py-3 text-sm font-semibold text-polaria-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
