"use client"

import { div } from "framer-motion/client";
import { useState, useRef,useEffect } from "react"
import Dropdown from "./dropdown";
import TeacherInput from "./teacherInput";


export default function TeacherDropdown() {
  const [teacher, setTeacher] = useState("")
  const [semester, setsemester] = useState<number|string | null>(null)
  const [year, setyear] = useState< number|string | null>(null)
  

//   จำลองรายชื่อที่มีอยู่ในระบบ
  const teacherList=[
    "อาจารย์สมชาย",
    "อาจารย์สมหญิง",
    "ดร.วิภา",
    "ดร.ปรัชญา",
    "ผศ.ดร.จิตรา",
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
    if (!teacher || !semester || !year) {
      alert("กรุณาเลือกให้ครบ")
      return
    } try {
      const res = await fetch("/api/api",{
        method: "POST",
        headers: {"Content-Type":"apllication/json"},
        body: JSON.stringify({teacher, semester, year}),
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
        <TeacherInput
            label="อาจารย์"
            teachers={teacherList}
            selected={teacher}
            setSelected={setTeacher}
        />
        <Dropdown label="ภาคการศึกษา" items={semesterlItems} selected={semester} setSelected={setsemester}/>
        <Dropdown label="ปีการศึกษา" items={yearlItems} selected={year} setSelected={setyear}/>

        <button
          className="mt-auto bg-[#F96D00] h-7 w-28 text-xs px-3 text-white sm:h-7 sm:text-sm sm:px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
          onClick={handleSearch}
        >
          ค้นหา
        </button>
    </div>
  )

}