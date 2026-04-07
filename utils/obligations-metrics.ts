import type { Obligation, ObligationMetrics } from "@/types/lease";

/**
 * Computes Flow 2 dashboard metrics from an obligations list (selected tenant).
 * - Pending includes `draft` (pre-activation).
 * - Overdue / flagged card = overdue + flagged counts.
 */
export function computeObligationMetrics(obligations: Obligation[]): ObligationMetrics {
  let fulfilled = 0;
  let pending = 0;
  let overdueFlagged = 0;
  for (const o of obligations) {
    switch (o.status) {
      case "fulfilled":
        fulfilled += 1;
        break;
      case "pending":
      case "draft":
        pending += 1;
        break;
      case "overdue":
      case "flagged":
        overdueFlagged += 1;
        break;
      case "waived":
        break;
      default:
        break;
    }
  }
  return {
    total: obligations.length,
    fulfilled,
    pending,
    overdueFlagged,
  };
}
