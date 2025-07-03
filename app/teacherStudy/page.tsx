"use client";

import TeacherDropdown from '../components/ui/teacherDropdown';
import TeacherOutput from '../components/TeacherOutput';
import { ClassItem } from '../components/ClassItem';
import { useState } from 'react';

export default function TeacherStudyPage() {
  console.log("TeacherStudyPage loaded");

  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);

  const [filters, setFilters] = useState<{
    teacher: string;
    semester: string;
    academicYear: string;
  } | null>(null); // 👈 เก็บ filter ที่ได้จาก Dropdown

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6  overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางอาจารย์</h1>
        <div className="mb-6">
          <TeacherDropdown
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onSearch={(filters) => {
              console.log("📌 Filters ที่ได้จาก Dropdown:", filters);
              setFilters(filters);
            }}
          />
        </div>
  <div className="min-h-[400px] mt-4">
        {/* แสดงตารางเมื่อกรอกข้อมูลครบ */}
        {filters ? (
          <TeacherOutput filters={filters} />
        ) : (
          <div className="text-center text-gray-400 py-10">
            กรุณาเลือกข้อมูลด้านบนเพื่อแสดงตาราง
          </div>
        )}
        </div>
      </div>
    </>
  );
}
