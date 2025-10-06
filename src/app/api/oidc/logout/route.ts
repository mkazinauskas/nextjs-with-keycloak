import { NextRequest, NextResponse } from "next/server";

import { initOidcClient, redirectWithState } from "@/lib/oidc/client";
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

    const { client, stateStore } = initOidcClient(request);

    const signoutRequest = await client.createSignoutRequest({
      id_token_hint: session?.idToken,
      state: { returnTo },
    });

    const response = redirectWithState(signoutRequest.url, stateStore);
    clearSession(response);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start logout flow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
