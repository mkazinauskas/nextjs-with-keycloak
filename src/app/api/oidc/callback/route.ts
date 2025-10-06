import { OidcClient } from "oidc-client-ts";
import { NextRequest, NextResponse } from "next/server";

import { buildClientSettings } from "@/lib/oidc/config";
import { CookieStateStore } from "@/lib/oidc/state-store";
import { writeSession } from "@/lib/oidc/session";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const stateStore = new CookieStateStore(request.cookies);
    const client = new OidcClient({
      ...buildClientSettings(origin),
      stateStore,
    });

    const signinResponse = await client.processSigninResponse(request.url);

    if (signinResponse.error) {
      throw new Error(
        signinResponse.error_description ?? signinResponse.error,
      );
    }

    const userState = signinResponse.userState as
      | { returnTo?: string }
      | undefined;

    const redirectPath = userState?.returnTo ?? "/";
    const target = new URL(redirectPath, origin);

    const response = NextResponse.redirect(target);
    stateStore.commit(response.cookies);

    const now = Math.floor(Date.now() / 1000);
    const expiresAt =
      signinResponse.expires_at ??
      (signinResponse.expires_in
        ? now + signinResponse.expires_in
        : now + 3600);

    writeSession(response, {
      accessToken: signinResponse.access_token,
      refreshToken: signinResponse.refresh_token,
      idToken: signinResponse.id_token,
      tokenType: signinResponse.token_type ?? "Bearer",
      scope: signinResponse.scope,
      expiresAt,
      profile: signinResponse.profile,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process callback";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
