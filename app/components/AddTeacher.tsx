"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";

type AddProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onAddEventAction: (event: any) => void;
  existingClasses: ClassItem[];
};



function isTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}



export default function AddTeacher({
  onSwitchAction,
  currentComponent,
  onAddEventAction,
  existingClasses,
}: AddProps) {
  const pathname = usePathname();

  const [role, setRole] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [teacherSurname, setTeacherSurname] = useState<string>("");

  const [formData, setFormData] = useState({
    role: "",
    teacherName: "",
    teacherSurname:"",
  });

  const [conflictData, setConflictData] = useState<ClassItem | null>(null);
  const [showConflictWarning, setShowConflictWarning] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const resetForm = () => {
    setFormData({
    role: "",
    teacherName: "",
    teacherSurname:"",
    });
    setRole("")
    setTeacherName("")
    setTeacherSurname("")
   }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  


    const requiredFields = [
      formData.role,
      formData.teacherName,
      formData.teacherSurname,
    ];


    const isTeacherValid = requiredFields.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );

    if (!isTeacherValid) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    //  for (const cls of existingClasses || []) {
    //   const hasSameTeacher = cls.teacher.some(t => allTeachers.includes(t));
    //   const sameDay = cls.weekday === formData.weekday;

    //   if (hasSameTeacher && sameDay) {
    //     if (
    //       isTimeOverlap(
    //         cls.study.startTime,
    //         cls.study.endTime,
    //         formData.study.startTime,
    //         formData.study.endTime
    //       )
    //     ) {
    //       console.log("Conflict detected with:", cls);
    //       setConflictData(cls);
    //       setShowConflictWarning(true);
    //       return;
    //     }
    //   }
    // }

    onAddEventAction({ 
      ...formData,
    });


    // reset ฟอร์ม
    resetForm();

  };

  // const handleOverwrite = () => {
  //   if (!conflictData) return;

  //   const allTeachers = getAllTeachers();

  //   onAddEventAction({
  //     ...formData,
  //     teacher: allTeachers,
  //     yearLevel: "2xxx",
  //     semester: "x",
  //     subjectName: formData.subjectName || "Subjectname",
  //     overwriteId: conflictData.subject_id,
  //   });

  //   setShowConflictWarning(false); // ปิด popup เตือน
  //   setConflictData(null);
  //   resetForm();
  // };

  return (
  <>
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="add-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className=" text-sm py-1">ข้อมูลอาจารย์</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <div className="">
              <label className="block mb-1">ชื่อ</label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <div className=" ">
              <label className="block mb-1">นามสกุล</label>
              <input
                type="text"
                name="teacherSurname"
                value={formData.teacherSurname}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <div className="">
              <label className="block mb-1">ตำแหน่ง</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <button type="submit" className="buttonSub">
              เพิ่ม
            </button>

          </div>
        </div>
      </form>
    </div>
  </>
  );
}
