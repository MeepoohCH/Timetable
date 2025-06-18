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
  midterm_id?: number | null;
  final_id?: number | null;
  teacher_id?: string | null;

  // จาก Subject
  subjectName: string;
  credit: number;
  creditType: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const yearLevel = searchParams.get('yearLevel');
    const semester = searchParams.get('semester');
    const academicYear = searchParams.get('academicYear');
    const degree = searchParams.get('degree');

    // ตรวจสอบว่ามี filter ครบไหม
    if (!yearLevel || !semester || !academicYear || !degree) {
      return NextResponse.json(
        { error: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    // Query ดึงข้อมูล join กับ Subject
    const [rows] = await pool.query<TimetableItem[]>(
      `SELECT t.*, s.subjectName, s.credit, s.creditType
       FROM Timetable t
       JOIN Subject s ON t.subject_id = s.subject_id
       WHERE t.yearLevel = ? AND t.semester = ? AND t.academicYear = ? AND t.degree = ?`,
      [yearLevel, semester, academicYear, degree]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
