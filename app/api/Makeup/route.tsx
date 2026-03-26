import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface TimetableItem extends RowDataPacket {
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
  teacher_id: string | null;

  subjectName: string;
  credit: number;
  creditType: string;

  midterm_exam_id?: number | null;
  midterm_examType?: string | null;
  midterm_date?: string | null;
  midterm_startTime?: string | null;
  midterm_endTime?: string | null;
  midterm_location?: string | null;

  final_exam_id?: number | null;
  final_examType?: string | null;
  final_date?: string | null;
  final_startTime?: string | null;
  final_endTime?: string | null;
  final_location?: string | null;
}

interface TeacherItem extends RowDataPacket {
  teacher_id: string;
  role: string;
  teacherName: string;
  teacherSurname: string;
}

export async function GET(request: NextRequest) {
 let conn;
try {
  conn = await pool.getConnection();

  const { searchParams } = new URL(request.url);
  const teacher = searchParams.get('teacher') || '';
  const semester = searchParams.get('semester') || '';
  const academicYear = searchParams.get('academicYear') || '';
  const weekday = searchParams.get('weekday') || '';

  if (!semester || !academicYear) {
    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  }

  

  let sql = `
    SELECT 
      t.*, 
      s.subjectName, s.credit, s.creditType,
      mid.exam_id AS midterm_exam_id,
      mid.examType AS midterm_examType,
      mid.date AS midterm_date,
      mid.startTime AS midterm_startTime,
      mid.endTime AS midterm_endTime,
      mid.location AS midterm_location,
      final.exam_id AS final_exam_id,
      final.examType AS final_examType,
      final.date AS final_date,
      final.startTime AS final_startTime,
      final.endTime AS final_endTime,
      final.location AS final_location
    FROM Timetable t
    JOIN Subject s ON t.subject_id = s.subject_id
    LEFT JOIN Exam mid ON t.midterm_id = mid.exam_id
    LEFT JOIN Exam final ON t.final_id = final.exam_id
    WHERE 1=1
  `;

  const params: (string | number)[] = [];

  if (teacher !== '') {
    sql += ` AND FIND_IN_SET(?, REPLACE(t.teacher_id, ' ', '')) > 0`;
    params.push(teacher);
  }

  if (semester !== '') {
    sql += ` AND t.semester = ?`;
    params.push(semester);
  }

  if (academicYear !== '') {
    sql += ` AND t.academicYear = ?`;
    params.push(academicYear);
  }

  if (weekday !== '') {
    sql += ` AND t.weekday = ?`;
    params.push(weekday);
  }

  const [rows] = await conn.query<TimetableItem[]>(sql, params);

  // แปลงข้อมูลอาจารย์ตามเดิม
  const [teachers] = await conn.query<TeacherItem[]>(`SELECT teacher_id, role, teacherName, teacherSurname FROM Teacher`);

  const results = rows.map((item) => {
    let teacherList: string[] = [];
    let parsedTeachers: TeacherItem[] = [];

    if (item.teacher_id) {
      const ids = item.teacher_id
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id !== '');

      const matched = ids
        .map((id) => {
          const teacher = teachers.find((t) => t.teacher_id === id);
          return teacher ? { id, ...teacher } : null;
        })
        .filter((t): t is TeacherItem & { id: string } => !!t);

      const sorted = matched.sort((a, b) => Number(a.teacher_id) - Number(b.teacher_id));

      teacherList = sorted.map((t) => `${t.role}${t.teacherName} ${t.teacherSurname}`);

      parsedTeachers = sorted.map((t) => t);
    }

    return {
      ...item,
      teacher: teacherList,
      teacher_id: parsedTeachers.map((t) => t.teacher_id).join(','),
      parsedTeachers,
    };
  });

  return NextResponse.json(results, { status: 200 });
} catch (error) {
  console.error("Database query error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
} finally {
  if (conn) conn.release();
}
}