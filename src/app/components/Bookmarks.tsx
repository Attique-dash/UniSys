// app/components/Bookmarks.tsx
"use client";
import { useState, useEffect } from "react";
import {
  collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy,
} from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { useAuth } from "@/app/contexts/authContext";
import { MdAdd, MdDelete, MdLink, MdOpenInNew, MdBookmark, MdCategory, MdSearch } from "react-icons/md";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  uid: string;
  createdAt: number;
}

const categories = ["General", "Study", "Work", "Entertainment", "News", "Social"];

export default function Bookmarks() {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({ title: "", url: "", description: "", category: "General" });
  const [errors, setErrors] = useState({ title: "", url: "" });
  const [saving, setSaving] = useState(false);

  const bookmarksRef = collection(db, "bookmarks");

  const fetchBookmarks = async () => {
    if (!currentUser) return;
    try {
      const q = query(bookmarksRef, where("uid", "==", currentUser.uid), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bookmark));
      setBookmarks(data);
      setFilteredBookmarks(data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, [currentUser]);

  useEffect(() => {
    let filtered = bookmarks;
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }
    setFilteredBookmarks(filtered);
  }, [searchTerm, selectedCategory, bookmarks]);

  const validate = () => {
    const e = { title: "", url: "" };
    if (!formData.title.trim()) e.title = "Title is required.";
    if (!formData.url.trim()) e.url = "URL is required.";
    else if (!/^https?:\/\/.+/.test(formData.url.trim())) e.url = "URL must start with http:// or https://";
    setErrors(e);
    return !e.title && !e.url;
  };

  const handleSave = async () => {
    if (!validate() || !currentUser) return;
    setSaving(true);
    try {
      await addDoc(bookmarksRef, {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        category: formData.category,
        uid: currentUser.uid,
        createdAt: Date.now(),
      });
      setFormData({ title: "", url: "", description: "", category: "General" });
      setShowForm(false);
      await fetchBookmarks();
    } catch (err) {
      console.error("Error saving bookmark:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this bookmark?")) {
      try {
        await deleteDoc(doc(db, "bookmarks", id));
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        console.error("Error deleting bookmark:", err);
      }
    }
  };

  const getFavicon = (url: string) => {
    try {
      const { origin } = new URL(url);
      return `${origin}/favicon.ico`;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdBookmark className="text-blue-500" />
            My Bookmarks
          </h1>
          <p className="text-gray-500 text-sm mt-1">Organize and access your important links</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          <MdAdd size={18} /> Add Bookmark
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-blue-400"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
          <MdLink size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No saved sites yet</p>
          <p className="text-sm mt-1">Click "Add Bookmark" to save your first link</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {getFavicon(bm.url) ? (
                      <img
                        src={getFavicon(bm.url)!}
                        alt=""
                        width={16}
                        height={16}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <MdLink size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{bm.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{bm.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition"
                    title="Open site"
                  >
                    <MdOpenInNew size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(bm.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {bm.category}
                </span>
              </div>
              {bm.description && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{bm.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(bm.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Bookmark Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MdBookmark className="text-blue-500" /> Add Bookmark
              </h2>
              <button
                onClick={() => { setShowForm(false); setFormData({ title: "", url: "", description: "", category: "General" }); setErrors({ title: "", url: "" }); }}
                className="text-gray-400 hover:text-gray-600 transition text-xl"
              >✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Google Scholar"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.title ? "border-red-400" : "border-gray-200"} rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.url ? "border-red-400" : "border-gray-200"} rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition`}
                />
                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-400"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400">(optional)</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief note about this site"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm shadow-sm"
              >
                {saving ? "Saving..." : "Save Bookmark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}