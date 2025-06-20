"use client"

import StudentDropdownInput from '../components/ui/studentDropdownInput';
import StudentForm from '../components/StudentForm';
import { useParams } from 'next/navigation';



export default function AddTablePage() {
  const params = useParams();
const timetable_id_str = params?.timetable_id;
const timetable_id = timetable_id_str ? Number(timetable_id_str) : undefined;
 console.log("timetable_id =", timetable_id);

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางนักศึกษา</h1>
        <div className="mb-6">
         <StudentDropdownInput timetable_id={timetable_id} />
        <StudentForm timetable_id={timetable_id} />
        </div>
      </div>
    </>
  );
}
