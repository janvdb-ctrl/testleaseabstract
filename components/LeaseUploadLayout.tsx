"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LeaseConfirmationScreen } from "@/components/LeaseConfirmationScreen";
import { LeaseFileUpload } from "@/components/LeaseFileUpload";
import { LeaseProcessingScreen } from "@/components/LeaseProcessingScreen";
import {
  buildPendingTenantSidebarItem,
  FLOW1_PLACEHOLDER_TENANT_ID,
  writePendingTenantToSessionStorage,
} from "@/lib/flow1-dashboard";
import {
  MOCK_LEASE_TERM_END_LABEL,
  MOCK_LEASE_TERM_START_LABEL,
  MOCK_OBLIGATIONS_EXTRACTED,
} from "@/lib/flow1-mock-abstraction";
import { mockDashboardProperty } from "@/mocks/dashboard";

type TenantMode = "create" | "existing";
type FlowPhase = "form" | "processing" | "confirmation";

/** Local mock list — replace with API later. */
const EXISTING_TENANTS = [
  { id: "tenant-ada", label: "Ada Lovelace — Suite 1204" },
  { id: "tenant-babbage", label: "Charles Babbage — Suite 802" },
  { id: "tenant-hopper", label: "Grace Hopper — Suite 2100" },
  { id: "tenant-turing", label: "Alan Turing — Retail Pod A" },
] as const;

const MOCK_AGENT_DELAY_MS = 3000;

