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
   overwriteId?: string;

  study: {
    location: string,
    startTime: string,
    endTime: string,
  },
  exam: {
    midterm: {
      date: string| null,
      location: string| null,
      startTime: string| null,
      endTime: string| null,
    }| null,
    final: {
      date: string| null,
      location: string| null,
      startTime: string| null,
      endTime: string| null,
    }| null,
  }
  parsedTeachers?: {
  teacherName: string;
  teacherSurname: string;
}[];
}
