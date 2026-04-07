import { NextResponse } from "next/server";
import { devIsTenantActivated } from "@/lib/api/dev-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  return NextResponse.json({ activated: devIsTenantActivated(tenantId) });
}
