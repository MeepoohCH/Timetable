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

export default function TeacherMidtermCalendar({
  selectedEvent,
  setSelectedEvent,
  currentMonth,
  setCurrentMonth,
  events,
  examType,
}: {
  selectedEvent: any | null;
  setSelectedEvent: (event: any | null) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  events: any[] | undefined;
  examType?: "final" | "midterm"
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderCells = () => {
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");

        const dayEvents = Array.isArray(events)
          ? events.filter((e) => {
              if (examType === "final") {
                if (!e.exam.final.date) return false;
                return isSameDay(new Date(e.exam.final.date), subDays(day, 1));
              } else if (examType === "midterm") {
                if (!e.exam.midterm.date) return false;
                return isSameDay(new Date(e.exam.midterm.date), subDays(day, 1));
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
                  {event.subjectName || event.title || "ไม่มีชื่อกิจกรรม"}
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
        <h2 className="text-xl">{format(currentMonth, "MMMM", { locale: th })}</h2>
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