import TeacherDropdown from '../components/ui/teacherDropdown';
import TeacherOutput from '../components/TeacherOutput';

const mockClasses = [
  {
    day: 'จันทร์',
    starttime: "08:45",
    endtime: "10:15",
    subject: 'CALCULUS1',
    subjectid: '01006030 (ท) ปี 1 กลุ่ม 4',
  },
  {
    day: 'อังคาร',
    starttime: "13:00",
    endtime: "20:00",
    subject: 'PHYSICS1',
    subjectid: '02007040 (ท) ปี 2 กลุ่ม 1',
  },
];


export default function SchedulePage() {
  console.log("StudentPage loaded");
  return (
    <>
  <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto w-full">
    <h1 className="text-2xl font-medium mb-4">ตารางอาจารย์</h1>
    <div className="mb-6">
      <TeacherDropdown />
      <TeacherOutput/>
    </div>
</div>

    </>
  );
}
