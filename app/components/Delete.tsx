"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItemGet } from "./ClassItem_getData";
import { useSearchParams } from 'next/navigation';
import { ClassItem } from "./ClassItem";

type DeleteProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onDeleteEventAction: (event: any) => void;
  selectedEvent: ClassItemGet | null;
  events: ClassItem[];
  existingClasses: ClassItem[];
  data?: ClassItemGet | null;
    showPopup: (message: string, type?: "success" | "error") => void; 
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
  onDeleteEventAction,
  selectedEvent,
  existingClasses,
  data,
  showPopup,
}: DeleteProps) {



  const [formData, setFormData] = useState<ClassItem>({
    id: "",
    timetable_id: 0,
    subject_id: "",
    subjectType: "",
    yearLevel: 0,
    degree: 0,
    sec: 0,
    semester: 0,
    academicYear: "",
    weekday: "",
    study: {
      startTime: "",
      endTime: "",
      location: "",
    },
    exam: {
      midterm: {
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      },
      final: {
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      },
    },
    teacher: [],
    role: "",
    teacherName: "",
    teacherSurname: "",
    teacher_id: "",
    subjectName: "",
    credit: 0,
    creditType: "",
  });


  const searchParams = useSearchParams();
  const router = useRouter();
  const timetableId = searchParams.get("timetable_id");

  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState<string>("");

  const [day, setDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [midtermDate, setMidtermDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [studyEndTime, setStudyEndTime] = useState<Date | null>(null);
  const [midtermStartTime, setMidtermStartTime] = useState<Date | null>(null);
  const [midtermEndTime, setMidtermEndTime] = useState<Date | null>(null);
  const [finalStartTime, setFinalStartTime] = useState<Date | null>(null);
  const [finalEndTime, setFinalEndTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
const [showErrorModal, setShowErrorModal] = useState(false);


  const handleAddTeachers = (names: string[]) => {
    const newOnes = names.filter(n => n !== "" && !teachers.includes(n));
    if (newOnes.length > 0) {
      const updated = [...teachers, ...newOnes];
      setTeachers(updated);
      setFormData(prev => ({ ...prev, teacher: updated }));
    }
  };

  useEffect(() => {
    if (data && !selectedEvent) {
      // แปลงอาจารย์ทั้งหมด
      const parsedTeachers = (data.teacher || []).map((full) => {
        const parts = full.trim().split(" ");
        let teacherName = "";
        let teacherSurname = "";

        if (parts.length >= 2) {
          teacherName = parts[parts.length - 2];
          teacherSurname = parts[parts.length - 1];
        } else if (parts.length === 2) {
          teacherName = parts[0];
          teacherSurname = parts[1];
        } else if (parts.length === 1) {
          teacherName = parts[0];
        }

        return { teacherName, teacherSurname };
      });

      const first = parsedTeachers[0] || { teacherName: "", teacherSurname: "" };

      setFormData({
        id: data.id || "",
        timetable_id: data.timetable_id,
        subject_id: data.subject_id,
        subjectName: data.subjectName,
        sec: data.sec,
        teacher: data.teacher_id ? [data.teacher_id] : [],
        weekday: data.weekday,
        subjectType: data.subjectType,
        academicYear: String(data.academicYear),
        yearLevel: data.yearLevel,
        degree: data.degree,
        semester: data.semester,
        teacher_id: data.teacher_id || "",

        // เพิ่ม 3 ฟิลด์หลักจากคนแรก
        role: "",
        teacherName: first.teacherName,
        teacherSurname: first.teacherSurname,

        parsedTeachers, // ใส่อาจารย์ทั้งหมดแบบแยกชื่อ

        credit: data.credit,
        creditType: data.creditType,

        study: {
          location: data.location || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
        },

        exam: {
          midterm: {
            date: data.midterm_date ? data.midterm_date.split('T')[0] : "",
            location: data.midterm_location || "",
            startTime: data.midterm_startTime ? data.midterm_startTime.slice(0, 5) : "",
            endTime: data.midterm_endTime ? data.midterm_endTime.slice(0, 5) : "",
          },
          final: {
            date: data.final_date ? data.final_date.split('T')[0] : "",
            location: data.final_location || "",
            startTime: data.final_startTime ? data.final_startTime.slice(0, 5) : "",
            endTime: data.final_endTime ? data.final_endTime.slice(0, 5) : "",
          },
        },
      });

      const knownRoles = ["ผศ.ดร.", "รศ.ดร.", "รศ.", "ผศ.", "ดร.", "ศ.", "นาย", "นางสาว"];

      const teacherString = (data.teacher || [])
        .map((full) => {
          let nameWithoutRole = full.trim();
          for (const role of knownRoles) {
            if (nameWithoutRole.startsWith(role)) {
              nameWithoutRole = nameWithoutRole.slice(role.length).trim();
              break;
            }
          }
          return nameWithoutRole;
        })
        .join(", ");

      setNewTeacher("");
      console.log(teacherString);

      const namesArray = teacherString.split(",").map((n) => n.trim()).filter(Boolean);
      handleAddTeachers(namesArray);
    }
  }, [data, selectedEvent]);


  const [showModal, setShowModal] = useState(false);

 const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {

    if (!data) {
      alert("ไม่มีข้อมูลสำหรับลบ");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/Timetable/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timetable_id: data.timetable_id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "ลบข้อมูลไม่สำเร็จ");
      }

     showPopup("Successfully deleted data", "success");
      setShowModal(false);
      onDeleteEventAction(selectedEvent); // เรียก callback เพื่อลบข้อมูลในหน้าจอ
      router.replace("/addTable");

    } catch (error: any) {
  const message = error.message || "เกิดข้อผิดพลาดในการลบข้อมูล";
  setErrorMessage(message);
  setShowErrorModal(true);
  console.error(error);
}

  };



  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <div className="delete-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
            <label className=" text-sm py-1">ตารางเรียน</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
              <div className="">
                <label className="block mb-1">รหัสวิชา</label>
                <input type="text" value={formData.subject_id} readOnly className="box" />
              </div>


              <div className="">
                <label className="block mb-1">ประเภทวิชา</label>
                <input type="text" value={formData.subjectType} readOnly className="box" />
              </div>

              <div className="">
                <label className="block mb-1">กลุ่ม</label>
                <input type="number" value={formData.sec ?? ""} readOnly className="box" />
              </div>

              <div className="">
                <label className="block mb-1">วันเรียน</label>
                <input
                  type="text"
                  value={formData.weekday}
                  readOnly
                  className="box"
                />
              </div>

              <div className="">
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={studyStartTime}
                  value={formData.study.startTime}
                  onChange={() => { }}
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
                  selected={studyEndTime}
                  value={formData.study.endTime}
                  onChange={() => { }}
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
                <input type="text" value={formData.study.location} readOnly className="box" />
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
            </div>

            <hr className="border-t-3 border-gray-200 w-full" />
            <label className=" text-sm py-1">สอบกลางภาค</label>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
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
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={midtermStartTime}
                  value={formData.exam.midterm.startTime}
                  onChange={() => { }}
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
                  selected={midtermEndTime}
                  value={formData.exam.midterm.endTime}
                  onChange={() => { }}
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
                <input type="text" value={formData.exam.midterm.location} readOnly className="box" />
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
                        setMidtermDate(date);
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
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={finalStartTime}
                  value={formData.exam.final.startTime}
                  onChange={() => { }}
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
                  selected={finalEndTime}
                  value={formData.exam.final.endTime}
                  onChange={() => { }}
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
                <input type="text" value={formData.exam.final.location} readOnly className="box" />
              </div>

            </div>

            <button
              type="submit"
              className="buttonSub mt-4 bg-red-600 hover:bg-red-700 text-white">
              ลบ
            </button>
          </div>
        </form>
      </div>
      
      {showErrorModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
      <p className="text-sm text-gray-800">{errorMessage}</p>
      <div className="mt-6 text-right">
        <button
          onClick={() => setShowErrorModal(false)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
)}


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">
              ยืนยันการลบ
            </h2>
            <p className="text-gray-700 mb-6">
              ต้องการลบวิชา <span className="font-medium">{selectedEvent?.subjectName}</span> ใช่หรือไม่?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>
             <button
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "กำลังลบ..." : "ลบ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
