import { NextRequest, NextResponse } from "next/server";

import { initOidcClient, redirectWithState } from "@/lib/oidc/client";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const { client, stateStore } = initOidcClient(request);

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
    return redirectWithState(new URL(redirectPath, origin), stateStore);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process logout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
