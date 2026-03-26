"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";
import { v4 as uuidv4 } from 'uuid';

type SubjectItem = {
  subject_id: string;
  subjectName: string;
  credit: number | null;
  creditType: string;
};


type AddProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onAddEventAction: (event: any) => void;
  existingClasses: ClassItem[];  // ✅ เปลี่ยนชื่อ
  triggerRefresh: () => void;
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
  triggerRefresh,
}: AddProps) {
  const pathname = usePathname();

  const [role, setRole] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [teacherSurname, setTeacherSurname] = useState<string>("");

  const [formData, setFormData] = useState({
    subject_id: "",
    subjectName: "",
    credit: null,
    creditType: "",
  });


  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showPopup = (message: string, type: "success" | "error" = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ถ้าเป็น credit ให้แปลงเป็น number
    const newValue = name === "credit" ? (value === "" ? null : Number(value)) : value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      subject_id: "",
      subjectName: "",
      credit: null,
      creditType: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // เช็คฟิลด์ที่จำเป็นครบไหม
    const requiredFields = [
      formData.subject_id,
      formData.subjectName,
      formData.credit,
      formData.creditType,
    ];


    const isSubjectValid = requiredFields.every(
      (field) => typeof field === "string" ? field.trim() !== "" : field !== null
    );

    if (!isSubjectValid) {
      showPopup("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (formData.credit !== null && formData.credit <= 0) {
      showPopup("กรุณากรอกหน่วยกิตมากกว่า 0");
      return;
    }

      if (formData.subject_id.length !== 8) {
    showPopup("กรุณากรอกรหัสวิชาให้ครบ 8 ตัว");
    return;
  }

    const newSubject = {
      subject_id: formData.subject_id.trim(),
      subjectName: formData.subjectName.trim(),
      credit: formData.credit,
      creditType: formData.creditType.trim(),
    };

    try {
      const response = await fetch("/api/Subject/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      });

      const result = await response.json();

      if (response.status === 200 && result.message === "Subject already exists") {
        showPopup("มีรหัสวิชานี้อยู่ในระบบแล้ว");
        return;
      }

      if (!response.ok) {
        showPopup(`เกิดข้อผิดพลาด: ${result.message || result.error || response.statusText}`);
        return;
      }

      showPopup(result.message || "เพิ่มข้อมูลวิชาเรียบร้อยแล้ว", "success");
      triggerRefresh();
      onAddEventAction(newSubject);
      resetForm();

    } catch (error) {
      console.error("❌ Error adding subject:", error);
      showPopup("เกิดข้อผิดพลาดในการเพิ่มข้อมูลวิชา");
    }
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
                  type="number"
                  name="credit"
                  value={formData.credit ?? ""}
                  onChange={handleChange}
                  className="box"
                  min="1"
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

      {showToast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300
      ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {toastMessage}
        </div>
      )}
    </>

  );
}
