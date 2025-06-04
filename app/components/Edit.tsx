"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type ClassItem = {
  subject_id: string;
  subjectName: string;
  sec: string;
  teacher: string[];
  weekday: string;
  startTime: string;
  endTime: string;
  location: string;
};

type EditProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onEditEventAction: (updatedEvent: ClassItem) => void;
  selectedEvent: ClassItem | null;
  events: ClassItem[];
};

// ฟังก์ชันแปลงเวลา Date เป็น HH:mm string
function formatDateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function Edit({
  onSwitchAction,
  currentComponent,
  onEditEventAction,
  selectedEvent,
  events,
}: EditProps) {
  const [formData, setFormData] = useState<ClassItem>({
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: [],
    weekday: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent);
      setTeachers(selectedEvent.teacher || []);

      // แปลงเวลา string เป็น Date
      if (selectedEvent.startTime) {
        const [h, m] = selectedEvent.startTime.split(":");
        const d = new Date();
        d.setHours(Number(h), Number(m), 0, 0);
        setStartTime(d);
      } else setStartTime(null);

      if (selectedEvent.endTime) {
        const [h, m] = selectedEvent.endTime.split(":");
        const d = new Date();
        d.setHours(Number(h), Number(m), 0, 0);
        setEndTime(d);
      } else setEndTime(null);
    } else {
      setFormData({
        subject_id: "",
        subjectName: "",
        sec: "",
        teacher: [],
        weekday: "",
        startTime: "",
        endTime: "",
        location: "",
      });
      setTeachers([]);
      setStartTime(null);
      setEndTime(null);
    }
  }, [selectedEvent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeacher = () => {
    if (newTeacher.trim() !== "" && !teachers.includes(newTeacher.trim())) {
      const updated = [...teachers, newTeacher.trim()];
      setTeachers(updated);
      setFormData((prev) => ({ ...prev, teacher: updated }));
      setNewTeacher("");
    }
  };

  const handleRemoveTeacher = (index: number) => {
    const updated = teachers.filter((_, i) => i !== index);
    setTeachers(updated);
    setFormData((prev) => ({ ...prev, teacher: updated }));
  };

  const handleStartTimeChange = (date: Date | null) => {
    setStartTime(date);
    setFormData((prev) => ({
      ...prev,
      startTime: date ? formatDateToTimeString(date) : "",
    }));
  };

  const handleEndTimeChange = (date: Date | null) => {
    setEndTime(date);
    setFormData((prev) => ({
      ...prev,
      endTime: date ? formatDateToTimeString(date) : "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTeachers =
    newTeacher.trim() !== "" && !teachers.includes(newTeacher.trim())
      ? [...teachers, newTeacher.trim()]
      : teachers;


    const requiredFields = [
      formData.subject_id,
      formData.sec,
      formData.location,
      formData.weekday,
      formData.startTime,
      formData.endTime,
    ];
    if (
      requiredFields.some((field) => field.trim() === "") ||
      teachers.length === 0
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง รวมถึงอาจารย์อย่างน้อย 1 คน");
      return;
    }

    onEditEventAction({ ...formData, teacher: teachers });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-10 text-sm">
          <div>
            <label className="block mb-1">รหัสวิชา</label>
            <input
              type="text"
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              className="box"
              required
            />
          </div>

          {/* <div>
            <label className="block mb-1">ชื่อวิชา</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              className="box"
            />
          </div> */}

          <div>
            <label className="block mb-1">กลุ่ม</label>
            <input
              type="text"
              name="sec"
              value={formData.sec}
              onChange={handleChange}
              className="box"
              required
            />
          </div>

          <div>
            <label className="block mb-1">เวลาเริ่ม</label>
            <DatePicker
              selected={startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="box pl-4"
              required
            />
          </div>

          <div>
            <label className="block mb-1">เวลาจบ</label>
            <DatePicker
              selected={endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="box pl-4"
              required
            />
          </div>

          <div>
            <label className="block mb-1">สถานที่</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="box"
              required
            />
          </div>

          <div>
            <label className="block mb-1">วัน</label>
            <select
              name="weekday"
              value={formData.weekday}
              onChange={handleChange}
              className="box"
              required
            >
              <option value="">-- เลือกวัน --</option>
              <option value="จันทร์">จันทร์</option>
              <option value="อังคาร">อังคาร</option>
              <option value="พุธ">พุธ</option>
              <option value="พฤหัส">พฤหัส</option>
              <option value="ศุกร์">ศุกร์</option>
              <option value="เสาร์">เสาร์</option>
              <option value="อาทิตย์">อาทิตย์</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">อาจารย์</label>
            <div className="flex items-center">
              <input
                type="text"
                name="teacher"
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                className="boxT"
              />
              <button
                type="button"
                onClick={handleAddTeacher}
                className="px-2 rounded hover:bg-gray-100"
                title="เพิ่มอาจารย์"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {teachers.map((teacher, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#FFE5CC] text-sm px-2 py-1 rounded"
                >
                  <span>{teacher}</span>
                  <button
                    onClick={() => handleRemoveTeacher(index)}
                    className="ml-2 text-gray-700 hover:text-red-500"
                    title="ลบอาจารย์"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="buttonSub bg-green-600 hover:bg-green-700 text-white px-3 rounded">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
