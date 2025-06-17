"use client";

import { useState } from "react";
import Add from "../components/Add";
import Calendar from "./Calendar";
import Delete from "../components/Delete";
import DetailPanel from "../components/DetailPanel";
import Edit from "../components/Edit";
import ScheduleTable from "./ui/ScheduleTable";
import { ClassItem } from "./ClassItem";
import ExamForm from "./ExamForm";


export default function StudyForm() { 
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);   // <-- เปลี่ยน type เป็น ClassItem | null
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ClassItem[]>([]);

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
         selectedEvent={selectedEvent}
         existingClasses={existingClasses}
       />

        )}
        {currentComponent === "delete" && (
          <Delete
          onSwitchAction={switchComponent}
          currentComponent="delete"
          onDeleteEventAction={handleDeleteEvent}
          events={events}
          selectedEvent={selectedEvent} // เพิ่มตรงนี้✅ 
        />
        )}
      </div>
    </div>
  );
}