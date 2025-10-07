"use client";

import Link from "next/link";
import { useAuth } from "react-oidc-context";
import { useOidcSession } from "@/lib/oidc/use-session";

const containerClasses =
  "mx-auto min-h-screen max-w-4xl space-y-10 px-6 py-16 text-slate-100";

const cardClasses =
  "rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl";

const headingClasses = "text-3xl font-semibold text-white";

export default function DashboardPage() {
  const auth = useAuth();
  const { data: session, loading, error } = useOidcSession();
  const loggingOut = auth.activeNavigator === "signoutRedirect";

  const startLogout = () => {
    void auth.signoutRedirect({ state: { returnTo: "/" } });
  };

  return (
    <div className="bg-slate-950">
      <div className={containerClasses}>
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Protected area
          </p>
          <h1 className={headingClasses}>Dashboard</h1>
          <p className="text-sm text-slate-300">
            This page reflects the authenticated state exposed by{" "}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.7rem]">
              react-oidc-context
            </code>{" "}
            and lets you sign out via Keycloak&apos;s RP-initiated logout.
          </p>
        </header>

        <section className={cardClasses}>
          {loading && (
            <p className="text-sm text-slate-300">Loading session details…</p>
          )}

          {!loading && error && (
            <div className="space-y-3">
              <p className="text-sm text-red-300">Error: {error}</p>
              <Link
                href="/login"
                className="inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Try signing in again
              </Link>
            </div>
          )}

          {!loading && !error && session?.authenticated === false && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                You are not authenticated. Start the login flow to access
                protected APIs.
              </p>
              <Link
                href="/login"
                className="inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Go to login
              </Link>
            </div>
          )}

          {!loading && !error && session?.authenticated && (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">
                  Session active
                </p>
                {session.expiresAt && (
                  <p className="text-sm text-slate-400">
                    Expires at:{" "}
                    {new Date(session.expiresAt * 1000).toLocaleString()}
                  </p>
                )}
                {session.scope && (
                  <p className="text-sm text-slate-400">
                    Scope: {session.scope}
                  </p>
                )}
              </div>
              {session.profile && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">Profile</p>
                  <pre className="overflow-x-auto rounded-2xl bg-slate-950/70 p-4 text-left text-xs text-slate-300">
                    {JSON.stringify(session.profile, null, 2)}
                  </pre>
                </div>
              )}
              <button
                type="button"
                onClick={startLogout}
                disabled={loggingOut}
                className={`inline-flex rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white ${
                  loggingOut ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                Sign out
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
