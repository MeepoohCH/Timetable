"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type EditProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onEditEventAction: (event: any) => void;
  events: any[];
  selectedEvent: any | null; // 👈 เพิ่ม
};


// ✅ ฟังก์ชันแปลงวันที่แบบ local (แก้ปัญหาวันเลื่อน)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Edit({
  onSwitchAction,
  currentComponent,
  onEditEventAction,
}: EditProps) {
  const pathname = usePathname();
  const isstudyPage = pathname.includes("/studentStudy") || pathname.includes("/teacherStudy")

  const [day, setDay] = useState<Date | null>(null);
  const [startTime, setstartTime] = useState<Date | null>(null);
  const [endTime, setendTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");

  const [formData, setFormData] = useState({
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");

  const handleAddTeacher = () => {
    if (newTeacher.trim() !== "") {
      setTeachers([...teachers, newTeacher.trim()]);
      setNewTeacher("");
    }
  };

  const handleRemoveTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditEventAction({ ...formData, teacher: teachers });
    // reset ฟอร์ม
    setFormData({
      subject_id: "",
      subjectName: "test",
      sec: "",
      teacher: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
    });
    setTeachers([]);
    setDay(null);
    setstartTime(null);
    setendTime(null);
  };

  function formatDateToTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  const requiredFields = [
    formData.subject_id,
    formData.sec,
    formData.location,
    isstudyPage ? weekday : formData.date,
    formData.startTime,
    formData.endTime,
  ];


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-10 text-sm">
          <div className="">
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
          <div className="">
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

          <div className="">
            <label className="block mb-1">เวลาเริ่ม</label>
            <DatePicker
              selected={startTime}
              onChange={(date: Date | null) => {
                setstartTime(date);
                setFormData((prev) => ({
                  ...prev,
                  startTime: date ? formatDateToTimeString(date) : "",
                }));
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="box pl-4"
              required
            />
          </div>

          <div className="">
            <label className="block mb-1">เวลาจบ</label>
            <DatePicker
              selected={endTime}
              onChange={(date: Date | null) => {
                setendTime(date);
                setFormData((prev) => ({
                  ...prev,
                  endTime: date ? formatDateToTimeString(date) : "",
                }));
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="เวลา"
              dateFormat="HH:mm"
              className="box pl-4"
              required
            />
          </div>

          <div className="">
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

          <div className="">
            <label className="block mb-1">วัน</label>
            {isstudyPage ? (
              <select
                name="weekday"
                value={weekday}
                onChange={(e) => {
                  setWeekday(e.target.value);
                  handleChange(e);
                }}
                className="box"
                required
              >
                <option value="">-- เลือกวัน --</option>
                <option value="monday">จันทร์</option>
                <option value="tuesday">อังคาร</option>
                <option value="wednesday">พุธ</option>
                <option value="thursday">พฤหัส</option>
                <option value="friday">ศุกร์</option>
                <option value="saturday">เสาร์</option>
                <option value="sunday">อาทิตย์</option>
              </select>
            ) : (
              <div className="flex items-center">
                <div className="boxT">
                  <DatePicker
                    selected={day}
                    onChange={(date: Date | null) => {
                      setDay(date);
                      setFormData((prev) => ({
                        ...prev,
                        date: date ? formatDateLocal(date) : "",
                      }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="outline-none w-full bg-transparent"
                    required
                  />
                </div>
                <div
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    document
                      .querySelector<HTMLInputElement>(
                        ".react-datepicker__input-container input"
                      )
                      ?.focus()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-2 row-span-2">
            <label className="block mb-1">อาจารย์</label>
            <div className="flex items-center">
              <input
                type="text"
                name="teacher"
                value={formData.teacher}
                onChange={(e) => {
                  handleChange(e);
                  setNewTeacher(e.target.value);
                }}
                className="boxT
                required"
              />
              <button type="button" onClick={handleAddTeacher} className="px-2 rounded hover:bg-gray-100">
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
                <div key={index} className="flex items-center bg-[#FFE5CC] text-sm px-2 py-1 rounded">
                  <span>{teacher}</span>
                  <button
                    onClick={() => handleRemoveTeacher(index)}
                    className="ml-2 text-gray-700 hover:text-red-500"
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

          <button type="submit" className="buttonSub">
            แก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}
