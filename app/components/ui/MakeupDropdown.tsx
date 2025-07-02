"use client"

import React, { useState, useEffect, useRef } from "react"
import Dropdown from "./dropdown";
import DropdownTeacher from "./dropdownTeacher";
import { useMakeupFilter } from "@/context/MakeupFilterContext/page";
import { ClassItem } from "../ClassItem";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
  ({ value, onClick, setIsDatePickerOpen }, ref) => (
    <input
      className="boxT border border-gray-300 rounded-[10px] px-2 py-1 text-sm w-40"
      style={{ height: "29px" }}
      onClick={() => {
        setIsDatePickerOpen(true);
        onClick(); // สำคัญมาก เพื่อให้ DatePicker เปิดจริง
      }}
      ref={ref}
      value={value}
      placeholder="เลือก..."
      readOnly
    />
  )
);


type TeacherDropdownProps = {
  selectedEvent: ClassItem | null;
  setSelectedEvent: (event: ClassItem) => void;
  onSearch: (filters: {
    teacher: string;
    semester: string;
    academicYear: string;
    weekday?: string;
    date?: string;
  }) => void;
};

export default function MakeupDropdown({ selectedEvent, setSelectedEvent, onSearch, }: TeacherDropdownProps) {
  const {
    teacher,
    semester,
    academicYear,
    weekday,
    date,
    setTeacher,
    setSemester,
    setacademicYear,
    setWeekday,
    setDate,
  } = useMakeupFilter();


  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const semesterItems = [
    { id: "1", label: "1" },
    { id: "2", label: "2" },
    { id: "3", label: "3" },
  ];

  const weekdayItems = [
    { id: "จันทร์", label: "จันทร์" },
    { id: "อังคาร", label: "อังคาร" },
    { id: "พุธ", label: "พุธ" },
    { id: "พฤหัสบดี", label: "พฤหัสบดี" },
    { id: "ศุกร์", label: "ศุกร์" },
    { id: "เสาร์", label: "เสาร์" },
    { id: "อาทิตย์", label: "อาทิตย์" },
  ];

  const currentYear = new Date().getFullYear() + 543;
  const yearItems = Array.from({ length: 4 }, (_, i) => {
    const y = currentYear - i;
    return { id: y, label: y.toString() };
  });

  const dateItems = Array.from({ length: 31 }, (_, i) => {
    const d = i + 1;
    return { id: d.toString(), label: d.toString() };
  });


  function handleDateChange(d: Date | null) {
    if (d) {
      const formatted = d.toISOString().split("T")[0];
      const dayString = d.toLocaleDateString("en-US", { weekday: "long" });
      setDate(formatted);
      setWeekday(dayString);
    } else {
      setDate("");
      setWeekday("");
    }
    setIsDatePickerOpen(false);
  }

  function convertWeekdayToThai(weekday: string): string {
    const map: { [key: string]: string } = {
      Sunday: "อาทิตย์",
      Monday: "จันทร์",
      Tuesday: "อังคาร",
      Wednesday: "พุธ",
      Thursday: "พฤหัสบดี",
      Friday: "ศุกร์",
      Saturday: "เสาร์",
    };
    return map[weekday] || weekday;
  }


  async function handleSearch() {

    if (  !semester || !academicYear ) {
      alert("กรุณาเลือกให้ครบ อาจารย์, ภาคการศึกษา, ปีการศึกษา, วันม วันที่");
      return;
    }

    console.log("กดปุ่มค้นหา, ส่งค่าไป parent:", { teacher, semester, academicYear, weekday, date });
    // const date2 = addDays(date, 1);
    onSearch({
      teacher: String(teacher),
      semester: String(semester),
      academicYear: String(academicYear),
      weekday: String(weekday),
      date: String(date),
    });

  }
  function handleRemoveTeacher() {
  setTeacher("");
  console.log("🧹 ลบค่าอาจารย์:", "");
}

function handleRemoveDate() {
  setSelectedDate(null);
  setDate("");
  setWeekday("");
  setIsDatePickerOpen(false);
  console.log("🧹 ลบวันที่และวันในสัปดาห์");
}


  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 items-end">
        <span>
          <DropdownTeacher
            label="อาจารย์"
            selected={teacher ?? ""}
            setSelected={setTeacher} />
        </span>
        <div className="pr-2 mt-6">
          <button
            type="button"
            className=" text-gray-700 hover:text-red-500"
            onClick={handleRemoveTeacher}
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

        <div className="flex gap-4">
          <Dropdown
            label="ภาคการศึกษา"
            items={semesterItems}
            selected={semester ?? ""}
            setSelected={setSemester}
          />
          <Dropdown
            label="ปีการศึกษา"
            items={yearItems}
            selected={academicYear ?? ""}
            setSelected={setacademicYear}
          />
        </div>

        <span className="ml-2">
          <Dropdown
            label="วัน"
            items={weekdayItems}
            selected={weekday}
            setSelected={(val) => setWeekday(String(val))}
          />
        </span>
        <div className="pr-2 mt-6">
          <button
            type="button"
            className=" text-gray-700 hover:text-red-500"
            onClick={handleRemoveDate}
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



        <div className="">
          <label className="block mb-1 text-sm">วันที่</label>
          <div className="flex items-center" >
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  // ตั้งเวลาเป็นเที่ยงวัน ป้องกันเวลาเร็วไป 1 วันจาก timezone
                  date.setHours(12, 0, 0, 0);

                  setSelectedDate(date);
                  setIsDatePickerOpen(false);

                  const weekdayEn = date.toLocaleDateString("en-US", { weekday: "long" });
                  const weekdayTh = convertWeekdayToThai(weekdayEn);  // แปลงเป็นภาษาไทย
                  setWeekday(weekdayTh);

                  const formatted = date.toISOString().split("T")[0];
                  setDate(formatted);
                } else {
                  setSelectedDate(null);
                  setWeekday("");
                  setDate("");
                  setIsDatePickerOpen(false);
                }
              }}
              open={isDatePickerOpen}
              onClickOutside={() => setIsDatePickerOpen(false)}
              dateFormat="dd/MM/yyyy"
              customInput={
                <CustomDateInput setIsDatePickerOpen={setIsDatePickerOpen} />
              }
            />

            <button
              type="button"
              onClick={handleRemoveDate}
              className="ml-2 text-gray-500 hover:text-gray-700"
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
        </div>

        <button
          className="mt-auto ml-2 bg-[#F96D00] h-7 w-28 text-xs px-3 text-white sm:h-7 sm:text-sm sm:px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
          onClick={handleSearch}
        >
          ค้นหา
        </button>
      </div>
    </div >
  );
}
