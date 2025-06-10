"use client"

import { useState,  useEffect } from "react"
import Dropdown from "./dropdown"
import { useStudentFilter } from "@/context/StudentFilterContext/page"

export default function StudentDropdown() {
  const [yearlevel, setYearlevel] = useState<number | null>(null)
  const [semester, setSemester] = useState<number | null>(null)
  const [year, setYear] = useState<number | null>(null)
  const [degree, setDegree] =useState<number | null>(null)

  const yearlevelItems = [
    { id: 1, label: "1" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
    { id: 4, label: "4" },
  ]

  const semesterItems = [
    { id: 1, label: "1" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
  ]

  const yearItems = [
    { id: 2568, label: "2568" },
    { id: 2567, label: "2567" },
    { id: 2566, label: "2566" },
    { id: 2565, label: "2565" },
  ]

  const degreeItems = [
    { id: 1, label: "1 ปริญญา"},
    { id: 2, label: "2 ปริญญา"},
  ]

  const { setFilters } = useStudentFilter();

  async function handleSearch() {
    if (!yearlevel || !semester || !year) {
      alert("กรุณาเลือกให้ครบ")
      return
    }

     setFilters({
    yearLevel: yearlevel,
    semester,
    academicYear: year,
    degree,
  });


console.log("Updated filters:", {
  yearLevel: yearlevel,
  semester,
  academicYear: year,
  degree,
});

  // เลื่อนไปยังฟอร์ม (แค่แสดงผล)
  const formSection = document.getElementById("form-section");
  formSection?.scrollIntoView({ behavior: "smooth", block: "start" });

  }

  return (
    <div className="flex flex-wrap gap-6 items-end">
      <Dropdown
        label="ชั้นปี"
        items={yearlevelItems}
        selected={yearlevel}
        setSelected={setYearlevel}
      />
      <Dropdown
        label="ภาคการศึกษา"
        items={semesterItems}
        selected={semester}
        setSelected={setSemester}
      />
      <Dropdown
        label="ปีการศึกษา"
        items={yearItems}
        selected={year}
        setSelected={setYear}
      />

      <Dropdown
        label="เซค"
        items={degreeItems}
        selected={degree}
        setSelected={setDegree}
      />

      <button
        className="mt-auto bg-[#F96D00] h-7 text-sm text-white px-4 rounded-[15px] transition hover:bg-white hover:text-[#F96D00]"
        onClick={handleSearch}
      >
        ค้นหา
      </button>
    </div>
  )
}
