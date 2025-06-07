export type ClassItem = {
  subject_id: string,
  subjectName: string,
  sec: string,
  teacher: string[],
  weekday: string,
  subjectType:string,
  academicYear:string,
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
