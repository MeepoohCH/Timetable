"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type DeleteProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onDeleteEventAction: (event: any) => void;
  selectedEvent: any | null;
  events: any[];
};

// แปลงวันที่แบบ local
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function Delete({
  onSwitchAction,
  currentComponent,
  onDeleteEventAction,
  selectedEvent,
}: DeleteProps) {
  const pathname = usePathname();
   const isstudyPage = pathname.includes("/studentStudy") || pathname.includes("/teacherStudy")

  // สร้าง state เก็บข้อมูลฟอร์ม เพื่อแสดงข้อมูลของ selectedEvent
  const [formData, setFormData] = useState({
    subject_id: "",
    subjectName: "",
    sec: "",
    location: "",
    date: "",
    weekday: "",
    startTime: "",
    endTime: "",
  });

  // สร้าง state รายชื่ออาจารย์แบบ array
  const [teachers, setTeachers] = useState<string[]>([]);

  // เก็บวันที่และเวลาที่แปลงเป็น Date object เพื่อแสดงใน DatePicker
  const [day, setDay] = useState<Date | null>(null);
  const [startTime, setstartTime] = useState<Date | null>(null);
  const [endTime, setendTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");

  // เมื่อ selectedEvent เปลี่ยน ให้โหลดข้อมูลลงฟอร์ม
  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        subject_id: selectedEvent.subject_id || "",
        subjectName: selectedEvent.subjectName || "",
        sec: selectedEvent.sec || "",
        location: selectedEvent.location || "",
        date: selectedEvent.date || "",
        weekday: selectedEvent.weekday || "",
        startTime: selectedEvent.startTime || "",
        endTime: selectedEvent.endTime || "",
      });

      setTeachers(Array.isArray(selectedEvent.teacher) ? selectedEvent.teacher : []);

      // แปลงวันที่ (string) เป็น Date object สำหรับ DatePicker
      if (selectedEvent.date) {
        const parts = selectedEvent.date.split("-"); // assuming format YYYY-MM-DD
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          setDay(d);
        }
      } else {
        setDay(null);
      }

      // แปลงเวลาเริ่มต้นเป็น Date object
      if (selectedEvent.startTime) {
        const [h, m] = selectedEvent.startTime.split(":");
        const ts = new Date();
        ts.setHours(Number(h), Number(m), 0, 0);
        setstartTime(ts);
      } else {
        setstartTime(null);
      }

      // แปลงเวลาจบเป็น Date object
      if (selectedEvent.endTime) {
        const [h, m] = selectedEvent.endTime.split(":");
        const te = new Date();
        te.setHours(Number(h), Number(m), 0, 0);
        setendTime(te);
      } else {
        setendTime(null);
      }
    } else {
      // เคลียร์ฟอร์มหากไม่มี event ที่เลือก
      setFormData({
        subject_id: "",
        subjectName: "test",
        sec: "",
        location: "",
        date: "",
        weekday: "",
        startTime: "",
        endTime: "",
      });
      setTeachers([]);
      setDay(null);
      setstartTime(null);
      setendTime(null);
      setWeekday("");
    }
  }, [selectedEvent]);

  // ไม่ต้องแก้ไขข้อมูล เพราะเป็น delete แต่ยังโชว์ข้อมูลให้เห็นทั้งหมด

  // กดลบ event
  const handleDelete = () => {
    if (selectedEvent) {
      onDeleteEventAction(selectedEvent);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <div className="edit-form flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-10 text-sm">
          <div className="">
            <label className="block mb-1">รหัสวิชา</label>
            <input type="text" value={formData.subject_id} readOnly className="box" />
          </div>
          <div className="">
            <label className="block mb-1">กลุ่ม</label>
            <input type="text" value={formData.sec} readOnly className="box" />
          </div>

          <div className="">
            <label className="block mb-1">เวลาเริ่ม</label>
            <DatePicker
              selected={startTime}
              onChange={() => {}}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="box pl-4"
              readOnly
              disabled
            />
          </div>

          <div className="">
            <label className="block mb-1">เวลาจบ</label>
            <DatePicker
              selected={endTime}
              onChange={() => {}}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="box pl-4"
              readOnly
              disabled
            />
          </div>

          <div className="">
            <label className="block mb-1">สถานที่</label>
            <input type="text" value={formData.location} readOnly className="box" />
          </div>

          <div className="">
            <label className="block mb-1">วัน</label>
            {isstudyPage ? (
              <input
                type="text"
                value={formData.weekday}
                readOnly
                className="box"
              />
            ) : (
              <DatePicker
                selected={day}
                onChange={() => {}}
                dateFormat="dd/MM/yyyy"
                className="boxDate"
                readOnly
                disabled
              />
            )}
          </div>

          <div className="">
            <label className="block mb-1">อาจารย์</label>
            <div className="flex flex-wrap gap-2 mt-2 w-36">
              {teachers.length === 0 && <p className="text-gray-500">ไม่มีข้อมูลอาจารย์</p>}
              {teachers.map((teacher, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#FFE5CC] text-sm px-2 py-1 rounded"
                >
                  <span>{teacher}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="buttonSub mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            ลบ
          </button>
        </div>
      </form>
    </div>
  );
}
