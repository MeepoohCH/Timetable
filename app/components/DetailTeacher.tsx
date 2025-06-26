"use client";

import { useEffect, useState } from "react";
import { ClassItemGet } from "./ClassItem_getData";

type DetailPanelProps = {
    selectedEvent: any | null;
    examType?: "midterm" | "final";
    filters: {
        teacher: string;
        semester: string;
        academicYear: string;
    } | null;
};

export default function DetailPanel({
    selectedEvent,
    examType,
    filters,
}: DetailPanelProps) {
    const [classes, setClasses] = useState<ClassItemGet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🌀 Fetch จาก filters ที่ส่งเข้ามา
    useEffect(() => {
        if (!filters) return;

        const { teacher, semester, academicYear } = filters;

        setLoading(true);
        setError(null);
        if (!teacher || !semester || !academicYear) {
            console.warn("ข้อมูล filter ไม่ครบ");
            return;
        }


        fetch(
            `/api/Timetable/teacherSearch?teacher=${teacher}&semester=${semester}&academicYear=${academicYear}`
        )
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => {
                setClasses(data);
                console.log("📦 Fetched from DetailPanel:", data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [filters]);

    if (!selectedEvent) {
        return (
            <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-4 border-white bg-[#F3F4F6]">
                <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
                    รายละเอียด
                </h2>
                <p className="text-gray-500 text-sm text-center">ไม่มีข้อมูล</p>
            </div>
        );
    }

    const date = examType === "midterm" ? selectedEvent.midterm_date : selectedEvent.final_date;
    const startTime = examType === "midterm" ? selectedEvent.midterm_startTime : selectedEvent.final_startTime;
    const endTime = examType === "midterm" ? selectedEvent.midterm_endTime : selectedEvent.final_endTime;
    const location = examType === "midterm" ? selectedEvent.midterm_location : selectedEvent.final_location;


    return (
        <div className="w-full lg:w-[30%] p-4 rounded-lg shadow border-4 border-white bg-[#F3F4F6]">
            <h2 className="text-xl font-kanit border-b-2 border-white pb-2 mb-2 text-[#616161] text-center">
                รายละเอียด
                {examType === "midterm"
                    ? "การสอบกลางภาค"
                    : examType === "final"
                        ? "การสอบปลายภาค"
                        : "การเรียน"}
            </h2>

            <ul className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-kanit text-[#616161] m-4 leading-relaxed">
                <li className="contents">
                    <span>รหัสวิชา</span>
                    <span>{selectedEvent.subject_id}</span>
                </li>
                <li className="contents">
                    <span>ชื่อวิชา</span>
                    <span>{selectedEvent.subjectName}</span>
                </li>
                <li className="contents">
                    <span>กลุ่ม</span>
                    <span>{selectedEvent.sec}</span>
                </li>
                <li className="contents">
                    <span>ประเภท</span>
                    <span>
                        {selectedEvent.subjectType === "ท"
                            ? "ทฤษฎี"
                            : selectedEvent.subjectType === "ป"
                                ? "ปฏิบัติ"
                                : selectedEvent.subjectType}
                    </span>
                </li>
                <li className="contents">
                    <span>หน่วยกิต</span>
                    <span>
                        {selectedEvent.credit}({selectedEvent.creditType})
                    </span>
                </li>
                <li className="contents">
                    <span>อาจารย์</span>
                    <span className="flex flex-col">
                        {Array.isArray(selectedEvent.teacher)
                            ? selectedEvent.teacher.map((t: string, i: number) => (
                                <span key={i}>{t}</span>
                            ))
                            : selectedEvent.teacher}
                    </span>
                </li>

                {examType ? (
                    <>
                        <li className="contents">
                            <span>วันสอบ</span>
                            <span>{date ? new Date(date).toLocaleDateString("th-TH") : "-"}</span>
                        </li>
                        <li className="contents">
                            <span>เวลา</span>
                            <span>
                                {(startTime && startTime.length >= 5 ? startTime.slice(0, 5) : "-")} - {(endTime && endTime.length >= 5 ? endTime.slice(0, 5) : "-")}
                            </span>
                        </li>

                        <li className="contents">
                            <span>สถานที่</span>
                            <span>{location || "-"}</span>
                        </li>
                    </>
                ) : null}
            </ul>
        </div>
    );
}
