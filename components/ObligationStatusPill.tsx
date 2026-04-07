import type { ObligationStatus } from "@/types/lease";

const LABELS: Record<ObligationStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  fulfilled: "Fulfilled",
  overdue: "Overdue",
  flagged: "Flagged",
  waived: "Waived",
};

export interface ObligationStatusPillProps {
  status: ObligationStatus;
  className?: string;
}

/**
 * Flow 2 — table status pills. Colours from `app/globals.css` `--flow2-pill-*`
 * (KAD Success / Highlight Blue / semantic danger / On-hold / neutrals).
 */
export function ObligationStatusPill({ status, className = "" }: ObligationStatusPillProps) {
  const base =
    "inline-flex max-w-full min-h-[28px] items-center justify-center whitespace-nowrap rounded-full border border-[var(--border-width-default)] px-ls-12 py-ls-4 text-center text-fs-12 font-semibold leading-lh-16";

  const styles: Record<ObligationStatus, string> = {
    fulfilled:
      "border-[color:var(--flow2-pill-fulfilled-border)] bg-[color:var(--flow2-pill-fulfilled-bg)] text-[color:var(--flow2-pill-fulfilled-text)]",
    pending:
      "border-[color:var(--flow2-pill-pending-border)] bg-[color:var(--flow2-pill-pending-bg)] text-[color:var(--flow2-pill-pending-text)]",
    overdue:
      "border-[color:var(--flow2-pill-overdue-border)] bg-[color:var(--flow2-pill-overdue-bg)] text-[color:var(--flow2-pill-overdue-text)]",
    flagged:
      "border-[color:var(--flow2-pill-flagged-border)] bg-[color:var(--flow2-pill-flagged-bg)] text-[color:var(--flow2-pill-flagged-text)]",
    waived:
      "border-[color:var(--flow2-pill-waived-border)] bg-[color:var(--flow2-pill-waived-bg)] text-[color:var(--flow2-pill-waived-text)]",
    draft:
      "border-[color:var(--flow2-pill-draft-border)] bg-[color:var(--flow2-pill-draft-bg)] text-[color:var(--flow2-pill-draft-text)]",
  };

  return (
    <span className={`${base} ${styles[status]} ${className}`.trim()} data-status={status}>
      {LABELS[status]}
    </span>
  );
}
