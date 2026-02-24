"use client";

import { useEffect, useMemo, useState } from "react";
import AddTeacher from "./AddTeacher";
import EditTeacher from "./EditTeacher";
import DeleteTeacher from "./DeleteTeacher";
import TeacherTable from "./TeacherTable";
import { ClassItem } from "./ClassItem";

type Role = "admin" | "teacher" | "student" | "";

export default function TeacherDataForm() {
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);
  const [events, setEvents] = useState<ClassItem[]>([]);

  // role / permission (มาจาก server)
  const [role, setRole] = useState<Role>("");
  const [loadingRole, setLoadingRole] = useState(true);
  const [roleError, setRoleError] = useState<string>("");

  const canWrite = role === "admin";

  const tabs = useMemo(() => {
    return canWrite ? (["add", "edit", "delete"] as const) : ([] as const);
  }, [canWrite]);

  // ✅ โหลด role จาก server/session (JWT cookie)
  useEffect(() => {
    let alive = true;

    async function loadRole() {
      try {
        setLoadingRole(true);
        setRoleError("");

        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          // 401/500 อื่น ๆ
          throw new Error("Failed to load session");
        }

        const data = await res.json();

        if (!alive) return;

        if (!data?.loggedIn) {
          setRole("");
          // ถ้าคุณอยาก redirect ไปหน้า login ก็ทำได้:
          // window.location.href = "/login";
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
      const res = await fetch("/api/Teacher/getData", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setEvents(data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
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

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
    setSelectedEvent(null);
    await refreshData();
  };

  const handleEditEvent = async (updatedEvent: ClassItem) => {
    setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
    setSelectedEvent(null);
    await refreshData();
  };

  const switchComponent = (component: "add" | "edit" | "delete") => setCurrentComponent(component);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ ถ้ากำลังโหลด role กัน UI กระพริบ / กันคลิกเพี้ยนช่วงแรก
  if (loadingRole) {
    return (
      <div className="min-h-screen font-kanit flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลดสิทธิ์ผู้ใช้...</div>
      </div>
    );
  }

  // (optional) แสดง error แบบนุ่ม ๆ
  // ยังให้ดูตารางได้ แต่จะเขียนไม่ได้เพราะ role เป็น ""
  // คุณจะเลือก redirect ไป /login ก็ได้
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
                onClick={() => switchComponent(tab)}
                className={`px-6 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 
                  ${
                    currentComponent === tab
                      ? "bg-white text-orange-500 border-t-4 border-x-4 border-white border-b-0"
                      : "bg-transparent text-gray-500 hover:text-orange-500"
                  }`}
                type="button"
              >
                {tab === "add" ? "เพิ่ม" : tab === "edit" ? "แก้ไข" : "ลบ"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Form: แสดงเฉพาะ admin */}
      {canWrite && (
        <div
          id="form-panel"
          className="flex-1 p-4 mx-2 shadow scroll-mt-20 bg-[#F3F4F6] border-4 border-white rounded-2xl w-full max-w-[1152px]"
        >
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
      )}

      {/* ✅ Table: ทุก role ที่เข้าหน้านี้ได้ "ดูได้" */}
      <div className="flex-1 mt-8 mx-2 w-full max-w-[1152px]">
        <TeacherTable
          selectedEvent={selectedEvent}
          setSelectedEvent={(event) => {
            // teacher ดูได้ แต่แก้ไขไม่ได้
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