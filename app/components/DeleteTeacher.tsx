"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type DeleteProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onDeleteEventAction: (event: any) => void;
  selectedEvent: any | null;
  events: any[];
};

export default function DeleteTeacher({
  onSwitchAction,
  currentComponent,
  onDeleteEventAction,
  selectedEvent,
}: DeleteProps) {
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    teacherName: "",
    teacherSurname: "",
    role: "",
  });

  const [role, setRole] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [teacherSurname, setTeacherSurname] = useState<string>("");

  // เมื่อ selectedEvent เปลี่ยน ให้โหลดข้อมูลลงฟอร์ม
  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent);
    } else {
      // เคลียร์ข้อมูลทั้งหมดเมื่อไม่มี selectedEvent
      setFormData({
        teacherName: "",
        teacherSurname: "",
        role: "",
      });
      setRole("");
      setTeacherName("");
      setTeacherSurname("");
    }
  }, [selectedEvent]);

  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedEvent) return;
    onDeleteEventAction(selectedEvent);
    setShowModal(false);
  };

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          <div className="delete-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <label className=" text-sm py-1">ข้อมูลอาจารย์</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
              <div className="">
                <label className="block mb-1">ชื่อ</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  readOnly
                  className="box"
                />
              </div>

              <div className="">
                <label className="block mb-1">นามสกุล</label>
                <input
                  type="text"
                  value={formData.teacherSurname}
                  readOnly
                  className="box"
                />
              </div>

              <div className="">
                <label className="block mb-1">ตำแหน่ง</label>
                <input
                  type="text"
                  value={formData.role}
                  readOnly
                  className="box"
                />
              </div>
                <button 
                type="submit" 
                className="buttonSub mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                ลบ
                </button>
            </div>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">
              ยืนยันการลบ
            </h2>
            <p className="text-gray-700 mb-6">
              ต้องการลบวิชา{" "}
              <span className="font-medium">{selectedEvent?.subjectName}</span>{" "}
              ใช่หรือไม่?
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
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
