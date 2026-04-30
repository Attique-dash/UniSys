// app/teacher/page.tsx
"use client";
import { useState, useEffect } from "react";
import { IoHomeSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaUser, FaBookmark, FaCheckCircle, FaClock } from "react-icons/fa";
import { MdEdit, MdDelete, MdDashboard, MdAssignmentTurnedIn } from "react-icons/md";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Shell } from "@/app/components/Shell";
import { useAuth } from "@/app/contexts/authContext";
import Bookmarks from "@/app/components/Bookmarks";

const NAV = [
  { href: "/teacher", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/teacher/profile", label: "Profile", icon: <FaUser /> },
  { href: "/teacher/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
];

interface Task {
  id: string;
  student: string;
  tasks: string[];
  status: string;
  createdAt: number;
}

export default function TeacherPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "bookmarks">("tasks");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"));
      const data = await getDocs(q);
      setTasks(data.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    await updateDoc(doc(db, "tasks", taskId), { status: newStatus });
    await fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "tasks", taskId));
      await fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tasks.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs"><FaCheckCircle size={12} /> Completed</span>;
      case "in-progress":
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs"><FaClock size={12} /> In Progress</span>;
      default:
        return <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs">Pending</span>;
    }
  };

  return (
    <Shell panelTitle="Teacher Panel" navItems={NAV}>
      <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "tasks" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <MdAssignmentTurnedIn size={16} /> Student Tasks
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "bookmarks" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <FaBookmark size={14} /> Saved Sites
        </button>
      </div>

      {activeTab === "tasks" && (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Student Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage student assignments</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by student or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
              <p className="text-lg font-medium">No tasks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-gray-800">{task.student}</h2>
                        {getStatusBadge(task.status)}
                      </div>
                      <ul className="space-y-1">
                        {task.tasks.map((t, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => handleDelete(task.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "bookmarks" && <Bookmarks />}
    </Shell>
  );
}