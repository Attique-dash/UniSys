// app/student/bookmarks/page.tsx
"use client";
import { MdDashboard, MdAssignment } from "react-icons/md";
import { FaUser, FaBookmark } from "react-icons/fa";
import { Shell } from "@/app/components/Shell";
import Bookmarks from "@/app/components/Bookmarks";

const NAV = [
  { href: "/student", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/student/profile", label: "Profile", icon: <FaUser /> },
  { href: "/student/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
];

export default function StudentBookmarks() {
  return (
    <Shell panelTitle="Student Panel" navItems={NAV}>
      <Bookmarks />
    </Shell>
  );
}
