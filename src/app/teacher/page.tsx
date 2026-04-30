// app/teacher/page.tsx
"use client";
import { useState, useEffect } from "react";
import { FaUser, FaBookmark, FaCheckCircle, FaClock, FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete, MdDashboard, MdAssignmentTurnedIn, MdAdd } from "react-icons/md";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, addDoc } from "firebase/firestore";
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
  studentEmail?: string;
  tasks: string[];
  status: string;
  createdAt: number;
  dueDate?: number;
}

export default function TeacherPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "bookmarks">("tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ 
    student: "", 
    studentEmail: "", 
    tasks: "", 
    dueDate: "", 
    status: "pending" 
  });
  const [formErrors, setFormErrors] = useState({ student: "", tasks: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const tasksCollectionRef = collection(db, "tasks");

  const fetchTasks = async () => {
    try {
      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleFormClose = () => {
    setFormVisible(false);
    setFormData({ student: "", studentEmail: "", tasks: "", dueDate: "", status: "pending" });
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
      studentEmail: formData.studentEmail || formData.student,
      tasks: taskList,
      dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : null,
      status: formData.status,
      createdAt: Date.now(),
    };

    try {
      if (editIndex !== null) {
        await updateDoc(doc(db, "tasks", tasks[editIndex].id), newTask);
      } else {
        await addDoc(tasksCollectionRef, newTask);
      }
      handleFormClose();
      await fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (index: number) => {
    const task = tasks[index];
    setFormData({
      student: task.student,
      studentEmail: task.studentEmail || task.student,
      tasks: task.tasks.join(", "),
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      status: task.status,
    });
    setEditIndex(index);
    setFormVisible(true);
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Tasks</h1>
              <p className="text-gray-500 text-sm mt-1">Add, edit and manage student assignments</p>
            </div>
            <button
              onClick={() => setFormVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition"
            >
              <MdAdd size={20} /> Add Task
            </button>
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
              {filteredTasks.map((task, index) => (
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
                      <button 
                        onClick={() => handleEdit(index)} 
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Edit task"
                      >
                        <MdEdit size={18} />
                      </button>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button 
                        onClick={() => handleDelete(task.id)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete task"
                      >
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Student Email <span className="text-gray-400">(optional)</span></label>
                <input
                  type="email"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="student@university.edu"
                />
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
                {editIndex !== null ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}