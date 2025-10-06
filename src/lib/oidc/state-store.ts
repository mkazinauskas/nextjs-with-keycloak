import type { StateStore } from "oidc-client-ts";
import type {
  RequestCookies,
  ResponseCookies,
} from "next/dist/server/web/spec-extension/cookies";

import { STATE_COOKIE_NAME, TEN_MINUTES_IN_SECONDS } from "./constants";

type StateDictionary = Record<string, unknown>;

function decodeCookie(value: string | undefined): StateDictionary {
  if (!value) {
    return {};
  }

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(json) as StateDictionary;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // If parsing fails, fall through and reset storage
  }

  return {};
}

function encodeCookie(data: StateDictionary): string {
  const base64 = Buffer.from(JSON.stringify(data), "utf8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export class CookieStateStore implements StateStore {
  private readonly initialData: StateDictionary;
  private data: StateDictionary;
  private dirty = false;

  public constructor(requestCookies: RequestCookies) {
    const cookie = requestCookies.get(STATE_COOKIE_NAME)?.value;
    this.initialData = decodeCookie(cookie);
    this.data = { ...this.initialData };
  }

  public async set<TState = unknown>(key: string, value: TState): Promise<void> {
    this.data[key] = value as unknown;
    this.dirty = true;
  }

  public async get<TState = unknown>(key: string): Promise<TState | null> {
    return (this.data[key] as TState | undefined) ?? null;
  }

  public async remove<TState = unknown>(key: string): Promise<TState | null> {
    const existing = (this.data[key] as TState | undefined) ?? null;
    if (key in this.data) {
      delete this.data[key];
      this.dirty = true;
    }
    return existing;
  }

  public async getAllKeys(): Promise<string[]> {
    return Object.keys(this.data);
  }

  public commit(responseCookies: ResponseCookies): void {
    if (!this.dirty) {
      return;
    }

    if (Object.keys(this.data).length === 0) {
      responseCookies.delete(STATE_COOKIE_NAME);
      return;
    }

    responseCookies.set({
      name: STATE_COOKIE_NAME,
      value: encodeCookie(this.data),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: TEN_MINUTES_IN_SECONDS,
    });
  }
}
