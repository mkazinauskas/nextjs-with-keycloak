"use client";

import { useMemo } from "react";
import { AuthProvider } from "react-oidc-context";

import { buildBrowserSettings } from "@/lib/oidc/settings";

type Props = {
  children: React.ReactNode;
};

export function OidcProvider({ children }: Props) {
  const settings = useMemo(() => buildBrowserSettings(), []);

  return (
    <AuthProvider
      {...settings}
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      {children}
    </AuthProvider>
  );
}