function isValidEmail(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/**
 * Flow 1 — tenant record + lease upload shell. Tenant fields use local state only.
 * @see Projects/lease-abstraction-agent/flows/flow-1-lease-upload.md
 */
export function LeaseUploadLayout() {
  const router = useRouter();
  const [phase, setPhase] = useState<FlowPhase>("form");

  const [tenantMode, setTenantMode] = useState<TenantMode>("create");

  const [newTenant, setNewTenant] = useState({
    tenantName: "",
    unitSpace: "",
    email: "",
    phone: "",
  });

  const [existingTenantId, setExistingTenantId] = useState("");

  const isNewTenantRecordComplete = useMemo(() => {
    return (
      newTenant.tenantName.trim() !== "" &&
      newTenant.unitSpace.trim() !== "" &&
      isValidEmail(newTenant.email)
    );
  }, [newTenant]);

  const isExistingSelectionComplete = existingTenantId !== "";

  const isTenantRecordComplete =
    tenantMode === "create" ? isNewTenantRecordComplete : isExistingSelectionComplete;

  const [leaseFiles, setLeaseFiles] = useState<File[]>([]);

  const canSubmitAbstract = isTenantRecordComplete && leaseFiles.length > 0;

  const [processingFileNames, setProcessingFileNames] = useState<string[]>([]);

  async function handleUploadAndAbstract() {
    if (phase !== "form" || !canSubmitAbstract) return;
    setProcessingFileNames(leaseFiles.map((f) => f.name));
    setPhase("processing");
    try {
      // TODO: POST multipart + enqueue lease abstraction job (agent).
      await new Promise((r) => setTimeout(r, MOCK_AGENT_DELAY_MS));
      setPhase("confirmation");
    } catch {
      setPhase("form");
    }
  }

  function handleReviewObligations() {
    if (tenantMode === "create") {
      const pending = buildPendingTenantSidebarItem({
        tenantName: newTenant.tenantName,
        unitSpace: newTenant.unitSpace,
        propertyName: mockDashboardProperty.name,
      });
      writePendingTenantToSessionStorage(pending);
      router.push(`/dashboard?tenant=${FLOW1_PLACEHOLDER_TENANT_ID}`);
    } else {
      router.push(`/dashboard?tenant=${encodeURIComponent(existingTenantId)}`);
    }
  }

  if (phase === "confirmation") {
    return (
      <div className="mx-auto w-full max-w-3xl font-neue-plak-text">
        <LeaseConfirmationScreen
          obligationsExtracted={MOCK_OBLIGATIONS_EXTRACTED}
          leaseTermStartLabel={MOCK_LEASE_TERM_START_LABEL}
          leaseTermEndLabel={MOCK_LEASE_TERM_END_LABEL}
          onReviewObligations={handleReviewObligations}
        />
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="mx-auto w-full max-w-3xl font-neue-plak-text">
        <LeaseProcessingScreen fileNames={processingFileNames} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-col gap-ls-32 px-ls-24 py-ls-32 font-neue-plak-text md:px-ls-32 md:py-ls-48">
      <header className="border-b border-[var(--colour-neutral-80)] pb-ls-24">
        <p className="text-fs-14 font-semibold uppercase leading-lh-24 tracking-[0.06em] text-[var(--colour-neutral-60)]">
          Lease Abstraction Agent
        </p>
        <p className="mt-ls-4">
          <Link
            href="/dashboard"
            className="text-fs-14 font-regular text-[var(--colour-highlight-blue-100)] underline-offset-2 hover:underline"
          >
            ← Back to obligations
          </Link>
        </p>
        <h1 className="mt-ls-8 text-fs-40 font-semibold leading-lh-48 text-[var(--colour-neutral-15)]">
          Upload lease agreement
        </h1>
        <p className="mt-ls-12 max-w-2xl text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
          Add or select a tenant, then upload the lease. The agent will extract obligations for you to review
          before anything is activated or sent to the tenant.
        </p>
      </header>

      {/* Step 1 — Tenant record */}
      <section className="space-y-ls-24" aria-labelledby="flow1-step-tenant">
        <div className="flex items-baseline gap-ls-12">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--colour-highlight-blue-50)] text-fs-14 font-semibold text-[var(--colour-highlight-blue-100)]"
            aria-hidden
          >
            1
          </span>
          <div>
            <h2 id="flow1-step-tenant" className="text-fs-24 font-semibold leading-lh-32 text-[var(--colour-neutral-15)]">
              Tenant
            </h2>
            <p className="mt-ls-4 text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-60)]">
              Create a new tenant record or select an existing one (e.g. renewal).
            </p>
          </div>
        </div>

        <div
          className="inline-flex rounded-control border border-[var(--colour-neutral-80)] p-ls-4"
          role="tablist"
          aria-label="Tenant source"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tenantMode === "create"}
            className={`rounded-control px-ls-16 py-ls-8 text-fs-14 font-semibold leading-lh-24 transition-colors ${
              tenantMode === "create"
                ? "bg-[var(--colour-neutral-15)] text-[var(--colour-neutral-100)]"
                : "text-[var(--colour-neutral-30)] hover:bg-[color:var(--colour-neutral-80)]/20"
            }`}
            onClick={() => setTenantMode("create")}
          >
            New tenant
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tenantMode === "existing"}
            className={`rounded-control px-ls-16 py-ls-8 text-fs-14 font-semibold leading-lh-24 transition-colors ${
              tenantMode === "existing"
                ? "bg-[var(--colour-neutral-15)] text-[var(--colour-neutral-100)]"
                : "text-[var(--colour-neutral-30)] hover:bg-[color:var(--colour-neutral-80)]/20"
            }`}
            onClick={() => setTenantMode("existing")}
          >
            Existing tenant
          </button>
        </div>

        {tenantMode === "create" ? (
          <div className="grid gap-ls-16 sm:grid-cols-2">
            <label className="block space-y-ls-8 sm:col-span-2">
              <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
                Tenant name <span className="text-[var(--colour-semantic-danger-100)]">*</span>
              </span>
              <input
                className="kad-input"
                type="text"
                name="tenantName"
                autoComplete="organization"
                placeholder="Legal name or entity"
                value={newTenant.tenantName}
                onChange={(e) => setNewTenant((s) => ({ ...s, tenantName: e.target.value }))}
                required
                aria-required="true"
              />
            </label>
            <label className="block space-y-ls-8 sm:col-span-2">
              <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
                Unit / space identifier <span className="text-[var(--colour-semantic-danger-100)]">*</span>
              </span>
              <input
                className="kad-input"
                type="text"
                name="unitSpace"
                placeholder='e.g. "2174 Hwy 56 E" or Unit 3B'
                value={newTenant.unitSpace}
                onChange={(e) => setNewTenant((s) => ({ ...s, unitSpace: e.target.value }))}
                required
                aria-required="true"
              />
            </label>
            <label className="block space-y-ls-8 sm:col-span-2">
              <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
                Tenant contact email <span className="text-[var(--colour-semantic-danger-100)]">*</span>
              </span>
              <input
                className="kad-input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="tenant@example.com"
                value={newTenant.email}
                onChange={(e) => setNewTenant((s) => ({ ...s, email: e.target.value }))}
                required
                aria-required="true"
                aria-invalid={newTenant.email.length > 0 && !isValidEmail(newTenant.email)}
              />
            </label>
            <label className="block space-y-ls-8 sm:col-span-2">
              <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
                Tenant contact phone <span className="font-regular text-[var(--colour-neutral-60)]">(optional)</span>
              </span>
              <input
                className="kad-input"
                type="text"
                name="phone"
                autoComplete="tel"
                placeholder="For SMS reminders"
                value={newTenant.phone}
                onChange={(e) => setNewTenant((s) => ({ ...s, phone: e.target.value }))}
              />
            </label>
          </div>
        ) : (
          <label className="block max-w-lg space-y-ls-8">
            <span className="text-fs-14 font-semibold leading-lh-24 text-[var(--colour-neutral-30)]">
              Select tenant <span className="text-[var(--colour-semantic-danger-100)]">*</span>
            </span>
            <select
              className="kad-input"
              name="existingTenantId"
              value={existingTenantId}
              onChange={(e) => setExistingTenantId(e.target.value)}
              required
              aria-required="true"
            >
              <option value="">Choose a tenant</option>
              {EXISTING_TENANTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {!isTenantRecordComplete ? (
          <p className="text-fs-14 leading-lh-24 text-[var(--colour-neutral-60)]" role="status">
            {tenantMode === "create"
              ? "Enter tenant name, unit / space, and a valid email before uploading."
              : "Select an existing tenant before uploading."}
          </p>
        ) : null}
      </section>

      {/* Step 2 — Lease upload */}
      <section
        className={`space-y-ls-24 transition-opacity ${!isTenantRecordComplete ? "opacity-50" : "opacity-100"}`}
        aria-labelledby="flow1-step-upload"
        data-tenant-record-complete={isTenantRecordComplete ? "true" : "false"}
      >
        <div className="flex items-baseline gap-ls-12">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--colour-highlight-blue-50)] text-fs-14 font-semibold text-[var(--colour-highlight-blue-100)]"
            aria-hidden
          >
            2
          </span>
          <div>
            <h2 id="flow1-step-upload" className="text-fs-24 font-semibold leading-lh-32 text-[var(--colour-neutral-15)]">
              Lease document(s)
            </h2>
            <p className="mt-ls-4 text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-60)]">
              PDF, DOCX, or images (JPG/PNG). Add multiple files if needed — then run abstraction when you are ready.
            </p>
          </div>
        </div>

        <LeaseFileUpload files={leaseFiles} onFilesChange={setLeaseFiles} disabled={!isTenantRecordComplete} processing={false} />
      </section>

      <footer className="flex flex-col gap-ls-12 border-t border-[var(--colour-neutral-80)] pt-ls-24 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className="kad-btn-secondary w-full text-center sm:w-auto">
          Cancel
        </Link>
        <button
          type="button"
          disabled={!canSubmitAbstract}
          onClick={() => void handleUploadAndAbstract()}
          className="kad-btn-primary inline-flex w-full items-center justify-center gap-ls-8 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          title={
            !isTenantRecordComplete
              ? "Complete the tenant record first"
              : leaseFiles.length === 0
                ? "Add at least one lease file"
                : undefined
          }
        >
          Upload and abstract
        </button>
      </footer>
    </div>
  );
}
