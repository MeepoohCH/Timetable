export type ClassItemGet = {
  id: string;
  date: string;
  timetable_id: number;
  subject_id: string;
  subjectType: string;
  yearLevel: number;
  degree: number;
  sec: number;
  semester: number;
  academicYear: number;
  weekday: string;
  startTime: string;
  endTime: string;
  location: string;
  midterm_id?: number | null;
  final_id?: number | null;
  teacher_id?: string | null;
  title?: string
teacher?: string[];
  subjectName: string;
  credit: number;
  creditType: string;
   overwriteId?: string;

  // ✅ เพิ่มพวกนี้เข้าไปด้วย
  midterm_exam_id?: number| null;
  midterm_examType?: string| null;
  midterm_date?: string| null;
  midterm_startTime?: string| null;
  midterm_endTime?: string| null;
  midterm_location?: string| null;

  final_exam_id?: number| null;
  final_examType?: string| null;
  final_date?: string| null;
  final_startTime?: string| null;
  final_endTime?: string| null;
  final_location?: string| null;

  
    parsedTeachers?: {
    role: string;
    teacherName: string;
    teacherSurname: string;
  }[];

}
