export type ClassItem = {
<<<<<<< Updated upstream
  subject_id: string;
  subjectName: string;
  sec: string;
  teacher: string[];
  weekday: string;         
  date?: string;         
  startTime: string;
  endTime: string;
  location: string;
  subjectType: string;
  academicYear: string;
};
=======
  subject_id: string,
  subjectName: string,
  sec: string,
  teacher: string[],
  weekday: string,
  startTime: string,
  endTime: string,
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
>>>>>>> Stashed changes
