"use client";

import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type DeleteTeacherProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  selectedEvent: any | null;
  events: any[];
  triggerRefresh: () => void;
};

export default function DeleteTeacher({
  onSwitchAction,
  currentComponent,
  selectedEvent,
  triggerRefresh,
}: DeleteTeacherProps) {
  const [formData, setFormData] = useState({
    teacher_id: "",
    teacherName: "",
    teacherSurname: "",
    role: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent);
    } else {
      setFormData({
        teacher_id: "",
        teacherName: "",
        teacherSurname: "",
        role: "",
      });
    }
  }, [selectedEvent]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!formData.teacher_id) return;

    try {
      setLoading(true);
      const res = await fetch("/api/Teacher/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacher_id: formData.teacher_id }),
      });

      if (!res.ok) throw new Error("การลบล้มเหลว");

      const result = await res.json();
      console.log("✅ ลบสำเร็จ:", result);
      triggerRefresh();

    
      setShowModal(false);
      onSwitchAction("add"); // กลับไปหน้า add หรือหน้าอื่นหลังลบ
    } catch (err) {
      console.error("❌ ลบไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการลบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className="text-sm py-1">ข้อมูลอาจารย์</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <div>
              <label className="block mb-1">คำนำหน้า</label>
              <input type="text" value={formData.role} className="box" readOnly />
            </div>

            <div>
              <label className="block mb-1">ชื่อ</label>
              <input type="text" value={formData.teacherName} readOnly className="box" />
            </div>

            <div>
              <label className="block mb-1">นามสกุล</label>
              <input type="text" value={formData.teacherSurname} className="box" readOnly />
            </div>

            <button type="button" className="buttonSub" onClick={handleDelete}>
              ลบ
            </button>
          </div>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">
              ยืนยันการลบ
            </h2>
            <p className="text-gray-700 mb-6">
              ต้องการลบอาจารย์ <span className="font-medium">{formData.teacherName} {formData.teacherSurname}</span> ใช่หรือไม่?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "กำลังลบ..." : "ลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
