import { AuthProvider } from "@/app/contexts/authContext";
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
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
