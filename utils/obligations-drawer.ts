import type { Obligation, ObligationDrawerDraft } from "@/types/lease";

/** Initial drawer state when no row is selected. */
export const EMPTY_OBLIGATION_DRAWER_DRAFT: ObligationDrawerDraft = {
  name: "",
  type: "document",
  dueDate: "",
  recurrence: "Once",
  status: "draft",
  evidenceRequired: "",
};

export function obligationToDrawerDraft(o: Obligation): ObligationDrawerDraft {
  return {
    name: o.name,
    type: o.type,
    dueDate: o.dueDate,
    recurrence: o.recurrence,
    status: o.status,
    evidenceRequired: o.evidenceRequired,
  };
}

export function applyDrawerDraftToObligation(o: Obligation, draft: ObligationDrawerDraft): Obligation {
  return {
    ...o,
    name: draft.name.trim() || o.name,
    type: draft.type,
    dueDate: draft.dueDate,
    recurrence: draft.recurrence,
    status: draft.status,
    evidenceRequired: draft.evidenceRequired,
  };
}
