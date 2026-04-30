import { AuthProvider } from "@/app/contexts/authContext";
import { ClientOnly } from "@/app/components/ClientOnly";
import { RouteGuard } from "@/app/components/RouteGuard";
import "@/app/globals.css";
import React from "react";

export const metadata = {
  title: "UniSys",
  description: "University Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientOnly>
          <AuthProvider>
            <RouteGuard>{children}</RouteGuard>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
