"use client";

import { useState } from "react";
import Add from "../components/Add";
import Delete from "../components/Delete";
import Edit from "../components/Edit";
import { ClassItem } from "./ClassItem";
import { ClassItemGet } from "./ClassItem_getData";
import { useStudentFilter } from "@/context/StudentFilterContext/page";

type PopupType = "success" | "error";

export default function StudyForm() {
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");

  // ✅ ใช้ selectedEventGet เป็นตัวหลัก (เพราะ Edit/Delete รับตัวนี้)
  const [selectedEventGet, setSelectedEventGet] = useState<ClassItemGet | null>(null);

  // ตาราง events ที่อยู่ในหน้านี้
  const [events, setEvents] = useState<ClassItem[]>([]);

  // ✅ toast/popup (ไว้ส่งให้ Delete.showPopup)
  const [popup, setPopup] = useState<{
    open: boolean;
    message: string;
    type: PopupType;
  }>({ open: false, message: "", type: "success" });

  const showPopup = (message: string, type: PopupType = "success") => {
    setPopup({ open: true, message, type });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, open: false }));
    }, 2500);
  };

  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);

  const handleAddEvent = (newClass: ClassItem) => {
    setExistingClasses((prev) => [...prev, newClass]);
    setEvents((prev) => [...prev, newClass]);
  };

  // ✅ Delete ส่ง eventToDelete กลับมา (เราใช้ subject_id + sec ตัดออกจาก events)
  const handleDeleteEvent = (eventToDelete: ClassItemGet | null) => {
    if (!eventToDelete) return;

    setEvents((prev) =>
      prev.filter(
        (ev) => !(ev.subject_id === eventToDelete.subject_id && ev.sec === eventToDelete.sec)
      )
    );

    setSelectedEventGet(null);
  };

  // ✅ สำคัญ: Edit.tsx ต้องการ onEditEventAction(updatedEvent: ClassItem)
  const handleEditEvent = (updatedEvent: ClassItem) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.subject_id === updatedEvent.subject_id && ev.sec === updatedEvent.sec
          ? updatedEvent
          : ev
      )
    );

    setSelectedEventGet(null);
  };

  const { filters } = useStudentFilter();
  const isReady =
    filters.yearLevel && filters.semester && filters.academicYear && filters.degree;

  return (
    <div className="">
      {/* Tabs */}
      <div id="form-tabs" className="scroll-mt-20 pt-6">
        <div className="flex justify-start gap-2 px-6 pt-4 font-kanit">
          {(["add", "edit", "delete"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => switchComponent(tab)}
              className={`px-6 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 
                ${
                  currentComponent === tab
                    ? "bg-white text-orange-500 border-t-4 border-x-4 border-white border-b-0"
                    : "bg-transparent text-gray-500 hover:text-orange-500"
                }`}
            >
              {tab === "add" ? "เพิ่ม" : tab === "edit" ? "แก้ไข" : "ลบ"}
            </button>
          ))}
        </div>

        {!isReady && (
          <div className="px-6 pt-3 text-sm text-gray-500">
            เลือกชั้นปี/ภาคเรียน/ปีการศึกษา/หลักสูตรจากด้านบนก่อน เพื่อให้ข้อมูลตรง
          </div>
        )}
      </div>

      {/* Panel */}
      <div
        id="form-panel"
        className="flex-1 p-4 mx-2 shadow scroll-mt-20 bg-[#F3F4F6] border-4 border-white rounded-2xl w-full max-w-[1152px]"
      >
        {currentComponent === "add" && (
          <Add
            onSwitchAction={switchComponent}
            currentComponent="add"
            onAddEventAction={handleAddEvent}
            existingClasses={existingClasses}
          />
        )}

        {currentComponent === "edit" && (
          <Edit
            onSwitchAction={switchComponent}
            currentComponent="edit"
            onEditEventAction={handleEditEvent} // ✅ type ตรงแล้ว
            events={events}
            selectedEvent={selectedEventGet}
            existingClasses={existingClasses}
            data={selectedEventGet}
          />
        )}

        {currentComponent === "delete" && (
          <Delete
            onSwitchAction={switchComponent}
            currentComponent="delete"
            onDeleteEventAction={handleDeleteEvent} // ✅ รับ event ได้แล้ว
            events={events}
            selectedEvent={selectedEventGet}
            existingClasses={existingClasses}
            data={selectedEventGet} // ✅ จำเป็นสำหรับ delete by timetable_id
            showPopup={showPopup} // ✅ แก้ error DeleteProps
          />
        )}
      </div>

      {/* ✅ Toast */}
      {popup.open && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[2000]">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg text-white ${
              popup.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {popup.message}
          </div>
        </div>
      )}
    </div>
  );
}