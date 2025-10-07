import { useCallback } from "react";
import { useAuth } from "react-oidc-context";

export interface SessionPayload {
  authenticated: boolean;
  expiresAt?: number;
  scope?: string;
  profile?: Record<string, unknown>;
}

export interface SessionQuery {
  data: SessionPayload | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  refresh: () => Promise<void>;
}

export function useOidcSession(): SessionQuery {
  const auth = useAuth();

  const refresh = useCallback(async () => {
    try {
      await auth.signinSilent();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to refresh session silently", error);
      }
    }
  }, [auth]);

  const data: SessionPayload | null = auth.user
    ? {
        authenticated: true,
        expiresAt: auth.user.expires_at ?? undefined,
        scope: auth.user.scope ?? undefined,
        profile: auth.user.profile ?? undefined,
      }
    : { authenticated: false };

  return {
    data,
    loading: auth.isLoading,
    error: auth.error?.message ?? null,
    authenticated: auth.isAuthenticated,
    refresh,
  };
}
