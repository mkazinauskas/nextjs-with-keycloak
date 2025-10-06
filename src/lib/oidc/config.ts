import type { OidcClientSettings } from "oidc-client-ts";

const REQUIRED_VARS = ["OIDC_AUTHORITY", "OIDC_CLIENT_ID"] as const;

const cached = {
  authority: undefined as string | undefined,
  clientId: undefined as string | undefined,
  scope: undefined as string | undefined,
  clientSecret: undefined as string | undefined,
  redirectUri: undefined as string | undefined,
  postLogoutRedirectUri: undefined as string | undefined,
};

function assertRequiredEnv() {
  for (const key of REQUIRED_VARS) {
    if (!process.env[key] || process.env[key]?.trim().length === 0) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

function loadBaseConfig() {
  if (!cached.authority) {
    assertRequiredEnv();
    cached.authority = process.env.OIDC_AUTHORITY!;
    cached.clientId = process.env.OIDC_CLIENT_ID!;
    cached.scope = process.env.OIDC_SCOPE ?? "openid profile email";
    cached.clientSecret = process.env.OIDC_CLIENT_SECRET;
    cached.redirectUri = process.env.OIDC_REDIRECT_URI;
    cached.postLogoutRedirectUri = process.env.OIDC_POST_LOGOUT_REDIRECT_URI;
  }

  return {
    authority: cached.authority!,
    clientId: cached.clientId!,
    scope: cached.scope!,
    clientSecret: cached.clientSecret,
    redirectUri: cached.redirectUri,
    postLogoutRedirectUri: cached.postLogoutRedirectUri,
  };
}

export function buildClientSettings(origin: string): OidcClientSettings {
  if (!origin) {
    throw new Error("Origin is required to build OIDC client settings");
  }

  const base = loadBaseConfig();
  const redirectUri =
    base.redirectUri ?? new URL("/api/oidc/callback", origin).toString();

  return {
    authority: base.authority,
    client_id: base.clientId,
    client_secret: base.clientSecret,
    response_type: "code",
    scope: base.scope,
    redirect_uri: redirectUri,
    post_logout_redirect_uri:
      base.postLogoutRedirectUri ??
      new URL("/api/oidc/logout/callback", origin).toString(),
    staleStateAgeInSeconds: 10 * 60,
  };
}
