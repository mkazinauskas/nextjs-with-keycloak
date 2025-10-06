import { OidcClient } from "oidc-client-ts";
import { NextRequest, NextResponse } from "next/server";

import { buildClientSettings } from "@/lib/oidc/config";
import { CookieStateStore } from "@/lib/oidc/state-store";
import { clearSession, readSession } from "@/lib/oidc/session";
import { sanitizeReturnTo } from "@/lib/oidc/url";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const session = readSession(request);
    const returnTo = sanitizeReturnTo(
      origin,
      request.nextUrl.searchParams.get("returnTo"),
    );

    const stateStore = new CookieStateStore(request.cookies);
    const client = new OidcClient({
      ...buildClientSettings(origin),
      stateStore,
    });

    const signoutRequest = await client.createSignoutRequest({
      id_token_hint: session?.idToken,
      state: { returnTo },
    });

    const response = NextResponse.redirect(signoutRequest.url);
    stateStore.commit(response.cookies);
    clearSession(response);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start logout flow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
