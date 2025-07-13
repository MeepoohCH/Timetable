"use client";

import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";
import { useStudentFilter } from "@/context/StudentFilterContext/page"
import Teacherbox from "./Teacherbox";
import { forwardRef } from "react";

type AddProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onAddEventAction: (event: any) => void;
  existingClasses: ClassItem[];
};


//เช็คเวลาทับซ้อน
function isTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}


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
  existingClasses,
}: AddProps) {
  const pathname = usePathname();


  const [day, setDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [midtermDate, setMidtermDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [subjectType, setSubjectType] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);


  // เพิ่ม ref ให้ DatePicker รู้
  const midtermDateRef = useRef<HTMLInputElement>(null);
  const finalDateRef = useRef<HTMLInputElement>(null);
  const [isMidtermOpen, setIsMidtermOpen] = useState(false);
  const [isFinalOpen, setIsFinalOpen] = useState(false);

  const studyStartTimeRef = useRef<HTMLInputElement>(null);
  const midtermStartTimeRef = useRef<HTMLInputElement>(null);
  const finalStartTimeRef = useRef<HTMLInputElement>(null);

  const studyEndTimeRef = useRef<HTMLInputElement>(null);
  const midtermEndTimeRef = useRef<HTMLInputElement>(null);
  const finalEndTimeRef = useRef<HTMLInputElement>(null);
  const [overwriteId, setOverwriteId] = useState<string | undefined>(undefined);


  const { filters } = useStudentFilter()

  console.log("Updated filtersAdd:", filters);

  useEffect(() => {
    if (filters.yearLevel && filters.semester && filters.academicYear) {
      setFormData((prev) => ({
        ...prev,
        yearLevel: filters.yearLevel,
        semester: filters.semester,
        academicYear: filters.academicYear,
        degree: filters.degree ?? null, // เผื่อ degree ยังไม่เลือก
      }))
    }
  }, [filters])

  interface Filters {
    yearLevel?: number | string | null;
    semester?: number | string | null;
    academicYear?: number | string | null;
    degree?: number | string | null;
  }
  type FormData = {
    subject_id: string;
    subjectName: string;
    sec: number | null;
    teacher: string[];
    weekday: string;
    subjectType: string;
    yearLevel: number | string | null;
    semester: number | string | null;
    academicYear: number | string | null;
    degree: number | string | null;
    overwriteId?: string | undefined;
    study: {
      location: string;
      startTime: string;
      endTime: string;
    };
    exam: {
      midterm: {
        date: string;
        location: string;
        startTime: string;
        endTime: string;
      } | null;
      final: {
        date: string;
        location: string;
        startTime: string;
        endTime: string;
      } | null;
    };
  };

  const [formData, setFormData] = useState<FormData>({
    subject_id: "",
    subjectName: "",
    sec: null,
    teacher: [""],
    weekday: "",
    subjectType: "",
    yearLevel: filters.yearLevel || null,
    semester: filters.semester || null,
    academicYear: filters.academicYear || null,
    degree: filters.degree || null,
    overwriteId: undefined,
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: {
        date: "",
        location: "",
        startTime: "",
        endTime: "",
      },
      final: {
        date: "",
        location: "",
        startTime: "",
        endTime: "",
      },
    },
  });




  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");
  const [conflictData, setConflictData] = useState<ClassItem | null>(null);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [showFilterWarning, setShowFilterWarning] = useState(false);
  const [filterErrors, setFilterErrors] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const showPopup = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  const handleAddTeacher = () => {
    if (selectedTeachers.length > 0) {
      // กรองเฉพาะชื่อที่ยังไม่มีใน teachers
      const newTeachers = selectedTeachers.filter(
        (t) => !teachers.includes(t)
      );

      // ถ้าไม่มีชื่อใหม่เลย ไม่ต้องทำอะไร
      if (newTeachers.length === 0) {
        setSelectedTeachers([]);
        return;
      }

      const updatedTeachers = [...teachers, ...newTeachers];

      setTeachers(updatedTeachers);
      setSelectedTeachers([]);

      setFormData({
        ...formData,
        teacher: updatedTeachers,
      });
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

  const handleSecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "sec"
        ? value === "" ? null : Number(value) // ✅ แปลงเฉพาะ sec เป็น number
        : value,
    }));
  };

  const handleFinalExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      exam: {
        ...prev.exam,
        final: prev.exam.final
          ? { ...prev.exam.final, [name]: value }
          : { date: "", location: "", startTime: "", endTime: "", [name]: value }, // ถ้า null ให้สร้างใหม่
      },
    }));
  };

  const handleMidtermExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      exam: {
        ...prev.exam,
        midterm: prev.exam.midterm
          ? { ...prev.exam.midterm, [name]: value }
          : { date: "", location: "", startTime: "", endTime: "", [name]: value },
      },
    }));
  };


  const handleStudyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      study: {
        ...prev.study,
        [name]: value,
      },
    }));
  };



  const resetForm = (filters: Filters = {}) => {
    console.log("resetForm filters:", filters);
    setFormData({
      subject_id: "",
      subjectName: "",
      sec: null,
      teacher: [""],
      weekday: "",
      subjectType: "",
      yearLevel: filters.yearLevel || null,
      semester: filters.semester || null,
      academicYear: filters.academicYear || null,
      degree: filters.degree || null,
      overwriteId: undefined,
      study: {
        location: "",
        startTime: "",
        endTime: "",
      },
      exam: {
        midterm: {
          date: "",
          location: "",
          startTime: "",
          endTime: "",
        },
        final: {
          date: "",
          location: "",
          startTime: "",
          endTime: "",
        },
      },
    });
    setTeachers([]);
    setNewTeacher("");
    setDay(null);
    setStartTime(null);
    setEndTime(null);
    setWeekday("");
    setMidtermDate(null);
    setFinalDate(null);

  }

  useEffect(() => {
    console.log("formData ล่าสุด:", formData)
  }, [formData])




  const getAllTeachers = () => {
    return newTeacher.trim() !== "" && !teachers.includes(newTeacher.trim())
      ? [...teachers, newTeacher.trim()]
      : teachers;
  }


  const submitData = async (
    dataToSend: FormData,
    showPopup: (msg: string, type?: "success" | "error") => void
  ) => {
    try {
      const res = await fetch('/api/Timetable/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409 && result.error) {
          console.log('Conflict data from server:', result.conflictData);
          setConflictData(result.conflictData);
          setShowConflictWarning(true);
        } else {
          showPopup("เกิดข้อผิดพลาด: " + (result.error || "ไม่ทราบสาเหตุ"), "error");
        }
        return false;
      }

      setShowConflictWarning(false);
      setConflictData(null);
      showPopup("เพิ่มตารางเรียนสำเร็จ", "success");
      resetForm(filters);
      return true; // ส่งข้อมูลสำเร็จ
    } catch (err) {
      console.error('❌ เกิดข้อผิดพลาดในการส่งข้อมูล:', err);
      showPopup("เกิดข้อผิดพลาดในการส่งข้อมูล", "error");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTeachers = getAllTeachers();

    // ตรวจสอบทีละช่อง
    const errors: string[] = [];


    if (!formData.subject_id.trim()) errors.push("รหัสวิชา");
    if (!formData.sec) errors.push("กลุ่มเรียน (Sec)");
    if (!formData.weekday.trim()) errors.push("วันเรียน");
    if (!formData.study.startTime.trim()) errors.push("เวลาเริ่มเรียน");
    if (!formData.study.endTime.trim()) errors.push("เวลาสิ้นสุดเรียน");



    if (!filters.yearLevel) errors.push("ชั้นปี");
    if (!filters.semester) errors.push("ภาคการศึกษา");
    if (!filters.academicYear) errors.push("ปีการศึกษา");

    if (errors.length > 0) {
      setFilterErrors(errors);
      setShowFilterWarning(true);
      return;
    }


    // ตรวจสอบเวลาเรียนซ้อน
    for (const cls of existingClasses || []) {
      const hasSameTeacher = cls.teacher.some((t) => allTeachers.includes(t));
      const sameDay = cls.weekday === formData.weekday;

      if (hasSameTeacher && sameDay) {
        if (
          isTimeOverlap(
            cls.study.startTime,
            cls.study.endTime,
            formData.study.startTime,
            formData.study.endTime
          )
        ) {
          console.log("Conflict detected with:", cls);
          setConflictData(cls);
          setShowConflictWarning(true);
          return;
        }
      }
    }

    const dataToSend: FormData = {
      ...formData,
      teacher: allTeachers,
      overwriteId: overwriteId ? String(overwriteId) : undefined,
    };

    const success = await submitData(dataToSend, showPopup);
    if (success) {
      onAddEventAction(dataToSend);
      resetForm(filters);
    }
  };

  const handleOverwrite = async () => {
    if (!conflictData) return;

    const allTeachers = getAllTeachers();
    const id = String(conflictData.timetable_id);

    console.log("📤 handleOverwrite: ส่งข้อมูลพร้อม overwriteId =", id);

    const dataToSend: FormData = {
      ...formData,
      teacher: allTeachers,
      overwriteId: id,  // ให้ backend ลบของเก่าก่อน insert ใหม่
    };

    const success = await submitData(dataToSend, showPopup); // ✅ ต้องเรียก submitData

    if (success) {
      onAddEventAction(dataToSend);
      setShowConflictWarning(false);
    }
  };

