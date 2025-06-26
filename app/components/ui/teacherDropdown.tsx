"use client"

import { useState, useRef, useEffect } from "react"
import Dropdown from "./dropdown";
import DropdownTeacher from "./dropdownTeacher";
import { useTeacherFilter } from "@/context/TeacherFilterContext/page";
import React from "react";
import { ClassItem } from "../ClassItem";

type TeacherDropdownProps = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem) => void;
  onSearch: (filters: {
    teacher: string;
    semester: string;
    academicYear: string;
  }) => void;
};



export default function TeacherDropdown({ selectedEvent, setSelectedEvent, onSearch, }: TeacherDropdownProps) {

  const {
    teacher,
    setTeacher,
    semester,
    setSemester,
    academicYear,
    setacademicYear,
  } = useTeacherFilter();

  const [teacherList, setTeacherList] = React.useState<{ id: string | number; label: string }[]>([]);

  const semesterItems = [
    { id: "1", label: "1" },
    { id: "2", label: "2" },
    { id: "3", label: "3" },
  ];

  const currentYear = new Date().getFullYear() + 543;
  const yearItems = Array.from({ length: 4 }, (_, i) => {
    const y = currentYear - i;
    return { id: y, label: y.toString() };
  });



  async function handleSearch() {

    if (!teacher || !semester || !academicYear) {
      alert("กรุณาเลือกให้ครบ");
      return;
    }
    console.log("กดปุ่มค้นหา, ส่งค่าไป parent:", { teacher, semester, academicYear });
    onSearch({
      teacher: String(teacher),
      semester: String(semester),
      academicYear: String(academicYear),
    });

  }




  return (
    <div className="flex flex-wrap gap-6 items-end ">
      <DropdownTeacher
        label="อาจารย์"
        selected={teacher ?? ""}
        setSelected={setTeacher}
      />
      <Dropdown
        label="ภาคการศึกษา"
        items={semesterItems}
        selected={semester ?? ""}
        setSelected={setSemester}
      />
      <Dropdown
        label="ปีการศึกษา"
        items={yearItems}
        selected={academicYear ?? ""}
        setSelected={setacademicYear}
      />
      <button
        className="mt-auto bg-[#F96D00] h-7 w-28 text-xs px-3 text-white sm:h-7 sm:text-sm sm:px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
        onClick={handleSearch}
      >
        ค้นหา
      </button>
    </div>
  );
}
