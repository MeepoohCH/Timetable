"use client";

import { useEffect, useState } from "react";
import TeacherCalendar from "./TeacherMidtermCalendar";
import DetailPanel from "../components/DetailTeacher";
import TeacherScheduleTable from "./ui/TeacherSchedule";
import { ClassItemGet } from "./ClassItem_getData";
import { useRouter } from 'next/navigation';

type Filters = {
  teacher: string;
  semester: string;
  academicYear: string;
};

export default function TeacherOutput({ filters }: { filters: Filters }) {
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItemGet | null>(null);
  const [events, setEvents] = useState<ClassItemGet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [midtermCurrentMonth, setMidtermCurrentMonth] = useState(new Date());
  const [finalCurrentMonth, setFinalCurrentMonth] = useState(new Date());

  // ดึงค่าจาก context (ถ้าอยากใช้ก็ใช้ แต่ตอนนี้ props.filters เป็นตัวหลัก)
  // const { teacher, semester, year } = useTeacherFilter();

  useEffect(() => {
    if (!filters) return;

    const { teacher, semester, academicYear } = filters;

    setLoading(true);
    setError(null);

    fetch(`/api/Timetable/teacherGet?teacher=${teacher}&semester=${semester}&academicYear=${academicYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) return <div className="text-center  text-gray-400  p-4">กำลังโหลดข้อมูล...</div>;

  if (error)
    return (
      <div className="text-center p-4 text-red-600">
        เกิดข้อผิดพลาด: {error}
      </div>
    );

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
    <>
      {events.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          ไม่พบข้อมูลตารางเรียน/ตารางสอบของอาจารย์
        </div>
      ) : (
        <div>
          {/* ตารางเรียน */}
          <div id="schedule-section" className="w-full max-w-6xl scroll-mt-20 mt-8 px-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">📅 ตารางเรียน</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2">
            <TeacherScheduleTable
              filters={filters}
              selectedEvent={selectedEvent}
              setSelectedEvent={handleClick}
            />
          </div>

          {/* ตารางสอบกลางภาค */}
          <div id="midterm-section" className="w-full scroll-mt-20 max-w-6xl mt-8 px-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">📝 ตารางสอบกลางภาค</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2">
            <TeacherCalendar
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
            <DetailPanel filters={filters} examType="midterm" selectedEvent={selectedEvent} />
          </div>

          {/* ตารางสอบปลายภาค */}
          <div id="final-section" className="w-full scroll-mt-20 max-w-6xl mt-8 px-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">📝 ตารางสอบปลายภาค</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2">
            <TeacherCalendar
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
            <DetailPanel filters={filters} examType="final" selectedEvent={selectedEvent} />
          </div>
        </div>
      )}
    </>
  );
}
