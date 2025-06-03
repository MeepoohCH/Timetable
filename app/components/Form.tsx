"use client";
import { usePathname } from "next/navigation"; // ✅ เพิ่มบรรทัดนี้
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../globals.css";

type FormProps = {
  mode: "add" | "edit" | "delete";
};

const Form = ({ mode }: FormProps) => {
  const pathname = usePathname(); // ✅ ตรวจ path
  const isstudyPage = pathname.toLowerCase().includes("/study");

  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");
  const [day, setDay] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [timeStart, setTimeStart] = useState<Date | null>(null);
  const [timeFinish, setTimeFinish] = useState<Date | null>(null);

  const handleAddTeacher = () => {
    if (newTeacher.trim() !== "") {
      setTeachers([...teachers, newTeacher.trim()]);
      setNewTeacher("");
    }
  };

  const handleRemoveTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  return (
    <div className={`${mode}-form gridcol`}>
      {/* รหัสวิชา กลุ่ม สถานที่ */}
      <div className="col-span-1">
        <label>รหัสวิชา</label>
        <input name="subjectID" type="text" className="box" />
      </div>
      <div className="col-span-1">
        <label>กลุ่ม</label>
        <input name="sec" type="text" className="box" />
      </div>
      <div className="col-span-1">
        <label>สถานที่</label>
        <input name="location" type="text" className="box" />
      </div>

      {/* เพิ่มอาจารย์ */}
      <div className="col-span-2 row-span-2">
        <label className="block mb-1">อาจารย์</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
            className="boxT"
          />
          <button
            type="button"
            onClick={handleAddTeacher}
            className="px-3 py-1"
          >
            {/* [+] ไอคอน */}
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
              >
                {/* [-] ไอคอน */}
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
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* วัน */}
      <div className="col-span-1">
        <label className="block mb-1">วัน</label>
        {isstudyPage ? (
          <select
            name="weekday"
            value={weekday}
            onChange={(e) => setWeekday(e.target.value)}
            className="box"
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
          <div className="relative w-full">
            <DatePicker
              selected={day}
              onChange={(date: Date | null) => setDay(date)}
              dateFormat="dd/MM/yyyy"
              className="boxDate"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
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

      {/* เวลาเริ่ม / เวลาจบ */}
      <div className="col-span-1">
        <label>เวลาเริ่ม</label>
        <DatePicker
          selected={timeStart}
          onChange={(date: Date | null) => setTimeStart(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="เวลา"
          dateFormat="HH:mm"
          className="box pl-4"
          
        />
      </div>
      <div className="col-span-1">
        <label>เวลาจบ</label>
        <DatePicker
          selected={timeFinish}
          onChange={(date: Date | null) => setTimeFinish(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="เวลา"
          dateFormat="HH:mm"
          className="box pl-4"
        />
      </div>
    </div>
  );
};

export default Form;
