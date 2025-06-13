export type ClassItem = {
  id: string;
  subject_id: string,
  subjectName: string,
  sec: number | null;
  academicYear: "",
  teacher: string[],
  weekday: string,
  subjectType: string,
  role: string,
  teacher_id: string,
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
