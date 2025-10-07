import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const AUTHORITY = process.env.NEXT_PUBLIC_OIDC_AUTHORITY;
const CLIENT_ID = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID;
const AUDIENCE_OVERRIDE = process.env.NEXT_PUBLIC_OIDC_AUDIENCE;

if (!AUTHORITY || AUTHORITY.trim().length === 0) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_OIDC_AUTHORITY");
}

if (!CLIENT_ID || CLIENT_ID.trim().length === 0) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_OIDC_CLIENT_ID");
}

const authorityWithSlash = AUTHORITY.endsWith("/") ? AUTHORITY : `${AUTHORITY}/`;
const JWKS_URI = new URL(
  "protocol/openid-connect/certs",
  authorityWithSlash,
);

const audienceCandidates = AUDIENCE_OVERRIDE
  ? AUDIENCE_OVERRIDE.split(",").map((item) => item.trim()).filter(Boolean)
  : [CLIENT_ID];

const EXPECTED_AUDIENCE =
  audienceCandidates.length === 1 ? audienceCandidates[0] : audienceCandidates;

const jwks = createRemoteJWKSet(JWKS_URI);

export interface VerifiedToken extends JWTPayload {
  scope?: string;
}

export async function verifyAccessToken(token: string): Promise<VerifiedToken> {
  const result = await jwtVerify(token, jwks, {
    issuer: AUTHORITY,
    audience: EXPECTED_AUDIENCE,
  });

  return result.payload as VerifiedToken;
}

function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const [, token] = authHeader.match(/^Bearer\s+(.+)$/i) ?? [];
  return token ?? null;
}

export async function authenticateRequest(
  request: Request,
): Promise<VerifiedToken> {
  const token = extractBearerToken(request.headers.get("authorization"));
  if (!token) {
    throw new Error("Missing bearer token");
  }

  try {
    return await verifyAccessToken(token);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to verify token", error);
    }
    throw new Error("Invalid bearer token");
  }
}
