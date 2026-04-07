import type {
  Obligation,
  PropertySummary,
  TenantSidebarBadge,
  TenantSidebarItem,
  TenantSidebarRowBase,
} from "@/types/lease";

/** Property shown in Flow 2 dashboard header context. */
export const mockDashboardProperty: PropertySummary = {
  id: "prop-7f2a",
  name: "Oak Tower",
};

const CLAUSE_COI =
  "Tenant shall maintain commercial general liability insurance naming Landlord as additional insured, with coverage of not less than $2,000,000 per occurrence, and shall deliver a certificate of insurance within ten (10) days of lease execution.";

const CLAUSE_PHOTOS =
  "Tenant shall provide dated photographs of the Premises condition within five (5) business days of possession.";

const CLAUSE_HAZARD =
  "Tenant acknowledges receipt of any hazard disclosure documents provided by Landlord regarding the Premises.";

const CLAUSE_CAM =
  "Tenant shall pay its proportionate share of common area maintenance charges within thirty (30) days of invoice.";

const CLAUSE_HVAC =
  "Tenant shall maintain the HVAC system and provide annual inspection certificates upon request.";

const CLAUSE_ROOF =
  "Tenant shall permit Landlord or its agents to inspect the roof and provide photographic evidence of condition as reasonably requested.";

const CLAUSE_PARKING =
  "Tenant shall use assigned parking spaces solely for tenant vehicles in accordance with building rules.";

const CLAUSE_FIRE =
  "Tenant shall participate in annual fire drills and acknowledge receipt of emergency procedures.";

const CLAUSE_SIGNAGE =
  "Tenant shall obtain Landlord approval prior to installing any exterior signage.";

const CLAUSE_SALES =
  "Tenant shall deliver quarterly gross sales reports within fifteen (15) days following each calendar quarter.";

const EVD_COI =
  "PDF of COI showing insurer, coverage amounts, expiry date, and Landlord as additional insured.";
const EVD_PHOTOS = "Upload dated photos of each room and common area.";
const EVD_ACK = "Signed acknowledgement PDF.";
const EVD_CAM = "Payment confirmation or remittance advice.";
const EVD_HVAC = "HVAC inspection certificate from licensed contractor.";
const EVD_ROOF = "Time-stamped photos of roof condition.";
const EVD_PARKING = "N/A — obligation waived.";
const EVD_FIRE = "Signed participation log or email confirmation.";
const EVD_SIGN = "Photo mock-up and manufacturer specifications.";
const EVD_SALES = "Spreadsheet or PDF of reported gross sales.";

/**
 * Static tenant rows (Flow 2 sidebar). Badge is derived from obligations via
 * {@link buildTenantSidebarItems}.
 * // TODO: GET /properties/:propertyId/tenants
 */
export const mockTenantRows: TenantSidebarRowBase[] = [
  {
    id: "tenant-ada",
    name: "Ada Lovelace",
    unitLabel: "Suite 1204",
    addressLine: "400 Market St, San Francisco, CA",
  },
  {
    id: "tenant-babbage",
    name: "Charles Babbage",
    unitLabel: "Suite 802",
    addressLine: "400 Market St, San Francisco, CA",
  },
  {
    id: "tenant-hopper",
    name: "Grace Hopper",
    unitLabel: "Suite 2100",
    addressLine: "400 Market St, San Francisco, CA",
  },
  {
    id: "tenant-turing",
    name: "Alan Turing",
    unitLabel: "Retail Pod A",
    addressLine: "400 Market St, San Francisco, CA",
  },
];

/**
 * Flow 2 sidebar badge: critical = overdue + flagged; complete = all fulfilled;
 * otherwise attention = pending + draft.
 */
export function deriveTenantSidebarBadge(obligations: Obligation[]): TenantSidebarBadge {
  if (obligations.length === 0) {
    return { kind: "attention", count: 0 };
  }
  let overdue = 0;
  let flagged = 0;
  let pending = 0;
  let draft = 0;
  for (const o of obligations) {
    switch (o.status) {
      case "overdue":
        overdue += 1;
        break;
      case "flagged":
        flagged += 1;
        break;
      case "pending":
        pending += 1;
        break;
      case "draft":
        draft += 1;
        break;
      default:
        break;
    }
  }
  const allFulfilled = obligations.every((o) => o.status === "fulfilled");
  if (allFulfilled) {
    return { kind: "complete" };
  }
  if (overdue + flagged > 0) {
    return { kind: "critical", count: overdue + flagged };
  }
  return { kind: "attention", count: pending + draft };
}

