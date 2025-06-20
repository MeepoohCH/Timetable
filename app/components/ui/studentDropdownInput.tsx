"use client"

import { useState, useEffect } from "react"
import Dropdown from "./dropdown"
import { useStudentFilter } from "@/context/StudentFilterContext/page"
import { ClassItemGet } from "../ClassItem_getData"

// StudentDropdownInput.tsx
type Props = {
  timetable_id?: number | undefined; // หรือชนิดอื่น ๆ ที่เหมาะสม เช่น string | undefined
  data?: ClassItemGet | null; // ✅ เพิ่ม prop นี้
};

export default function StudentDropdown({ timetable_id,data }: Props) {
    console.log("🔽 data ที่ส่งเข้ามาใน StudentDropdown:", data);

  const [yearlevel, setYearlevel] = useState<number | string | null>(null)
  const [semester, setSemester] = useState<number | string | null>(null)
  const [year, setYear] = useState<number | string | null>(null)
  const [degree, setDegree] = useState<number | string | null>(null)

  const [hasError, setHasError] = useState(false) // state สำหรับแจ้ง error
  const { setFilters } = useStudentFilter()

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

  const currentYear = new Date().getFullYear() + 543
  const yearItems = Array.from({ length: 4 }, (_, i) => {
    const year = currentYear - i
    return { id: year, label: year.toString() }
  })

  const degreeItems = [
    { id: 1, label: "1 ปริญญา" },
    { id: 2, label: "2 ปริญญา" },
  ]

  useEffect(() => {
    if (yearlevel && semester && year && degree) {
      // ล้าง error ถ้าเลือกครบ
      setHasError(false)

      // ส่งค่า filter
      setFilters({
        yearLevel: yearlevel,
        semester,
        academicYear: year,
        degree,
      })

      const formSection = document.getElementById("form-section")
      formSection?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      // แจ้งเตือนถ้ายังเลือกไม่ครบ
      setHasError(true)
    }
  }, [yearlevel, semester, year, degree, setFilters])

  useEffect(() => {
  if (data) {
    setYearlevel(data.yearLevel);
    setSemester(data.semester);
    setYear(data.academicYear);
    setDegree(data.degree);
    setHasError(false); // ล้าง error ถ้าเคยแจ้งเตือนก่อนหน้า
  }
}, [data]);

  return (
    <div className="flex flex-col gap-2">
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
      </div>

      {hasError && (
        <p className="text-red-500 text-sm mt-2">* กรุณาเลือกข้อมูลด้านบนให้ครบทุกช่อง</p>
      )}
    </div>
  )
}
