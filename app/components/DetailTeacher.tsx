"use client";

import { ClassItemGet } from "./ClassItem_getData";

type DetailPanelProps = {
  selectedEvent: any | null;
  examType?: "midterm" | "final";
  data: ClassItemGet[]; // เพิ่ม prop data เพื่อรับข้อมูลจากภายนอก
};

export default function DetailPanel({
  selectedEvent,
  examType,
  data,
}: DetailPanelProps) {

  if (!selectedEvent) {
    return (
      <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-4 border-white bg-[#F3F4F6]">
        <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
          รายละเอียด
        </h2>
        <p className="text-gray-500 text-sm text-center">ไม่มีข้อมูล</p>
      </div>
    );
  }

  // หาข้อมูล selectedEvent จาก data (ในกรณีที่ selectedEvent เป็น object ที่ส่งมาจากที่อื่น)
  const eventDetail =
    data.find((item) => item.timetable_id === selectedEvent.timetable_id) || selectedEvent;

  const date = examType === "midterm" ? eventDetail.midterm_date : eventDetail.final_date;
  const startTime = examType === "midterm" ? eventDetail.midterm_startTime : eventDetail.final_startTime;
  const endTime = examType === "midterm" ? eventDetail.midterm_endTime : eventDetail.final_endTime;
  const location = examType === "midterm" ? eventDetail.midterm_location : eventDetail.final_location;

  return (
    <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-4 border-white bg-[#F3F4F6]">
      <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
        รายละเอียด
        {examType === "midterm"
          ? "การสอบกลางภาค"
          : examType === "final"
          ? "การสอบปลายภาค"
          : "การเรียน"}
      </h2>

      <ul className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-kanit text-[#616161] m-4 leading-relaxed">
        <li className="contents">
          <span>รหัสวิชา</span>
          <span>{eventDetail.subject_id}</span>
        </li>
        <li className="contents">
          <span>ชื่อวิชา</span>
          <span>{eventDetail.subjectName}</span>
        </li>
        <li className="contents">
          <span>กลุ่ม</span>
          <span>{eventDetail.sec}</span>
        </li>
        <li className="contents">
          <span>ประเภท</span>
          <span>
            {eventDetail.subjectType === "ท"
              ? "ทฤษฎี"
              : eventDetail.subjectType === "ป"
              ? "ปฏิบัติ"
              : eventDetail.subjectType}
          </span>
        </li>
        <li className="contents">
          <span>หน่วยกิต</span>
          <span>
            {eventDetail.credit}({eventDetail.creditType})
          </span>
        </li>
        <li className="contents">
          <span>อาจารย์</span>
          <span className="flex flex-col">
            {Array.isArray(eventDetail.teacher)
              ? eventDetail.teacher.map((t: string, i: number) => (
                  <span key={i}>{t}</span>
                ))
              : eventDetail.teacher}
          </span>
        </li>

        {examType ? (
          <>
            <li className="contents">
              <span>วันสอบ</span>
              <span>{date ? new Date(date).toLocaleDateString("th-TH") : "-"}</span>
            </li>
            <li className="contents">
              <span>เวลา</span>
              <span>
                {(startTime && startTime.length >= 5 ? startTime.slice(0, 5) : "-")} -{" "}
                {(endTime && endTime.length >= 5 ? endTime.slice(0, 5) : "-")}
              </span>
            </li>

            <li className="contents">
              <span>สถานที่</span>
              <span>{location || "-"}</span>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
}
