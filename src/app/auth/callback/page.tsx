"use client";

import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";

export default function OidcCallbackPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading || auth.activeNavigator === "signinRedirect") {
      return;
    }

    if (auth.error) {
      // In case of an error, stay on the page so the error message renders.
      return;
    }

    const state = auth.user?.state as { returnTo?: string } | undefined;
    const target = state?.returnTo ?? "/dashboard";
    router.replace(target);
  }, [auth.activeNavigator, auth.error, auth.isLoading, auth.user, router]);

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md space-y-4 rounded-3xl border border-red-500/40 bg-red-500/10 p-10 text-center text-red-100 shadow-xl">
          <h1 className="text-2xl font-semibold">Sign-in failed</h1>
          <p className="text-sm">{auth.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Completing sign-in…</h1>
        <p className="mt-3 text-sm text-slate-300">
          Hang tight while we finish validating your identity and redirect you back to the app.
        </p>
      </div>
    </div>
  );
}
