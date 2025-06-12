import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getOrCreateExamId(conn: mysql.PoolConnection, exam: {
  examType: string,
  date: string,
  startTime: string,
  endTime: string,
  location: string
}): Promise<number> {
  const [existing] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT exam_id FROM Exam WHERE examType = ? AND date = ? AND startTime = ? AND endTime = ? AND location = ?`,
    [exam.examType, exam.date, exam.startTime, exam.endTime, exam.location]
  );

  if (existing.length > 0) {
    return existing[0].exam_id;
  }

  const [insertResult] = await conn.query<mysql.ResultSetHeader>(
    `INSERT INTO Exam (examType, date, startTime, endTime, location) VALUES (?, ?, ?, ?, ?)`,
    [exam.examType, exam.date, exam.startTime, exam.endTime, exam.location]
  );

  return insertResult.insertId;
}

export async function POST(req: NextRequest) {
  let conn: mysql.PoolConnection | null = null;
  try {
    const body = await req.json();
    console.log('Received timetable data:', body);

    // Destructure and validate as needed
    const {
      subject_id,
      subjectName,
      sec,
      teacher,
      weekday,
      subjectType,
      yearLevel,
      semester,
      academicYear,
      degree,
      study,
      exam,
    } = body;

    conn = await pool.getConnection();

    for (const fullName of teacher) {
      const parts = fullName.split(' ');
      const name = parts[0];
      const surname = parts.slice(1).join(' ');

      const [teacherRows] = await conn.query<mysql.RowDataPacket[]>(
        `SELECT teacher_id FROM Teacher WHERE teacherName = ? AND teacherSurname = ?`,
        [name, surname]
      );

      
  let teacher_id: number | null = null;
  if (teacherRows.length > 0) {
    teacher_id = teacherRows[0].teacher_id;
  }
      

      const midterm_id = await getOrCreateExamId(conn, {
        examType: 'midterm',
        date: exam.midterm.date,
        startTime: exam.midterm.startTime,
        endTime: exam.midterm.endTime,
        location: exam.midterm.location,
      });

      const final_id = await getOrCreateExamId(conn, {
        examType: 'final',
        date: exam.final.date,
        startTime: exam.final.startTime,
        endTime: exam.final.endTime,
        location: exam.final.location,
      });

      await conn.query(
        `INSERT INTO Timetable 
          (subject_id, subjectType, yearLevel, degree, sec, semester, academicYear, weekday, startTime, endTime, location, midterm_id, final_id, teacher_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          subject_id,
          subjectType,
          yearLevel,
          degree,
          sec,
          semester,
          academicYear,
          weekday,
          study.startTime,
          study.endTime,
          study.location,
          midterm_id,
          final_id,
          teacher_id,
        ]
      );
    }

    return NextResponse.json({ message: 'Timetable created successfully' }, { status: 201 });
  } catch (error: any) {
  console.error('Error creating timetable:', error.message || error);
  return NextResponse.json({ error: error.message || 'Failed to create timetable' }, { status: 500 });
}
}
