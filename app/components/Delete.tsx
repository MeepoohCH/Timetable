"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";

type DeleteProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onDeleteEventAction: (event: any) => void;
  selectedEvent: any | null;
  events: any[];
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
  onSwitchAction,
  currentComponent,
  onDeleteEventAction,
  selectedEvent,
}: DeleteProps) {
  const pathname = usePathname();


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

 
  const [day, setDay] = useState<Date | null>(null);
  const [startTime, setstartTime] = useState<Date | null>(null);
  const [endTime, setendTime] = useState<Date | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [midtermDate, setMidtermDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
  const [studyEndTime, setStudyEndTime] = useState<Date | null>(null);
  const [midtermStartTime, setMidtermStartTime] = useState<Date | null>(null);
  const [midtermEndTime, setMidtermEndTime] = useState<Date | null>(null);
  const [finalStartTime, setFinalStartTime] = useState<Date | null>(null);
  const [finalEndTime, setFinalEndTime] = useState<Date | null>(null);
  


  // เมื่อ selectedEvent เปลี่ยน ให้โหลดข้อมูลลงฟอร์ม
useEffect(() => {
  if (selectedEvent) {
    setFormData(selectedEvent);
    setTeachers(Array.isArray(selectedEvent.teacher) ? selectedEvent.teacher : []);


    if (selectedEvent.exam?.midterm?.date) {
      setMidtermDate(new Date(selectedEvent.exam.midterm.date));
    } else {
      setMidtermDate(null);
    }


    if (selectedEvent.exam?.final?.date) {
      setFinalDate(new Date(selectedEvent.exam.final.date));
    } else {
      setFinalDate(null);
    }

    // Helper function แปลงเวลา HH:mm เป็น Date object (วันนี้)
    const parseTime = (timeStr: string | undefined): Date | null => {
      if (!timeStr) return null;
      const [h, m] = timeStr.split(":");
      const d = new Date();
      d.setHours(Number(h), Number(m), 0, 0);
      return d;
    };

    setStudyStartTime(parseTime(selectedEvent.study?.startTime));
    setStudyEndTime(parseTime(selectedEvent.study?.endTime));


    setMidtermStartTime(parseTime(selectedEvent.exam?.midterm?.startTime));
    setMidtermEndTime(parseTime(selectedEvent.exam?.midterm?.endTime));


    setFinalStartTime(parseTime(selectedEvent.exam?.final?.startTime));
    setFinalEndTime(parseTime(selectedEvent.exam?.final?.endTime));

 
    setWeekday(selectedEvent.weekday || "");
  } else {
    // เคลียร์ข้อมูลทั้งหมดเมื่อไม่มี selectedEvent
    setFormData({
      subject_id: "",
      subjectName: "",
      sec: "",
      teacher: "",
      weekday: "",
      subjectType: "",
      academicYear: "2xxx",
      study: { location: "", startTime: "", endTime: "" },
      exam: {
        midterm: { date: "", location: "", startTime: "", endTime: "" },
        final: { date: "", location: "", startTime: "", endTime: "" },
      },
    });
    setTeachers([]);
    setMidtermDate(null);
    setFinalDate(null);
    setStudyStartTime(null);
    setStudyEndTime(null);
    setMidtermStartTime(null);
    setMidtermEndTime(null);
    setFinalStartTime(null);
    setFinalEndTime(null);
    setWeekday("");
  }
}, [selectedEvent]);

  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedEvent) return;
    onDeleteEventAction(selectedEvent);
    setShowModal(false);
  };

  return (
    <>
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
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
                <input type="text" value={formData.sec} readOnly className="box" />
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

              <div className="">
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={studyEndTime}
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

              <div className="">
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={midtermEndTime}
                  value={formData.exam.midterm.endTime}
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

              <div className="">
                <label className="block mb-1">เวลาจบ</label>
                <DatePicker
                  selected={finalEndTime}
                  value={formData.exam.final.endTime}
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

              <div className="">
                <label className="block mb-1">สถานที่</label>
                <input type="text" value={formData.exam.final.location} readOnly className="box" />
              </div>

            </div>

            <button 
              type="submit" 
              className="buttonSub mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              ลบ
            </button>
        </div>
      </form>
    </div>

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
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
