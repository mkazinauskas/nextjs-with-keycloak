import { NextRequest, NextResponse } from "next/server";

import { initOidcClient, redirectWithState } from "@/lib/oidc/client";
import { sanitizeReturnTo } from "@/lib/oidc/url";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const { client, stateStore } = initOidcClient(request);

    const returnTo = sanitizeReturnTo(
      origin,
      request.nextUrl.searchParams.get("returnTo"),
    );

    const signinRequest = await client.createSigninRequest({
      state: { returnTo },
    });

    return redirectWithState(signinRequest.url, stateStore);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start login flow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
