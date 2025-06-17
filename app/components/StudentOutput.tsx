"use client";

import { useState } from "react";
import StudentCalendar from "./StudentCalendar";
import DetailPanel from "../components/DetailPanel";
import StudentScheduleTable from "./ui/StudentScheduleTable";
import { ClassItem } from "./ClassItem";

export default function StudentOutput() { 
  const [existingClasses, setExistingClasses] = useState<ClassItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<"add" | "edit" | "delete">("add");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);   // <-- เปลี่ยน type เป็น ClassItem | null
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ClassItem[]>([]);

    return (
        <div className="">
            {/* ตารางเรียน */}
            <div id="schedule-section" className="w-full max-w-6xl scroll-mt-20 mt-8 px-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">📅 ตารางเรียน</h2>

            </div>
            <div
            className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2"
            >
            <StudentScheduleTable
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

            {/* ตารางสอบกลางภาค */}
            <div id="midterm-section" className="w-full scroll-mt-20 max-w-6xl mt-8 px-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">📝 ตารางสอบกลางภาค</h2>
            </div>
            <div
            className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2"
            >
            <StudentCalendar
                selectedEvent={selectedEvent}
                setSelectedEvent={(event) => {
                setSelectedEvent(event);
                setCurrentComponent("edit");
                }}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                events={events}
                examType="midterm"
            />
            <DetailPanel examType="midterm" selectedEvent={selectedEvent} />
            </div>

            {/* ตารางสอบปลายภาค */}
            <div id="final-section" className="w-full scroll-mt-20 max-w-6xl mt-8 px-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">📝 ตารางสอบปลายภาค</h2>
            </div>
            <div
            className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center mt-2 mx-2"
            >
            <StudentCalendar
                selectedEvent={selectedEvent}
                setSelectedEvent={(event) => {
                setSelectedEvent(event);
                setCurrentComponent("edit");
                }}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                events={events}
                examType="final"
            />
            <DetailPanel examType="final" selectedEvent={selectedEvent} />
            </div>
        </div>
    )
}