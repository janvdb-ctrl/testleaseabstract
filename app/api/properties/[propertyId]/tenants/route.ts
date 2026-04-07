import { NextResponse } from "next/server";
import { devGetTenantSidebarItems } from "@/lib/api/dev-store";

export async function GET(
  _request: Request,
  { params }: { params: { propertyId: string } },
) {
  void params.propertyId;
  const tenants = devGetTenantSidebarItems();
  return NextResponse.json({ tenants });
}
