import { NextResponse } from "next/server";
import { devGetObligationsForTenant } from "@/lib/api/dev-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  const obligations = devGetObligationsForTenant(tenantId);
  return NextResponse.json({ obligations });
}
