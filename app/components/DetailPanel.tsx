export default function DetailPanel({
  selectedEvent,
  examType
}: {
  selectedEvent: any | null;
  examType?: "midterm" | "final";
}) {
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

  const examData = examType ? selectedEvent.exam[examType] : null;
  const dataToShow = examData ?? selectedEvent.study;

 
return (
    <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-4 border-white bg-[#F3F4F6]">
      <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
        รายละเอียด{examType === "midterm"
          ? "การสอบกลางภาค"
          : examType === "final"
          ? "การสอบปลายภาค"
          : "การเรียน"}
      </h2>

      <ul className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-kanit text-[#616161] m-4 leading-relaxed">
        <li className="contents">
          <span>รหัสวิชา</span>
          <span>{selectedEvent.subject_id}</span>
        </li>
        <li className="contents">
          <span>ชื่อวิชา</span>
          <span>{selectedEvent.subjectName}</span>
        </li>
        <li className="contents">
          <span>กลุ่ม</span>
          <span>{selectedEvent.sec}</span>
        </li>
        <li className="contents">
          <span>ประเภท</span>
          <span>{selectedEvent.subjectType}</span>
        </li>
        <li className="contents">
          <span>อาจารย์</span>
          <span className="flex flex-col">
            {Array.isArray(selectedEvent.teacher)
              ? selectedEvent.teacher.map((t : string , i : number) => <span key={i}>{t}</span>)
              : selectedEvent.teacher}
          </span>
        </li>

        {examType ? (
          <>
            <li className="contents">
              <span>วันสอบ</span>
              <span>{examData?.date || "-"}</span>
            </li>
            <li className="contents">
              <span>เวลาเริ่ม</span>
              <span>{examData?.startTime || "-"}</span>
            </li>
            <li className="contents">
              <span>เวลาจบ</span>
              <span>{examData?.endTime || "-"}</span>
            </li>
            <li className="contents">
              <span>สถานที่</span>
              <span>{examData?.location || "-"}</span>
            </li>
          </>
        ) : (
          <>
            <li className="contents">
              <span>วัน</span>
              <span>{selectedEvent.weekday}</span>
            </li>
            <li className="contents">
              <span>เวลาเริ่ม</span>
              <span>{selectedEvent.study.startTime}</span>
            </li>
            <li className="contents">
              <span>เวลาจบ</span>
              <span>{selectedEvent.study.endTime}</span>
            </li>
            <li className="contents">
              <span>สถานที่</span>
              <span>{selectedEvent.study.location}</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}