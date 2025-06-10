"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type StudentFilter = {
  yearLevel: number | null;
  semester: number | null;
  academicYear: number | null;
  degree: number | null;
};

type StudentFilterContextType = {
  filters: StudentFilter;
  setFilters: (filters: StudentFilter) => void;
};

const StudentFilterContext = createContext<StudentFilterContextType | undefined>(undefined);

export const StudentFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<StudentFilter>({
    yearLevel: null,
    semester: null,
    academicYear: null,
    degree: null,
  });

  return (
    <StudentFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </StudentFilterContext.Provider>
  );
};

export const useStudentFilter = () => {
  const context = useContext(StudentFilterContext);
  if (!context) {
    throw new Error("useStudentFilter must be used within a StudentFilterProvider");
  }
  return context;
};
