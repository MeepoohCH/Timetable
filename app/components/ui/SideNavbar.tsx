"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import LogoutButton from "./LogoutButton";
import { usePathname, useRouter } from "next/navigation";

type Role = "admin" | "teacher" | "student";

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
  const router = useRouter();
  const isActive = pathname === href;

  return (
    <button
      className={`group relative flex items-center gap-2 text-left px-4 py-3 rounded transition text-sm sm:text-base
        ${isActive ? "bg-white text-[#F96D00]" : "text-gray-600 hover:bg-gray-200"}
      `}
      onClick={() => {
        router.push(href);
        onClick?.();
      }}
      type="button"
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
  const [role, setRole] = useState<Role>("student"); // default เผื่อยังไม่โหลด role
  const pathname = usePathname();

  useEffect(() => {
    const r = (sessionStorage.getItem("role") || "student") as Role;
    if (r === "admin" || r === "teacher" || r === "student") setRole(r);
    else setRole("student");
  }, [pathname]);

  const menu = useMemo(() => {
    if (role === "student") {
      return {
        manage: [] as { icon: string; label: string; href: string }[],
        table: [
          { icon: "ph:student", label: "นักศึกษา", href: "/studentStudy" },
          { icon: "hugeicons:teacher", label: "อาจารย์", href: "/teacherStudy" },
          ],
        other: [] as { icon: string; label: string; href: string }[],
      };
    }

    if (role === "teacher") {
      return {
        manage: [
          { icon: "tabler:file-description", label: "ข้อมูลอาจารย์", href: "/teacherData" },
          { icon: "tabler:file-description", label: "ข้อมูลวิชา", href: "/SubjectData" },
        ],
        table: [
          { icon: "ph:student", label: "นักศึกษา", href: "/studentStudy" },
          { icon: "hugeicons:teacher", label: "อาจารย์", href: "/teacherStudy" },
        ],
        other: [{ icon: "mage:plus-square", label: "ชดเชย", href: "/makeupclass" }],
      };
    }

    return {
      manage: [
        { icon: "ph:student", label: "เพิ่มตาราง", href: "/addTable" },
        { icon: "tabler:file-description", label: "ข้อมูลอาจารย์", href: "/teacherData" },
        { icon: "tabler:file-description", label: "ข้อมูลวิชา", href: "/SubjectData" },
      ],
      table: [
        { icon: "ph:student", label: "นักศึกษา", href: "/studentStudy" },
        { icon: "hugeicons:teacher", label: "อาจารย์", href: "/teacherStudy" },
      ],
      other: [{ icon: "mage:plus-square", label: "ชดเชย", href: "/makeupclass" }],
    };
  }, [role]);

  return (
  <>
    <button
      className="md:hidden fixed top-4 right-4 z-[70] p-2 rounded bg-[#F96D00] text-white"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
      type="button"
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
      <nav className="flex flex-col h-full w-full">
        {/* header/logo */}
        <div className="w-full flex justify-center mt-6 mb-8">
          <Image
            src="/logo1.png"
            alt="logo1"
            width={181}
            height={62}
            priority
            className="max-w-full h-auto"
          />
        </div>

        <div className="flex-1 overflow-y-auto pl-2 pr-2 pb-4">
          {menu.manage.length > 0 && (
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-600">จัดการตาราง</label>
              {menu.manage.map((m) => (
                <NavItem
                  key={m.href}
                  icon={m.icon}
                  label={m.label}
                  href={m.href}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}

          {/* ตาราง */}
          {menu.table.length > 0 && (
            <div className="flex flex-col mt-4">
              <label className="mb-2 text-sm font-medium text-gray-600">ตาราง</label>
              {menu.table.map((m) => (
                <NavItem
                  key={m.href}
                  icon={m.icon}
                  label={m.label}
                  href={m.href}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}

          {/* อื่นๆ */}
          {menu.other.length > 0 && (
            <div className="flex flex-col mt-4">
              <label className="mb-2 text-sm font-medium text-gray-600">อื่นๆ</label>
              {menu.other.map((m) => (
                <NavItem
                  key={m.href}
                  icon={m.icon}
                  label={m.label}
                  href={m.href}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto px-4 pb-6">
          <LogoutButton />
        </div>
      </nav>
    </div>
  </>
);
}