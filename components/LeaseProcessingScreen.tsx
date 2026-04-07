"use client";

export interface LeaseProcessingScreenProps {
  /** Basenames of files being processed (Flow 1 upload). */
  fileNames: string[];
}

/**
 * Flow 1 — full-screen state after the landlord submits for abstraction (agent not wired yet).
 */
export function LeaseProcessingScreen({ fileNames }: LeaseProcessingScreenProps) {
  const displayNames = fileNames.length ? fileNames : ["Lease document"];

  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center px-ls-24 py-ls-48 text-center font-neue-plak-text"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="max-w-md space-y-ls-24">
        <div className="flex flex-col items-center gap-ls-16 sm:flex-row sm:justify-center sm:text-left">
          <span
            className="inline-block h-12 w-12 shrink-0 animate-spin rounded-full border-4 border-[var(--colour-neutral-80)] border-t-[var(--colour-highlight-blue-100)]"
            aria-hidden
          />
          <h1 className="text-fs-24 font-semibold leading-lh-32 text-[var(--colour-neutral-15)]">
            Reading your lease…
          </h1>
        </div>

        <div className="rounded-card border border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] px-ls-16 py-ls-12 text-left">
          <p className="text-fs-12 font-semibold uppercase tracking-wide text-[var(--colour-neutral-60)]">
            File{fileNames.length === 1 ? "" : "s"}
          </p>
          <ul className="mt-ls-8 space-y-ls-4">
            {displayNames.map((name, index) => (
              <li
                key={`${name}-${index}`}
                className="truncate text-fs-14 font-regular text-[var(--colour-neutral-15)]"
                title={name}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
          This usually takes less than a minute.
        </p>
      </div>
    </div>
  );
}
