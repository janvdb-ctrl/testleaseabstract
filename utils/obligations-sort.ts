import type { Obligation, ObligationStatus } from "@/types/lease";

/** Flow 2: overdue first, then flagged, then others; tie-break by due date. */
function statusSortRank(status: ObligationStatus): number {
  if (status === "overdue") return 0;
  if (status === "flagged") return 1;
  return 2;
}

export function sortObligationsForDisplay(obligations: Obligation[]): Obligation[] {
  return [...obligations].sort((a, b) => {
    const d = statusSortRank(a.status) - statusSortRank(b.status);
    if (d !== 0) return d;
    return a.dueDate.localeCompare(b.dueDate);
  });
}
