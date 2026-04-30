// app/page.tsx - Landing Page
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiArrowRight, FiCheck, FiUsers, FiBookOpen, FiAward, FiMenu, FiX } from "react-icons/fi";
import { MdSchool, MdDashboard, MdAssignment, MdAnalytics } from "react-icons/md";
import logo from "@/app/images/logo.png";

const FEATURES = [
  {
    icon: <MdDashboard size={28} />,
    title: "Smart Dashboard",
    description: "Intuitive admin dashboard with real-time analytics and task management capabilities."
  },
  {
    icon: <FiUsers size={28} />,
    title: "User Management",
    description: "Efficiently manage students, teachers, and administrators with role-based access."
  },
  {
    icon: <MdAssignment size={28} />,
    title: "Task Tracking",
    description: "Assign, track, and monitor student tasks with status updates and due dates."
  },
  {
    icon: <FiBookOpen size={28} />,
    title: "Resource Library",
    description: "Centralized bookmark management for educational resources and references."
  },
  {
    icon: <MdAnalytics size={28} />,
    title: "Progress Analytics",
    description: "Track completion rates and performance metrics with visual insights."
  },
  {
    icon: <FiAward size={28} />,
    title: "Achievement System",
    description: "Gamified learning experience with progress tracking and achievements."
  }
];

const STATS = [
  { value: "10K+", label: "Active Students" },
  { value: "500+", label: "Teachers" },
  { value: "50K+", label: "Tasks Completed" },
  { value: "99%", label: "Satisfaction Rate" }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src={logo} alt="UniSys" width={36} height={36} className="rounded-lg" />
              <span className="text-xl font-bold text-gray-800 tracking-tight">UniSys</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition">Features</Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition">About</Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition">Contact</Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Sign In
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition shadow-sm"
              >
                Dashboard
                <FiArrowRight size={18} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link href="#about" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">About</Link>
              <Link href="#contact" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Contact</Link>
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <Link href="/login" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
                <Link href="/admin" className="block py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg text-center">Dashboard</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <MdSchool className="text-blue-500" size={20} />
              <span className="text-sm font-medium text-blue-600">Empowering Education</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Streamline Your
              <span className="text-blue-500"> Educational</span> Management
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              UniSys is a comprehensive Learning Management System designed to simplify task management, 
              enhance collaboration, and drive student success through intelligent workflows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
              >
                Get Started
                <FiArrowRight size={20} />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-blue-500 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your educational institution efficiently and effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-500 group-hover:text-white transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                About <span className="text-blue-500">UniSys</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                UniSys was built with a vision to transform educational management through technology. 
                We believe that efficient administration leads to better learning outcomes.
              </p>
              <ul className="space-y-4">
                {[
                  "Modern, intuitive interface designed for ease of use",
                  "Secure, scalable architecture built for institutions of all sizes",
                  "Continuous updates based on educational best practices",
                  "Dedicated support team committed to your success"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheck className="text-green-600" size={14} />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose UniSys?</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Our platform combines powerful functionality with an elegant design, making educational 
                management simpler and more effective than ever before.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold mb-1">Fast</p>
                  <p className="text-sm text-blue-100">Lightning quick performance</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold mb-1">Secure</p>
                  <p className="text-sm text-blue-100">Enterprise-grade security</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold mb-1">Simple</p>
                  <p className="text-sm text-blue-100">No training required</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold mb-1">Reliable</p>
                  <p className="text-sm text-blue-100">99.9% uptime guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions already using UniSys to streamline their operations 
            and enhance student success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25"
            >
              Get Started Now
              <FiArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src={logo} alt="UniSys" width={32} height={32} className="rounded-lg" />
                <span className="text-lg font-bold text-gray-800">UniSys</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-sm">
                Empowering educational institutions with modern management tools. 
                Simplify administration, enhance learning.
              </p>
              <p className="text-sm text-gray-500">© 2025 UniSys. All rights reserved.</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link></li>
                <li><Link href="/admin" className="text-gray-600 hover:text-gray-900 transition">Dashboard</Link></li>
                <li><Link href="/login" className="text-gray-600 hover:text-gray-900 transition">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-600">help@unisys.edu</span></li>
                <li><span className="text-gray-600">+1 (555) 123-4567</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}