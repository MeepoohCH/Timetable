"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type AddProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onAddEventAction: (event: any) => void;
  
};

// ✅ ฟังก์ชันแปลงวันที่แบบ local (แก้ปัญหาวันเลื่อน)
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

export default function Add({
  onSwitchAction,
  currentComponent,
  onAddEventAction,
}: AddProps) {
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
    subjectType:"",
    academicYear:"",
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

    const allTeachers =
    newTeacher.trim() !== "" && !teachers.includes(newTeacher.trim())
      ? [...teachers, newTeacher.trim()]
      : teachers;


    const requiredFields = [
      formData.subject_id,
      formData.sec,
      formData.location,
      isstudyPage ? weekday : formData.date,
      formData.startTime,
      formData.endTime,
    ];
    if (requiredFields.some((field) => field.trim() === "") || allTeachers.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง รวมถึงอาจารย์อย่างน้อย 1 คน");
      return;
    }




    onAddEventAction({ 
      ...formData,
      teacher: teachers,
      weekday: isstudyPage ? weekday : "",
      // ใส่ฟิกค่าเข้าไปเพื่อให้ได้เห็นใน ui แต่จริงๆต้องไปดึงเอาจาก DB
      subjectName: "subjectName",
      subjectType: "ท/ป",
      academicYear: "2xxx"
    });


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
      subjectType:"ท/ป",
      academicYear:"2xxx",
    });
    setTeachers([]);
    setNewTeacher("");
    setDay(null);
    setNewTeacher("");
    setstartTime(null);
    setendTime(null);
    setWeekday("");
  };
  



  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="add-form  flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-10 text-sm">
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
            />
          </div>


        <div className="col-span-1 text-sm">
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
            />
          </div>

          <div className=" ">
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
                <option value="จันทร์">จันทร์</option>
                <option value="อังคาร">อังคาร</option>
                <option value="พุธ">พุธ</option>
                <option value="พฤหัส">พฤหัส</option>
                <option value="ศุกร์">ศุกร์</option>
                <option value="เสาร์">เสาร์</option>
                <option value="อาทิตย์">อาทิตย์</option>
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
                  />
                </div>
                <button
                  type="button"
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
                </button>
              </div>
            )}
          </div>

          <div className="">
            <label className="block mb-1">อาจารย์</label>

            <div className="flex items-center">
              <input
                type="text"
                name="teacher"
                value={newTeacher}
                onChange={(e) => {
                  handleChange(e);
                  setNewTeacher(e.target.value);
                }}
                className="boxT"
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


          <button type="submit" className="buttonSub" onClick={handleAddTeacher}>
            เพิ่ม
          </button>
        </div>
      </form>
    </div>
  );
}
