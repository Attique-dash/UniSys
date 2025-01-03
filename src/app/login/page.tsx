"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import logo from "../images/logo.png";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { userLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  
    useEffect(() => {
      if (userLoggedIn) {
        router.push("/");
      }
    }, [userLoggedIn, router]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }
  
    const lastLoggedInEmail = localStorage.getItem("lastLoggedInEmail");
  
    if (lastLoggedInEmail && lastLoggedInEmail !== email) {
      setError("This email does not match the previously logged-in email.");
      return;
    }
  
    setError("");
    try {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      localStorage.setItem("lastLoggedInEmail", email);
      router.push("/");
    } catch (err: any) {
      console.error("Error during login:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };
  
  

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setIsSigningIn(true);
      await doSignInWithGoogle();
      router.push("/");
    } catch (err) {
      setError("Failed to log in with Google.");
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (userLoggedIn) {
    router.push("/");
    return null;
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-gray-700 text-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={60} height={60} />
          <span className="text-xl font-bold">UniSys</span>
        </div>
      </header>
      <div className="flex items-center justify-center">
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg max-w-sm w-full mt-16">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome 
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-base font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-base font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 mt-7 flex items-center text-gray-500"
              >
                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
              disabled={isSigningIn}
            >
              {isSigningIn ? "Logging in..." : "Login"}
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Login with Google
          </button>
        </div>
      </div>
    </>
  );
}
