import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM Timetable');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('❌ Error fetching timetable:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timetable' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const connection = await connectDB();

    // ตัวอย่าง SQL insert (สมมติคอลัมน์ชื่อเดียวกับ data keys)
    const sql = `
      INSERT INTO Timetable (
        id, subject_id, subjectType, yearLevel, sec, semester, academicYear,
        weekday, startTime, endTime, location, exam_id, teacher_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.id,
      data.subject_id,
      data.subjectType,
      data.yearLevel,
      data.sec,
      data.semester,
      data.academicYear,
      data.weekday,
      data.startTime,
      data.endTime,
      data.location,
      data.exam_id,
      data.teacher_id,
    ];

    await connection.query(sql, values);

    return NextResponse.json({ message: 'Schedule saved successfully!' }, { status: 201 });
  } catch (error) {
    console.error('❌ Error saving schedule:', error);
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    );
  }
}
