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

## OIDC API integration

The application exposes a small set of API routes backed by [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) to handle the authorization code flow against Keycloak (or any compliant OIDC provider).

1. Copy `.env.example` to `.env.local` and fill in your realm details (authority, client id, optional secret).
2. Start the identity stack with `docker compose up -d` to boot the local Keycloak instance.
3. Visit [`/login`](http://localhost:3000/login) and use the **Continue with Keycloak** button to trigger the code flow (`/api/oidc/login`).
4. After authenticating, you will land on [`/dashboard`](http://localhost:3000/dashboard) which reads the active session via `/api/oidc/session` and provides a **Sign out** button (`/api/oidc/logout`).

The relevant server routes live under `src/app/api/oidc/*`:

- `GET /api/oidc/login` – creates the authorization request and redirects to Keycloak.
- `GET /api/oidc/callback` – processes the authorization response and stores the resulting tokens inside an HTTP-only session cookie.
- `GET /api/oidc/logout` – initiates RP-initiated logout and clears the session.
- `GET /api/oidc/logout/callback` – finalizes logout and returns users to the requested location.
- `GET /api/oidc/session` – exposes non-sensitive session metadata for client-side checks.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
