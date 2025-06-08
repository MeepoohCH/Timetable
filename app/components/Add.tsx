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


  const [day, setDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [midtermDate, setMidtermDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [subjectType, setSubjectType] = useState<string>("");


  const [formData, setFormData] = useState({
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: "",
    weekday: "",
    subjectType:"",
    academicYear:"",
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

  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");

  const handleAddTeacher = () => {
    if (newTeacher.trim() !== "") {
      setTeachers([...teachers, newTeacher.trim()]);
      setNewTeacher("");
      setFormData({ ...formData, teacher: "" });  
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTeachers =
    newTeacher.trim() !== "" && !teachers.includes(newTeacher.trim())
      ? [...teachers, newTeacher.trim()]
      : teachers;


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





    onAddEventAction({ 
      ...formData,
      teacher: teachers,
      yearLevel: "2xxx",
      semester: "x",
      subjectName: "Subjectname",
    });


    // reset ฟอร์ม
    setFormData({
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: "",
    weekday: "",
    subjectType:"",
    academicYear:"2xxx",
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
  };
  



  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="add-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
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
                type="text"
                name="sec"
                value={formData.sec}
                onChange={handleChange}
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
                className="box pl-4"
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
                className="box pl-4"
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
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
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
                            midterm: {
                              ...prev.exam.midterm,
                              date: date ? date.toISOString().split("T")[0] : "",
                            },
                          },
                        }));
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="boxT"
                    />
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
                    <DatePicker
                      selected={finalDate}
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
                      className="boxT"
                    />
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
            เพิ่ม
          </button>
          
        </div>
      </form>
    </div>
  );
}
