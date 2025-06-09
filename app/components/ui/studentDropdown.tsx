"use client"

import { useState } from "react"
import Dropdown from "./dropdown"

export default function StudentDropdown() {
  const [yearlevel, setYearlevel] = useState<string | null>(null)
  const [semester, setSemester] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [degree, setDegree] =useState<string | null>(null)

  const yearlevelItems = [
    { id: "year1", label: "1" },
    { id: "year2", label: "2" },
    { id: "year3", label: "3" },
    { id: "year4", label: "4" },
  ]

  const semesterItems = [
    { id: "semester1", label: "1" },
    { id: "semester2", label: "2" },
    { id: "semester3", label: "3" },
  ]

  const yearItems = [
    { id: "2568", label: "2568" },
    { id: "2567", label: "2567" },
    { id: "2566", label: "2566" },
    { id: "2565", label: "2565" },
  ]

  const degreeItems = [
    { id: "iot", label: "1 ปริญญา"},
    { id: "physiot", label: "2 ปริญญา" },
  ]

  async function handleSearch() {
    if (!yearlevel || !semester || !year) {
      alert("กรุณาเลือกให้ครบ")
      return
    }
    try {
      const res = await fetch("/api/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // แก้ typo ตรงนี้
        body: JSON.stringify({ yearlevel, semester, year }),
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
