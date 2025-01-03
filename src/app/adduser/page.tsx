"use client";

import Image from "next/image";
import { IoHomeSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import logo from "../images/logo.png";
import { db } from "@/app/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    subject: "",
  });
  const [message, setMessage] = useState(""); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmail = async (email: string) => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: formData.name,
          role: formData.role,
          subject: formData.subject,
        }),
      });
  
      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const docRef = await addDoc(collection(db, "users"), formData);
      console.log("Document written with ID: ", docRef.id);
  
await sendEmail(formData.email);
      setMessage("Data stored in Firebase and email sent successfully!");
  
      setTimeout(() => {
        setMessage("");
      }, 3000);
  
      setFormData({ name: "", email: "", role: "student", subject: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Failed to store data or send email.");
  
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-gray-700 text-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={60} height={60} />
          <span className="text-xl font-bold">UniSys</span>
        </div>
        <div className="text-lg font-medium">Admin Panel</div>
        <a href="/login" className="px-4 py-2 cursor-pointer bg-red-600 rounded hover:bg-red-500">
          Logout
        </a>
      </header>

      <div className="flex flex-1">
        <nav className="w-64 bg-gray-200 p-4 shadow-inner">
          <ul className="space-y-4">
            <li>
              <a href="/" className="flex p-2 text-lg rounded hover:bg-gray-300 text-gray-700">
                <IoHomeSharp className="mr-5 mt-1" />
                Home
              </a>
            </li>
            <li>
              <a href="/adduser" className="flex p-2 text-lg rounded hover:bg-gray-300 text-gray-700">
                <IoPersonAddSharp className="mr-5 mt-1" />
                Add User
              </a>
            </li>
            <li>
              <a href="/showuser" className="flex p-2 text-lg rounded hover:bg-gray-300 text-gray-700">
                <FaUsers className="mr-5 mt-1" />
                Show Users
              </a>
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-8 bg-white">
          <h1 className="text-2xl text-center font-bold mb-4">Add Student</h1>
          <p className="text-gray-700 text-center mb-6">Below is the form to add a new student in the UniSys.</p>

          {message && (
            <div className={`mb-4 text-center p-2 rounded ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter the student's name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter the student's email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 cursor-pointer block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              >
                <option value="teacher">Teacher</option>
                <option value="cr">Class Representative (CR)</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter the subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
              >
                Send Email
              </button>
            </div>
          </form>
        </main>
      </div>

      <footer className="p-4 bg-gray-800 text-center text-white">
        © 2025 UniSys. All rights reserved.
      </footer>
    </div>
  );
}
