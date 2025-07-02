"use client"

import React, { useState, useEffect, useRef } from "react"
import Dropdown from "./dropdown";
import DropdownTeacher from "./dropdownTeacher";
import { useMakeupFilter } from "@/context/MakeupFilterContext/page";
import { ClassItem } from "../ClassItem";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
  ({ value, onClick }, ref) => (
    <input
      className="boxT border border-gray-300 rounded-[10px] px-2 py-1 text-sm w-40"
      style={{ height: "29px" }}
      onClick={onClick}
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
    console.log("🔍 ค่าที่จะใช้ค้นหา:");
    console.log("👨‍🏫 teacher:", teacher);
    console.log("📘 semester:", semester);
    console.log("📅 academicYear:", academicYear);
    console.log("🗓️ weekday:", weekday);
    console.log("📆 date:", date);
    if (!teacher || !semester || !academicYear || !weekday || !date) {
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

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-6 items-end">
        <DropdownTeacher
          label="อาจารย์"
          selected={teacher ?? ""}
          setSelected={setTeacher}
        />
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
        <Dropdown
          label="วัน"
          items={weekdayItems}
          selected={weekday}
          setSelected={(val) => setWeekday(String(val))}
        />
        <div>
          <label className="block mb-1 text-sm">วันที่</label>
          <div className="flex items-center">
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
              customInput={<CustomDateInput />}
            />


            <button
              type="button"
              onClick={() => setIsDatePickerOpen(true)}
              className="ml-2 text-gray-500 hover:text-gray-700"
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
        </div>

        <button
          className="mt-auto bg-[#F96D00] h-7 w-28 text-xs px-3 text-white sm:h-7 sm:text-sm sm:px-4 rounded-15px transition hover:bg-white hover:text-[#F96D00]"
          onClick={handleSearch}
        >
          ค้นหา
        </button>
      </div>
    </div>
  );
}
