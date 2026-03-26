"use client";

import { useState } from "react";
import StudentCalendar from "./StudentCalendar";
import DetailPanel from "../components/DetailPanel";
import StudentScheduleTable from "./ui/StudentScheduleTable";
import { ClassItemGet } from "./ClassItem_getData";
import { useRouter } from 'next/navigation';


type Props = {
  filters: {
    yearLevel: string;
    semester: string;
    academicYear: string;
    degree: string;
  };
};



export default function StudentOutput({ filters }: Props) {
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItemGet | null>(null);   // <-- เปลี่ยน type เป็น ClassItem | null
  const [midtermCurrentMonth, setMidtermCurrentMonth] = useState(new Date());
  const [finalCurrentMonth, setFinalCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ClassItemGet[]>([]);
  const router = useRouter();
  
  const handleClick = (event: ClassItemGet) => {
  setSelectedEvent(event);                 // 1. เก็บ event ไว้
  setCurrentComponent("edit");            // 2. เปลี่ยนโหมด
  const formSection = document.getElementById("form-section");
  formSection?.scrollIntoView({ behavior: "smooth", block: "start" });

  // 🔽 3. ใช้ timetable_id ไปทำอย่างอื่น (เช่น router.push หรือ fetch รายละเอียด)
  // ตัวอย่างใช้ router.push
  router.push(`/addTable/${event.timetable_id}`);
};


  return (
    <div className="">
      {/* ตารางเรียน */}
      <div id="schedule-section" className="w-full max-w-6xl scroll-mt-20 mt-8 px-4">
        <h2 className="text-2xl font-semibold text-orange-600 mb-6">📅 ตารางเรียน</h2>

      </div>
      <div
        className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2"
      >
        <StudentScheduleTable
          filters={filters}
          selectedEvent={selectedEvent}
           setSelectedEvent={handleClick}
        />
      </div>

      {/* ตารางสอบกลางภาค */}
      <div id="midterm-section" className="w-full scroll-mt-20 max-w-6xl mt-8 px-4">
        <h2 className="text-2xl font-semibold text-orange-600 mb-6">📝 ตารางสอบกลางภาค</h2>
      </div>
      <div
        className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2"
      >
        <StudentCalendar
          filters={filters}
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            setSelectedEvent(event);
            setCurrentComponent("edit");
          }}
          currentMonth={midtermCurrentMonth}
          setCurrentMonth={setMidtermCurrentMonth}
          events={events}
          examType="midterm"
        />
        <DetailPanel examType="midterm" filters={filters} selectedEvent={selectedEvent} />
      </div>

      {/* ตารางสอบปลายภาค */}
      <div id="final-section" className="w-full scroll-mt-20 max-w-6xl mt-8 px-4">
        <h2 className="text-2xl font-semibold text-orange-600 mb-6">📝 ตารางสอบปลายภาค</h2>
      </div>
      <div
        className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2"
      >
        <StudentCalendar
          filters={filters}
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            setSelectedEvent(event);
            setCurrentComponent("edit");
          }}
          currentMonth={finalCurrentMonth}
          setCurrentMonth={setFinalCurrentMonth}
          events={events}
          examType="final"
        />
        <DetailPanel examType="final"  filters={filters} selectedEvent={selectedEvent} />
      </div>
    </div>
  )
}