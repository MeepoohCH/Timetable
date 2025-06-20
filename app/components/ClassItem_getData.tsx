export type ClassItemGet = {
  id: string;
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

  subjectName: string;
  credit: number;
  creditType: string;

  // ✅ เพิ่มพวกนี้เข้าไปด้วย
  midterm_exam_id?: number;
  midterm_examType?: string;
  midterm_date?: string;
  midterm_startTime?: string;
  midterm_endTime?: string;
  midterm_location?: string;

  final_exam_id?: number;
  final_examType?: string;
  final_date?: string;
  final_startTime?: string;
  final_endTime?: string;
  final_location?: string;
}
