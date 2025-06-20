import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
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

    const yearLevel = searchParams.get('yearLevel');
    const semester = searchParams.get('semester');
    const academicYear = searchParams.get('academicYear');
    const degree = searchParams.get('degree');

    if (!yearLevel || !semester || !academicYear || !degree) {
      return NextResponse.json(
        { error: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    // ใช้ conn.query แทน pool.query
    const [rows] = await conn.query<TimetableItem[]>(
      `SELECT 
        t.*, 
        s.subjectName, s.credit, s.creditType,

        -- Midterm Exam
        mid.exam_id AS midterm_exam_id,
        mid.examType AS midterm_examType,
        mid.date AS midterm_date,
        mid.startTime AS midterm_startTime,
        mid.endTime AS midterm_endTime,
        mid.location AS midterm_location,

        -- Final Exam
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
      WHERE t.yearLevel = ? AND t.semester = ? AND t.academicYear = ? AND t.degree = ?`,
      [yearLevel, semester, academicYear, degree]
    );

    const [teachers] = await conn.query<TeacherItem[]>(
      `SELECT teacher_id, role, teacherName, teacherSurname FROM Teacher`
    );

    const results = rows.map((item) => {
      let teacherList: string[] = [];

      if (item.teacher_id) {
        const ids = item.teacher_id.split(",").map((id) => id.trim());

        teacherList = ids.map((id) => {
          const teacher = teachers.find((t) => t.teacher_id === id);
          return teacher
            ? `${teacher.role}${teacher.teacherName} ${teacher.teacherSurname}`
            : id;
        });
      }

      return {
        ...item,
        teacher: teacherList,
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
