"use client";

const buttonClasses =
  "rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300";

export default function LoginPage() {
  const startLogin = () => {
    window.location.href = "/api/oidc/login?returnTo=/dashboard";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-lg">
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="text-sm text-slate-300">
          Authenticate against your Keycloak realm using the OIDC code flow.
          You&apos;ll be redirected back to the dashboard once complete.
        </p>
        <button type="button" className={buttonClasses} onClick={startLogin}>
          Continue with Keycloak
        </button>
      </div>
    </div>
  );
}
