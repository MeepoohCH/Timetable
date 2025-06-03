"use client";

import { useState } from "react";
import Add from "../components/Add";
import Delete from "../components/Delete";
import Edit from "../components/Edit";

export default function Student() {
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [events, setEvents] = useState<any[]>([]);

  const handleAddEvent = (event: any) => setEvents((prev) => [...prev, event]);
  const handleDeleteEvent = (updatedEvents: any[]) => setEvents(updatedEvents);
  const handleEditEvent = (updatedEvents: any[]) => setEvents(updatedEvents);
  const isActive = (tab: "edit" | "delete" | "add") => currentComponent === tab;
  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-kanit">
      <div className=" pt-6 bg-[#F3F4F6]">
        <div className="flex justify-start gap-2 px-10 pt-4 bg-[#F3F4F6] font-kanit ">
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

      <div className="flex-1 p-4 mx-8 shadow bg-[#F3F4F6] border-4 border-white font-kanit rounded-2xl">
        {currentComponent === "add" && (
          <Add
            onSwitch={switchComponent}
            currentComponent="add"
            onAddEvent={handleAddEvent}
          />
        )}
        {currentComponent === "edit" && (
          <Edit
            onSwitch={switchComponent}
            currentComponent="edit"
            onEditEvent={handleEditEvent}
            events={events}
          />
        )}
        {currentComponent === "delete" && (
          <Delete
            onSwitch={switchComponent}
            currentComponent="delete"
            onDeleteEvent={handleDeleteEvent}
            events={events}
          />
        )}
      </div>
    </div>
  );
}
