"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type StudentFilterContextType = {
  yearlevel: string | number | null
  setYearlevel: (value: string | number | null) => void
  semester: string | number | null
  setSemester: (value: string | number | null) => void
  academicYear: string | number | null
  setAcademicYear: (value: string | number | null) => void
  degree: string | number | null
  setDegree: (value: string | number | null) => void
}

const StudentFilterContext = createContext<StudentFilterContextType | undefined>(undefined)

export function StudentFilterProvider({ children }: { children: ReactNode }) {
  const [yearlevel, setYearlevel] = useState<string | number | null>(null)
  const [semester, setSemester] = useState<string | number | null>(null)
  const [academicYear, setAcademicYear] = useState<string | number | null>(null)
  const [degree, setDegree] = useState<string | number | null>(null)

  return (
    <StudentFilterContext.Provider
      value={{
        yearlevel,
        setYearlevel,
        semester,
        setSemester,
        academicYear,
        setAcademicYear,
        degree,
        setDegree,
      }}
    >
      {children}
    </StudentFilterContext.Provider>
  )
}

export function useStudentFilter() {
  const context = useContext(StudentFilterContext)
  if (!context) {
    throw new Error("useStudentFilter must be used within a StudentFilterProvider")
  }
  return context
}
