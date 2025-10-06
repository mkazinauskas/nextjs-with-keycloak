import { useCallback, useEffect, useState } from "react";

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

export function useOidcSession(options: { auto?: boolean } = {}): SessionQuery {
  const auto = options.auto ?? true;
  const [data, setData] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(auto);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/oidc/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Session lookup failed (${response.status})`);
      }

      const payload = (await response.json()) as SessionPayload;
      setData(payload);
    } catch (err) {
      setData(null);
      const message =
        err instanceof Error ? err.message : "Unknown session error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auto) {
      return;
    }
    void refresh();
  }, [auto, refresh]);

  return {
    data,
    loading,
    error,
    authenticated: Boolean(data?.authenticated),
    refresh,
  };
}
