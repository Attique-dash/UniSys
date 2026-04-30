"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/authContext";

const roleRoutes: Record<string, string[]> = {
  admin: ["/admin", "/adduser", "/showuser", "/bookmarks"],
  teacher: ["/teacher", "/teacher/bookmarks", "/teacher/profile"],
  student: ["/student", "/student/bookmarks", "/student/profile"],
  cr: ["/cr", "/cr/bookmarks", "/cr/profile"],
};

const publicRoutes = ["/", "/login", "/forgot-password"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Allow public routes
    if (publicRoutes.includes(pathname)) return;

    // Not logged in - redirect to login
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const role = currentUser.role;
    if (!role) {
      router.push("/login");
      return;
    }

    // Check if user has access to this route
    const allowedRoutes = roleRoutes[role] || [];
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));

    if (!isAllowed) {
      // Redirect to their appropriate home
      const homeRoute = `/${role}`;
      router.push(homeRoute);
    }
  }, [currentUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
