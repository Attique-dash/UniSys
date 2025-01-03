"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoHomeSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaUsers, FaUserCircle } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "@/app/firebase/firebase"; 
import logo from "../images/logo.png";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ShowUser() {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData: User[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">), 
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
          <h1 className="text-2xl text-center font-bold mb-4">Student Names</h1>
          <p className="text-gray-700 text-center mb-6">
            Show the student name and their email
          </p>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center bg-gray-100 p-4 rounded-md shadow"
                >
                  <FaUserCircle className="text-gray-500 text-4xl mr-4" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No users found.</div>
          )}
        </main>
      </div>

      <footer className="p-4 bg-gray-800 text-center text-white">
        © 2025 UniSys. All rights reserved.
      </footer>
    </div>
  );
}
