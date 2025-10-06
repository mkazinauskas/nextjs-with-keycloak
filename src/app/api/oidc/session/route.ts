import { NextRequest, NextResponse } from "next/server";

import { readSession } from "@/lib/oidc/session";

export async function GET(request: NextRequest) {
  const session = readSession(request);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    expiresAt: session.expiresAt,
    scope: session.scope,
    profile: session.profile,
  });
}
