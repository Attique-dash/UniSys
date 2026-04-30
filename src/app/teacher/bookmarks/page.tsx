// app/teacher/bookmarks/page.tsx
"use client";
import { MdDashboard, MdPerson } from "react-icons/md";
import { FaBookmark } from "react-icons/fa";
import { Shell } from "@/app/components/Shell";
import Bookmarks from "@/app/components/Bookmarks";

const NAV = [
  { href: "/teacher", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/teacher/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
  { href: "/teacher/profile", label: "Profile", icon: <MdPerson /> },
];

export default function TeacherBookmarks() {
  return (
    <Shell panelTitle="Teacher Panel" navItems={NAV}>
      <Bookmarks />
    </Shell>
  );
}
