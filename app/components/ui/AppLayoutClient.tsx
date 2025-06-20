"use client";

import { usePathname } from "next/navigation";
import SideNavbar from "./SideNavbar";
import Navbar from "./NavBar";

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarPaths = ["/login"];
  const showNavbar = !hideNavbarPaths.includes(pathname || "");

  return (
    <>
      {showNavbar && (
        <aside className="md:w-[200px] shrink-0 sticky top-0 h-auto md:h-screen">
          <SideNavbar />
        </aside>
      )}

      <div className="flex flex-col w-full ">
        {showNavbar && (
          <div className="sticky top-0 z-[50]">
            <Navbar/>
          </div>
        )}
        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </>
  );
}