import { ClassItem } from "../ClassItem";

type Props = {
  classes: ClassItem[];
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem) => void;
};

export default function TeacherScheduleTable({ 
  classes, 
  selectedEvent, 
  setSelectedEvent 
}: Props) {
  const weekdays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const startHour = 8;
  const endHour = 22;
  const totalSlots = (endHour - startHour) * 4;

  const parseTimeToFloat = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
  };

  const timeToSlot = (time: number) => Math.round((time - startHour) * 4);

  return (
    <div className="w-full max-w-[1152px] mx-auto">
      <div className="inline-block w-full max-w-full rounded-2xl p-1 shadow bg-[#F3F4F6] border-4 border-white">
        <div className="grid grid-rows-[40px_repeat(7,1fr)]">
          <div className="grid grid-cols-[75px_repeat(56,19px)]">
            <div className="flex items-center text-sm justify-center sticky left-0 border-r bg-[#F3F4F6]">
              วัน / เวลา
            </div>
            {Array.from({ length: totalSlots }).map((_, i) => {
              const hour = startHour + Math.floor(i / 4);
              const min = (i % 4) * 15;
              const label = min === 0 ? `${hour}:00` : '';
              return (
                <div
                  key={i}
                  className="flex items-center justify-end ml-3 text-xs"
                  style={{ width: 19 }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* weekday rows */}
          {weekdays.map((weekday) => (
            <div
              key={weekday}
              className="grid grid-cols-[75px_repeat(56,19px)] border-t relative bg-[#F3F4F6]"
            >
              <div className="flex items-center text-sm justify-center sticky left-0 border-r bg-[#F3F4F6]">
                {weekday}
              </div>
              <div className="relative col-span-[56] flex">
                {Array.from({ length: totalSlots }).map((_, i) => (
                  <div
                    key={i}
                    className="relative border-r border-b border-[#F3F4F6] bg-[#F3F4F6]"
                    style={{ width: 19, height: 48, zIndex: 0 }}
                  />
                ))}

                {classes
                  .filter((c) => c.weekday === weekday)
                  .map((c, i) => {
                    const start = parseTimeToFloat(c.study.startTime);
                    const end = parseTimeToFloat(c.study.endTime);
                    const left = timeToSlot(start) * 19;
                    const width = (end - start) * 4 * 19;
                    const isSelected =
                      selectedEvent?.subject_id === c.subject_id &&
                      selectedEvent?.sec === c.sec;

                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedEvent(c)}
                        
                        className={`absolute top-1 bottom-1 ml-3 rounded p-1 shadow text-xs overflow-hidden text-center z-10 cursor-pointer
+                         ${isSelected ? "bg-orange-300 ring-2 ring-orange-500" : "bg-[#FEDDC1]"}
                        `}
                        style={{ left, width }}
                        title={`${c.subjectName} (${c.subject_id})`}
                      >
                        <span className="font-medium">{c.subjectName}</span>
                        <div style={{ fontSize: '10px' }}>{c.subject_id} ({c.subjectType}) ปี {c.academicYear} กลุ่ม {c.sec}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
