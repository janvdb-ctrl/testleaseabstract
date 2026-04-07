import { NextResponse } from "next/server";
import { devActivateTenant } from "@/lib/api/dev-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await params;
  devActivateTenant(tenantId);
  return NextResponse.json({ ok: true });
}
