"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useId, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PolariaFormModalProps {
  open: boolean;
  onClose: () => void;
  sectionLabel?: string;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  closeLabel?: string;
  className?: string;
  /** Formularios largos: menos padding, cabecera compacta y scroll interno. */
  compact?: boolean;
}

export function PolariaFormModal({
  open,
  onClose,
  sectionLabel,
  title,
  description,
  children,
  onSubmit,
  error,
  isSubmitting = false,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  closeLabel = "Cerrar",
  className,
  compact = false,
}: PolariaFormModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSubmitting, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          aria-label="Cerrar modal"
          className="fixed inset-0 bg-polaria-bg/80 backdrop-blur-sm"
          onClick={() => {
            if (!isSubmitting) onClose();
          }}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "polaria-card-glow relative z-10 flex w-full max-h-[min(90dvh,calc(100vh-2rem))] flex-col rounded-2xl border border-polaria-t-20 bg-polaria-t-08 backdrop-blur-xl",
            compact ? "max-w-md p-4 sm:p-5" : "max-w-lg p-6 sm:p-8",
            className,
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-start justify-between gap-4",
              compact ? "mb-4" : "mb-6",
            )}
          >
          <div>
            {sectionLabel ? (
              <p className="polaria-text-label text-polaria-teal">
                {sectionLabel}
              </p>
            ) : null}
            <h2
              id={titleId}
              className={cn(
                "polaria-text-card-title mt-1",
                compact && "text-lg sm:text-xl",
              )}
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className={cn(
                  "polaria-text-subtitle",
                  compact ? "mt-1 text-sm" : "mt-2",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={cn(
              "shrink-0 rounded-lg border border-polaria-w-08 px-3 py-1.5",
              "polaria-text-body-sm text-polaria-w transition hover:border-polaria-t-20 hover:text-polaria-teal",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-polaria-teal focus-visible:ring-offset-2 focus-visible:ring-offset-polaria-bg",
            )}
          >
            {closeLabel}
          </button>
          </div>

          <form
            onSubmit={onSubmit}
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-y-auto",
              compact ? "gap-3" : "gap-5",
            )}
          >
          {children}

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-polaria-danger-border bg-polaria-danger-bg px-3 py-2 polaria-text-body-sm text-polaria-danger"
            >
              {error}
            </p>
          ) : null}

          <div
            className={cn(
              "flex shrink-0 flex-wrap items-center justify-end gap-3",
              compact ? "pt-1" : "pt-2",
            )}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={cn(
                "rounded-xl border border-polaria-w-08 px-4 py-2.5",
                "polaria-text-body-sm text-polaria-w transition hover:border-polaria-t-20 hover:text-polaria-teal",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-polaria-teal focus-visible:ring-offset-2 focus-visible:ring-offset-polaria-bg",
              )}
            >
              {cancelLabel}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex min-w-[7rem] items-center justify-center gap-2 rounded-xl bg-polaria-teal px-4 py-2.5",
                "polaria-text-body-sm font-semibold text-polaria-bg transition hover:opacity-90",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-polaria-teal focus-visible:ring-offset-2 focus-visible:ring-offset-polaria-bg",
              )}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              {submitLabel}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
