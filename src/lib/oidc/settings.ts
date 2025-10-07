import type { UserManagerSettings } from "oidc-client-ts";

const required = {
  NEXT_PUBLIC_OIDC_AUTHORITY: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
  NEXT_PUBLIC_OIDC_CLIENT_ID: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
};

function requireEnv(): void {
  for (const [name, value] of Object.entries(required)) {
    if (!value || value.trim() === "") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
}

function resolveRedirectUri(): string {
  const explicit = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI;
  if (explicit && explicit.trim().length > 0) {
    return explicit;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }

  throw new Error(
    "NEXT_PUBLIC_OIDC_REDIRECT_URI is required during server rendering",
  );
}

function resolvePostLogoutRedirectUri(): string {
  const explicit = process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI;
  if (explicit && explicit.trim().length > 0) {
    return explicit;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/`;
  }

  throw new Error(
    "NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI is required during server rendering",
  );
}

export function buildBrowserSettings(): UserManagerSettings {
  requireEnv();

  return {
    authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY!,
    client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!,
    redirect_uri: resolveRedirectUri(),
    post_logout_redirect_uri: resolvePostLogoutRedirectUri(),
    scope: process.env.NEXT_PUBLIC_OIDC_SCOPE ?? "openid profile email",
    response_type: "code",
    automaticSilentRenew: true,
    loadUserInfo: true,
  };
}
