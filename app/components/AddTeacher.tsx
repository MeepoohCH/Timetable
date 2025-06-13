"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";
import { v4 as uuidv4 } from 'uuid';

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


  const [formData, setFormData] = useState({
    role: "",
    teacherName: "",
    teacherSurname:"",
  });

  const [conflictData, setConflictData] = useState<ClassItem | null>(null);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
   }

const handleSubmit = async (e: React.FormEvent) => {
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
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }
  const isDuplicate = existingClasses.some(
  (cls) =>
    cls.teacherName.toLowerCase() === formData.teacherName.toLowerCase().trim() &&
    cls.teacherSurname.toLowerCase() === formData.teacherSurname.toLowerCase().trim()
);

if (isDuplicate) {
    setErrorMessage("มีอาจารย์ชื่อ-นามสกุลนี้อยู่ในระบบแล้ว");
  return;
}


  const newEvent: ClassItem = {
    id: uuidv4(),
    subject_id: "",  
    subjectName: "",
    sec: null,
    teacher_id: "",
    teacher: [`${formData.teacherName} ${formData.teacherSurname}`],
    role: formData.role,
    teacherName: formData.teacherName,
    teacherSurname: formData.teacherSurname,
    weekday: "",
    subjectType: "",
    academicYear: "",
    credit: null,
    creditType: "",
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: { date: "", location: "", startTime: "", endTime: "" },
      final: { date: "", location: "", startTime: "", endTime: "" },
    },
  };

  // 🔧 เตรียมข้อมูลสำหรับส่งไป backend
  const dataToSend = {
    role: formData.role,
    teacherName: formData.teacherName,
    teacherSurname: formData.teacherSurname,
  };

  try {
    const response = await fetch("/api/Teacher/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Success:", result);

    onAddEventAction(newEvent);
    resetForm();

  } catch (error) {
    console.error("❌ Error submitting form:", error);
  }

};

return (
  <>
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="add-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className=" text-sm py-1">ข้อมูลอาจารย์</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">

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
           

            <button type="submit" className="buttonSub">
              เพิ่ม
            </button>

          </div>
        </div>
      </form>
    </div>
    {errorMessage && (
  <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
)}
  </>
  
  );
}
