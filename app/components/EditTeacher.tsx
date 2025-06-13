"use client";

import React, { useEffect, useState } from "react";
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

export default function EditTeacher({
  onSwitchAction,
  currentComponent,
  onEditEventAction,
  selectedEvent,
  events,
  existingClasses,
}: EditTeacherProps) {
  const [formData, setFormData] = useState({
    teacher_id: "",
    teacherName: "",
    teacherSurname: "",
    role: "",
  });


    useEffect(() => {
      console.log("🧪 selectedEvent:", selectedEvent);
  if (selectedEvent) {
    setFormData({
      teacher_id: selectedEvent.teacher_id,
      teacherName: selectedEvent.teacherName || "",
      teacherSurname: selectedEvent.teacherSurname || "",
      role: selectedEvent.role || "",
    });
  } else {
    setFormData({
      teacher_id: "",
      teacherName: "",
      teacherSurname: "",
      role: "",
    });
  }}, [selectedEvent]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
     console.log(`Changed ${name}:`, value);  // <-- เพิ่มตรงนี้
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedEvent) return;

  const fullName = `${formData.teacherName} ${formData.teacherSurname}`.trim();

  const duplicateTeacher = existingClasses.find(
    (cls) =>
      cls.id !== formData.teacher_id &&
      cls.teacherName.trim().toLowerCase() === formData.teacherName.trim().toLowerCase() &&
      cls.teacherSurname.trim().toLowerCase() === formData.teacherSurname.trim().toLowerCase()
  );

  if (duplicateTeacher) {
    const isExactDuplicate =
      duplicateTeacher.role.trim().toLowerCase() === formData.role.trim().toLowerCase();

    if (isExactDuplicate) {
      alert("มีอาจารย์ชื่อ-นามสกุล-ตำแหน่งนี้อยู่ในระบบแล้ว");
      return;
    }
  }

  const updatedEvent: ClassItem = {
    ...selectedEvent,
    teacher_id: formData.teacher_id,
    teacherName: formData.teacherName.trim(),
    teacherSurname: formData.teacherSurname.trim(),
    role: formData.role.trim(),
    teacher: [`${formData.teacherName} ${formData.teacherSurname}`, formData.role],
  };

  const dataToSend = {
    teacher_id: formData.teacher_id,
    teacherName: formData.teacherName.trim(),
    teacherSurname: formData.teacherSurname.trim(),
    role: formData.role.trim(),
  };

  console.log("📤 ส่งข้อมูลไป backend:", dataToSend);
  try {
    const response = await fetch("/api/Teacher/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ แก้ไขสำเร็จ:", result);

    onEditEventAction(updatedEvent);
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการแก้ไข:", error);
    alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
  }
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className="text-sm py-1">ข้อมูลอาจารย์</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">

            <div>
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

            <div>
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

            <div>
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



            <button type="submit" className="buttonSub" >
              แก้ไข
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 