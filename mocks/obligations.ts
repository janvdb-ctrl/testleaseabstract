import type { Obligation, ObligationStats, PropertySummary } from "@/types/lease";

/** Mock property for the obligations overview. */
export const mockProperty: PropertySummary = {
  id: "prop-7f2a",
  name: "Oak Tower — Unit 1204",
};

const CLAUSE_COI =
  "Tenant shall maintain commercial general liability insurance naming Landlord as additional insured, with coverage of not less than $2,000,000 per occurrence.";

const CLAUSE_PHOTOS =
  "Tenant shall provide dated photographs of the Premises condition within five (5) business days of possession.";

const CLAUSE_HAZARD =
  "Tenant acknowledges receipt of any hazard disclosure documents provided by Landlord regarding the Premises.";

const CLAUSE_RENTERS = "Tenant shall maintain a renters insurance policy and deliver a declaration page annually.";

const CLAUSE_SMOKE =
  "Tenant shall ensure smoke detectors are inspected and provide photo evidence of compliance.";

const CLAUSE_PET = "Tenant shall execute the pet addendum and acknowledge building pet rules.";

const EVD_COI =
  "PDF of COI showing insurer, coverage amounts, expiry date, and Landlord as additional insured.";
const EVD_PHOTOS = "Upload dated photos of each room and common area.";
const EVD_ACK = "Signed acknowledgement PDF.";
const EVD_RENTERS = "Declaration page PDF.";
const EVD_SMOKE = "Photos of detectors with visible test date.";
const EVD_PET = "Signed pet addendum.";

// Mock obligations for development and demos.
// TODO: replace with GET /api/properties/:propertyId/obligations
export const mockObligations: Obligation[] = [
  {
    id: "obl-001",
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
    id: "obl-002",
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
    id: "obl-003",
    name: "Hazard disclosure acknowledgement",
    type: "acknowledgement",
    dueDate: "2026-04-20",
    recurrence: "Once",
    status: "fulfilled",
    lastSubmission: "2026-04-19",
    sourceClause: CLAUSE_HAZARD,
    evidenceRequired: EVD_ACK,
  },
  {
    id: "obl-004",
    name: "Renters policy declaration page",
    type: "document",
    dueDate: "2026-06-01",
    recurrence: "Annual",
    status: "pending",
    lastSubmission: null,
    sourceClause: CLAUSE_RENTERS,
    evidenceRequired: EVD_RENTERS,
  },
  {
    id: "obl-005",
    name: "Smoke detector inspection",
    type: "photo",
    dueDate: "2026-02-01",
    recurrence: "Annual",
    status: "overdue",
    lastSubmission: "—",
    sourceClause: CLAUSE_SMOKE,
    evidenceRequired: EVD_SMOKE,
  },
  {
    id: "obl-006",
    name: "Pet addendum signature",
    type: "acknowledgement",
    dueDate: "2026-12-31",
    recurrence: "Once",
    status: "pending",
    lastSubmission: null,
    sourceClause: CLAUSE_PET,
    evidenceRequired: EVD_PET,
  },
];

export function computeObligationStats(obligations: Obligation[]): ObligationStats {
  const total = obligations.length;
  let overdue = 0;
  let fulfilled = 0;
  let pending = 0;
  for (const o of obligations) {
    switch (o.status) {
      case "fulfilled":
        fulfilled += 1;
        break;
      case "overdue":
      case "flagged":
        overdue += 1;
        break;
      case "pending":
      case "draft":
        pending += 1;
        break;
      case "waived":
        break;
      default:
        break;
    }
  }
  return { total, overdue, fulfilled, pending };
}
