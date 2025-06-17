"use client";

import { useState } from "react";
import Add from "../components/Add";
import Calendar from "../components/TeacherCalendar";
import Delete from "../components/Delete";
import DetailPanel from "../components/DetailPanel";
import Edit from "../components/Edit";

export default function ExamForm() { 
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  const handleAddEvent = (event: any) => setEvents((prev) => [...prev, event]);
  const handleDeleteEvent = (updatedEvents: any[]) => setEvents(updatedEvents);
  const handleEditEvent = (updatedEvent: any) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.subject_id === updatedEvent.subject_id ? updatedEvent : ev
      )
    );
    setSelectedEvent(null); // reset event ที่เลือกหลังแก้ไข
  };

  const isActive = (tab: "edit" | "delete" | "add") => currentComponent === tab;
  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);



  return (
    <div className=" min-h-screen font-kanit">
      <div className=" pt-6">
        <div className="flex justify-start gap-2 px-6 pt-4font-kanit ">
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

      <div className="flex-1 p-4 mx-2 shadow bg-[#F3F4F6] border-4 border-white font-kanit rounded-2xl w-full max-w-[1152px]">



        {currentComponent === "add" && (
          <Add
            onSwitchAction={switchComponent}
            currentComponent="add"
            onAddEventAction={handleAddEvent}
          />
        )}
        {currentComponent === "edit" && (
         <Edit
         onSwitchAction={switchComponent}
         currentComponent="edit"
         onEditEventAction={handleEditEvent}
         events={events}
         selectedEvent={selectedEvent}
       />

        )}
        {currentComponent === "delete" && (
          <Delete
          onSwitchAction={switchComponent}
          currentComponent="delete"
          onDeleteEventAction={handleDeleteEvent}
          events={events}
          selectedEvent={selectedEvent} // ✅ เพิ่มตรงนี้
        />
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-8 mx-2">
      <Calendar
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            setSelectedEvent(event);
            setCurrentComponent("edit"); // เปลี่ยนเป็นหน้า edit อัตโนมัติ
          }}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          events={events}
        />

        <DetailPanel selectedEvent={selectedEvent} />
      </div>
    </div>
  );
}