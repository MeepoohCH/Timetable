"use client";

import { useState, useEffect, useRef } from "react";
import AddTeacher from "./AddTeacher";
import Delete from "./Delete";
import DetailPanel from "./DetailPanel";
import Edit from "./Edit";
import ScheduleTable from "./ui/StudentScheduleTable";
import { ClassItem } from "./ClassItem";
import ExamForm from "./ExamForm";
import EditTeacher from "./EditTeacher";
import DeleteTeacher from "./DeleteTeacher";
import TeacherTable from "./TeacherTable";


export default function TeacherDataForm() { 
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);   // <-- เปลี่ยน type เป็น ClassItem | null
  const [events, setEvents] = useState<ClassItem[]>([]);


async function fetchEvents() {
    try {
      const res = await fetch("/api/Teacher/getData");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setEvents(data.teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }

  
  useEffect(() => {
  fetchEvents(); // fetch ตอน mount ครั้งเดียว
}, []);

  // ฟังก์ชันสำหรับรีเฟรชข้อมูล (ใช้เรียกหลังเพิ่ม/แก้ไข/ลบ)
  const refreshData = async () => {
    await fetchEvents();
  };

   const handleAddEvent = async (newClass: ClassItem) => {
    setExistingClasses(prev => [...prev, newClass]);
    setEvents(prev => [...prev, newClass]);  

    await refreshData(); // ดึงข้อมูลใหม่จาก API
    
  };

  const handleDeleteEvent = async () => {
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
    await refreshData(); // ดึงข้อมูลใหม่จาก API
  };

  const handleEditEvent = async (updatedEvent: ClassItem) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === updatedEvent.id ? updatedEvent : ev
      )
    );
    setSelectedEvent(null);
    await refreshData(); // ดึงข้อมูลใหม่จาก API
  };



  const isActive = (tab: "edit" | "delete" | "add") => currentComponent === tab;
  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);


const [refreshKey, setRefreshKey] = useState(0);
  
const triggerRefresh = () => {
  setRefreshKey(prev => prev + 1);
  console.log("triggerRefresh called!");
};


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
            triggerRefresh={triggerRefresh}
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
        triggerRefresh={triggerRefresh}
       />

        )}
        {currentComponent === "delete" && (
          <DeleteTeacher
          onSwitchAction={switchComponent}
          currentComponent="delete"
          events={events}
          selectedEvent={selectedEvent} 
           triggerRefresh={triggerRefresh}
        />
        )}
      </div>
      <div id="form-section" className="flex-1 mt-8 mx-2 w-full max-w-[1152px]">
        <TeacherTable
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            setSelectedEvent(event);
            setCurrentComponent("edit");

            // เลื่อนหน้าไปยัง form-section
            const formSection = document.getElementById("form-section");
            formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          refreshKey={refreshKey} 
        />
      </div>
    </div>
  );
}