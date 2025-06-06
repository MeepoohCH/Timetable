"use client"

import { div } from "framer-motion/client";
import { useState, useRef,useEffect } from "react"
import Dropdown from "./dropdown";

export default function StudentDropdown() {
  const [yearlevel, setyearlevel] = useState<string | null>(null)
  const [semester, setsemester] = useState<string | null>(null)
  const [year, setyear] = useState<string | null>(null)
  const [examtype, setexamtype] = useState<string | null>(null)

  const yearlevelItems =[
    {id: "year1", label:"1"},
    {id: "year2", label:"2"},
    {id: "year3", label:"3"},
    {id: "year4", label:"4"},
  ]

    const semesterlItems =[
    {id: "semester1", label:"1"},
    {id: "semester2", label:"2"},
    {id: "semester3", label:"3"},
  ]

    const yearlItems =[
    {id: "2568", label:"2568"},
    {id: "2567", label:"2567"},
    {id: "2566", label:"2566"},
    {id: "2565", label:"2565"},
  ]

  const examtypeItems = [
    {id: "midterm", label:"กลางภาค"},
    {id: "Final", label:"ปลายภาค"},
  ]

  async function handleSearch() {
    if (!yearlevel || !semester || !year || !examtype) {
      alert("กรุณาเลือกให้ครบ")
      return
    } try {
      const res = await fetch("/api/api",{
        method: "POST",
        headers: {"Content-Type":"apllication/json"},
        body: JSON.stringify({yearlevel, semester, year}),
      })

      if (!res.ok) throw new Error("API error")

      const data = await res.json()
      alert(`ผลลัพธ์: ${JSON.stringify(data)}`)
    }catch (err) {
      alert("เกิดข้อผิดพลาดในการเรียก API")
      console.error(err)
    }
  }

  return (
    <div className="flex flex-wrap gap-6">
      <Dropdown label="ชั้นปี" items={yearlevelItems} selected={yearlevel} setSelected={setyearlevel}/>
      <Dropdown label="ภาคการศึกษา" items={semesterlItems} selected={semester} setSelected={setsemester}/>
      <Dropdown label="ปีการศึกษา" items={yearlItems} selected={year} setSelected={setyear}/>
      <Dropdown label="การสอบ..." items={examtypeItems} selected={examtype} setSelected={setexamtype}/>
          <button
            className="mt-auto bg-[#F96D00] h-7 text-sm text-white px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
            onClick={handleSearch}
          >
            ค้นหา
          </button>
    </div>
  )

}