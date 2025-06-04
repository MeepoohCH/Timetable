export default function DetailPanel({
  selectedEvent,
}: {
  selectedEvent: any | null;
}) {
  return (
    <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-2 border-white bg-[#F3F4F6]">
      <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
        รายละเอียด
      </h2>
      {selectedEvent ? (
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
            <span>อาจารย์</span>
            <span className="flex flex-col">
              {Array.isArray(selectedEvent.teacher)
                ? selectedEvent.teacher.map((t: string, i: number) => (
                    <span key={i}> {t}</span>
                  ))
                : selectedEvent.teacher}
            </span>
          </li>
          <li className="contents">
            <span>วัน/เดือน/ปี</span>
            <span>{selectedEvent.date}</span>
          </li>
          <li className="contents">
            <span>เวลาเริ่ม</span>
            <span>{selectedEvent.timeStart}</span>
          </li>
          <li className="contents">
            <span>เวลาจบ</span>
            <span>{selectedEvent.timeEnd}</span>
          </li>
          <li className="contents">
            <span>สถานที่</span>
            <span>{selectedEvent.location}</span>
          </li>
        </ul>
      ) : (
        <p className="text-gray-500 text-sm text-center">ไม่มีข้อมูล</p>
      )}
    </div>
  );
}
