"use client";

import { useState, useEffect, useMemo } from "react";
import { ClassItem } from "./ClassItem";
import SubjectTable from "./SubjectTable";
import AddSubject from "./AddSubject";
import EditSubject from "./EditSubject";
import DeleteSubject from "./DeleteSubject";

type Role = "admin" | "teacher" | "student" | "";

export default function SubjectDataForm() {
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);
  const [events, setEvents] = useState<ClassItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  //   role จาก localStorage
  const [role, setRole] = useState<Role>("");
  useEffect(() => {
    const r = (localStorage.getItem("role") || "") as Role;
    setRole(r);
  }, []);

  const canWrite = role === "admin";     // admin เท่านั้นที่เพิ่ม/แก้ไข/ลบได้
  const canViewOnly = role === "teacher"; // teacher ดูอย่างเดียว

  const tabs = useMemo(() => {
    return canWrite ? (["add", "edit", "delete"] as const) : ([] as const);
  }, [canWrite]);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/Subject/getData");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setEvents(data.subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const refreshData = async () => {
    await fetchEvents();
  };

  const handleAddEvent = async (newClass: ClassItem) => {
    setExistingClasses((prev) => [...prev, newClass]);
    setEvents((prev) => [...prev, newClass]);
    await refreshData();
  };

  const handleDeleteEvent = async (eventToDelete: ClassItem) => {
    if (!eventToDelete) return;
    setEvents((prev) => prev.filter((ev) => ev.subject_id !== eventToDelete.subject_id));
    setSelectedEvent(null);
    await refreshData();
  };

  const handleEditEvent = async (updatedEvent: ClassItem) => {
    setEvents((prev) => prev.map((ev) => (ev.subject_id === updatedEvent.subject_id ? updatedEvent : ev)));
    setSelectedEvent(null);
    await refreshData();
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const switchComponent = (component: "add" | "edit" | "delete") => {
    //   teacher ห้ามสลับไปหน้าแก้ไข/เพิ่ม/ลบ
    if (!canWrite) return;
    setCurrentComponent(component);
  };

  //   ถ้าไม่ใช่ admin แต่ currentComponent ดันเป็น add (default) ให้เปลี่ยนเป็น edit (หรืออะไรก็ได้) แต่เราจะไม่ render ฟอร์มอยู่ดี
  useEffect(() => {
    if (!canWrite) setCurrentComponent("edit");
  }, [canWrite]);

  return (
    <div className="min-h-screen font-kanit">
      {/*   Tabs: แสดงเฉพาะ admin */}
      {canWrite && (
        <div id="form-section" className="scroll-mt-20 pt-6">
          <div className="flex justify-start gap-2 px-6 pt-4font-kanit">
            {tabs.map((tab) => (
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
      )}

      {/*   ฟอร์ม Add/Edit/Delete: render เฉพาะ admin */}
      {canWrite && (
        <div
          id="form-section"
          className="flex-1 p-4 mx-2 shadow scroll-mt-20 bg-[#F3F4F6] border-4 border-white rounded-2xl w-full max-w-[1152px]"
        >
          {currentComponent === "add" && (
            <AddSubject
              onSwitchAction={switchComponent}
              currentComponent="add"
              onAddEventAction={handleAddEvent}
              existingClasses={existingClasses}
              triggerRefresh={triggerRefresh}
            />
          )}

          {currentComponent === "edit" && (
            <EditSubject
              onSwitchAction={switchComponent}
              currentComponent="edit"
              onEditEventAction={handleEditEvent}
              events={events}
              selectedEvent={selectedEvent}
              existingClasses={existingClasses}
              triggerRefresh={triggerRefresh}
              allSubjects={events}
            />
          )}

          {currentComponent === "delete" && (
            <DeleteSubject
              onSwitchAction={switchComponent}
              currentComponent="delete"
              onDeleteEventAction={handleDeleteEvent}
              events={events}
              selectedEvent={selectedEvent}
              triggerRefresh={triggerRefresh}
              allSubjects={events}
            />
          )}
        </div>
      )}

      {/*   ตาราง: ทุก role ดูได้ */}
      <div id="form-section" className="flex-1 mt-8 mx-2 w-full max-w-[1152px]">
        <SubjectTable
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            //   teacher กดแถวแล้ว “อย่าเด้งไป edit”
            if (!canWrite) return;

            setSelectedEvent(event);
            setCurrentComponent("edit");
            const formSection = document.getElementById("form-section");
            formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
}
