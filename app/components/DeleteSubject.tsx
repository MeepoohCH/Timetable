"use client";

import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";

type DeleteTeacherProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onDeleteEventAction: (event: any) => void;
  selectedEvent: any | null;
  events: any[];
  triggerRefresh: () => void;
  allSubjects: ClassItem[];
};

export default function DeleteSubject({
  onSwitchAction,
  currentComponent,
  onDeleteEventAction,
  selectedEvent,
  triggerRefresh,
  allSubjects,
}: DeleteTeacherProps) {

  const [formData, setFormData] = useState({
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
    role: "",
    credit: null as number | null,
    creditType: "",
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

  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent);
    } else {
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
        credit: null,
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
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedEvent && allSubjects.length > 0) {
      const found = allSubjects.find(s => s.subject_id === selectedEvent.subject_id);
      if (found) {
        setFormData(prev => ({
          ...prev,
          subject_id: found.subject_id,
          subjectName: found.subjectName || "",
          credit: found.credit ?? null,
          creditType: found.creditType || "",
        }));
      }
    }
  }, [selectedEvent, allSubjects]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showPopup = (message: string, type: "success" | "error" = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = () => {
    if (!formData.subject_id) {
      showPopup("กรุณากรอกรหัสวิชาที่ต้องการลบ", "error");
      return;
    }
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!formData.subject_id) {
      showPopup("กรุณากรอกรหัสวิชาที่ต้องการลบ", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/Subject/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_id: formData.subject_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        showPopup("ลบไม่สำเร็จ: " + errorData.error, "error");
        return;
      }

      const result = await res.json();
      showPopup(result.message, "success");
      onDeleteEventAction(formData);
      triggerRefresh();

      // Reset formData
      setFormData({
        id: "",
        subject_id: "",
        subjectName: "",
        sec: "",
        teacher: [],
        weekday: "",
        subjectType: "",
        academicYear: "",
        teacherName: "",
        teacherSurname: "",
        role: "",
        credit: null,
        creditType: "",
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

      setShowModal(false);
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
      showPopup("เกิดข้อผิดพลาดระหว่างลบวิชา", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className="text-sm py-1">ข้อมูลวิชา</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <div>
              <label className="block mb-1">รหัสวิชา</label>
              <input
                type="text"
                value={formData.subject_id}
                onChange={(e) => {
                  const val = e.target.value;
                  let newFormData = { ...formData, subject_id: val };

                  if (val.length === 8) {
                    const found = allSubjects.find(s => s.subject_id === val);
                    if (found) {
                      newFormData = {
                        ...newFormData,
                        subjectName: found.subjectName || "",
                        credit: found.credit ?? null,
                        creditType: found.creditType || "",
                      };
                    } else {
                      newFormData = {
                        ...newFormData,
                        subjectName: "",
                        credit: null,
                        creditType: "",
                      };
                    }
                  } else {
                    newFormData = {
                      ...newFormData,
                      subjectName: "",
                      credit: null,
                      creditType: "",
                    };
                  }

                  setFormData(newFormData);
                }}
                className="box"
              />
            </div>

            <div>
              <label className="block mb-1">ชื่อวิชา</label>
              <input
                type="text"
                value={formData.subjectName}
                className="box"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1">หน่วยกิต</label>
              <input
                type="number"
                value={formData.credit ?? ""}
                className="box"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1">ประเภทหน่วยกิต</label>
              <input
                type="text"
                value={formData.creditType}
                className="box"
                readOnly
              />
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
              ต้องการลบวิชา <span className="font-medium">{formData.subjectName}</span> ใช่หรือไม่?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700"
                onClick={() => setShowModal(false)}
                disabled={loading}
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

      {showToast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300
          ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
