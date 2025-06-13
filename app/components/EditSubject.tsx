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

export default function EditSubject({
  onSwitchAction,
  currentComponent,
  onEditEventAction,
  selectedEvent,
  events,
  existingClasses,
}: EditTeacherProps) {

  const [formData, setFormData] = useState<{
     subject_id: string;
  subjectName: string;
  credit: number | null;
  creditType: string;
}>({
  subject_id: "",
  subjectName: "",
  credit: null,
  creditType: "",
});
    useEffect(() => {
      console.log("🧪 selectedEventSubject:", selectedEvent);
  if (selectedEvent) {
    setFormData({
      subject_id: selectedEvent.subject_id,
      subjectName: selectedEvent.subjectName || "",
      credit: selectedEvent.credit || null,
      creditType: selectedEvent.creditType || "",
    });
  } else {
    setFormData({
    subject_id: "",
    subjectName: "",
    credit: null,
    creditType: "",
    });
  }}, [selectedEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changed ${name}:`, value);  // <-- เพิ่มตรงนี้
     setFormData((prev) => ({
    ...prev,
    [name]: name === "credit" ? (value === "" ? null : Number(value)) : value,
  }));
};
  

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedEvent) return;

  const originalSubjectId = selectedEvent.subject_id;

  const duplicateSubject = existingClasses.find(
    (cls) =>
      cls.subject_id === formData.subject_id &&
      cls.subject_id !== originalSubjectId
  );

  if (duplicateSubject) {
    alert("มีรหัสวิชานี้อยู่ในระบบแล้ว");
    return;
  }

  const updatedEvent: ClassItem = {
    ...selectedEvent,
    subject_id: formData.subject_id.trim(),
    subjectName: formData.subjectName.trim(),
    credit: formData.credit ?? null,
    creditType: formData.creditType.trim(),
  };

  const dataToSend = {
    original_subject_id: originalSubjectId, // รหัสเดิม (ใช้ค้นหา)
    subject_id: formData.subject_id.trim(), // รหัสใหม่ (อาจเปลี่ยน)
    subjectName: formData.subjectName.trim(),
    credit: formData.credit ?? null,
    creditType: formData.creditType.trim(),
  };

  console.log("📤 ส่งข้อมูลวิชาไป backend:", dataToSend);

  try {
    const response = await fetch("/api/Subject/edit", {
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
    console.log("✅ แก้ไขวิชาสำเร็จ:", result);

    onEditEventAction(updatedEvent);
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการแก้ไขวิชา:", error);
    alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูลวิชา");
  }
};


return (
  <>
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
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
                type="number"
                name="credit"
                value={formData.credit ?? ""}
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
              แก้ไข
            </button>

          </div>
        </div>
      </form>
    </div>
  </>
  );
} 