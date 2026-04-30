// app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { IoStatsChart, IoDocumentText } from "react-icons/io5";
import { FaUsers, FaBookmark, FaCheckCircle, FaClock, FaChartLine } from "react-icons/fa";
import { MdEdit, MdDelete, MdAdd, MdDashboard } from "react-icons/md";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Shell } from "@/app/components/Shell";
import Bookmarks from "@/app/components/Bookmarks";
import { useAuth } from "@/app/contexts/authContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/adduser", label: "Add User", icon: <MdDashboard /> },
  { href: "/showuser", label: "Show Users", icon: <FaUsers /> },
  { href: "/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
];

interface Task {
  id: string;
  student: string;
  studentId?: string;
  tasks: string[];
  createdAt: number;
  dueDate?: number;
  status: "pending" | "in-progress" | "completed";
}

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ student: "", tasks: "", dueDate: "", status: "pending" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState({ student: "", tasks: "" });
  const [activeTab, setActiveTab] = useState<"dashboard" | "tasks" | "bookmarks">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });

  const tasksCollectionRef = collection(db, "tasks");

  const fetchTasks = async () => {
    const data = await getDocs(tasksCollectionRef);
    const tasksData = data.docs.map((d) => ({ ...d.data(), id: d.id })) as Task[];
    setTasks(tasksData);
    updateStats(tasksData);
    return tasksData;
  };

  const updateStats = (tasksData: Task[]) => {
    setStats({
      total: tasksData.length,
      completed: tasksData.filter(t => t.status === "completed").length,
      pending: tasksData.filter(t => t.status === "pending").length,
      inProgress: tasksData.filter(t => t.status === "in-progress").length,
    });
  };

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    let filtered = tasks;
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tasks.some(task => task.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, tasks]);

  const handleFormClose = () => {
    setFormVisible(false);
    setFormData({ student: "", tasks: "", dueDate: "", status: "pending" });
    setEditIndex(null);
    setFormErrors({ student: "", tasks: "" });
  };

  const handleFormSubmit = async () => {
    const errors = { student: "", tasks: "" };
    if (!formData.student.trim()) errors.student = "Student Name is required.";
    if (!formData.tasks.trim()) errors.tasks = "Tasks are required.";
    if (errors.student || errors.tasks) { setFormErrors(errors); return; }

    const taskList = formData.tasks.split(",").map((t) => t.trim()).filter(Boolean);
    const newTask = {
      student: formData.student,
      tasks: taskList,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : null,
      status: formData.status,
      createdAt: Date.now(),
    };

    if (editIndex !== null) {
      await updateDoc(doc(db, "tasks", tasks[editIndex].id), newTask);
    } else {
      await addDoc(tasksCollectionRef, newTask);
    }
    handleFormClose();
    await fetchTasks();
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "tasks", tasks[index].id));
      await fetchTasks();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateDoc(doc(db, "tasks", taskId), { status: newStatus });
    await fetchTasks();
  };

  const handleEdit = (index: number) => {
    setFormData({
      student: tasks[index].student,
      tasks: tasks[index].tasks.join(", "),
      dueDate: tasks[index].dueDate ? new Date(tasks[index].dueDate).toISOString().split('T')[0] : "",
      status: tasks[index].status,
    });
    setEditIndex(index);
    setFormVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in-progress": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <Shell panelTitle="Admin Panel" navItems={NAV}>
      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-white p-1 rounded-xl border border-gray-200 w-fit shadow-sm">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "dashboard" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <IoStatsChart size={16} /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "tasks" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <IoDocumentText size={16} /> Tasks
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "bookmarks" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <FaBookmark size={14} /> Bookmarks
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {currentUser?.name || "Admin"}! Here's your task summary.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Tasks" value={stats.total} icon={<IoDocumentText size={24} />} color="bg-blue-100 text-blue-600" />
            <StatCard title="Completed" value={stats.completed} icon={<FaCheckCircle size={24} />} color="bg-green-100 text-green-600" />
            <StatCard title="In Progress" value={stats.inProgress} icon={<FaClock size={24} />} color="bg-yellow-100 text-yellow-600" />
            <StatCard title="Pending" value={stats.pending} icon={<FaChartLine size={24} />} color="bg-gray-100 text-gray-600" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No tasks yet. Create your first task!</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{task.student}</p>
                      <p className="text-sm text-gray-500">{task.tasks[0]}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Tasks</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and assign tasks to students</p>
            </div>
            <button
              onClick={() => setFormVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition"
            >
              <MdAdd size={20} /> Add Task
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by student or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm mt-1">Try adjusting your search or add a new task</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTasks.map((item, index) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-gray-800 text-base">{item.student}</h2>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {item.tasks.map((task, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                      {item.dueDate && (
                        <p className="text-xs text-gray-400 mt-3">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleEdit(index)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                        <MdEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
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

      {/* Task Form Modal */}
      {formVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">{editIndex !== null ? "Edit Task" : "Add Task"}</h2>
              <button onClick={handleFormClose} className="text-gray-400 hover:text-gray-600 transition text-xl">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Name</label>
                <input
                  type="text"
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${formErrors.student ? "border-red-400" : "border-gray-200"} rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition`}
                  placeholder="Enter student name"
                />
                {formErrors.student && <p className="text-red-500 text-xs mt-1">{formErrors.student}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tasks <span className="text-gray-400">(comma separated)</span></label>
                <input
                  type="text"
                  value={formData.tasks}
                  onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${formErrors.tasks ? "border-red-400" : "border-gray-200"} rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition`}
                  placeholder="Quiz tomorrow, Submit assignment"
                />
                {formErrors.tasks && <p className="text-red-500 text-xs mt-1">{formErrors.tasks}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date (Optional)</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                onClick={handleFormSubmit}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition text-sm shadow-sm"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
