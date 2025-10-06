import { OidcClient } from "oidc-client-ts";
import { NextRequest, NextResponse } from "next/server";

import { buildClientSettings } from "@/lib/oidc/config";
import { CookieStateStore } from "@/lib/oidc/state-store";
import { sanitizeReturnTo } from "@/lib/oidc/url";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const stateStore = new CookieStateStore(request.cookies);
    const client = new OidcClient({
      ...buildClientSettings(origin),
      stateStore,
    });

    const returnTo = sanitizeReturnTo(
      origin,
      request.nextUrl.searchParams.get("returnTo"),
    );

    const signinRequest = await client.createSigninRequest({
      state: { returnTo },
    });

    const response = NextResponse.redirect(signinRequest.url);
    stateStore.commit(response.cookies);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start login flow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
