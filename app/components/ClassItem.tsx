export type ClassItem = {
  id: string;
  subject_id: string,
  subjectName: string,
  sec: string,
  teacher: string[],
  weekday: string,
  subjectType:string,
  academicYear:string,
  role:string,
  teacherName:string,
  teacherSurname:string,
  credit: string,
  creditType: string,
  study: {
    location: string,
    startTime: string,
    endTime: string,
  },
  exam: {
    midterm: {
      date:string,
      location: string,
      startTime: string,
      endTime: string,
    },
    final: {
      date:string,
      location: string,
      startTime: string,
      endTime: string,
    },
  }
}
