"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";


function NavItem({ icon, label, href }: { icon: string; label: string; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

return (
  <button
    className={`flex items-center gap-2 text-left px-2 py-2 rounded transition text-sm sm:text-base
      ${isActive ? "bg-[#F96D00] text-white" : "text-gray-600 hover:text-[#f96D00] hover:bg-transparent"}
      group`}
    onClick={() => (window.location.href = href)}
  >
    <Icon
      icon={icon}
      className={`text-xl transition-colors group-hover:text-[#f96D00] ${
        isActive ? "text-white" : "text-gray-600"
      }`}
    />
    <span className="truncate group-hover:text-[#f96D00]">{label}</span>
  </button>
);
}

export default function SideNavbar() {
  return (
    <div className="relative w-[200px] sticky top-0 z-50 left-0 h-screen bg-[#F7F7F7] shadow-md p-4 flex flex-col">
      <nav className="flex flex-col w-full gap-4 sm:mt-6 pl-2">
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/logo1.png"
            alt="logo1"
            width={181}
            height={62}
            priority
            className="max-w-full h-auto"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">ตารางสอน</label>
          <NavItem icon="ph:student" label="นักศึกษา" href="/student" />
          <NavItem icon="hugeicons:teacher" label="อาจารย์" href="/teacher" />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">ตารางสอบ</label>
          <NavItem icon="ph:student" label="นักศึกษา" href="/teacher" />
          <NavItem icon="hugeicons:teacher" label="อาจารย์" href="/teacher" />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">อื่นๆ</label>
          <NavItem icon="mage:plus-square" label="ชดเชย" href="/teacher" />
        </div>
        <div className="absolute inset-x-4 bottom-6">
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
