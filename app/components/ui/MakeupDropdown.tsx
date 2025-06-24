"use client";

import Dropdown from "./dropdown";
import DropdownTeacher from "./dropdownTeacher";
import { useTeacherFilter } from "@/context/TeacherFilterContext/page";
import React from "react";
import { ClassItem } from "../ClassItem";

type Props = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem | null) => void;
};

export default function MakeupDropdown({ selectedEvent, setSelectedEvent }: Props) {
  const {
    teacher,
    setTeacher,
    semester,
    setSemester,
    year,
    setYear,
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

  React.useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch("/api/Teacher/dropdown");
        if (!res.ok) throw new Error("โหลดอาจารย์ล้มเหลว");
        const data = await res.json();
        const teachers = Array.isArray(data.teachers) ? data.teachers : [];
        const formatted = teachers.map((t: any) => ({
          id: t.teacher_id,
          label: `${t.teacherName} ${t.teacherSurname}`,
        }));
        setTeacherList(formatted);
      } catch (err) {
        console.error(err);
        setTeacherList([]);
      }
    }
    fetchTeachers();
  }, []);

  async function handleSearch() {
  console.log("🔍 Searching with filters:");
  console.log("Teacher:", teacher);
  console.log("Semester:", semester);
  console.log("Year:", year);
    if (!teacher || !semester || !year) {
      alert("กรุณาเลือกให้ครบ");
      return;
    }
  }

  


  return (
    <div className="flex flex-wrap gap-6">
      <DropdownTeacher
        label="อาจารย์"
        items={teacherList}
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
        selected={year ?? ""}
        setSelected={setYear}
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
