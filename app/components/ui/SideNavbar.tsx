"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

function NavItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: string;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      className={`group relative flex items-center gap-2 text-left px-4 py-3 rounded transition text-sm sm:text-base
        ${isActive ? "bg-white text-[#F96D00]" : "text-gray-600 hover:bg-gray-200"}
      `}
      onClick={() => {
        window.location.href = href;
        onClick?.();
      }}
    >
      {isActive && (
        <div className="absolute h-full left-0 top-0 bottom-0 w-1 rounded-l bg-[#F96D00]" />
      )}
      <Icon
        icon={icon}
        className={`text-xl transition-colors ${
          isActive ? "text-[#F96D00]" : "group-hover:text-[#F96D00]"
        }`}
      />
      <span
        className={`truncate transition-colors ${
          isActive ? "text-[#F96D00]" : "group-hover:text-[#F96D00]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

      <button
        className="md:hidden fixed top-4 right-4 z-[70] p-2 rounded bg-[#F96D00] text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} className="text-2xl" />
      </button>


      <div
        className={`
          fixed top-0 left-0 h-screen bg-[#F7F7F7] shadow-md flex flex-col
          w-[200px] z-[60]
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <nav className="flex flex-col w-full gap-4 mt-6 pl-2">
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
            <label className="mb-2 text-sm font-medium text-gray-600">จัดการตาราง</label>
            <NavItem
              icon="ph:student"
              label="เพิ่มตาราง"
              href="/AddTable"
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              icon="tabler:file-description"
              label="ข้อมูลอาจารย์"
              href="/teacherData"
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              icon="tabler:file-description"
              label="ข้อมูลวิชา"
              href="/SubjectData"
              onClick={() => setIsOpen(false)}
            />
          </div>


          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-600">ตารางเรียน</label>
            <NavItem
              icon="ph:student"
              label="นักศึกษา"
              href="/studentStudy"
              onClick={() => setIsOpen(false)}
            />
            <NavItem
              icon="hugeicons:teacher"
              label="อาจารย์"
              href="/teacherStudy"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-600">อื่นๆ</label>
            <NavItem
              icon="mage:plus-square"
              label="ชดเชย"
              href="/makeupclass"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="absolute inset-x-4 bottom-6">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </>
  );
}
