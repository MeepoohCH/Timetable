import TeacherDropdown from '../components/ui/teacherDropdown';
import TeacherOutput from '../components/TeacherOutput';



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
