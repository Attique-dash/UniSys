// app/cr/bookmarks/page.tsx
"use client";
import { MdDashboard, MdPerson } from "react-icons/md";
import { FaBookmark } from "react-icons/fa";
import { Shell } from "@/app/components/Shell";
import Bookmarks from "@/app/components/Bookmarks";

const NAV = [
  { href: "/cr", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/cr/bookmarks", label: "Saved Sites", icon: <FaBookmark /> },
  { href: "/cr/profile", label: "Profile", icon: <FaBookmark /> },
];

export default function CRBookmarks() {
  return (
    <Shell panelTitle="CR Panel" navItems={NAV}>
      <Bookmarks />
    </Shell>
  );
}
