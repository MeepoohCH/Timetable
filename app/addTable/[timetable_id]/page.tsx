"use client"

import StudentDropdown from '@/app/components/ui/studentDropdownInput';
import StudentForm from '@/app/components/StudentForm';
import { useParams } from 'next/navigation';
import { ClassItemGet } from '@/app/components/ClassItem_getData';
import { useState,useEffect } from "react"



export default function AddTablePage() {
  const params = useParams();
const timetable_id_str = params?.timetable_id;
const timetable_id = timetable_id_str ? Number(timetable_id_str) : undefined;
 console.log("timetable_id =", timetable_id);

 const [data, setData] = useState<ClassItemGet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!timetable_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/Timetable/getData?timetable_id=${timetable_id}`);
        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        const json = await res.json();
        console.log("📦 ข้อมูลที่โหลดได้จาก API (getData):", json);

        setData(json);
      } catch (err) {
        console.error("โหลดข้อมูลผิดพลาด", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timetable_id]);

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto bg-[#EFEFEF] w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางนักศึกษา</h1>
        <div className="mb-6">
         <StudentDropdown timetable_id={timetable_id} data={data}/>
        <StudentForm timetable_id={timetable_id} data={data} />
        </div>
      </div>
    </>
  );
}
