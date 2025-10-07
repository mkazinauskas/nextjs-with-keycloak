import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/lib/oidc/token-verifier";

function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const [, token] = authHeader.match(/^Bearer\s+(.+)$/i) ?? [];
  return token ?? null;
}

export async function GET(request: NextRequest) {
  const token = extractBearerToken(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      { error: "Missing bearer token" },
      { status: 401 },
    );
  }

  try {
    const payload = await verifyAccessToken(token);

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
