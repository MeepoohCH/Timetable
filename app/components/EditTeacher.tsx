"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";


type EditTeacherProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onEditEventAction: (updatedEvent: ClassItem) => void;
  selectedEvent: ClassItem | null;
  events: ClassItem[];
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

// ฟังก์ชันแปลงเวลา Date เป็น HH:mm string
function formatDateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function EditTeacher({
  onSwitchAction,
  currentComponent,
  onEditEventAction,
  selectedEvent,
  events,
  existingClasses
}: EditTeacherProps) {

    const [formData, setFormData] = useState({
      teacherName: "",
      teacherSurname: "",
      role: ""
    });

    const [role, setRole] = useState<string>("");
    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherSurname, setTeacherSurname] = useState<string>("");

    useEffect(() => {
      if (selectedEvent) {
        setFormData(selectedEvent)
      } else {
      setFormData({
        teacherName: "",
        teacherSurname: "",
        role:"",
      });
      setRole("");
      setTeacherName("");
      setTeacherSurname("");
      }
    }, [selectedEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ข้อมูลที่บันทึก:", formData);
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };


  return (
  <>
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
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