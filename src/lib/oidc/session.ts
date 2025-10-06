import type { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  ID_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "./constants";

export interface OidcSession {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresAt: number;
  scope?: string;
  profile?: Record<string, unknown>;
}

interface SessionMetadata {
  tokenType: string;
  expiresAt: number;
  scope?: string;
  profile?: Record<string, unknown>;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function encodeMetadata(metadata: SessionMetadata): string {
  const base64 = Buffer.from(JSON.stringify(metadata), "utf8").toString(
    "base64",
  );
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeMetadata(raw: string): SessionMetadata | null {
  try {
    const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as SessionMetadata;
  } catch {
    return null;
  }
}

export function readSession(request: NextRequest): OidcSession | null {
  const metadataCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!metadataCookie) {
    return null;
  }

  const metadata = decodeMetadata(metadataCookie);
  if (!metadata) {
    return null;
  }

  return {
    ...metadata,
    accessToken:
      request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? undefined,
    refreshToken:
      request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value ?? undefined,
    idToken: request.cookies.get(ID_TOKEN_COOKIE_NAME)?.value ?? undefined,
  };
}

export function writeSession(
  response: NextResponse,
  session: OidcSession,
): void {
  const maxAgeSeconds = Math.max(
    60,
    session.expiresAt - Math.floor(Date.now() / 1000),
  );

  const metadata: SessionMetadata = {
    tokenType: session.tokenType,
    expiresAt: session.expiresAt,
    scope: session.scope,
    profile: session.profile,
  };

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: encodeMetadata(metadata),
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
    path: "/",
    maxAge: maxAgeSeconds,
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: IS_PRODUCTION,
    path: "/",
    maxAge: maxAgeSeconds,
  };

  if (session.accessToken) {
    response.cookies.set({
      ...cookieOptions,
      name: ACCESS_TOKEN_COOKIE_NAME,
      value: session.accessToken,
    });
  } else {
    response.cookies.delete({ name: ACCESS_TOKEN_COOKIE_NAME, path: "/" });
  }

  if (session.refreshToken) {
    response.cookies.set({
      ...cookieOptions,
      name: REFRESH_TOKEN_COOKIE_NAME,
      value: session.refreshToken,
    });
  } else {
    response.cookies.delete({ name: REFRESH_TOKEN_COOKIE_NAME, path: "/" });
  }

  if (session.idToken) {
    response.cookies.set({
      ...cookieOptions,
      name: ID_TOKEN_COOKIE_NAME,
      value: session.idToken,
    });
  } else {
    response.cookies.delete({ name: ID_TOKEN_COOKIE_NAME, path: "/" });
  }
}

export function clearSession(response: NextResponse): void {
  response.cookies.delete({ name: SESSION_COOKIE_NAME, path: "/" });
  response.cookies.delete({ name: ACCESS_TOKEN_COOKIE_NAME, path: "/" });
  response.cookies.delete({ name: REFRESH_TOKEN_COOKIE_NAME, path: "/" });
  response.cookies.delete({ name: ID_TOKEN_COOKIE_NAME, path: "/" });
}
