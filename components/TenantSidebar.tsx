"use client";

import type { TenantSidebarItem } from "@/types/lease";

export interface TenantSidebarProps {
  /** Tenants for this property (badge + row data). */
  tenants: TenantSidebarItem[];
  /** Currently selected tenant id (controlled). */
  selectedId: string;
  /** Called when the user selects a different tenant row. */
  onSelect: (tenantId: string) => void;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function unitAddress(row: TenantSidebarItem): string {
  return `${row.unitLabel} · ${row.addressLine}`;
}

function BadgeComplete() {
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--colour-status-success-50)] text-[color:var(--colour-status-success-100)]"
      title="All obligations fulfilled"
      aria-label="All obligations fulfilled"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M11.5 3.5L5.25 9.75L2.5 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function BadgeNumber({
  value,
  variant,
}: {
  value: number;
  variant: "attention" | "critical";
}) {
  const isCritical = variant === "critical";
  const label = isCritical
    ? `${value} overdue or flagged`
    : `${value} pending or in progress`;
  return (
    <span
      className={`inline-flex min-h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-ls-8 py-ls-2 text-fs-12 font-semibold tabular-nums leading-lh-16 ${
        isCritical
          ? "bg-[color:var(--colour-semantic-danger-50)] text-[color:var(--colour-semantic-danger-100)]"
          : "bg-[color:var(--colour-semantic-pending-50)] text-[color:var(--colour-semantic-pending-100)]"
      }`}
      title={label}
      aria-label={label}
    >
      {value}
    </span>
  );
}

function TenantStatusBadge({ badge }: { badge: TenantSidebarItem["badge"] }) {
  if (badge.kind === "complete") {
    return <BadgeComplete />;
  }
  if (badge.kind === "attention") {
    return <BadgeNumber value={badge.count} variant="attention" />;
  }
  return <BadgeNumber value={badge.count} variant="critical" />;
}

export function TenantSidebar({ tenants, selectedId, onSelect }: TenantSidebarProps) {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] md:sticky md:top-0 md:h-screen md:w-[320px] md:border-b-0 md:border-r"
      aria-label="Tenants"
    >
      <div className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-16">
        <p className="text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-60)]">
          Tenants
        </p>
        <p className="mt-ls-4 text-fs-12 leading-lh-16 text-[var(--colour-neutral-60)]">
          Select a tenant to review obligations
        </p>
      </div>

      <div
        className="flex flex-1 flex-col gap-ls-8 overflow-y-auto p-ls-12"
        role="listbox"
        aria-label="Tenant list"
        aria-activedescendant={selectedId ? `tenant-row-${selectedId}` : undefined}
      >
        {tenants.map((t) => {
          const selected = t.id === selectedId;
          return (
            <button
              key={t.id}
              id={`tenant-row-${t.id}`}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(t.id)}
              className={`flex w-full items-start gap-ls-12 rounded-card border px-ls-12 py-ls-12 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--colour-highlight-blue-100)] ${
                selected
                  ? "border-[var(--colour-highlight-blue-100)] bg-[color:var(--colour-highlight-blue-50)] ring-1 ring-[var(--colour-highlight-blue-100)]"
                  : "border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] hover:bg-[color:var(--colour-neutral-80)]/15"
              }`}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--colour-neutral-15)] text-fs-14 font-semibold leading-none text-[var(--colour-neutral-100)]"
                aria-hidden
              >
                {initials(t.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-fs-16 font-semibold leading-lh-24 text-[var(--colour-neutral-15)]">
                  {t.name}
                </span>
                <span className="mt-ls-4 block text-fs-12 leading-lh-16 text-[var(--colour-neutral-30)]">
                  {unitAddress(t)}
                </span>
              </span>
              <TenantStatusBadge badge={t.badge} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
