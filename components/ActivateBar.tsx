"use client";

export interface ActivateBarProps {
  /** Tenant display name — used in copy and confirmation. */
  tenantName: string;
  /** Whether reminders are active for this tenant (local / future API). */
  activated: boolean;
  /** Called after the user confirms activation. */
  onActivate: () => void | Promise<void>;
  /** Called when the user chooses to deactivate. */
  onDeactivate: () => void | Promise<void>;
}

/**
 * Flow 2: fixed to the bottom of the obligations panel.
 * Pre-activation: guidance + confirm to schedule reminders and email the tenant.
 * Post-activation: deactivate control.
 */
export function ActivateBar({ tenantName, activated, onActivate, onDeactivate }: ActivateBarProps) {
  async function handleActivateClick() {
    const ok = window.confirm(
      `This will schedule reminders and notify ${tenantName} by email. Continue?`,
    );
    if (ok) await Promise.resolve(onActivate());
  }

  async function handleDeactivateClick() {
    await Promise.resolve(onDeactivate());
  }

  return (
    <div
      role="region"
      aria-label="Obligation reminders activation"
      className="flex shrink-0 flex-col gap-ls-12 border-t border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] px-ls-24 py-ls-16 md:px-ls-32 lg:px-ls-40"
    >
      {!activated ? (
        <>
          <p className="max-w-3xl text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
            Obligations stay in <span className="font-semibold text-[var(--colour-neutral-15)]">draft</span> until you
            activate. Activation schedules due-date reminders and notifies the tenant by email when action is needed.
          </p>
          <div>
            <button type="button" className="kad-btn-primary" onClick={handleActivateClick}>
              Confirm and activate
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-ls-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
            Reminders are{" "}
            <span className="font-semibold text-[color:var(--colour-status-success-100)]">active</span> for{" "}
            {tenantName}. Email notifications use the tenant contact on file.
          </p>
          <button type="button" className="kad-btn-secondary shrink-0 self-start sm:self-auto" onClick={handleDeactivateClick}>
            Deactivate
          </button>
        </div>
      )}
    </div>
  );
}
