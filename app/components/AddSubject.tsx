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



export default function AddSubject({
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
    id: "",
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: [] as string[],
    weekday: "",
    subjectType:"",
    academicYear:"",
    teacherName:"",
    teacherSurname:"",
    role:"",
    credit: "",
    creditType: "",
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
      final: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
    },
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
      id: "",
      subject_id: "",
      subjectName: "",
      sec: "",
      teacher: [] as string[],
      weekday: "",
      subjectType: "",
      academicYear: "",
      teacherName: "",
      teacherSurname: "",
      credit: "",
      creditType: "",
      role: "",
      study: {
        location: "",
        startTime: "",
        endTime: "",
      },
      exam: {
        midterm: {
          date: "",
          location: "",
          startTime: "",
          endTime: "",
        },
        final: {
          date: "",
          location: "",
          startTime: "",
          endTime: "",
        },
      },
    });
   }

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const requiredFields = [
    formData.subject_id,
    formData.subjectName,
    formData.credit,
    formData.creditType,
  ];

  const isSubjectValid = requiredFields.every(
    (field) => typeof field === "string" && field.trim() !== ""
  );

  if (!isSubjectValid) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const newEvent: ClassItem = {
    id: "",
    subject_id: formData.subject_id,  
    subjectName: formData.subjectName,
    sec: "",
    teacher: [],
    role: "",
    teacherName: "",
    teacherSurname: "",
    weekday: "",
    subjectType: "",
    academicYear: "",
    credit: formData.credit,
    creditType: formData.creditType,
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: { date:"", location:"", startTime:"", endTime:"" },
      final: { date:"", location:"", startTime:"", endTime:"" },
    },
  };



  onAddEventAction(newEvent);
  resetForm();
};

return (
  <>
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="add-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 ">
          <label className=" text-sm py-1">ข้อมูลวิชา</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <div className="">
              <label className="block mb-1">รหัสวิชา</label>
              <input
                type="text"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <div className=" ">
              <label className="block mb-1">ชื่อวิชา</label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <div className="">
              <label className="block mb-1">หน่วยกิต</label>
              <input
                type="text"
                name="credit"
                value={formData.credit}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <div className="">
              <label className="block mb-1">ประเภทหน่วยกิต</label>
              <input
                type="text"
                name="creditType"
                value={formData.creditType}
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
