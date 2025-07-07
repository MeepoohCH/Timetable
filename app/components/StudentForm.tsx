"use client";

import { useState,useEffect } from "react";
import Add from "../components/Add";
import Delete from "../components/Delete";
import Edit from "../components/Edit";
import { ClassItem } from "./ClassItem";
import { ClassItemGet } from "./ClassItem_getData";


type Props = {
  timetable_id?: number | undefined; // หรือชนิดอื่น ๆ ที่เหมาะสม เช่น string | undefined
  data?: ClassItemGet | null; // ✅ เพิ่ม prop นี้
};


export default function StudentForm({ timetable_id, data }: Props) {
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);   // <-- เปลี่ยน type เป็น ClassItem | null
    const [selectedEventGet, setSelectedEventGet] = useState<ClassItemGet | null>(null); 
  const [events, setEvents] = useState<ClassItem[]>([]);
  const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState<"success" | "error">("success");
const [showToast, setShowToast] = useState(false);

const showPopup = (message: string, type: "success" | "error" = "success") => {
  setToastMessage(message);
  setToastType(type);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000);
};


   const handleAddEvent = (newClass: ClassItem) => {
    setExistingClasses(prev => [...prev, newClass]);
    setEvents(prev => [...prev, newClass]);  
  };
const handleDeleteEvent = () => {
      if (!selectedEvent) return;

    setEvents((prev) =>
      prev.filter((ev) =>
        !(
          ev.subject_id === selectedEvent.subject_id &&
          ev.sec === selectedEvent.sec
        )
      )
    );

    setSelectedEvent(null); // clear class ที่ถูกเลือกหลังลบ
  };
  const handleEditEvent = (updatedEvent: any) => {
    setEvents((prev) =>
      prev.map((ev) =>
      ev.subject_id === updatedEvent.subject_id && ev.sec === updatedEvent.sec
        ? updatedEvent
        : ev
      )
    );
    setSelectedEvent(null); // reset event ที่เลือกหลังแก้ไข
  };

  const isActive = (tab: "edit" | "delete" | "add") => currentComponent === tab;
  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);

  useEffect(() => {
    if (timetable_id !== undefined) {
      setCurrentComponent("edit");
    }
  }, [timetable_id]);

  return (
    <div className="">
      <div id="form-section" className="scroll-mt-20 pt-6">
        <div id="form-section" className="flex justify-start   gap-2 px-6 pt-4font-kanit ">
          {(["add", "edit", "delete"] as const).map((tab) => (
            <button
              key={tab}
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
      </div>

      <div id="form-section" className="flex-1 p-4 mx-2 shadow scroll-mt-20 bg-[#F3F4F6] border-4 border-white  rounded-2xl w-full max-w-[1152px]">
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
         onEditEventAction={handleEditEvent}
         events={events}
         selectedEvent={selectedEventGet}
         existingClasses={existingClasses}
        data={data}
       />

        )}
        {currentComponent === "delete" && (
          <Delete
          onSwitchAction={switchComponent}
          currentComponent="delete"
          onDeleteEventAction={handleDeleteEvent}
          events={events}
          selectedEvent={selectedEventGet} // เพิ่มตรงนี้✅ 
          data={data}
          existingClasses={existingClasses}
          showPopup={showPopup} 
        />
        )}
      </div>
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