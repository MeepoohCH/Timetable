"use client";

import TeacherDropdown from '../components/ui/teacherDropdown';
import { ClassItem } from '../components/ClassItem';
import CourseCard from '../components/ui/courseCard';
import ExportButton from '../components/ExportButton';
import { useState,useEffect } from 'react';
import { useTeacherFilter } from "@/context/TeacherFilterContext/page";

type Course = {
  subject: string;
  subjectid: string;
  subjecttype: string;
  year: string;
  sec: string;
  credits: string;
  teacher: string;
  starttime: string;
  endtime: string;
  weekday: string;
};

const courses: Course[] = [
  {
    subject: "CALCULUS 1",
    subjectid: "01006030",
    subjecttype: "ท",
    year: "1",
    sec: "41",
    credits: "3(3-0-6)",
    teacher: "ดร.นัชนัยน์ รุ่งเหมือนฟ้า",
    starttime: "8.45 น.",
    endtime: "10.15 น.",
    weekday: "พุธ",
  },
    {
    subject: "CALCULUS 1",
    subjectid: "01006030",
    subjecttype: "ท",
    year: "1",
    sec: "41",
    credits: "3(3-0-6)",
    teacher: "ดร.นัชนัยน์ รุ่งเหมือนฟ้า",
    starttime: "8.45 น.",
    endtime: "10.15 น.",
    weekday: "เสาร์",
  },
]

type Props = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem | null) => void;
};

const [filters, setFilters] = useState<{
    teacher: string;
    semester: string;
    academicYear: string;
  } | null>(null); // 👈 เก็บ filter ที่ได้จาก Dropdown

export default function MakeupClassPage() {
  
    const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);
      const {
    teacher,
    semester,
    academicYear,
    setTeacher,
    setSemester,
    setacademicYear,
  } = useTeacherFilter();

    useEffect(() => {
    console.log("👨‍🏫 teacher:", teacher);
    console.log("📅 semester:", semester);
    console.log("📆 year:", academicYear);
  }, [teacher, semester, academicYear]);

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางชดเชย</h1>
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
        <div className="">
          <div className='mb-4'>
            <ExportButton data={courses} fileName='ตารางชดเชย'/>
          </div>
          {courses.map((c, i) => (
            <CourseCard key={i} course={c} />
          ))}
        </div>
      </div>
    </>
  );
}
