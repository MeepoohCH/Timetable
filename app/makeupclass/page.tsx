"use client";

import MakeupDropdown from '../components/ui/MakeupDropdown';
import { ClassItem } from '../components/ClassItem';
import CourseCard from '../components/ui/courseCard';
import ExportButton from '../components/ExportButton';
import { useState, useEffect } from 'react';
import { useMakeupFilter } from '@/context/MakeupFilterContext/page';
import { ClassItemGet } from '../components/ClassItem_getData';

type Course = {
  subject: string;
  subjectid: string;
  subjecttype: string;
  year: string;
  sec: string;
  credit: number;
  teacher: string;
  starttime: string;
  endtime: string;
  weekday: string;
};


type Props = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem | null) => void;
};


export default function MakeupClassPage() {

  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);
  const {
    teacher,
    semester,
    academicYear,
    weekday, 
    date,
    setTeacher,
    setSemester,
    setacademicYear,
    setWeekday,  
    setDate,
  } = useMakeupFilter();
  
 const [filters, setFilters] = useState<{
  teacher: string;
  semester: string;
  academicYear: string;
  day?: string;
  date?: string;
} | null>(null);


  const [events, setEvents] = useState<ClassItemGet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filters) return;

    const { teacher, semester, academicYear, day,date } = filters;

    setLoading(true);
    setError(null);

    fetch(`/api/Timetable/teacherSearch?teacher=${teacher}&semester=${semester}&academicYear=${academicYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        console.log('MakeupPage: ', data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);




  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-visible bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางชดเชย</h1>
        <div className="mb-6  relative z-50">
          <MakeupDropdown
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onSearch={(filters) => {
              console.log("📌 Filters ที่ได้จาก Dropdown:", filters);
              setFilters(filters);
            }}
          />
        </div>
        {/* ✅ ถ้า loading หรือ error ให้แสดงข้อความแทนเนื้อหา */}
        {loading ? (
          <div className="text-center text-gray-400 p-4">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-600">
            เกิดข้อผิดพลาด: {error}
          </div>
        ) : (
          <div className="">
            <div className="mb-4">
              <ExportButton
                data={events.map((e) => ({
                  subject: e.subjectName,
                  subjectid: e.subject_id,
                  subjecttype: e.subjectType,
                  year: e.yearLevel?.toString() ?? "-",
                  sec: e.sec.toString(),
                  credits: e.credit || "-",
                  teacher: Array.isArray(e.parsedTeachers) && e.parsedTeachers.length > 0
                    ? e.parsedTeachers
                      .map((t) => {
                        const name = `${t.teacherName ?? ""} ${t.teacherSurname ?? ""}`.trim();
                        return name || "-";
                      })
                      .join(", ")
                    : "-",
                  starttime: e.startTime,
                  endtime: e.endTime,
                  weekday: e.weekday,
                }))}
                fileName="ตารางชดเชย"
              />
            </div>

            {events.map((e, i) => (
              <CourseCard
                key={i}
                course={{
                  subject: e.subjectName,
                  subjectid: e.subject_id,
                  subjecttype: e.subjectType,
                  year: e.yearLevel?.toString() ?? "-",
                  sec: e.sec.toString(),
                  credit: e.credit || 0,
                  teacher: e.parsedTeachers
                    ? e.parsedTeachers.map(t => `${t.teacherName} ${t.teacherSurname}`).join(", ")
                    : "-",
                  starttime: e.startTime,
                  endtime: e.endTime,
                  weekday: e.weekday,
                }}
              />
            ))}

          </div>
        )}
      </div>
    </>
  );
}
