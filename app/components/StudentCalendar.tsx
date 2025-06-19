"use client";

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  subDays,

} from "date-fns";
import { th } from "date-fns/locale";



const now = new Date();
import { ClassItem } from "./ClassItem_getData";
import { useEffect, useState } from "react"

type StudentCalendarProps = {
  selectedEvent: any | null;
  setSelectedEvent: (event: any | null) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  events?: any[];
  examType?: "final" | "midterm";
  filters: {
    yearLevel: string;
    semester: string;
    academicYear: string;
    degree: string;
  } | null;
};


const COLORS = [
  "#F87171", // red
  "#FBBF24", // yellow
  "#34D399", // green
  "#60A5FA", // blue
  "#A78BFA", // purple
  "#F472B6", // pink
  "#FCD34D", // amber
  "#4ADE80", // emerald
  "#38BDF8", // sky
  "#C084FC", // violet
];

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

export default function StudentCalendar({
  selectedEvent,
  setSelectedEvent,
  currentMonth,
  setCurrentMonth,
  examType,
  filters,


}: StudentCalendarProps) {

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));
  const displayYear = currentMonth.getFullYear() + 543;
  const displayMonthYear = `${format(currentMonth, "MMMM", { locale: th })} ${displayYear}`;

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    console.log("filters ใน StudentSchedule:", filters);

    if (!filters) return;

    const { yearLevel, semester, academicYear, degree } = filters;

    setLoading(true);
    setError(null);

    fetch(`/api/Timetable/studentSearch?yearLevel=${yearLevel}&semester=${semester}&academicYear=${academicYear}&degree=${degree}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        console.log("📦 ข้อมูลที่ได้จาก API หน้า Calendar:", data); // 👈 log ตรงนี้
        setClasses(data);
        // หาเดือนแรกของประเภทสอบที่ต้องการ
      let examDates: Date[] = [];
      if (examType === "midterm") {
        examDates = data
          .filter((item: any) => item.midterm_date)
          .map((item: any) => new Date(item.midterm_date));
      } else if (examType === "final") {
        examDates = data
          .filter((item: any) => item.final_date)
          .map((item: any) => new Date(item.final_date));
      } else {
        // ถ้าไม่มี examType กำหนด default หาเดือนแรกของทุก examType
        examDates = data.flatMap((item: any) => {
          const dates: Date[] = [];
          if (item.midterm_date) dates.push(new Date(item.midterm_date));
          if (item.final_date) dates.push(new Date(item.final_date));
          return dates;
        });
      }

      if (examDates.length > 0) {
        const firstExamDate = examDates.reduce(
          (earliest: Date, current: Date) => (current < earliest ? current : earliest)
        );
        setCurrentMonth(startOfMonth(firstExamDate));
      }
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
}, [filters, examType]);


  const renderCells = () => {
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");

        const dayEvents = Array.isArray(classes)
  ? classes.filter((e) => {
      if (examType === "final") {
        if (!e.final_date) return false;
        return isSameDay(new Date(e.final_date), day); // ไม่ลบ 1 วัน
      } else if (examType === "midterm") {
        if (!e.midterm_date) return false;
        return isSameDay(new Date(e.midterm_date), day); // ไม่ลบ 1 วัน
      }
      return false;
    })
  : [];


        const maxVisible = 2;
        const visibleEvents = dayEvents.slice(0, maxVisible);
        const extraCount = dayEvents.length - maxVisible;

        days.push(
          <div
            key={day.toString()}
            className={`flex flex-col items-start p-2 h-24 m-1.5 rounded-lg cursor-pointer text-sm bg-white 
              ${!isSameMonth(day, currentMonth) ? "text-gray-400" : ""}`}
          >
            <span className="text-sm self-end">{formattedDate}</span>

            {visibleEvents.map((event, idx) => {
              const isSelected = selectedEvent === event;
              const bgColor = getColorFromString(event.title || `${event.id || idx}`);
              return (
                <div
                  key={idx}
                  className={`w-full mt-1 rounded px-1 text-xs truncate cursor-pointer text-white
                    ${isSelected ? "ring-2 ring-orange-500" : ""}`}
                  style={{
                    backgroundColor: bgColor,
                    filter: isSelected ? "none" : "none",
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.subjectName || "ไม่มีชื่อกิจกรรม"}
                </div>
              );
            })}

            {extraCount > 0 && (
              <div
                className="w-full mt-1 text-blue-500 text-xs cursor-pointer"
                onClick={() => setSelectedEvent({ allEvents: dayEvents, date: day })}
              >
                +{extraCount} เพิ่มเติม
              </div>
            )}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
    }

    return rows;
  };


  return (
    <div className="flex-1 w-[70%] p-4 rounded-lg shadow bg-[#F3F4F6] border-4 border-white">
      <div className="flex items-center justify-center gap-5 mb-2 text-[#616161] font-kanit">
        <button onClick={handlePrev}>&lt;</button>
        <h2 className="text-xl">{displayMonthYear}</h2>
        <button onClick={handleNext}>&gt;</button>
      </div>

      <div className="grid grid-cols-7 text-center font-kanit mb-2 text-[#616161]">
        {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {renderCells()}
    </div>
  );
}