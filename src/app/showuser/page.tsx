// app/showuser/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { IoHomeSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaUsers, FaUserCircle, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { MdBookmark } from "react-icons/md";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Shell } from "@/app/components/Shell";

const NAV = [
  { href: "/", label: "Dashboard", icon: <IoHomeSharp /> },
  { href: "/adduser", label: "Add User", icon: <IoPersonAddSharp /> },
  { href: "/showuser", label: "Show Users", icon: <FaUsers /> },
  { href: "/bookmarks", label: "Saved Sites", icon: <MdBookmark /> },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subject?: string;
}

export default function ShowUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData: User[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteDoc(doc(db, "users", id));
      await fetchUsers();
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    await updateDoc(doc(db, "users", id), { role: newRole });
    await fetchUsers();
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700";
      case "teacher": return "bg-blue-100 text-blue-700";
      case "cr": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Shell panelTitle="Admin Panel" navItems={NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-blue-400"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="cr">CRs</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="text-gray-400 text-2xl" />
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
                    <td className="py-3 px-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          onBlur={() => handleUpdateRole(user.id, editingUser.role)}
                          autoFocus
                          className="px-2 py-1 text-sm border border-gray-200 rounded-lg"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="cr">CR</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{user.subject || "-"}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Role"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete User"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
          <FaUsers size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm mt-1">Try adjusting your search or add a new user</p>
        </div>
      )}
    </Shell>
  );
}