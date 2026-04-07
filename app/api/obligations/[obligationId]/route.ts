import { NextResponse } from "next/server";
import type { ObligationDrawerDraft } from "@/types/lease";
import { devPatchObligation } from "@/lib/api/dev-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ obligationId: string }> },
) {
  const { obligationId } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  const draft: ObligationDrawerDraft = {
    name: String(body.name ?? ""),
    type: body.type as ObligationDrawerDraft["type"],
    dueDate: String(body.due_date ?? body.dueDate ?? ""),
    recurrence: (body.recurrence ?? body.recurrence_rule) as ObligationDrawerDraft["recurrence"],
    status: body.status as ObligationDrawerDraft["status"],
    evidenceRequired: String(body.evidence_required ?? body.evidenceRequired ?? ""),
  };

  const updated = devPatchObligation(obligationId, draft);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
