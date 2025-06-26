"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FilterContextType = {
  teacher: string | number;
  setTeacher: (val: string | number) => void;
  semester: string | number;
  setSemester: (val: string | number) => void;
  academicYear: string | number;
  setacademicYear: (val: string | number) => void;
};

const TeacherFilterContext = createContext<FilterContextType | undefined>(undefined);

export const TeacherFilterProvider = ({ children }: { children: ReactNode }) => {
  const [teacher, setTeacher] = useState<string | number>("");
  const [semester, setSemester] = useState<string | number>("");
  const [academicYear, setacademicYear] = useState<string | number>("");

  return (
    <TeacherFilterContext.Provider
      value={{ teacher, setTeacher, semester, setSemester, academicYear, setacademicYear }}
    >
      {children}
    </TeacherFilterContext.Provider>
  );
};

export const useTeacherFilter = () => {
  const context = useContext(TeacherFilterContext);
  if (!context) {
    throw new Error("useTeacherFilter must be used within a TeacherFilterProvider");
  }
  return context;
};
