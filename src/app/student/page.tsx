// app/student/page.tsx
"use client";
import { useState, useEffect } from "react";
import { FaUser, FaBookmark, FaCheckCircle, FaClock, FaFlagCheckered } from "react-icons/fa";
import { MdDashboard, MdAssignment } from "react-icons/md";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Shell } from "@/app/components/Shell";
import { useAuth } from "@/app/contexts/authContext";
import Bookmarks from "@/app/components/Bookmarks";

const NAV = [
  { href: "/student", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/student/profile", label: "Profile", icon: <FaUser /> },
  { href: "/student/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
];

interface Task {
  id: string;
  student: string;
  tasks: string[];
  status: string;
  dueDate?: number;
  createdAt: number;
}

export default function StudentPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "bookmarks">("tasks");

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"), where("student", "==", currentUser?.name || ""));
      const data = await getDocs(q);
      setTasks(data.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [currentUser]);

  const handleTaskComplete = async (taskId: string) => {
    await updateDoc(doc(db, "tasks", taskId), { status: "completed" });
    await fetchTasks();
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <FaCheckCircle className="text-green-500" />;
      case "in-progress": return <FaClock className="text-yellow-500" />;
      default: return <FaFlagCheckered className="text-gray-400" />;
    }
  };

  return (
    <Shell panelTitle="Student Panel" navItems={NAV}>
      <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "tasks" ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <MdAssignment size={16} /> My Tasks
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
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">Track your assignments and stay organized</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Tasks</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending + stats.inProgress}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
              <p className="text-lg font-medium">No tasks assigned yet</p>
              <p className="text-sm mt-1">Check back later for new assignments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(task.status)}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          task.status === "completed" ? "bg-green-100 text-green-700" :
                          task.status === "in-progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {task.status || "Pending"}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {task.tasks.map((t, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                      {task.dueDate && (
                        <p className="text-xs text-gray-400 mt-3">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {task.status !== "completed" && (
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
                      >
                        Mark Complete
                      </button>
                    )}
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