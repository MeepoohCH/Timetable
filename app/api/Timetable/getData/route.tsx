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


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);


 
let conn = null;
  

  try {
    conn = await pool.getConnection();
    const timetableIdRaw = searchParams.get('timetable_id');
    console.log("Received timetable_id from query:", timetableIdRaw);

    let timetable_id: number;

    if (timetableIdRaw) {
      timetable_id = Number(timetableIdRaw);
      if (isNaN(timetable_id)) {
        return NextResponse.json({ error: 'Invalid timetable_id format' }, { status: 400 });
      }
    } else {
      const [latestRows] = await conn.query<RowDataPacket[]>(
        `SELECT timetable_id FROM Timetable ORDER BY created_at DESC LIMIT 1`
      );
      if (latestRows.length === 0) {
        return NextResponse.json({ error: 'No timetable found' }, { status: 404 });
      }
      timetable_id = latestRows[0].timetable_id;
    }

   const [rows] = await conn.query<TimetableItem[]>(
  `SELECT 
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
  WHERE t.timetable_id = ?`,
  [timetable_id]
);

// ดึงอาจารย์
const [teachers] = await pool.query<TeacherItem[]>(
  `SELECT teacher_id, role, teacherName, teacherSurname FROM Teacher`
);

// รวมผล
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

if (results.length === 0) {
  return NextResponse.json({ error: 'Timetable not found' }, { status: 404 });
}

return NextResponse.json(results[0]);


  } catch (error: any) {
    console.error('GET timetable error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
