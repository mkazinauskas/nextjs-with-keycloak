import { OidcClient } from "oidc-client-ts";
import { NextRequest, NextResponse } from "next/server";

import { buildClientSettings } from "@/lib/oidc/config";
import { CookieStateStore } from "@/lib/oidc/state-store";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const stateStore = new CookieStateStore(request.cookies);
    const client = new OidcClient({
      ...buildClientSettings(origin),
      stateStore,
    });

    const signoutResponse = await client.processSignoutResponse(request.url);

    if (signoutResponse.error) {
      throw new Error(
        signoutResponse.error_description ?? signoutResponse.error,
      );
    }

    const userState = signoutResponse.userState as
      | { returnTo?: string }
      | undefined;
    const redirectPath = userState?.returnTo ?? "/";
    const response = NextResponse.redirect(new URL(redirectPath, origin));
    stateStore.commit(response.cookies);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process logout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
