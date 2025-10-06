import { NextRequest, NextResponse } from "next/server";

import { initOidcClient, redirectWithState } from "@/lib/oidc/client";
import { writeSession } from "@/lib/oidc/session";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const { client, stateStore } = initOidcClient(request);

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
    const response = redirectWithState(new URL(redirectPath, origin), stateStore);

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
