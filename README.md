This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## OIDC integration

Authentication is handled entirely in the browser via [`react-oidc-context`](https://github.com/authts/react-oidc-context), which wraps `oidc-client-ts` with ergonomic React hooks and automatic redirect processing.

1. Copy `.env.example` to `.env.local` and provide the public URLs for your Keycloak realm and client (`NEXT_PUBLIC_OIDC_*`).
2. Start the identity stack with `docker compose up -d` to boot the local Keycloak instance.
3. Visit [`/login`](http://localhost:3000/login) and click **Continue with Keycloak** to invoke `signinRedirect`. The callback route (`/auth/callback`) is processed by the provider and returns you to the requested location.
4. Open [`/dashboard`](http://localhost:3000/dashboard) to inspect the live session exposed by `useAuth()`/`useOidcSession()`, exercise the **Call secured API** example (which invokes `/api/profile` with your bearer token), or sign out via the **Sign out** button which triggers `signoutRedirect`.

### Secured API example

- `GET /api/profile` validates the `Authorization: Bearer <token>` header against Keycloak&apos;s JWKS using [`jose`](https://github.com/panva/jose) and returns basic profile fields when the token is valid. The dashboard includes a sample client call wired to this endpoint.
  - If your access tokens carry a different `aud` claim (e.g. `account`), set `NEXT_PUBLIC_OIDC_AUDIENCE` with a comma-separated list of acceptable audiences so verification succeeds.

The provider is initialised in `src/components/oidc-provider.tsx`, and client settings (authority, client id, scopes, redirect URIs) live in `src/lib/oidc/settings.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
