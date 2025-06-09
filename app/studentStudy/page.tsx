import StudentDropdown from '../components/ui/studentDropdown';
import StudyForm from '../components/StudyForm';
import ExamForm from '../Exam/page';


export default function SchedulePage() {
  console.log("StudentPage loaded");
  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางนักศึกษา</h1>
        <div className="mb-6">
          <StudentDropdown />o
          <StudyForm/>
        </div>
      </div>
    </>
  );
}
