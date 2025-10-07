import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const authorityEnv = process.env.NEXT_PUBLIC_OIDC_AUTHORITY;
const clientIdEnv = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID;
const audienceEnv = process.env.NEXT_PUBLIC_OIDC_AUDIENCE;

if (!authorityEnv || authorityEnv.trim().length === 0) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_OIDC_AUTHORITY",
  );
}

if (!clientIdEnv || clientIdEnv.trim().length === 0) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_OIDC_CLIENT_ID",
  );
}

const authority = authorityEnv.trim();
const clientId = clientIdEnv.trim();

const jwks = createRemoteJWKSet(
  new URL(
    "protocol/openid-connect/certs",
    authority.endsWith("/") ? authority : `${authority}/`,
  ),
);

const expectedAudience = audienceEnv
  ? audienceEnv
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  : clientId;

export interface VerifiedToken extends JWTPayload {
  scope?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<
    string,
    {
      roles?: string[];
    }
  >;
}

export class UnauthorizedError extends Error {
  public constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  public constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function verifyAccessToken(token: string): Promise<VerifiedToken> {
  const result = await jwtVerify(token, jwks, {
    issuer: authority,
    audience: expectedAudience,
  });

  return result.payload as VerifiedToken;
}

export function extractBearerToken(authHeader: string | null): string {
  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }
  const [, token] = authHeader.match(/^Bearer\s+(.+)$/i) ?? [];
  if (!token) {
    throw new UnauthorizedError("Authorization header must use Bearer scheme");
  }
  return token;
}

export async function authenticateRequest(
  request: Request,
): Promise<VerifiedToken> {
  const token = extractBearerToken(request.headers.get("authorization"));
  return authenticateToken(token);
}

export async function authenticateToken(token: string): Promise<VerifiedToken> {
  try {
    return await verifyAccessToken(token);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to verify token", error);
    }
    throw new UnauthorizedError("Invalid bearer token");
  }
}

export function getScopes(token: VerifiedToken): Set<string> {
  return new Set((token.scope ?? "").split(" ").filter(Boolean));
}

export function requireScope(
  token: VerifiedToken,
  required: string | string[],
): void {
  const scopes = getScopes(token);
  const requiredList = Array.isArray(required) ? required : [required];
  const missing = requiredList.filter((scope) => !scopes.has(scope));
  if (missing.length > 0) {
    throw new ForbiddenError(`Missing required scope(s): ${missing.join(", ")}`);
  }
}

export function getRealmRoles(token: VerifiedToken): Set<string> {
  const roles = token.realm_access?.roles ?? [];
  return new Set(roles);
}

export function requireRealmRole(
  token: VerifiedToken,
  role: string | string[],
): void {
  const roles = getRealmRoles(token);
  console.log(roles)
  const requiredList = Array.isArray(role) ? role : [role];
  const missing = requiredList.filter((item) => !roles.has(item));
  if (missing.length > 0) {
    throw new ForbiddenError(`Missing required role(s): ${missing.join(", ")}`);
  }
}

export function getClientRoles(
  token: VerifiedToken,
  resource: string,
): Set<string> {
  const roles = token.resource_access?.[resource]?.roles ?? [];
  return new Set(roles);
}

export function requireClientRole(
  token: VerifiedToken,
  resource: string,
  role: string | string[],
): void {
  const roles = getClientRoles(token, resource);
  const requiredList = Array.isArray(role) ? role : [role];
  const missing = requiredList.filter((item) => !roles.has(item));
  if (missing.length > 0) {
    throw new ForbiddenError(
      `Missing required client role(s) for ${resource}: ${missing.join(", ")}`,
    );
  }
}