/** Merge static tenant rows with badges derived from mock obligation sets. */
export function buildTenantSidebarItems(
  obligationsByTenantId: Record<string, Obligation[]>,
): TenantSidebarItem[] {
  return mockTenantRows.map((row) => ({
    ...row,
    badge: deriveTenantSidebarBadge(obligationsByTenantId[row.id] ?? []),
  }));
}

// TODO: GET /tenants/:tenantId/obligations
export const mockObligationsByTenantId: Record<string, Obligation[]> = {
  "tenant-ada": [
    {
      id: "obl-ada-1",
      name: "Certificate of insurance",
      type: "document",
      dueDate: "2026-05-01",
      recurrence: "Annual",
      status: "pending",
      lastSubmission: null,
      sourceClause: CLAUSE_COI,
      evidenceRequired: EVD_COI,
    },
    {
      id: "obl-ada-2",
      name: "Move-in condition photos",
      type: "photo",
      dueDate: "2026-03-15",
      recurrence: "Once",
      status: "overdue",
      lastSubmission: "—",
      sourceClause: CLAUSE_PHOTOS,
      evidenceRequired: EVD_PHOTOS,
    },
    {
      id: "obl-ada-3",
      name: "Hazard disclosure acknowledgement",
      type: "acknowledgement",
      dueDate: "2026-04-20",
      recurrence: "Once",
      status: "fulfilled",
      lastSubmission: "2026-04-18",
      sourceClause: CLAUSE_HAZARD,
      evidenceRequired: EVD_ACK,
    },
    {
      id: "obl-ada-4",
      name: "CAM reconciliation payment",
      type: "payment",
      dueDate: "2026-02-01",
      recurrence: "Quarterly",
      status: "flagged",
      lastSubmission: "Disputed Jan 4",
      sourceClause: CLAUSE_CAM,
      evidenceRequired: EVD_CAM,
    },
  ],
  "tenant-babbage": [
    {
      id: "obl-bab-1",
      name: "HVAC maintenance certificate",
      type: "document",
      dueDate: "2026-01-10",
      recurrence: "Annual",
      status: "overdue",
      lastSubmission: "—",
      sourceClause: CLAUSE_HVAC,
      evidenceRequired: EVD_HVAC,
    },
    {
      id: "obl-bab-2",
      name: "Roof inspection photos",
      type: "photo",
      dueDate: "2026-02-28",
      recurrence: "Annual",
      status: "overdue",
      lastSubmission: "—",
      sourceClause: CLAUSE_ROOF,
      evidenceRequired: EVD_ROOF,
    },
    {
      id: "obl-bab-3",
      name: "Obsolete parking clause (false positive)",
      type: "document",
      dueDate: "2025-06-01",
      recurrence: "Once",
      status: "waived",
      lastSubmission: "—",
      sourceClause: CLAUSE_PARKING,
      evidenceRequired: EVD_PARKING,
    },
  ],
  "tenant-hopper": [
    {
      id: "obl-hop-1",
      name: "Insurance COI on file",
      type: "document",
      dueDate: "2025-12-01",
      recurrence: "Annual",
      status: "fulfilled",
      lastSubmission: "2025-11-28",
      sourceClause: CLAUSE_COI,
      evidenceRequired: EVD_COI,
    },
    {
      id: "obl-hop-2",
      name: "Fire drill acknowledgement",
      type: "acknowledgement",
      dueDate: "2026-01-15",
      recurrence: "Once",
      status: "fulfilled",
      lastSubmission: "2026-01-14",
      sourceClause: CLAUSE_FIRE,
      evidenceRequired: EVD_FIRE,
    },
  ],
  "tenant-turing": [
    {
      id: "obl-tur-1",
      name: "Signage compliance photo",
      type: "photo",
      dueDate: "2026-06-01",
      recurrence: "As-needed",
      status: "draft",
      lastSubmission: null,
      sourceClause: CLAUSE_SIGNAGE,
      evidenceRequired: EVD_SIGN,
    },
    {
      id: "obl-tur-2",
      name: "Quarterly sales report",
      type: "document",
      dueDate: "2026-04-30",
      recurrence: "Quarterly",
      status: "pending",
      lastSubmission: "—",
      sourceClause: CLAUSE_SALES,
      evidenceRequired: EVD_SALES,
    },
  ],
};

/** Placeholder lease one-liner for the right-panel top bar (Flow 2). */
export function mockLeaseSummaryLine(tenantName: string, unitLabel: string): string {
  return `${mockDashboardProperty.name} · ${unitLabel} · Lease Jan 2024 – Dec 2029 · 4,200 RSF · Escalation 3% annually — ${tenantName}`;
}
