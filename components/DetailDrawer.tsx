"use client";

import type {
  ObligationDrawerDraft,
  ObligationRecurrence,
  ObligationStatus,
  ObligationType,
} from "@/types/lease";

const TYPE_OPTIONS: { value: ObligationType; label: string }[] = [
  { value: "document", label: "Document" },
  { value: "photo", label: "Photo" },
  { value: "acknowledgement", label: "Acknowledgement" },
  { value: "payment", label: "Payment" },
];

const RECURRENCE_OPTIONS: ObligationRecurrence[] = [
  "Once",
  "Annual",
  "Semi-annual",
  "Monthly",
  "Quarterly",
  "As-needed",
];

const STATUS_OPTIONS: ObligationStatus[] = [
  "draft",
  "pending",
  "fulfilled",
  "overdue",
  "flagged",
  "waived",
];

const STATUS_LABELS: Record<ObligationStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  fulfilled: "Fulfilled",
  overdue: "Overdue",
  flagged: "Flagged",
  waived: "Waived",
};

export interface DetailDrawerProps {
  /** Obligation id for headings / future API. */
  obligationId: string;
  /** Read-only lease clause from abstraction. */
  sourceClause: string;
  /** Controlled editable fields. */
  draft: ObligationDrawerDraft;
  onDraftChange: (next: ObligationDrawerDraft) => void;
  onSave: () => void;
  /** Sets status to Waived and persists (Flow 2). */
  onMarkWaived: () => void;
  onCancel: () => void;
  /**
   * `inline` — Flow 2: panel continues below the table inside the same card (not a modal).
   * `card` — standalone bordered panel (e.g. future modal body reuse).
   */
  variant?: "inline" | "card";
}

export function DetailDrawer({
  obligationId,
  sourceClause,
  draft,
  onDraftChange,
  onSave,
  onMarkWaived,
  onCancel,
  variant = "card",
}: DetailDrawerProps) {
  function patch<K extends keyof ObligationDrawerDraft>(key: K, value: ObligationDrawerDraft[K]) {
    onDraftChange({ ...draft, [key]: value });
  }

  const shellClass =
    variant === "inline"
      ? "border-t border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-5)] p-ls-24"
      : "rounded-card border border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] p-ls-24 ring-1 ring-[var(--colour-neutral-80)]";

  return (
    <section
      className={shellClass}
      aria-label="Obligation detail"
      data-drawer-variant={variant}
    >
      <div className="flex flex-col gap-ls-8 border-b border-[var(--colour-neutral-80)] pb-ls-16">
        <h2 className="text-fs-24 font-regular leading-lh-32 text-[var(--colour-neutral-15)]">
          Obligation detail
        </h2>
        <p className="text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-60)]">{obligationId}</p>
      </div>

      <div className="mt-ls-16">
        <p className="text-fs-12 font-semibold uppercase leading-lh-16 tracking-wide text-[var(--colour-neutral-60)]">
          Source clause
        </p>
        <blockquote className="mt-ls-8 border-l-4 border-[var(--colour-highlight-purple-100)] bg-[color:var(--colour-highlight-purple-50)] px-ls-16 py-ls-12 text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-15)]">
          {sourceClause}
        </blockquote>
      </div>

      <div className="mt-ls-24 grid gap-ls-16 sm:grid-cols-2">
        <label className="block space-y-ls-8 sm:col-span-2">
          <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
            Obligation name
          </span>
          <input
            type="text"
            className="kad-input"
            value={draft.name}
            onChange={(e) => patch("name", e.target.value)}
            autoComplete="off"
          />
        </label>

        <label className="block space-y-ls-8">
          <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">Type</span>
          <select
            className="kad-input"
            value={draft.type}
            onChange={(e) => patch("type", e.target.value as ObligationType)}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-ls-8">
          <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">Due date</span>
          <input
            type="date"
            className="kad-input"
            value={draft.dueDate}
            onChange={(e) => patch("dueDate", e.target.value)}
          />
        </label>

        <label className="block space-y-ls-8">
          <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
            Recurrence
          </span>
          <select
            className="kad-input"
            value={draft.recurrence}
            onChange={(e) => patch("recurrence", e.target.value as ObligationRecurrence)}
          >
            {RECURRENCE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-ls-8">
          <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">Status</span>
          <select
            className="kad-input"
            value={draft.status}
            onChange={(e) => patch("status", e.target.value as ObligationStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-ls-8 sm:col-span-2">
          <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
            Evidence required
          </span>
          <input
            type="text"
            className="kad-input"
            value={draft.evidenceRequired}
            onChange={(e) => patch("evidenceRequired", e.target.value)}
            placeholder="Describe what the tenant must submit"
            autoComplete="off"
          />
        </label>
      </div>

      <div className="mt-ls-24 flex flex-col gap-ls-8 border-t border-[var(--colour-neutral-80)] pt-ls-24 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={onSave} className="kad-btn-primary sm:min-w-[160px]">
          Save changes
        </button>
        <button type="button" onClick={onMarkWaived} className="kad-btn-secondary sm:min-w-[160px]">
          Mark as waived
        </button>
        <button type="button" onClick={onCancel} className="kad-btn-secondary sm:min-w-[160px]">
          Cancel
        </button>
      </div>
    </section>
  );
}
