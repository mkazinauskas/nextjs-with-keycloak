import { OidcClient } from "oidc-client-ts";
import { type NextRequest, NextResponse } from "next/server";

import { buildClientSettings } from "./config";
import { CookieStateStore } from "./state-store";

export interface ClientContext {
  client: OidcClient;
  stateStore: CookieStateStore;
}

export function initOidcClient(request: NextRequest): ClientContext {
  const stateStore = new CookieStateStore(request.cookies);
  const client = new OidcClient({
    ...buildClientSettings(request.nextUrl.origin),
    stateStore,
  });

  return { client, stateStore };
}

export function redirectWithState(
  target: string | URL,
  stateStore: CookieStateStore,
) {
  const response = NextResponse.redirect(target);
  stateStore.commit(response.cookies);
  return response;
}
