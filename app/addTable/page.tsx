import StudentDropdownInput from '../components/ui/studentDropdownInput';
import StudentForm from '../components/StudentForm';

export default function AddTablePage() {
  console.log("StudentPage loaded");
  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางนักศึกษา</h1>
        <div className="mb-6">
          <StudentDropdownInput />
          <StudentForm/>
        </div>
      </div>
    </>
  );
}
