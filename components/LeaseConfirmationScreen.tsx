"use client";

export interface LeaseConfirmationScreenProps {
  /** Staged obligation rows the agent produced (mock until API). */
  obligationsExtracted: number;
  leaseTermStartLabel: string;
  leaseTermEndLabel: string;
  onReviewObligations: () => void;
}

/**
 * Flow 1 Step 5 — after abstraction completes; landlord reviews in Flow 2 next.
 */
export function LeaseConfirmationScreen({
  obligationsExtracted,
  leaseTermStartLabel,
  leaseTermEndLabel,
  onReviewObligations,
}: LeaseConfirmationScreenProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-ls-24 py-ls-48 font-neue-plak-text">
      <div className="rounded-card border border-[color:var(--colour-status-success-100)] bg-[color:var(--colour-status-success-50)]/30 p-ls-32 ring-1 ring-[color:var(--colour-status-success-100)]/25">
        <div className="flex items-start gap-ls-16">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--colour-status-success-50)] text-[color:var(--colour-status-success-100)]"
            aria-hidden
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-fs-24 font-semibold leading-lh-32 text-[var(--colour-neutral-15)]">
              Lease successfully parsed
            </h1>
            <p className="mt-ls-12 text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
              <span className="text-fs-32 font-semibold tabular-nums text-[var(--colour-neutral-15)]">{obligationsExtracted}</span>{" "}
              obligations extracted
            </p>
          </div>
        </div>

        <dl className="mt-ls-24 space-y-ls-12 border-t border-[var(--colour-neutral-80)] pt-ls-24">
          <div>
            <dt className="text-fs-12 font-semibold uppercase tracking-wide text-[var(--colour-neutral-60)]">
              Lease term
            </dt>
            <dd className="mt-ls-4 text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-15)]">
              <span className="font-semibold">{leaseTermStartLabel}</span>
              <span className="mx-ls-8 text-[var(--colour-neutral-60)]">–</span>
              <span className="font-semibold">{leaseTermEndLabel}</span>
            </dd>
          </div>
        </dl>

        <div className="mt-ls-32">
          <button type="button" className="kad-btn-primary w-full sm:w-auto" onClick={onReviewObligations}>
            Review obligations
          </button>
        </div>
      </div>
    </div>
  );
}
