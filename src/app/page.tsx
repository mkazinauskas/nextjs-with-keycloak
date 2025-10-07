import Link from "next/link";

const features = [
  {
    icon: "🔐",
    title: "Centralized SSO",
    description:
      "Delegate authentication to Keycloak and deliver a seamless sign-in experience across every application in your suite.",
  },
  {
    icon: "⚙️",
    title: "Policy Automation",
    description:
      "Manage roles, groups, and custom policies once inside Keycloak and let your Next.js middleware handle the rest.",
  },
  {
    icon: "🚀",
    title: "Production Ready",
    description:
      "Built for modern edge runtimes with sensible caching, token refresh, and session hardening baked in by default.",
  },
];

const steps = [
  {
    title: "Connect your realm",
    description:
      "Point the app to your Keycloak issuer URL and client credentials. Environment presets make this a one-minute change.",
  },
  {
    title: "Secure routes",
    description:
      "Protect pages or entire route groups using lightweight server actions and middleware helpers provided in the starter.",
  },
  {
    title: "Launch with confidence",
    description:
      "Ship to production knowing refresh tokens, silent re-authentication, and logout flows are already wired up.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.4),_transparent_55%)] blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
            <span className="inline-flex size-2 rounded-full bg-cyan-400" />
            Production-ready Next.js × Keycloak starter
          </div>
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Launch secure customer portals with Keycloak-backed authentication in hours, not weeks.
            </h1>
            <p className="text-lg text-slate-300 sm:text-xl">
              This starter bundles opinionated session handling, protected routing, and a polished UX so you can focus on
              your product while Keycloak handles identity.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-base font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              Start Keycloak login
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-cyan-400/60 px-6 py-3 text-base font-medium text-cyan-200 transition hover:border-cyan-300 hover:text-white"
            >
              Open the protected dashboard
            </Link>
            <a
              href="https://www.keycloak.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-base font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Explore Keycloak docs →
            </a>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5">
              <dt className="text-sm text-slate-400">SSO providers</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">20+</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5">
              <dt className="text-sm text-slate-400">Session refresh</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">Automatic</dd>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-5">
              <dt className="text-sm text-slate-400">Framework support</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">Next 15 + Edge</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-28">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-400">
              Why teams choose this starter
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Opinionated defaults that scale with your identity strategy.
            </h2>
            <p className="text-lg text-slate-300">
              From secure cookies to silent renewals, every integration detail is tuned for production so your team can
              ship features with confidence.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="mt-[2px] text-cyan-300">▹</span>
                Works with Keycloak realms in self-hosted or Red Hat SSO environments.
              </li>
              <li className="flex gap-3">
                <span className="mt-[2px] text-cyan-300">▹</span>
                Built-in middleware examples for protecting marketing pages, dashboards, and API routes.
              </li>
              <li className="flex gap-3">
                <span className="mt-[2px] text-cyan-300">▹</span>
                Ready-to-use UI components that respect light and dark mode preferences.
              </li>
            </ul>
          </div>
        </section>

        <section className="grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition hover:border-cyan-400/40"
            >
              <span className="text-3xl" aria-hidden>
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-4">
            <span className="rounded-full border border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
              Try it now
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Run the end-to-end OIDC flow without leaving this starter.
            </h2>
            <p className="text-sm text-slate-300 sm:text-base">
            Kick off a login from the landing page, land inside the protected dashboard, then inspect the live session
            state exposed by{" "}
            <code className="rounded bg-slate-950/70 px-2 py-1 text-xs text-cyan-200">react-oidc-context</code>. No
            custom backend glue is required—the provider handles callbacks, silent renew, and logout redirects.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5">
              <h3 className="text-base font-semibold text-white">1. Start the login flow</h3>
              <p className="mt-2 text-sm text-slate-300">
                Redirects through Keycloak and returns with secure, HTTP-only cookies.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Go to /login
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5">
              <h3 className="text-base font-semibold text-white">2. Inspect the session</h3>
              <p className="mt-2 text-sm text-slate-300">
                Check the session card sourced from the context: scopes, expiry, and profile fields update automatically.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/60 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-white"
              >
                Open dashboard
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5">
              <h3 className="text-base font-semibold text-white">3. Sign out everywhere</h3>
              <p className="mt-2 text-sm text-slate-300">
                Use the Sign out button on the dashboard to invoke `signoutRedirect` and bounce back to the landing page.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="space-y-6">
            <span className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-400">
              Integration quickstart
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Three steps to production-ready auth.</h2>
            <p className="text-lg text-slate-300">
              Follow the checklist to wire up Keycloak, run smoke tests, and invite your first users. Every step is
              documented inside the repository.
            </p>
          </div>
          <ol className="space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full border border-cyan-400/50 text-base font-medium text-cyan-300">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900 px-8 py-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Bring Keycloak to your Next.js experience.</h2>
              <p className="text-lg text-slate-300">
                Deploy the starter, connect your realm, and unlock secure authentication flows for your customers and
                internal tools.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Link
                href="/setup"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-medium text-slate-900 transition hover:bg-slate-200"
              >
                View setup guide
              </Link>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-base font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Talk to the team
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/70 bg-slate-950/90 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Next.js with Keycloak. All rights reserved.</span>
          <nav className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <a
              href="https://github.com/your-org/nextjs-with-keycloak"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
