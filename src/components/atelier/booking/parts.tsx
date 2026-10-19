"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

/* ---------------- ornament ---------------- */
export function Ornament({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className={`h-px w-12 ${dark ? "bg-parchment/25" : "bg-ink/20"}`} />
      <span className={dark ? "text-parchment/50" : "text-terra"}>✦</span>
      <span className={`h-px w-12 ${dark ? "bg-parchment/25" : "bg-ink/20"}`} />
    </div>
  );
}

/* ---------------- error band ---------------- */
export function ErrorBand({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-l-2 border-terra bg-terra/10 px-4 py-3">
      <p className="font-sans text-[13px] leading-snug text-terra-deep">
        {children}
      </p>
      {action}
    </div>
  );
}

/* ---------------- form field ---------------- */
export function Field({
  label,
  optional,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
        {label}
        {optional && (
          <span className="ml-2 font-medium normal-case tracking-normal text-ink/35">
            optional
          </span>
        )}
      </span>
      <input
        {...props}
        className="mt-2 w-full border-b border-ink/25 bg-transparent py-3 font-sans text-base text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-terra"
      />
    </label>
  );
}

/* ---------------- step rail ---------------- */
const ROMANS = ["I", "II", "III", "IV"];

export const STEP_LABELS = ["Date & Hour", "Tickets", "Details", "Review"];

export function StepRail({ step }: { step: number }) {
  return (
    <div className="mt-5">
      <div className="flex items-start gap-2">
        {STEP_LABELS.map((s, i) => (
          <div key={s} className="flex min-w-0 flex-1 flex-col gap-2">
            <span
              className={`h-[2px] transition-colors duration-500 ${
                i <= step ? "bg-terra" : "bg-ink/15"
              }`}
            />
            <span
              className={`hidden truncate font-sans text-[9px] font-bold uppercase tracking-[0.18em] sm:block ${
                i === step ? "text-terra" : "text-ink/35"
              }`}
            >
              {ROMANS[i]} · {s}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-terra sm:hidden">
        {ROMANS[step]} · {STEP_LABELS[step]}
      </p>
    </div>
  );
}

/* ---------------- status chip ---------------- */
export function StatusChip({ status }: { status: string }) {
  const confirmed = status === "CONFIRMED";
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.25em] ${
        confirmed
          ? "border-gold/60 bg-gold/15 text-[#7a5c2e]"
          : "border-ink/25 text-ink/45"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${confirmed ? "bg-gold" : "bg-ink/35"}`}
      />
      {confirmed ? "Confirmed" : "Cancelled"}
    </span>
  );
}

/* ---------------- summary row ---------------- */
export function SummaryRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink/10 py-4 last:border-0">
      <div className="min-w-0">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-ink/45">
          {label}
        </p>
        <div className="mt-1.5 font-display text-base leading-snug text-ink">
          {children}
        </div>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-terra underline decoration-terra/40 underline-offset-4 transition-colors hover:text-terra-deep"
        >
          Edit
        </button>
      )}
    </div>
  );
}
