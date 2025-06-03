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
} from "date-fns";
import { th } from "date-fns/locale"; // ✅ สำหรับแสดงชื่อเดือนเป็นภาษาไทย

export default function Calendar({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  events,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  events: any[];
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
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate);
        const dayEvents = events.filter((e) => isSameDay(new Date(e.date), day));

        days.push(
          <div
            key={day.toString()}
            className={`flex flex-col items-start p-2 h-20 m-1.5 rounded-lg cursor-pointer text-sm bg-white 
              ${!isSameMonth(day, currentMonth) ? "text-gray-400" : ""} 
              ${isSelected ? "bg-blue-200" : ""}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="text-sm self-end">{formattedDate}</span>
            {dayEvents.map((event, idx) => (
              <div
                key={idx}
                className="w-full mt-1 bg-orange-200 rounded px-1 text-xs truncate"
              >
                {event.title || "test"}
              </div>
            ))}
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
        <h2 className="text-xl">
          {format(currentMonth, "MMMM", { locale: th })}
        </h2>
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
