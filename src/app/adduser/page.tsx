// app/adduser/page.tsx
"use client";
import { IoHomeSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaUsers, FaBookmark, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { db, auth } from "@/app/firebase/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Shell } from "@/app/components/Shell";

const NAV = [
  { href: "/", label: "Dashboard", icon: <IoHomeSharp /> },
  { href: "/adduser", label: "Add User", icon: <IoPersonAddSharp /> },
  { href: "/showuser", label: "Show Users", icon: <FaUsers /> },
  { href: "/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
];

export default function AddUser() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "student", subject: "", password: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (email: string, password: string) => {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: formData.name, role: formData.role, subject: formData.subject, password }),
    });
    if (!response.ok) throw new Error("Failed to send email");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password || "Temp@123");
      const uid = userCredential.user.uid;

      // Save to Firestore with uid as document ID
      await setDoc(doc(db, "users", uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        subject: formData.subject,
        createdAt: Date.now(),
      });

      // Send welcome email
      await sendEmail(formData.email, formData.password || "Temp@123");

      setMessage({ type: "success", text: "User added successfully! Welcome email sent." });
      setFormData({ name: "", email: "", role: "student", subject: "", password: "" });
    } catch (error: any) {
      console.error("Error adding user:", error);
      setMessage({ type: "error", text: error.message || "Failed to add user. Please try again." });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <Shell panelTitle="Admin Panel" navItems={NAV}>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserPlus className="text-blue-500" /> Add User
          </h1>
          <p className="text-gray-500 text-sm mt-1">Register a new student, teacher, or CR to UniSys</p>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-600"
          } text-sm`}>
            {message.type === "success" ? "✓ " : "✗ "}{message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleInputChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleInputChange}
              placeholder="user@university.edu"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="text" name="password" value={formData.password} onChange={handleInputChange}
              placeholder="Leave empty for default: Temp@123"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select
              name="role" value={formData.role} onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="cr">Class Representative (CR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject/Specialization</label>
            <input
              type="text" name="subject" value={formData.subject} onChange={handleInputChange}
              placeholder="e.g. Mathematics, Computer Science"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-2"
          >
            <FaEnvelope size={14} />
            {loading ? "Adding User..." : "Add User & Send Credentials"}
          </button>
        </form>
      </div>
    </Shell>
  );
}