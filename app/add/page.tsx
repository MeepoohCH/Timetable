'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

type ScheduleFormInputs = {
  subject_id: number;
  subjectType: string;
  yearLevel: number;
  sec: number;
  semester: number;
  academicYear: number;
  weekday: string;
  startTime: string;
  endTime: string;
  location: string;
  exam_id: number;
  teacher_id: number;
};

export default function ScheduleFormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleFormInputs>();

const onSubmit = async (data: ScheduleFormInputs) => {
  try {
    const response = await fetch('/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit schedule');
    }

    const result = await response.json();
    console.log('✅ Schedule saved:', result);
    alert('Schedule saved successfully!');
  } catch (error) {
    console.error('❌ Error saving schedule:', error);
    alert('Failed to save schedule');
  }
};


  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Schedule Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* สร้าง input fields แบบ dynamic */}
        {[
          { label: 'Subject ID', name: 'subject_id' },
          { label: 'Subject Type', name: 'subjectType', type: 'text' },
          { label: 'Year Level', name: 'yearLevel' },
          { label: 'Section (Sec)', name: 'sec' },
          { label: 'Semester', name: 'semester' },
          { label: 'Academic Year', name: 'academicYear' },
          { label: 'Weekday', name: 'weekday', type: 'text' },
          { label: 'Start Time', name: 'startTime', type: 'time' },
          { label: 'End Time', name: 'endTime', type: 'time' },
          { label: 'Location', name: 'location', type: 'text' },
          { label: 'Exam ID', name: 'exam_id' },
          { label: 'Teacher ID', name: 'teacher_id' },
        ].map(({ label, name, type = 'number' }) => (
          <div key={name}>
            <label className="block font-semibold mb-1">{label}</label>
            <input
              type={type}
              {...register(name as keyof ScheduleFormInputs, { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors[name as keyof ScheduleFormInputs] && (
              <span className="text-red-500 text-sm">This field is required</span>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
