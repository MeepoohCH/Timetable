"use client";

import { useState } from "react";
import AddTeacher from "./AddTeacher";
import Calendar from "./TeacherCalendar";
import Delete from "./Delete";
import DetailPanel from "./DetailPanel";
import Edit from "./Edit";
import ScheduleTable from "./ui/StudentScheduleTable";
import { ClassItem } from "./ClassItem";
import ExamForm from "./ExamForm";
import EditTeacher from "./EditTeacher";
import DeleteTeacher from "./DeleteTeacher";
import TableDemo  from "./TeacherTable";
import TeacherTable from "./TeacherTable";


export default function TeacherDataForm() { 
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

    console.log("ลบ event:", selectedEvent);

    setEvents((prev) =>
      prev.filter((ev) =>
        !(
          ev.id === selectedEvent.id
        )
      )
    );

    setSelectedEvent(null); // clear class ที่ถูกเลือกหลังลบ
  };

  const handleEditEvent = (updatedEvent: ClassItem) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === updatedEvent.id ? updatedEvent : ev
      )
    );
    setSelectedEvent(null);
  };



  const isActive = (tab: "edit" | "delete" | "add") => currentComponent === tab;
  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);



  return (
    <div className=" min-h-screen font-kanit">
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
          <AddTeacher
            onSwitchAction={switchComponent}
            currentComponent="add"
            onAddEventAction={handleAddEvent}
            existingClasses={existingClasses}
          />
        )}
        {currentComponent === "edit" && (
         <EditTeacher
         onSwitchAction={switchComponent}
         currentComponent="edit"
         onEditEventAction={handleEditEvent}
         events={events}
         selectedEvent={selectedEvent}
         existingClasses={existingClasses}
       />

        )}
        {currentComponent === "delete" && (
          <DeleteTeacher
          onSwitchAction={switchComponent}
          currentComponent="delete"
          onDeleteEventAction={handleDeleteEvent}
          events={events}
          selectedEvent={selectedEvent} 
        />
        )}
      </div>
      <div id="form-section" className="flex-1 mt-8 mx-2 w-full max-w-[1152px]">
        <TeacherTable
          classes={Array.isArray(events) ? events : []}
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            setSelectedEvent(event);
            setCurrentComponent("edit");
            const formSection = document.getElementById("form-section");
            formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>
    </div>
  );
}