"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MakeupFilterContextType = {
  teacher: string | number;
  setTeacher: (val: string | number) => void;
  semester: string | number;
  setSemester: (val: string | number) => void;
  academicYear: string | number;
  setacademicYear: (val: string | number) => void;
  weekday:string | number;
  setWeekday: (val: string) => void;
  date: string | number;
  setDate: (val: string) => void;
};

const MakeupFilterContext = createContext<MakeupFilterContextType | undefined>(undefined);

export const MakeupFilterProvider = ({ children }: { children: ReactNode }) => {
  const [teacher, setTeacher] = useState<string | number>("");
  const [semester, setSemester] = useState<string | number>("");
  const [academicYear, setacademicYear] = useState<string | number>("");
  const [weekday, setWeekday] = useState<string>("");
  const [date, setDate] = useState<string>("");

  return (
    <MakeupFilterContext.Provider
      value={{
        teacher, setTeacher,
        semester, setSemester,
        academicYear, setacademicYear,
        weekday, setWeekday,
        date, setDate,
      }}
    >
      {children}
    </MakeupFilterContext.Provider>
  );
};

export const useMakeupFilter = () => {
  const context = useContext(MakeupFilterContext);
  if (!context) {
    throw new Error("useMakeupFilter must be used within a MakeupFilterProvider");
  }
  return context;
};
