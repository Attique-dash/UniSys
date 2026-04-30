// app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import Image from "next/image";
import logo from "../images/logo.png";
import Link from "next/link";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ type: "success", text: "Password reset email sent! Check your inbox." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to send reset email" });
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
              <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
            </div>

            {message && (
              <div className={`mb-6 px-4 py-3 rounded-xl ${
                message.type === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700" 
                  : "bg-red-50 border border-red-200 text-red-600"
              } text-sm text-center`}>
                {message.type === "success" ? "✓ " : "✗ "}{message.text}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>

              <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
                <FaArrowLeft size={12} /> Back to Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}