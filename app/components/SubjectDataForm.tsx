"use client";

import { useEffect, useMemo, useState } from "react";
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

  // ✅ role จาก server/session (JWT cookie)
  const [role, setRole] = useState<Role>("");
  const [loadingRole, setLoadingRole] = useState(true);
  const [roleError, setRoleError] = useState<string>("");

  const canWrite = role === "admin"; // admin เท่านั้นที่เพิ่ม/แก้ไข/ลบได้

  const tabs = useMemo(() => {
    return canWrite ? (["add", "edit", "delete"] as const) : ([] as const);
  }, [canWrite]);

  useEffect(() => {
    let alive = true;

    async function loadRole() {
      try {
        setLoadingRole(true);
        setRoleError("");

        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load session");

        const data = await res.json();
        if (!alive) return;

        if (!data?.loggedIn) {
          setRole("");
          return;
        }

        setRole((data.role || "") as Role);
      } catch (err) {
        if (!alive) return;
        setRole("");
        setRoleError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!alive) return;
        setLoadingRole(false);
      }
    }

    loadRole();
    return () => {
      alive = false;
    };
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/Subject/getData", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setEvents(data.subjects || []);
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
    setEvents((prev) =>
      prev.map((ev) => (ev.subject_id === updatedEvent.subject_id ? updatedEvent : ev))
    );
    setSelectedEvent(null);
    await refreshData();
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const switchComponent = (component: "add" | "edit" | "delete") => {
    if (!canWrite) return; // teacher/student ห้ามสลับไปหน้าเพิ่ม/แก้ไข/ลบ
    setCurrentComponent(component);
  };

  // ✅ กัน UI กระพริบตอนโหลด role
  if (loadingRole) {
    return (
      <div className="min-h-screen font-kanit flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลดสิทธิ์ผู้ใช้...</div>
      </div>
    );
  }

  const showRoleWarning = roleError && role === "";

  return (
    <div className="min-h-screen font-kanit">
      {showRoleWarning && (
        <div className="mx-2 mt-4 w-full max-w-[1152px] p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
          โหลด session ไม่สำเร็จ: {roleError} (จะแสดงแบบดูอย่างเดียว)
        </div>
      )}

      {/* ✅ Tabs: แสดงเฉพาะ admin */}
      {canWrite && (
        <div id="form-tabs" className="scroll-mt-20 pt-6">
          <div className="flex justify-start gap-2 px-6 pt-4 font-kanit">
            {tabs.map((tab) => (
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
        </div>
      )}

      {/* ✅ ฟอร์ม Add/Edit/Delete: render เฉพาะ admin */}
      {canWrite && (
        <div
          id="form-panel"
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

      {/* ✅ ตาราง: ทุก role ดูได้ */}
      <div id="table-section" className="flex-1 mt-8 mx-2 w-full max-w-[1152px]">
        <SubjectTable
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            // teacher/student กดแถวแล้ว “อย่าเด้งไป edit”
            if (!canWrite) return;

            setSelectedEvent(event);
            setCurrentComponent("edit");

            const formSection = document.getElementById("form-panel");
            formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
}