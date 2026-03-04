"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SideNavbar from "./SideNavbar";
import Navbar from "./NavBar";

function startsWithAny(pathname: string, list: string[]) {
  return list.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // ✅ หน้า auth ไม่ต้องมี Sidebar/Top Navbar
  const AUTH_HIDE_PATHS = ["/login", "/signup", "/"];

  // หน้าไหนไม่ต้องมี Table Navbar (ของคุณเดิม)
  const HIDE_TABLE_NAVBAR_PATHS = [
    "/login",
    "/signup",
    "/",
    "/addTable",
    "/teacherData",
    "/SubjectData",
    "/makeupclass",
  ];

  const showNavbar = !startsWithAny(pathname, AUTH_HIDE_PATHS);
  const showTableNavbar = !startsWithAny(pathname, HIDE_TABLE_NAVBAR_PATHS);

  return (
    <>
      {showNavbar && (
        <aside className="md:w-[200px] shrink-0 sticky top-0 h-auto md:h-screen">
          <SideNavbar />
        </aside>
      )}

      <div className="flex flex-col w-full">
        {showTableNavbar && (
          <div className="sticky top-0 z-[50]">
            <Navbar />
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </>
  );
}