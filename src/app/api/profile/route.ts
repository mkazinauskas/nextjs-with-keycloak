import { NextRequest, NextResponse } from "next/server";

import {
  authenticateRequest,
  ForbiddenError,
  requireRealmRole,
  requireScope,
} from "@/lib/oidc/token-verifier";

const REQUIRED_SCOPES = ["profile.read"];
const REQUIRED_REALM_ROLES = ["api_user"];

export async function GET(request: NextRequest) {
  try {
    const token = await authenticateRequest(request);
    requireScope(token, REQUIRED_SCOPES);
    requireRealmRole(token, REQUIRED_REALM_ROLES);

    return NextResponse.json(
      {
        sub: token.sub,
        email: token.email,
        preferred_username: token.preferred_username,
        scope: token.scope,
        iat: token.iat,
        exp: token.exp,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const status = error instanceof ForbiddenError ? 403 : 401;
    const message =
      error instanceof Error ? error.message : "Failed to authorize request";

    if (process.env.NODE_ENV !== "production") {
      console.warn("Protected profile endpoint rejected request", error);
    }

    return NextResponse.json({ error: message }, { status });
  }
}
