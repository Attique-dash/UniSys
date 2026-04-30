import { AuthProvider } from "@/app/contexts/authContext";
import { ClientOnly } from "@/app/components/ClientOnly";
import "@/app/globals.css";
import React from "react";

export const metadata = {
  title: "UniSys",
  description: "Your App Description",
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
            {children}
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
