// app/cr/page.tsx
"use client";
import { useState, useEffect } from "react";
import { FaUser, FaBookmark, FaCheckCircle, FaClock } from "react-icons/fa";
import { MdDashboard, MdEdit, MdAssignment } from "react-icons/md";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Shell } from "@/app/components/Shell";
import { useAuth } from "@/app/contexts/authContext";
import Bookmarks from "@/app/components/Bookmarks";

const NAV = [
  { href: "/cr", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/cr/profile", label: "Profile", icon: <FaUser /> },
  { href: "/cr/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
];

interface Task {
  id: string;
  student: string;
  tasks: string[];
  status: string;
}

export default function CRPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "bookmarks">("tasks");

  const fetchTasks = async () => {
    try {
      const data = await getDocs(collection(db, "tasks"));
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

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status === "pending" || !t.status).length,
  };

  return (
    <Shell panelTitle="CR Panel" navItems={NAV}>
      <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "tasks" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <MdAssignment size={16} /> Class Tasks
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
            <h1 className="text-2xl font-bold text-gray-800">Class Representative Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and update class task progress</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Class Tasks</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
              <p className="text-lg font-medium">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-gray-800">{task.student}</h2>
                        <select
                          value={task.status || "pending"}
                          onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
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