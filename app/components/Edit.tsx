"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";


type EditProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onEditEventAction: (updatedEvent: ClassItem) => void;
  selectedEvent: ClassItem | null;
  events: ClassItem[];
  existingClasses: ClassItem[]; 
};

function isTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}

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
  existingClasses,
}: EditProps) {
  const [formData, setFormData] = useState<ClassItem>({
    id: "",
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: [],
    weekday: "",
    subjectType:"",
    academicYear:"",
    role:"",
    teacherName:"",
    teacherSurname:"",
    credit: "",
    creditType: "",
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
      final: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
    },
  });

  const [day, setDay] = useState<Date | null>(null);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [subjectType, setSubjectType] = useState<string>("");
  const [midtermDate, setMidtermDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");

  const [conflictData, setConflictData] = useState<ClassItem | null>(null);
  const [showConflictWarning, setShowConflictWarning] = useState(false);


  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent);
      setTeachers(selectedEvent.teacher || []);

     const dateStr =
        selectedEvent.exam?.midterm?.date ||
        selectedEvent.exam?.final?.date;

      if (dateStr) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          setDay(d);
        } else {
          setDay(null);
        }
      } else {
        setDay(null);
      }

      // แปลงเวลาเริ่มต้น
      const startTimeStr =
        selectedEvent.study?.startTime ||
        selectedEvent.exam?.midterm?.startTime ||
        selectedEvent.exam?.final?.startTime;

      if (startTimeStr) {
        const [h, m] = startTimeStr.split(":");
        const ts = new Date();
        ts.setHours(Number(h), Number(m), 0, 0);
        setStartTime(ts);
      } else {
        setStartTime(null);
      }

      // แปลงเวลาสิ้นสุด
      const endTimeStr =
        selectedEvent.study?.endTime ||
        selectedEvent.exam?.midterm?.endTime ||
        selectedEvent.exam?.final?.endTime;

      if (endTimeStr) {
        const [h, m] = endTimeStr.split(":");
        const te = new Date();
        te.setHours(Number(h), Number(m), 0, 0);
        setEndTime(te);
      } else {
        setEndTime(null);
      }
    } else {
    setFormData({
    id: "",
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: [],
    weekday: "",
    subjectType:"",
    academicYear:"2xxx",
    role:"",
    teacherName:"",
    teacherSurname:"",
    credit: "",
    creditType: "",
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
      final: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
    },
    });
    setTeachers([]);
    setNewTeacher("");
    setNewTeacher("");
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

  const handleFinalExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      exam: {
        ...prev.exam,
        final: {
          ...prev.exam.final,
          [name]: value,
        },
      },
    }));
  };

    const handleMidtermExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        exam: {
          ...prev.exam,
          midterm: {
            ...prev.exam.midterm,
            [name]: value,
          },
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
  
  const resetForm = () => {
    setFormData({
    id: "",
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: [],
    weekday: "",
    subjectType:"",
    academicYear:"2xxx",
    role:"",
    teacherName:"",
    teacherSurname:"",
    credit: "",
    creditType: "",
    study: {
      location: "",
      startTime: "",
      endTime: "",
    },
    exam: {
      midterm: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
      final: {
        date:"",
        location: "",
        startTime: "",
        endTime: "",
      },
    },
    });
    setTeachers([]);
    setNewTeacher("");
    setDay(null);
    setNewTeacher("");
    setStartTime(null);
    setEndTime(null);
    setWeekday("");
    setMidtermDate(null);
    setFinalDate(null);
   }

  const getAllTeachers = () => {
    return teachers;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTeachers = getAllTeachers();



    const requiredFieldsStudy = [
      formData.subject_id,
      formData.sec,
      formData.study.location,
      formData.weekday,
      formData.study.startTime,
      formData.study.endTime,
    ];

    const requiredFieldsExamMid = [
      formData.exam.midterm.date,
      formData.exam.midterm.location,
      formData.exam.midterm.startTime,
      formData.exam.midterm.endTime,
    ];

    const requiredFieldsExamFinal = [
      formData.exam.final.date,
      formData.exam.final.location,
      formData.exam.final.startTime,
      formData.exam.final.endTime,
    ];


    const isStudyValid = requiredFieldsStudy.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );

    const isMidtermValid = requiredFieldsExamMid.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );

    const isFinalValid = requiredFieldsExamFinal.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );


    if (!isStudyValid) {
      alert("กรุณากรอกข้อมูลในส่วนของตารางเรียนให้ครบถ้วน");
      return;
    }

    if (!isMidtermValid) {
      alert("กรุณากรอกข้อมูลในส่วนของสอบกลางภาคให้ครบถ้วน");
      return;
    }

    if (!isFinalValid) {
      alert("กรุณากรอกข้อมูลในส่วนของสอบปลายภาคให้ครบถ้วน");
      return;
    }

    for (const cls of existingClasses || []) {
      if (selectedEvent && cls.subject_id === selectedEvent.subject_id) continue; // ข้ามตัวเอง

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


    onEditEventAction({
      ...formData, 
      teacher: allTeachers 
    });

    resetForm()
  };

  const handleOverwrite = () => {
    if (!conflictData) return;

    const allTeachers = getAllTeachers();

    onEditEventAction({
      ...formData,
      teacher: allTeachers,
      overwriteId: conflictData.subject_id,
    } as ClassItem & {overwriteId?:string});

    setShowConflictWarning(false);
    setConflictData(null);
    resetForm()
  };

  return (
  <>
    <div>
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className=" text-sm py-1">ตารางเรียน</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
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
              <label className="block mb-1">วันเรียน</label>
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

            <div className="">
              <label className="block mb-1">เวลาเริ่ม</label>
              <DatePicker
                selected={startTime}
                value={formData.study.startTime}
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
                className="box pl-4"
              />
            </div>


            <div className="col-span-1 text-sm">
              <label className="block mb-1">เวลาจบ</label>
              <DatePicker
                selected={endTime}
                value={formData.study.endTime}
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
                className="box pl-4"
              />
            </div>

            <div>
              <label className="block mb-1">สถานที่</label>
              <input
                type="text"
                name="location"
                value={formData.study.location}
                onChange={handleChange}
                className="box"
                required
              />
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
          </div>
          
          <hr className="border-t-3 border-gray-200 w-full" />
          <label className=" text-sm py-1">สอบกลางภาค</label>

          <div className="flex flex-col mb-2 gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <div className="">
              <label className="block mb-1">วันที่สอบ</label>
                <div className="flex items-center">
                  <div className="boxT">
                    <DatePicker
                      selected={midtermDate}
                      value={formData.exam.midterm.date}
                      onChange={(date: Date | null) => {
                        setMidtermDate(date);
                        setFormData((prev) => ({
                          ...prev,
                          exam: {
                            ...prev.exam,
                            midterm: {
                              ...prev.exam.midterm,
                              date: date ? date.toISOString().split("T")[0] : "",
                            },
                          },
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
            </div>

            <div>
              <label className="block mb-1">เวลาเริ่ม</label>
              <DatePicker
                selected={
                  formData.exam.midterm.startTime
                    ? new Date(`1970-01-01T${formData.exam.midterm.startTime}`)
                    : null
                }
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    exam: {
                      ...prev.exam,
                      midterm: {
                        ...prev.exam.midterm,
                        startTime: date ? formatDateToTimeString(date) : "",
                        endTime: prev.exam.midterm.endTime, // รักษาค่าเดิมไว้
                        location: prev.exam.midterm.location,
                      },
                    },
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

            <div>
              <label className="block mb-1">เวลาจบ</label>
              <DatePicker
                selected={
                  formData.exam.midterm.endTime
                    ? new Date(`1970-01-01T${formData.exam.midterm.endTime}`)
                    : null
                }
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    exam: {
                      ...prev.exam,
                      midterm: {
                        ...prev.exam.midterm,
                        endTime: date ? formatDateToTimeString(date) : "",
                        startTime: prev.exam.midterm.startTime,
                        location: prev.exam.midterm.location,
                      },
                    },
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
                value={formData.exam.midterm.location}
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
                  <div className="boxT">
                    <DatePicker
                      selected={finalDate}
                      value={formData.exam.final.date}
                      onChange={(date: Date | null) => {
                        setFinalDate(date);
                        setFormData((prev) => ({
                          ...prev,
                          exam: {
                            ...prev.exam,
                            final: {
                              ...prev.exam.final,
                              date: date ? date.toISOString().split("T")[0] : "",
                            },
                          },
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
            </div>

            <div>
              <label className="block mb-1">เวลาเริ่ม</label>
              <DatePicker
                selected={
                  formData.exam.final.startTime
                    ? new Date(`1970-01-01T${formData.exam.final.startTime}`)
                    : null
                }
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    exam: {
                      ...prev.exam,
                      final: {
                        ...prev.exam.final,
                        startTime: date ? formatDateToTimeString(date) : "",
                        endTime: prev.exam.final.endTime,
                        location: prev.exam.final.location,
                      },
                    },
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

            <div>
              <label className="block mb-1">เวลาจบ</label>
              <DatePicker
                selected={
                  formData.exam.final.endTime
                    ? new Date(`1970-01-01T${formData.exam.final.endTime}`)
                    : null
                }
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    exam: {
                      ...prev.exam,
                      final: {
                        ...prev.exam.final,
                        endTime: date ? formatDateToTimeString(date) : "",
                        startTime: prev.exam.final.startTime,
                        location: prev.exam.final.location,
                      },
                    },
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
                value={formData.exam.final.location}
                onChange={handleFinalExamChange}
                className="box"
              />
            </div>
          </div>


          <button type="submit" className="buttonSub" onClick={handleAddTeacher}>
            แก้ไข
          </button>
        </div>
      </form>
    </div>


        {showConflictWarning && conflictData && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">พบข้อมูลวิชาเรียนซ้ำ</h2>
          <p>
            อาจารย์ <strong>{conflictData.teacher.join(", ")}</strong> มีวิชาเรียนในวัน{" "}
            <strong>{conflictData.weekday}</strong> เวลา{" "}
            <strong>
              {conflictData.study.startTime} - {conflictData.study.endTime}
            </strong>{" "}
            อยู่แล้ว
          </p>
          <p>คุณต้องการจะเขียนทับข้อมูลเดิม หรือ ยกเลิก?</p>

          <div className="mt-6 flex justify-end gap-4">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => setShowConflictWarning(false)}
            >
              ยกเลิก
            </button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded"
              onClick={handleOverwrite}
            >
              เขียนทับ
            </button>
          </div>
        </div>
      </div>
    )}
    
  </>
  );
}