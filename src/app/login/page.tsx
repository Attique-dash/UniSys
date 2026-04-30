// app/login/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import Image from "next/image";
import logo from "../images/logo.png";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { userLoggedIn, currentUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && userLoggedIn && currentUser) {
      redirectByRole(currentUser.role);
    }
  }, [userLoggedIn, loading, currentUser]);

  const redirectByRole = (role: string | null) => {
    switch (role) {
      case "admin": router.push("/"); break;
      case "teacher": router.push("/teacher"); break;
      case "cr": router.push("/cr"); break;
      case "student": router.push("/student"); break;
      default: router.push("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Email and Password are required."); return; }
    setError("");
    try {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      setIsSigningIn(true);
      await doSignInWithGoogle();
    } catch {
      setError("Failed to log in with Google.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col">
      <header className="flex items-center gap-3 px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <Image src={logo} alt="Logo" width={44} height={44} className="rounded-lg shadow-sm" />
        <span className="text-xl font-bold text-gray-800 tracking-tight">UniSys</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h1>
              <p className="text-gray-500 text-sm">Sign in to your UniSys account</p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-gray-400" size={14} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2 text-gray-400" size={14} />
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 transition">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition duration-200 mt-2 shadow-md hover:shadow-lg"
              >
                {isSigningIn ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 uppercase tracking-widest">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow"
            >
              <FaGoogle className="text-red-500" size={18} />
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                Contact admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}