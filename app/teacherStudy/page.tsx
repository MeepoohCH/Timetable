"use client"

import TeacherDropdown from '../components/ui/teacherDropdown';
import TeacherOutput from '../components/TeacherOutput';
import { ClassItem } from '../components/ClassItem';
import { useState } from 'react';



export default function SchedulePage() {
  console.log("StudentPage loaded");
  const [selectedEvent, setSelectedEvent] = useState<ClassItem | null>(null);
const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-x-auto w-full">
        <h1 className="text-2xl font-medium mb-4">ตารางอาจารย์</h1>
        <div className="mb-6">
          <TeacherDropdown
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            refreshKey={refreshKey}
          />
          <TeacherOutput />
        </div>
      </div>

    </>
  );
}
