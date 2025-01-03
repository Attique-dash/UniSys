"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { IoHomeSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import logo from "./images/logo.png";
import { doLogout } from "@/app/firebase/auth";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await doLogout();
      router.push("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const [tasks, setTasks] = useState<{ id: string; student: string; tasks: string[] }[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<{ student: string; tasks: string }>(
    { student: "", tasks: "" });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState({ student: "", tasks: "" });

  const tasksCollectionRef = collection(db, "tasks");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getDocs(tasksCollectionRef);
        setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as { id: string; student: string; tasks: string[] }[]);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const handleFormClose = () => {
    setFormVisible(false);
    setFormData({ student: "", tasks: "" });
    setEditIndex(null);
    setFormErrors({ student: "", tasks: "" });
  };

  const handleFormSubmit = async () => {
    const errors = { student: "", tasks: "" };

    if (!formData.student.trim()) {
      errors.student = "Student Name is required.";
    }
    if (!formData.tasks.trim()) {
      errors.tasks = "Tasks are required.";
    }

    if (errors.student || errors.tasks) {
      setFormErrors(errors);
      return;
    }

    const taskList = formData.tasks.split(",").map((task) => task.trim());
    try {
      if (editIndex !== null) {
        const taskId = tasks[editIndex].id;
        const taskDoc = doc(db, "tasks", taskId);
        await updateDoc(taskDoc, { student: formData.student, tasks: taskList });
      } else {
        await addDoc(tasksCollectionRef, { student: formData.student, tasks: taskList });
      }

      handleFormClose();
      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as { id: string; student: string; tasks: string[] }[]);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleDelete = async (index : number) => {
    try {
      const taskId = tasks[index].id;
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);

      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as { id: string; student: string; tasks: string[] }[]);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (index: number) => {
    setFormData({ student: tasks[index].student, tasks: tasks[index].tasks.join(",") });
    setEditIndex(index);
    setFormVisible(true);
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-gray-700 text-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={60} height={60} />
          <span className="text-xl font-bold">UniSys</span>
        </div>
        <div className="text-lg font-medium">Admin Panel</div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition duration-300"
        >
          Logout
        </button>
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
          <h1 className="text-2xl text-center font-bold mb-4">Users Info</h1>
          <div className="grid grid-cols-2 gap-6">
            {tasks.map((item, index) => (
              <div key={item.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.student}</h2>
                  {item.tasks.map((task, idx) => (
                    <p key={idx} className="text-sm text-gray-600">{task}</p>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700">
                    <MdEdit size={24} />
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                    <MdDelete size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setFormVisible(true)}
              className="bg-gray-500 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 transition duration-300"
            >
              <MdAdd size={36} />
            </button>
          </div>
        </main>
      </div>

      {formVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-lg relative">
            <button
              onClick={handleFormClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">{editIndex !== null ? "Edit Student Task" : "Add Student Task"}</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
              <input
                type="text"
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-100 border ${
                  formErrors.student ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none`}
              />
              {formErrors.student && <p className="text-red-500 text-sm mt-1">{formErrors.student}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
              <input
                type="text"
                value={formData.tasks}
                onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
                className={`mt-1 block w-full px-4 py-2 bg-gray-100 border ${
                  formErrors.tasks ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none`}
              />
              {formErrors.tasks && <p className="text-red-500 text-sm mt-1">{formErrors.tasks}</p>}
            </div>

            <button
              onClick={handleFormSubmit}
              className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <footer className="p-4 bg-gray-800 text-center text-white">
        © 2025 UniSys. All rights reserved.
      </footer>
    </div>
  );
}
