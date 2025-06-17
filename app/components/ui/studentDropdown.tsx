"use client"

import { useState, useEffect } from "react"
import Dropdown from "./dropdown"

type DropdownProps = {
  onSearch: (filters: {
    yearLevel: string;
    semester: string;
    academicYear: string;
    degree: string;
  }) => void;
};


export default function StudentDropdown({ onSearch }: DropdownProps) {
  const [yearlevel, setYearlevel] = useState<number | string | null>(null)
  const [semester, setSemester] = useState<number | string | null>(null)
  const [year, setYear] = useState<number | string | null>(null)
  const [degree, setDegree] = useState<number | string | null>(null)



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

  const currentYear = new Date().getFullYear() + 543 // แปลง ค.ศ. เป็น พ.ศ.
  const yearItems = Array.from({ length: 4 }, (_, i) => {
    const year = currentYear - i
    return { id: year, label: year.toString() }
  })

  const degreeItems = [
    { id: 1, label: "1 ปริญญา" },
    { id: 2, label: "2 ปริญญา" },
  ]


// 👇 log ทุกครั้งที่ค่าถูกเปลี่ยน
useEffect(() => {
  console.log("ค่าปัจจุบัน:", [
    { label: "ชั้นปี (yearLevel)", value: yearlevel },
    { label: "ภาคการศึกษา (semester)", value: semester },
    { label: "ปีการศึกษา (academicYear)", value: year },
    { label: "หลักสูตร (degree)", value: degree },
  ])
}, [yearlevel, semester, year, degree])

    async function handleSearch() {
    if (!yearlevel || !semester || !year ||!degree) {
      alert("กรุณาเลือกให้ครบ")
      return
    }

  onSearch({
    yearLevel: String(yearlevel),
    semester: String(semester),
    academicYear: String(year),
    degree: String(degree),
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
        label="หลักสูตร"
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
