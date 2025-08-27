"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleMapsProvider } from "@/contexts/GoogleMapsContext";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface ClientProvidersProps {
  children: ReactNode;
  googleMapsApiKey?: string;
}

export function ClientProviders({
  children,
  googleMapsApiKey,
}: ClientProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          <GoogleMapsProvider apiKey={googleMapsApiKey}>
            {children}
            <Toaster />
          </GoogleMapsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
