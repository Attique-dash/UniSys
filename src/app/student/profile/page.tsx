// app/student/profile/page.tsx
"use client";
import { useState } from "react";
import { MdDashboard, MdPerson } from "react-icons/md";
import { FaBookmark, FaUser, FaCheckCircle } from "react-icons/fa";
import { Shell } from "@/app/components/Shell";
import { useAuth } from "@/app/contexts/authContext";

const NAV = [
  { href: "/student", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/student/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
  { href: "/student/profile", label: "Profile", icon: <FaUser /> },
];

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  return (
    <Shell panelTitle="Student Panel" navItems={NAV}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MdPerson className="text-blue-500" />
          Profile Settings
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {currentUser?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{currentUser?.name || "Student"}</h2>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mt-1">
                Student
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "info" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "security" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Security
            </button>
          </div>

          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={currentUser?.name || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={currentUser?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="text"
                    value={currentUser?.uid || ""}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value="Student"
                    readOnly
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Password management and security settings.</p>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium">
                Change Password
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-sm">Account Status</p>
            <p className="text-lg font-semibold text-green-600 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Active
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-sm">Tasks Completed</p>
            <p className="text-lg font-semibold text-blue-600 mt-1">View in Dashboard</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">2025</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
