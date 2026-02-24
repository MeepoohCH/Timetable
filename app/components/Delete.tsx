"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItemGet } from "./ClassItem_getData";
import { ClassItem } from "./ClassItem";

type DeleteProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onDeleteEventAction: (event: ClassItemGet | null) => void;
  selectedEvent: ClassItemGet | null;
  events: ClassItem[];
  existingClasses: ClassItem[];
  data?: ClassItemGet | null;
  showPopup: (message: string, type?: "success" | "error") => void;
};

export default function Delete({
  onDeleteEventAction,
  data,
  showPopup,
}: DeleteProps) {
  const router = useRouter();

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
    study: { startTime: "", endTime: "", location: "" },
    exam: {
      midterm: { date: "", startTime: "", endTime: "", location: "" },
      final: { date: "", startTime: "", endTime: "", location: "" },
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

  const [teachers, setTeachers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!data) return;

    // ตัดคำนำหน้าชื่ออาจารย์
    const knownRoles = ["ผศ.ดร.", "รศ.ดร.", "รศ.", "ผศ.", "ดร.", "ศ.", "นาย", "นางสาว"];

    const namesArray = (data.teacher || [])
      .map((full) => {
        let s = full.trim();
        for (const role of knownRoles) {
          if (s.startsWith(role)) {
            s = s.slice(role.length).trim();
            break;
          }
        }
        return s;
      })
      .filter(Boolean);

    setTeachers(namesArray);

    setFormData({
      ...formData,
      id: data.id || "",
      timetable_id: data.timetable_id,
      subject_id: data.subject_id,
      subjectName: data.subjectName,
      sec: data.sec,
      weekday: data.weekday,
      subjectType: data.subjectType,
      academicYear: String(data.academicYear),
      yearLevel: data.yearLevel,
      degree: data.degree,
      semester: data.semester,
      teacher_id: data.teacher_id || "",
      credit: data.credit,
      creditType: data.creditType,

      study: {
        location: data.location || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
      },

      exam: {
        midterm: {
          date: data.midterm_date ? data.midterm_date.split("T")[0] : "",
          location: data.midterm_location || "",
          startTime: data.midterm_startTime ? data.midterm_startTime.slice(0, 5) : "",
          endTime: data.midterm_endTime ? data.midterm_endTime.slice(0, 5) : "",
        },
        final: {
          date: data.final_date ? data.final_date.split("T")[0] : "",
          location: data.final_location || "",
          startTime: data.final_startTime ? data.final_startTime.slice(0, 5) : "",
          endTime: data.final_endTime ? data.final_endTime.slice(0, 5) : "",
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const confirmDelete = async () => {
    if (!data) {
      showPopup("ไม่มีข้อมูลสำหรับลบ", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/Timetable/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timetable_id: data.timetable_id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "ลบข้อมูลไม่สำเร็จ");
      }

      showPopup("Successfully deleted data", "success");
      setShowModal(false);

      onDeleteEventAction(data);
      router.replace("/addTable");
    } catch (error: any) {
      const message = error?.message || "เกิดข้อผิดพลาดในการลบข้อมูล";
      setErrorMessage(message);
      setShowErrorModal(true);
      console.error(error);
    } finally {
      setLoading(false);
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
          <div className="delete-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2">
            <label className="text-sm py-1">ตารางเรียน</label>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
              <div>
                <label className="block mb-1">รหัสวิชา</label>
                <input type="text" value={formData.subject_id} readOnly className="box" />
              </div>

              <div>
                <label className="block mb-1">ประเภทวิชา</label>
                <input type="text" value={formData.subjectType} readOnly className="box" />
              </div>

              <div>
                <label className="block mb-1">กลุ่ม</label>
                <input type="number" value={formData.sec ?? ""} readOnly className="box" />
              </div>

              <div>
                <label className="block mb-1">วันเรียน</label>
                <input type="text" value={formData.weekday} readOnly className="box" />
              </div>

              <div>
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={null}
                  value={formData.study.startTime}
                  onChange={() => {}}
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

              <div>
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={null}
                  value={formData.study.endTime}
                  onChange={() => {}}
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

              <div>
                <label className="block mb-1">สถานที่</label>
                <input type="text" value={formData.study.location} readOnly className="box" />
              </div>

              <div>
                <label className="block mb-1">อาจารย์</label>
                <div className="flex flex-wrap gap-2 mt-2 w-36">
                  {teachers.length === 0 && <p className="text-gray-500">ไม่มีข้อมูลอาจารย์</p>}
                  {teachers.map((teacher, index) => (
                    <div
                      key={`${teacher}-${index}`}
                      className="flex items-center bg-[#FFE5CC] text-sm px-2 py-1 rounded"
                    >
                      <span>{teacher}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-t-3 border-gray-200 w-full" />
            <label className="text-sm py-1">สอบกลางภาค</label>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
              <div>
                <label className="block mb-1">วันที่สอบ</label>
                <div className="flex items-center">
                  <div className="boxT">
                    <DatePicker
                      selected={null}
                      value={formData.exam?.midterm?.date ?? ""}
                      onChange={() => {}}
                      dateFormat="dd/MM/yyyy"
                      className="outline-none w-full bg-transparent"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={null}
                  value={formData.exam?.midterm?.startTime ?? ""}
                  onChange={() => {}}
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

              <div>
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={null}
                  value={formData.exam?.midterm?.endTime ?? ""}
                  onChange={() => {}}
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

              <div>
                <label className="block mb-1">สถานที่</label>
                <input
                  type="text"
                  value={formData.exam?.midterm?.location ?? ""}
                  readOnly
                  className="box"
                />
              </div>
            </div>

            <hr className="border-t-3 border-gray-200 w-full" />
            <label className="text-sm py-1">สอบปลายภาค</label>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
              <div>
                <label className="block mb-1">วันที่สอบ</label>
                <div className="flex items-center">
                  <div className="boxT">
                    <DatePicker
                      selected={null}
                      value={formData.exam?.final?.date ?? ""}
                      onChange={() => {}}
                      dateFormat="dd/MM/yyyy"
                      className="outline-none w-full bg-transparent"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1">เวลาเริ่ม</label>
                <DatePicker
                  selected={null}
                  value={formData.exam?.final?.startTime ?? ""}
                  onChange={() => {}}
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

              <div>
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={null}
                  value={formData.exam?.final?.endTime ?? ""}
                  onChange={() => {}}
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

              <div>
                <label className="block mb-1">สถานที่</label>
                <input
                  type="text"
                  value={formData.exam?.final?.location ?? ""}
                  readOnly
                  className="box"
                />
              </div>

              <button
                type="submit"
                className="buttonSub mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                ลบ
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Modal */}
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

      {/* Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-orange-600 mb-4">ยืนยันการลบ</h2>
            <p className="text-gray-700 mb-6">
              ต้องการลบวิชา <span className="font-medium">{formData.subjectName}</span> ใช่หรือไม่?
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
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