"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ClassItem } from "./ClassItem";

type Props = {
  classes: ClassItem[];
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem) => void;
};

export default function SubjectTable({ selectedEvent, setSelectedEvent }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);


const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/Subject/getData");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClasses(data.subjects);  // เพราะ API ส่ง subjects มา
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

/*   useEffect(() => {
    fetchSubjects();

   const interval = setInterval(() => {
      fetchSubjects();
    }, 10000); // fetch ทุก 10 วิ

    return () => clearInterval(interval);
  }, []);
*/
  return (
    <div className="w-full max-w-[1152px] overflow-x-auto">
      <div className="min-w-full bg-[#F3F4F6] text-center shadow border-4 rounded-2xl border-white font-kanit">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">รหัสวิชา</TableHead>
              <TableHead className="text-center">ชื่อวิชา</TableHead>
              <TableHead className="text-center">หน่วยกิต</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls, index) => (
              <TableRow
                key={`${cls.subject_id}`}
                className={`cursor-pointer ${
                  selectedEvent?.subject_id === cls.subject_id
                    ? "bg-gray-300"
                    : "hover:bg-gray-300"
                }`}
                onClick={() => setSelectedEvent(cls)}
              >
                <TableCell className="font-medium">{cls.subject_id}</TableCell>
                <TableCell>{cls.subjectName}</TableCell>
                <TableCell>{cls.credit}({cls.creditType})</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
