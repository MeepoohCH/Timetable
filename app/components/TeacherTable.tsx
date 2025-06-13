"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ClassItem } from "./ClassItem";
type Props = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem) => void;
};

export default function TeacherTable({ selectedEvent, setSelectedEvent }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);


const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/Teacher/getData");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClasses(data.teachers);  // เพราะ API ส่ง teachers มา
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

/*  useEffect(() => {
    fetchTeachers();

    const interval = setInterval(() => {
      fetchTeachers();
    }, 5000); // fetch ทุก 5 วิ

    return () => clearInterval(interval);
  }, []);
*/

  return (
    <div className="w-full max-w-[1152px] overflow-x-auto">
      <div className="min-w-full bg-[#F3F4F6] text-center shadow border-4 rounded-2xl border-white font-kanit">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">ลำดับ</TableHead>
              <TableHead className="text-center">ตำแหน่ง</TableHead>
              <TableHead className="text-center">ชื่อ</TableHead>
              <TableHead className="text-center">นามสกุล</TableHead>
            </TableRow>
          </TableHeader>
         <TableBody>
  {classes.map((cls, index) => (
    <TableRow
      key={cls.id ? cls.id.toString() : index}
      className={`cursor-pointer ${
        selectedEvent?.id === cls.id ? "hover:bg-gray-300" : "bg-gray-30"
      }`}
      onClick={() => setSelectedEvent(cls)}
    >
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{cls.role}</TableCell>
      <TableCell>{cls.teacherName}</TableCell>
      <TableCell>{cls.teacherSurname}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </div>
    </div>
  );
}
