import { NextResponse } from "next/server";
import { devWaiveObligation } from "@/lib/api/dev-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ obligationId: string }> },
) {
  const { obligationId } = await params;
  const updated = devWaiveObligation(obligationId);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
