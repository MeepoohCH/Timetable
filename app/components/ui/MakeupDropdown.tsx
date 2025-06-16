"use client"

import { div } from "framer-motion/client";
import { useState, useRef,useEffect } from "react"
import Dropdown from "./dropdown";


export default function MakeupDropdown() {
  const [day, setday] = useState<string | null>(null)
  const [semester, setsemester] = useState<string | null>(null)
  const [year, setyear] = useState<string | null>(null)

  const dayItems =[
    {id: "Mon", label:"จันทร์"},
    {id: "Tue", label:"อังคาร"},
    {id: "Wed", label:"พุธ"},
    {id: "Thr", label:"พฤหัส"},
    {id: "Fri", label:"ศุกร์"},
    {id: "Sat", label:"เสาร์"},
    {id: "Sun", label:"อาทิตย์"},
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

  async function handleSearch() {
    if (!day || !semester || !year) {
      alert("กรุณาเลือกให้ครบ")
      return
    } try {
      const res = await fetch("/api/api",{
        method: "POST",
        headers: {"Content-Type":"aplication/json"},
        body: JSON.stringify({day, semester, year}),
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
      <Dropdown label="วัน" items={dayItems} selected={day} setSelected={setday}/>
      <Dropdown label="ภาคการศึกษา" items={semesterlItems} selected={semester} setSelected={setsemester}/>
      <Dropdown label="ปีการศึกษา" items={yearlItems} selected={year} setSelected={setyear}/>

          <button
            className="mt-auto bg-[#F96D00] h-7 text-sm text-white px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
            onClick={handleSearch}
          >
            ค้นหา
          </button>
    </div>
  )

}