// app/components/Shell.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { doLogout } from "@/app/firebase/auth";
import logo from "@/app/images/logo.png";
import { ReactNode, useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface ShellProps {
  panelTitle: string;
  navItems: NavItem[];
  children: ReactNode;
}

export function Shell({ panelTitle, navItems, children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await doLogout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-800 transition"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <Image src={logo} alt="Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-lg font-bold text-gray-800 tracking-tight">UniSys</span>
        </div>
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {panelTitle}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar - Desktop */}
        <nav className={`
          fixed lg:relative w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-1 transition-all duration-300 z-10
          ${mobileMenuOpen ? 'left-0' : '-left-64 lg:left-0'}
        `}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-5 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 bg-gray-50 overflow-auto min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>

      <footer className="px-6 py-4 bg-white border-t border-gray-200 text-center text-xs text-gray-400">
        © 2025 UniSys. All rights reserved. | Empowering Education
      </footer>
    </div>
  );
}