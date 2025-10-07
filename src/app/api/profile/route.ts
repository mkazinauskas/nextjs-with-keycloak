import { NextRequest, NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/oidc/token-verifier";

export async function GET(request: NextRequest) {

  try {
    const payload = await authenticateRequest(request);

    return NextResponse.json(
      {
        sub: payload.sub,
        email: payload.email,
        preferred_username: payload.preferred_username,
        scope: payload.scope,
        iat: payload.iat,
        exp: payload.exp,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.log("Failed to verify token", error);
    const message =
      error instanceof Error ? error.message : "Failed to verify token";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
