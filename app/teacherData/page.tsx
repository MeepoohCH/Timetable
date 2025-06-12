import TeacherDataForm from '../components/TeacherDataForm';


export default function SchedulePage() {
  console.log("StudentPage loaded");
  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ข้อมูล</h1>
        <div className="mb-6">
            <TeacherDataForm/>
        </div>
      </div>
    </>
  );
}
