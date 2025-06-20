"use client"

import { useState, useRef, useEffect } from "react"
import Dropdown from "./dropdown";
import TeacherInput from "./teacherInput";

import { ClassItem } from "../ClassItem";

type TeacherDropdownProps = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem) => void;
};


export default function TeacherDropdown({ selectedEvent, setSelectedEvent }: TeacherDropdownProps) {

  const [semester, setsemester] = useState<number | string | null>(null)
  const [year, setyear] = useState<number | string | null>(null)
  const [teacher, setTeacher] = useState<string | number>("");
const [teacherList, setTeacherList] = useState<{ id: string | number; label: string }[]>([]);



  const semesterlItems = [
    { id: "semester1", label: "1" },
    { id: "semester2", label: "2" },
    { id: "semester3", label: "3" },
  ]

  const currentYear = new Date().getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.

  const yearItems = Array.from({ length: 4 }, (_, i) => {
    const year = currentYear - i;
    return { id: year, label: year.toString() };
  });

  const [classes, setClasses] = useState<ClassItem[]>([]);





  async function handleSearch() {
    if (!teacher || !semester || !year) {
      alert("กรุณาเลือกให้ครบ")
      return
    } try {
      const res = await fetch("/api/api", {
        method: "POST",
        headers: { "Content-Type": "apllication/json" },
        body: JSON.stringify({ teacher, semester, year }),
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      alert(`ผลลัพธ์: ${JSON.stringify(data)}`)
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเรียก API")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-wrap gap-6">
      <Dropdown
        label="อาจารย์"
        items={teacherList} // แสดงชื่อที่แปลงแล้ว
        selected={teacher}
        setSelected={setTeacher}
      />
      <Dropdown label="ภาคการศึกษา" items={semesterlItems} selected={semester} setSelected={setsemester} />
      <Dropdown label="ปีการศึกษา" items={yearItems} selected={year} setSelected={setyear} />

      <button
        className="mt-auto bg-[#F96D00] h-7 w-28 text-xs px-3 text-white sm:h-7 sm:text-sm sm:px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
        onClick={handleSearch}
      >
        ค้นหา
      </button>
    </div>
  )

}