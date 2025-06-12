"use client";

import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../components/DesignForm.css";
import { ClassItem } from "./ClassItem";

type EditTeacherProps = {
  onSwitchAction: (view: "edit" | "delete" | "add") => void;
  currentComponent: "edit" | "delete" | "add";
  onEditEventAction: (updatedEvent: ClassItem) => void;
  selectedEvent: ClassItem | null;
  events: ClassItem[];
  existingClasses: ClassItem[];
};

export default function EditTeacher({
  onSwitchAction,
  currentComponent,
  onEditEventAction,
  selectedEvent,
  events,
  existingClasses,
}: EditTeacherProps) {
  const [formData, setFormData] = useState({
    id: "",
    subject_id: "",
    subjectName: "",
    sec: "",
    teacher: [] as string[],
    weekday: "",
    subjectType:"",
    academicYear:"",
    teacherName:"",
    teacherSurname:"",
    role:"",
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

useEffect(() => {
  if (selectedEvent) {
    setFormData(selectedEvent);
  } else {
    setFormData({
      id: "",
      subject_id: "",
      subjectName: "",
      sec: "",
      teacher: [] as string[],
      weekday: "",
      subjectType: "",
      academicYear: "",
      teacherName: "",
      teacherSurname: "",
      credit: "",
      creditType: "",
      role: "",
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
  }
}, [selectedEvent]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedEvent) return;

  const fullName = `${formData.teacherName} ${formData.teacherSurname}`.trim();
  const updatedEvent: ClassItem = {
    ...formData,
    teacher: [fullName, formData.role], 
  };

  onEditEventAction(updatedEvent);
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="edit-form flex flex-row gap-4 text-sm sm:flex-col sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">
          <label className="text-sm py-1">ข้อมูลอาจารย์</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-2 text-sm">

                <div>
              <label className="block mb-1">ตำแหน่ง</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="box"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">ชื่อ</label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

            <div>
              <label className="block mb-1">นามสกุล</label>
              <input
                type="text"
                name="teacherSurname"
                value={formData.teacherSurname}
                onChange={handleChange}
                className="box"
                required
              />
            </div>

        

            <button type="submit" className="buttonSub">
              แก้ไข
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 