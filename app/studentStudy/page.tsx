'use client';


import StudentDropdown from '../components/ui/studentDropdown';
import StudyForm from '../components/StudyForm';
import StudentOutput from '../components/StudentOutput';
import { useState } from "react";

export default function SchedulePage() {
   const [filters, setFilters] = useState<{
    yearLevel: string;
    semester: string;
    academicYear: string;
    degree: string;
  } | null>(null); // 👈 เพิ่มตรงนี้


  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางนักศึกษา</h1>
        <div className="mb-6">
          <StudentDropdown
            onSearch={(filters) => {
              console.log("Filters ที่ได้จาก Dropdown:", filters);
              setFilters(filters);
              // เก็บไว้ใน state หรือ fetch api ต่อได้
            }}
          />
          <div className="min-h-[400px] mt-4">
    {filters ? (
      <StudentOutput filters={filters} />
    ) : (
      <div className="text-center text-gray-400 py-10">
        กรุณาเลือกข้อมูลด้านบนเพื่อแสดงตาราง
      </div>
    )}
  </div>
          
        </div>
      </div>
    </>
  );
}
