"use client";

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";

const buttonClasses =
  "rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [auth.isAuthenticated, router]);

  const startLogin = () => {
    void auth.signinRedirect({ state: { returnTo: "/dashboard" } });
  };

  const busy =
    auth.isLoading || auth.activeNavigator === "signinRedirect" || auth.isAuthenticated;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-lg">
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="text-sm text-slate-300">
          Authenticate against your Keycloak realm using the OIDC code flow.
          You&apos;ll be redirected back to the dashboard once complete.
        </p>
        {auth.error && (
          <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {auth.error.message}
          </p>
        )}
        <button
          type="button"
          className={`${buttonClasses} ${busy ? "cursor-not-allowed opacity-60" : ""}`}
          onClick={startLogin}
          disabled={busy}
        >
          Continue with Keycloak
        </button>
      </div>
    </div>
  );
}
