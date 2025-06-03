import { format, isSameDay } from "date-fns";
import { th } from "date-fns/locale";

export default function DetailPanel({
  selectedDate,
  events,
}: {
  selectedDate: Date;
  events: any[];
}) {
  const event = events.find((e) => isSameDay(new Date(e.date), selectedDate));

  return (
    <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-2 border-white bg-[#F3F4F6]">
      <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
        รายละเอียด
      </h2>
      {event ? (
        <ul className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-kanit text-[#616161] m-4 leading-relaxed">
          <li className="contents">
            <span>รหัสวิชา</span>
            <span>{event.subjectCode}</span>
          </li>
          <li className="contents">
            <span>ชื่อวิชา</span>
            <span>{event.subjectName}</span>
          </li>
          <li className="contents">
            <span>กลุ่ม</span>
            <span>{event.group}</span>
          </li>
          <li className="contents">
  <span>อาจารย์</span>
  <span className="flex flex-col">
    {Array.isArray(event.teacher)
      ? event.teacher.map((t: string, i: number) => (
          <span key={i}>• {t}</span>
        ))
      : event.teacher}
  </span>
</li>

          <li className="contents">
            <span>วัน/เดือน/ปี</span>
            <span>{format(selectedDate, "dd/MM/yyyy", { locale: th })}</span>
          </li>
          <li className="contents">
            <span>เวลาเริ่ม</span>
            <span>{event.timeStart}</span>
          </li>
          <li className="contents">
            <span>เวลาจบ</span>
            <span>{event.timeEnd}</span>
          </li>
          <li className="contents">
            <span>สถานที่</span>
            <span>{event.location}</span>
          </li>
        </ul>
      ) : (
        <p className="text-gray-500 text-sm text-center">ไม่มีข้อมูลในวันนี้</p>
      )}
    </div>
  );
}
