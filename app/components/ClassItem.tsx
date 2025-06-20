export type ClassItem = {
  id: string;
  timetable_id: number | null;
  yearLevel: number | null;
  degree: number | null;
  semester: number | null;
  subject_id: string,
  subjectName: string,
  sec: number | null;
  academicYear: string,
  teacher: string[],
  weekday: string,
  subjectType: string,
  role: string,
  teacher_id: string | null,
  teacherName: string,
  teacherSurname: string,
  credit: number | null,
  creditType: string,

  study: {
    location: string,
    startTime: string,
    endTime: string,
  },
  exam: {
    midterm: {
      date: string,
      location: string,
      startTime: string,
      endTime: string,
    },
    final: {
      date: string,
      location: string,
      startTime: string,
      endTime: string,
    },
  }
}
