type ClassItem = {
    subject_id: string,
    subjectName: string,
    sec: string,
    teacher: string[],
    weekday: string,
    startTime: string,
    endTime: string,
    location: string,
};

type Props = {
  classes: ClassItem[];
};

export default function ScheduleTable({ classes }: Props) {
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
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-[600px] bg-[#F7F7F7] rounded-xl p-2 shadow">
        <div className="grid grid-rows-[40px_repeat(7,1fr)]">
          <div className="grid grid-cols-[90px_repeat(56,19px)]">
            <div className="flex items-center justify-center sticky left-0 z-10 border-r bg-[#F7F7F7]">
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
              className="grid grid-cols-[90px_repeat(56,19px)] border-t relative bg-[#F7F7F7]"
            >
              <div className="flex items-center justify-center sticky left-0 z-40 border-r bg-[#F7F7F7]">
                {weekday}
              </div>
              <div className="relative col-span-[56] flex">
                {Array.from({ length: totalSlots }).map((_, i) => (
                  <div
                    key={i}
                    className="relative border-r border-b border-[#F7F7F7] bg-[#F7F7F7]"
                    style={{ width: 19, height: 48, zIndex: 0 }}
                  />
                ))}

                {classes
                  .filter((c) => c.weekday === weekday)
                  .map((c, i) => {
                    const start = parseTimeToFloat(c.startTime);
                    const end = parseTimeToFloat(c.endTime);
                    const left = timeToSlot(start) * 19;
                    const width = (end - start) * 4 * 19;

                    return (
                      <div
                        key={i}
                        className="absolute top-1 bottom-1 bg-[#FEDDC1] ml-3 rounded p-1 shadow text-xs overflow-hidden text-center z-10"
                        style={{ left, width }}
                        title={`${c.subjectName} (${c.subject_id}) ${c.startTime} - ${c.endTime}`}
                      >
                        <span className="font-medium">{c.subjectName}</span>
                        <div style={{ fontSize: '10px' }}>{c.subject_id}</div>
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
