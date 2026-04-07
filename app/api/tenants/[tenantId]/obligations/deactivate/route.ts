import { NextResponse } from "next/server";
import { devDeactivateTenant } from "@/lib/api/dev-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  devDeactivateTenant(tenantId);
  return NextResponse.json({ ok: true });
}
