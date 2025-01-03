// pages/_app.tsx
import { AuthProvider } from "@/app/contexts/authContext";
import "@/app/globals.css"; // Update the path if needed
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