const formatDateDisplay = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateForSave = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const CustomDateInput = forwardRef<HTMLInputElement, any>(({ value, onClick }, ref) => (
    <input
      className="boxT"
      ref={ref}
      onClick={onClick}
      value={value}
      readOnly
    />
  ));





  return (
    <>
      <div className="">
        <form onSubmit={handleSubmit}>
          <div className="add-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 ">
            <label className=" text-sm py-1">ตารางเรียน</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
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

              <div className=" ">
                <label className="block mb-1">ประเภทวิชา</label>
                <select
                  name="subjectType"
                  value={formData.subjectType}
                  onChange={(e) => {
                    setSubjectType(e.target.value);
                    handleChange(e);
                  }}
                  className="box"
                  required
                >
                  <option value="">-- เลือกประเภท --</option>
                  <option value="ท">ท</option>
                  <option value="ป">ป</option>
                </select>
              </div>



              <div className="">
                <label className="block mb-1">กลุ่ม</label>
                <input
                  type="number"
                  name="sec"
                  value={formData.sec !== null ? formData.sec : ""}
                  onChange={handleSecChange}
                  className="box"
                  required
                />
              </div>

              <div className=" ">
                <label className="block mb-1">วันเรียน</label>
                <select
                  name="weekday"
                  value={formData.weekday}
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
              </div>

              <div className="">
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={startTime}
                  onChange={(date: Date | null) => {
                    setStartTime(date);
                    setFormData((prev) => ({
                      ...prev,
                      study: {
                        ...prev.study,
                        startTime: date ? formatDateToTimeString(date) : "",
                      },
                    }));
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="HH:mm"
                  customInput={<input ref={studyStartTimeRef} className="boxT pl-4" />}
                />
              </div>


              <div className="col-span-1 text-sm">
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={endTime}
                  onChange={(date: Date | null) => {
                    setEndTime(date);
                    setFormData((prev) => ({
                      ...prev,
                      study: {
                        ...prev.study,
                        endTime: date ? formatDateToTimeString(date) : "",
                      },
                    }));
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="HH:mm"
                  customInput={<input ref={studyEndTimeRef} className="boxT pl-4" />}
                />
              </div>

              <div className="">
                <label className="block mb-1">สถานที่</label>
                <input
                  type="text"
                  name="location"
                  value={formData.study.location}
                  onChange={handleStudyChange}
                  className="box"
                />
              </div>

              <div className="">
                <label className="block mb-1">อาจารย์</label>

                <div className="flex items-center">
                  <Teacherbox
                    selectedTeachers={selectedTeachers}
                    setSelectedTeachers={setSelectedTeachers}
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
                      className="text-gray-500 hover:text-gray-800 cursor-pointer"
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
                        type="button"
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
            </div>


            <hr className="border-t-3 border-gray-200 w-full" />
            <label className=" text-sm py-1">สอบกลางภาค</label>

            <div className="flex flex-col mb-2 gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
              <div className="">
                <label className="block mb-1">วันที่สอบ</label>
                <div className="flex items-center">
                  <DatePicker
                    selected={midtermDate}
                    onChange={(date: Date | null) => {
                      setMidtermDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        exam: {
                          ...prev.exam,
                          midterm: prev.exam.midterm
                            ? {
                              ...prev.exam.midterm,
                              date: date ? formatDateForSave(date) : "",
                            }
                            : {
                              date: date ? formatDateForSave(date) : "",
                              startTime: "",
                              endTime: "",
                              location: "",
                            },
                        },
                      }));

                      setIsMidtermOpen(false);
                    }}
                    open={isMidtermOpen}
                    onClickOutside={() => setIsMidtermOpen(false)}
                    dateFormat="dd/MM/yyyy"
                    customInput={<input ref={midtermDateRef} className="boxT" />}
                  />
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsMidtermOpen(true)}
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

              <div>
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={
                    formData.exam?.midterm?.startTime
                      ? new Date(`1970-01-01T${formData.exam.midterm.startTime}`)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      exam: {
                        ...prev.exam,
                        midterm: {
                          ...(prev.exam?.midterm ?? {
                            startTime: "",
                            endTime: "",
                            date: "",
                            location: "",
                          }),
                          startTime: date ? formatDateToTimeString(date) : "",
                        },
                      },
                    }));
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="HH:mm"
                  customInput={<input ref={midtermStartTimeRef} className="boxT pl-4" />}
                />

              </div>

              <div>
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={
                    formData.exam.midterm?.endTime
                      ? new Date(`1970-01-01T${formData.exam.midterm.endTime}`)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      exam: {
                        ...prev.exam,
                        midterm: {
                          ...(prev.exam.midterm ?? {
                            date: "",
                            startTime: "",
                            endTime: "",
                            location: "",
                          }),
                          endTime: date ? formatDateToTimeString(date) : "",
                        },
                      },
                    }));

                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="HH:mm"
                  customInput={<input ref={midtermEndTimeRef} className="boxT pl-4" />}
                />
              </div>

              <div className="">
                <label className="block mb-1">สถานที่</label>
                <input
                  type="text"
                  name="location"
                  value={formData.exam.midterm?.location ?? ""}
                  onChange={handleMidtermExamChange}
                  className="box"
                />
              </div>
            </div>

            <hr className="border-t-3 border-gray-200 w-full" />
            <label className=" text-sm py-1">สอบปลายภาค</label>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">

              <div className="">
                <label className="block mb-1">วันที่สอบ</label>
                <div className="flex items-center">
                  <DatePicker
                    selected={
                      formData.exam?.final?.date
                        ? new Date(formData.exam.final.date)
                        : null
                    }
                    onChange={(date: Date | null) => {
                      setFinalDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        exam: {
                          ...prev.exam,
                          final: {
                            ...(prev.exam?.final ?? {
                              date: "",
                              startTime: "",
                              endTime: "",
                              location: "",
                            }),
                            date: date ?formatDateForSave(date) : "",
                          },
                        },
                      }));
                      setIsFinalOpen(false);
                    }}
                    open={isFinalOpen}
                    onClickOutside={() => setIsFinalOpen(false)}
                    dateFormat="dd/MM/yyyy"
                    customInput={<input ref={finalDateRef} className="boxT" />}
                  />

                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsFinalOpen(true)}
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

              <div>
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={
                    formData.exam.final?.startTime
                      ? new Date(`1970-01-01T${formData.exam.final.startTime}`)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      exam: {
                        ...prev.exam,
                        final: {
                          ...(prev.exam.final ?? {
                            date: "",
                            startTime: "",
                            endTime: "",
                            location: "",
                          }),
                          startTime: date ? formatDateToTimeString(date) : "",
                        },
                      },
                    }));

                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="HH:mm"
                  customInput={<input ref={finalStartTimeRef} className="boxT pl-4" />}
                />
              </div>

              <div>
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={
                    formData.exam.final?.endTime
                      ? new Date(`1970-01-01T${formData.exam.final.endTime}`)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    setFormData((prev) => ({
                      ...prev,
                      exam: {
                        ...prev.exam,
                        final: prev.exam.final
                          ? { ...prev.exam.final, endTime: date ? formatDateToTimeString(date) : "" }
                          : { date: "", startTime: "", endTime: date ? formatDateToTimeString(date) : "", location: "" },
                      },
                    }));


                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="เวลา"
                  dateFormat="HH:mm"
                  customInput={<input ref={finalEndTimeRef} className="boxT pl-4" />}
                />
              </div>

              <div className="">
                <label className="block mb-1">สถานที่</label>
                <input
                  type="text"
                  name="location"
                  value={formData.exam.final ? formData.exam.final.location : ""}
                  onChange={handleFinalExamChange}
                  className="box"
                />
              </div>
            </div>


            <button type="submit" className="buttonSub" onClick={handleAddTeacher}>
              เพิ่ม
            </button>

          </div>
        </form>
      </div>

      {showConflictWarning && conflictData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl max-w-md w-full space-y-5">
            <h2 className="text-2xl font-semibold text-orange-600 flex items-center gap-2">
              🛈 พบข้อมูลวิชาเรียนซ้ำ
            </h2>

            <div className="text-gray-700 text-md space-y-2 leading-relaxed">
              <p>
                อาจารย์ {" "} <strong className="text-gray-900">{conflictData.teacher.join(", ")}</strong>
                {" "}มีวิชาเรียนในวัน <strong className="text-gray-900">{conflictData.weekday}{" "}</strong>
                เวลา{" "} <strong className="text-gray-900">
                  {conflictData.study.startTime} - {conflictData.study.endTime}{" "} น.{" "}
                </strong>

                ในวิชา <strong className="text-gray-900">
                  รหัส {conflictData.subject_id} {conflictData.subjectName}
                </strong></p>

              <p className="text-red-600 font-medium">
                คุณต้องการจะเขียนทับข้อมูลเดิม หรือยกเลิก?
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowConflictWarning(false)}
              >
                ยกเลิก
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition shadow"
                onClick={handleOverwrite}
              >
                เขียนทับ
              </button>
            </div>
          </div>
        </div>
      )}

      {showFilterWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl max-w-md w-full space-y-5">
            <h2 className="text-2xl font-semibold text-red-600 flex items-center gap-2">
              ⚠️ กรอกข้อมูลไม่ครบ
            </h2>

            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {filterErrors.map((err, i) => (
                <li key={i}> {err}</li>
              ))}
            </ul>

            <div className="flex justify-end">
              <button
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200 shadow"
                onClick={() => setShowFilterWarning(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300
    ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          {toastMessage}
        </div>
      )}


    </>
  );
}
